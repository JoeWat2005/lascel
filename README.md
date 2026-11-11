# Lascel

Company website for Lascel, a single-page Next.js site that introduces the company and its subsidiaries and has a contact form that forwards messages by email through Brevo.

## Features

- Single page with hero, about, subsidiaries, contact and footer sections
- Subsidiaries section with a scrolling logo strip and a detail card that rotates every 10 seconds (DeskCaptain and Flotrafic)
- Contact form in a modal that is loaded only when a visitor opens it
- Contact API route that validates input, rate-limits senders and forwards each message through Brevo's transactional email API; messages are not stored
- Search metadata: canonical URL, Open Graph and Twitter cards, `robots.txt`, `sitemap.xml` and Organization JSON-LD
- Custom 404 page that redirects to the home page after 5 seconds
- Animations that are switched off for visitors who prefer reduced motion

## Tech stack

- Next.js 16.2.4 (App Router), React 19.2.4 and TypeScript 5
- Tailwind CSS 4 (via `@tailwindcss/postcss`) with daisyUI 5
- Framer Motion 12
- Brevo transactional email API, called with `fetch` (no SDK)
- Manrope and Geist Mono fonts through `next/font/google`
- ESLint 9 with `eslint-config-next`
- GitHub Actions for CI and deployment over SSH

## Getting started

### Prerequisites

- Node.js 20.9 or later (required by Next.js 16; CI uses Node.js 20)
- npm

### Installation

```bash
npm ci
```

### Configuration

Copy the template and fill in real values. For local development use `.env.local`; on a server, prefer system environment variables (for example a systemd `EnvironmentFile`). All `.env*` files except `.env.example` are git-ignored, so never commit real secrets.

```bash
cp .env.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `BREVO_API_KEY` | Brevo API key used to send contact form emails |
| `BREVO_FROM_EMAIL` | Sender address for forwarded messages |
| `BREVO_FROM_NAME` | Sender name for forwarded messages |
| `CONTACT_TO_EMAIL` | Inbox that receives contact form submissions |

If any of these is missing, the contact route logs an error and returns a generic failure (HTTP 502) to the visitor. The rest of the site works without them.

### Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

### Tests

There is no test suite. CI runs `npm test --if-present`, which is skipped because `package.json` has no `test` script.

## Deployment

### Automated deploys (GitHub Actions)

`.github/workflows/deploy.yml` does the following:

1. On every push and pull request to `main`, it runs `npm ci`, `npm run lint` and `npm run build` on Node.js 20.
2. On a push to `main` that passes CI, it connects to the server over SSH and, in `~/lascel-site`, hard-resets to `origin/main`, runs `npm ci` and `npm run build`, restarts the PM2 process `lascel` and reloads Nginx.

It needs these repository secrets: `HOST`, `USERNAME`, `SSH_KEY` and `PORT`.

### Manual server set-up (Oracle Cloud Compute VM)

This path runs the site on an Ubuntu VM behind Nginx, managed by systemd.

1. Create an Ubuntu VM in OCI Compute, reserve a public IP and assign it to the VM. Allow ingress on ports 22, 80 and 443 in the network security group or security list, and make sure the OS firewall also allows web traffic.

2. Install the runtime:

   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt install -y nodejs git nginx
   node -v
   npm -v
   ```

3. Deploy the code:

   ```bash
   sudo mkdir -p /var/www
   cd /var/www
   sudo git clone <YOUR_REPO_URL> lascel-site
   sudo chown -R $USER:$USER /var/www/lascel-site
   cd /var/www/lascel-site
   npm ci
   npm run build
   ```

4. Add production secrets in `/etc/lascel/lascel.env`, using the variables from the configuration table:

   ```bash
   sudo mkdir -p /etc/lascel
   sudo nano /etc/lascel/lascel.env
   ```

   ```env
   BREVO_API_KEY=...
   BREVO_FROM_EMAIL=...
   BREVO_FROM_NAME=...
   CONTACT_TO_EMAIL=...
   ```

