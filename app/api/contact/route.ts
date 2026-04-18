import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BREVO_SEND_EMAIL_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const NAME_MIN_LENGTH = 2;
const SUBJECT_MIN_LENGTH = 3;
const SUBJECT_MAX_LENGTH = 200;
const MESSAGE_MIN_LENGTH = 20;
const MESSAGE_MAX_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const GENERIC_SEND_FAILURE_MESSAGE =
  "We could not send your message right now. Please try again in a moment.";
const RATE_LIMIT_MESSAGE =
  "You are sending messages too quickly. Please wait a few minutes and try again.";

type RateLimitStore = Map<string, number[]>;
type GlobalRateLimitStore = typeof globalThis & {
  __contactRateLimitStore?: RateLimitStore;
};

const globalRateLimitStore = globalThis as GlobalRateLimitStore;
const contactRateLimitStore: RateLimitStore =
  globalRateLimitStore.__contactRateLimitStore ?? new Map<string, number[]>();

if (!globalRateLimitStore.__contactRateLimitStore) {
  globalRateLimitStore.__contactRateLimitStore = contactRateLimitStore;
}

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
};

function normalizeTextField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ipAddress = forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent")?.trim() ?? "unknown";

  return `${ipAddress}:${userAgent}`;
}

function isRateLimited(clientIdentifier: string, now = Date.now()) {
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recentRequests = (contactRateLimitStore.get(clientIdentifier) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    contactRateLimitStore.set(clientIdentifier, recentRequests);
    return true;
  }

  recentRequests.push(now);
  contactRateLimitStore.set(clientIdentifier, recentRequests);

  return false;
}

function errorResponse(message: string, status: 400 | 429 | 502) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const clientIdentifier = getClientIdentifier(request);

  if (isRateLimited(clientIdentifier)) {
    console.warn("Contact forwarding rate limited", {
      receivedAt: new Date().toISOString(),
    });

    return errorResponse(RATE_LIMIT_MESSAGE, 429);
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return errorResponse("Invalid form submission payload.", 400);
  }

  const name = normalizeTextField(payload.name);
  const email = normalizeTextField(payload.email);
  const subject = normalizeTextField(payload.subject);
  const message = normalizeTextField(payload.message);

  if (name.length < NAME_MIN_LENGTH) {
    return errorResponse("Please enter your name.", 400);
  }

  if (!EMAIL_PATTERN.test(email)) {
    return errorResponse("Please enter a valid email address.", 400);
  }

  if (subject.length < SUBJECT_MIN_LENGTH) {
    return errorResponse("Please enter a subject.", 400);
  }

  if (subject.length > SUBJECT_MAX_LENGTH) {
    return errorResponse("Please keep your subject under 200 characters.", 400);
  }

  if (message.length < MESSAGE_MIN_LENGTH) {
    return errorResponse("Please share a bit more detail in your message.", 400);
  }

  if (message.length > MESSAGE_MAX_LENGTH) {
    return errorResponse("Please keep your message under 2000 characters.", 400);
  }

  const brevoApiKey = getEnv("BREVO_API_KEY");
  const fromEmail = getEnv("BREVO_FROM_EMAIL");
  const fromName = getEnv("BREVO_FROM_NAME");
  const toEmail = getEnv("CONTACT_TO_EMAIL");

  if (!brevoApiKey || !fromEmail || !fromName || !toEmail) {
    console.error("Contact forwarding unavailable due to missing env vars", {
      receivedAt: new Date().toISOString(),
    });

    return errorResponse(GENERIC_SEND_FAILURE_MESSAGE, 502);
  }

  const requestSubject = `New contact form: ${subject}`;

  const textContent = [
    "New contact form submission",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const htmlContent = [
    "<h2>New contact form submission</h2>",
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>`,
    `<p><strong>Message:</strong><br/>${escapeHtml(message).replaceAll("\n", "<br/>")}</p>`,
  ].join("");

  const brevoPayload = {
    sender: { email: fromEmail, name: fromName },
    to: [{ email: toEmail }],
    replyTo: { email, name },
    subject: requestSubject,
    textContent,
    htmlContent,
  };

  try {
    const brevoResponse = await fetch(BREVO_SEND_EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify(brevoPayload),
      cache: "no-store",
    });

    if (!brevoResponse.ok) {
      console.warn("Contact forwarding failed", {
        brevoStatus: brevoResponse.status,
        receivedAt: new Date().toISOString(),
      });

      return errorResponse(GENERIC_SEND_FAILURE_MESSAGE, 502);
    }

    console.info("Contact forwarding succeeded", {
      brevoStatus: brevoResponse.status,
      messageLength: message.length,
      receivedAt: new Date().toISOString(),
      subjectLength: subject.length,
    });

    return NextResponse.json({
      message:
        "Message sent successfully. Thanks for reaching out. We will reply to your email soon.",
    });
  } catch {
    console.error("Contact forwarding request failed", {
      receivedAt: new Date().toISOString(),
    });

    return errorResponse(GENERIC_SEND_FAILURE_MESSAGE, 502);
  }
}
