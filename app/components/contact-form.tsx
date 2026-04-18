"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFormProps = {
  className?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 120;
const SUBJECT_MIN_LENGTH = 3;
const SUBJECT_MAX_LENGTH = 200;
const MESSAGE_MIN_LENGTH = 20;
const MESSAGE_MAX_LENGTH = 2000;

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function isFormValid(formState: ContactFormState) {
  const normalizedName = formState.name.trim();
  const normalizedEmail = formState.email.trim();
  const normalizedSubject = formState.subject.trim();
  const normalizedMessage = formState.message.trim();

  return (
    normalizedName.length >= NAME_MIN_LENGTH &&
    normalizedName.length <= NAME_MAX_LENGTH &&
    EMAIL_PATTERN.test(normalizedEmail) &&
    normalizedSubject.length >= SUBJECT_MIN_LENGTH &&
    normalizedSubject.length <= SUBJECT_MAX_LENGTH &&
    normalizedMessage.length >= MESSAGE_MIN_LENGTH &&
    normalizedMessage.length <= MESSAGE_MAX_LENGTH
  );
}

export default function ContactForm({ className }: ContactFormProps) {
  const reduceMotion = useReducedMotion();
  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const canSubmit = isFormValid(formState) && !isSubmitting;

  const updateField =
    (field: keyof ContactFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((currentState) => ({
        ...currentState,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid(formState)) {
      setHasError(true);
      setFeedback("Please complete all fields with valid details to send your message.");
      return;
    }

    setFeedback(null);
    setHasError(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const payload = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to send your message.");
      }

      setFeedback(
        payload.message ??
          "Message sent successfully. Thanks for reaching out. We will reply to your email soon.",
      );
      setFormState(initialFormState);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not send your message right now. Please try again in a moment.";
      setHasError(true);
      setFeedback(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-3xl border border-zinc-200/80 bg-white/75 p-6 shadow-[0_14px_40px_rgba(24,24,27,0.06)] backdrop-blur-sm sm:p-8 ${className ?? ""}`}
    >

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="form-control w-full">
          <span className="font-display label-text mb-2 text-xs italic uppercase tracking-[0.18em] text-zinc-600">
            Full name
          </span>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={updateField("name")}
            className="input input-bordered w-full border-zinc-300/80 bg-white/95 shadow-sm"
            placeholder="Your full name"
            required
            minLength={NAME_MIN_LENGTH}
            maxLength={NAME_MAX_LENGTH}
            autoComplete="name"
          />
        </label>

        <label className="form-control w-full">
          <span className="font-display label-text mb-2 text-xs italic uppercase tracking-[0.18em] text-zinc-600">
            Reply email
          </span>
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={updateField("email")}
            className="input input-bordered w-full border-zinc-300/80 bg-white/95 shadow-sm"
            placeholder="name@yourcompany.com"
            required
            autoComplete="email"
            inputMode="email"
            aria-describedby="contact-reply-email-help"
          />
          <span
            id="contact-reply-email-help"
            className="mt-2 text-xs text-zinc-500"
          >
            This is where our team will send the reply.
          </span>
        </label>
      </div>

      <label className="form-control mt-4 w-full">
        <span className="font-display label-text mb-2 text-xs italic uppercase tracking-[0.18em] text-zinc-600">
          Subject
        </span>
        <input
          type="text"
          name="subject"
          value={formState.subject}
          onChange={updateField("subject")}
          className="input input-bordered w-full border-zinc-300/80 bg-white/95 shadow-sm"
          placeholder="Partnership, issue report, getting involved, or general enquiry"
          required
          minLength={SUBJECT_MIN_LENGTH}
          maxLength={SUBJECT_MAX_LENGTH}
        />
      </label>

      <label className="form-control mt-4 w-full">
        <span className="font-display label-text mb-2 text-xs italic uppercase tracking-[0.18em] text-zinc-600">
          Message
        </span>
        <textarea
          name="message"
          value={formState.message}
          onChange={updateField("message")}
          className="textarea textarea-bordered min-h-40 w-full border-zinc-300/80 bg-white/95 shadow-sm"
          placeholder="Tell us how we can help, what issue you found, or what you'd like to discuss."
          required
          minLength={MESSAGE_MIN_LENGTH}
          maxLength={MESSAGE_MAX_LENGTH}
        />
      </label>

      <div className="mt-6 flex justify-center">
        <motion.button
          type="submit"
          className="btn btn-neutral rounded-full px-8 shadow-[0_12px_28px_-20px_rgba(24,24,27,0.75)]"
          disabled={!canSubmit}
          whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </motion.button>
      </div>

      {feedback ? (
        <p
          className={`mx-auto mt-4 max-w-xl text-center text-sm ${hasError ? "text-red-600" : "text-emerald-700"}`}
          role="status"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