5. Run the app with systemd:

   ```bash
   sudo tee /etc/systemd/system/lascel.service > /dev/null <<'EOF'
   [Unit]
   Description=Lascel Next.js app
   After=network.target

   [Service]
   Type=simple
   User=ubuntu
   WorkingDirectory=/var/www/lascel-site
   EnvironmentFile=/etc/lascel/lascel.env
   Environment=NODE_ENV=production
   ExecStart=/usr/bin/npm run start -- -p 3000
   Restart=always
   RestartSec=5

   [Install]
   WantedBy=multi-user.target
   EOF

   sudo systemctl daemon-reload
   sudo systemctl enable --now lascel
   sudo systemctl status lascel
   ```

6. Put Nginx in front as a reverse proxy:

   ```bash
   sudo tee /etc/nginx/sites-available/lascel > /dev/null <<'EOF'
   server {
     listen 80;
     server_name lascel.com www.lascel.com;

     location / {
       proxy_pass http://127.0.0.1:3000;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
     }
   }
   EOF

   sudo ln -sf /etc/nginx/sites-available/lascel /etc/nginx/sites-enabled/lascel
   sudo nginx -t
   sudo systemctl reload nginx
   ```

7. Enable HTTPS:

   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d lascel.com -d www.lascel.com
   ```

8. Point the domain at the VM. At your DNS provider (or an OCI DNS zone), create an `A` record for `@` pointing to the VM's public IP, and either an `A` record for `www` to the same IP or a `CNAME` for `www` pointing to `lascel.com`. Once DNS has propagated, check `https://lascel.com` and `https://www.lascel.com`.

Useful commands on the server:

```bash
sudo journalctl -u lascel -f
```

Notes: the manual guide runs the app as a systemd service from `/var/www/lascel-site`, while the workflow expects a PM2 process named `lascel` in `~/lascel-site`. Make sure the server matches the workflow before relying on automated deploys.

### After deploying

1. Check `https://lascel.com/robots.txt` and `https://lascel.com/sitemap.xml`.
2. Add the domain as a property in Google Search Console.
3. Submit `https://lascel.com/sitemap.xml` in Search Console.

## How it works

- `app/layout.tsx` is the root layout. It loads the fonts and sets the site-wide metadata (title template, canonical URL, Open Graph, Twitter and robots).
- `app/page.tsx` builds the home page from the section components, embeds the Organization JSON-LD and renders the contact modal controller.
- `app/components/contact-modal-controller.tsx` listens for clicks on any element with a `data-contact-trigger` attribute and, on the first click, loads `contact-modal.tsx` with `next/dynamic` (client-side only).
- `app/components/contact-form.tsx` checks the fields in the browser and posts them as JSON to `/api/contact`.
- `app/api/contact/route.ts` handles the request:
  1. Rate-limits each sender (IP address plus user agent) to 5 submissions per 10 minutes.
  2. Validates the name (at least 2 characters), email, subject (3 to 200 characters) and message (20 to 2,000 characters).
  3. Escapes the HTML and sends the message to Brevo (`POST https://api.brevo.com/v3/smtp/email`), with the visitor's address set as reply-to.
  4. Returns a JSON success or error message.
- The rate limiter keeps its counts in memory, so they reset when the process restarts and aren't shared between instances.
- `app/robots.ts` and `app/sitemap.ts` generate `/robots.txt` and `/sitemap.xml` for `https://lascel.com`.
- `app/not-found.tsx` is the 404 page with a countdown redirect to `/`.
- `app/globals.css` imports Tailwind CSS and the daisyUI plugin (light theme) and defines the ambient background, shimmer, reveal and button pulse animations, with reduced-motion overrides.

## Project structure

```text
.
├── .github/workflows/   CI and production deploy workflow
├── app/                 App Router layout, pages, metadata routes and global styles
│   ├── api/contact/     Contact form endpoint that sends through Brevo
│   └── components/      Page sections, subsidiaries carousel, contact modal and form
├── public/              Logos and the Open Graph image
├── .env.example         Template for the required environment variables
├── AGENTS.md            Notes for AI coding assistants (CLAUDE.md points here)
└── package.json         Scripts and dependencies
```
