# Lascel Site

Lascel marketing site built with Next.js App Router.

## Local Development

Install dependencies and run the app:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables (`.env.local` vs production)

The contact form submits to `/api/contact`, and that route forwards messages through Brevo. Messages are not stored in a database.

Required variables:

- `BREVO_API_KEY`
- `BREVO_FROM_EMAIL` (example: `no-reply@lascel.com`)
- `BREVO_FROM_NAME` (example: `Lascel Contact`)
- `CONTACT_TO_EMAIL` (example: `contact@lascel.com`)

### Which env file should you use?

- Local development: use `.env.local`.
- Production server: prefer real system environment variables (for example via systemd `EnvironmentFile`).
- Keep `.env.example` in git as a template only.
- Never commit `.env.local` or real secrets.

## SEO and Search Appearance

The project includes:

- Rich metadata in `app/layout.tsx` (title, description, canonical, Open Graph, Twitter, robots).
- `app/robots.ts` for `/robots.txt`.
- `app/sitemap.ts` for `/sitemap.xml`.
- Organization JSON-LD in `app/page.tsx`.

After deployment:

1. Open `https://lascel.com/robots.txt` and `https://lascel.com/sitemap.xml`.
2. Add domain property in Google Search Console.
3. Submit `https://lascel.com/sitemap.xml` in Search Console.

## Deploy to Oracle Cloud (Compute VM)

This is the simplest production path: Oracle Compute VM + Nginx + systemd.

### 1) Create VM and networking

1. Create an Ubuntu VM in OCI Compute.
2. Reserve a public IP and assign it to the VM.
3. Ensure ingress allows `22`, `80`, and `443` in your NSG or security list.
4. Ensure OS firewall also allows web traffic.

### 2) Install runtime on the VM

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs git nginx
node -v
npm -v
```

### 3) Deploy app code

```bash
sudo mkdir -p /var/www
cd /var/www
sudo git clone <YOUR_REPO_URL> lascel-site
sudo chown -R $USER:$USER /var/www/lascel-site
cd /var/www/lascel-site
npm ci
npm run build
```

### 4) Add production secrets (recommended)

```bash
sudo mkdir -p /etc/lascel
sudo nano /etc/lascel/lascel.env
```

Add:

```env
BREVO_API_KEY=...
BREVO_FROM_EMAIL=no-reply@lascel.com
BREVO_FROM_NAME=Lascel Contact
CONTACT_TO_EMAIL=contact@lascel.com
```

### 5) Run with systemd

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

### 6) Reverse proxy with Nginx

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

### 7) Enable HTTPS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d lascel.com -d www.lascel.com
```

## Link `lascel.com` to Oracle VM

At your DNS provider (or OCI DNS zone):

1. Create an `A` record for `@` pointing to your VM public IP (prefer reserved IP).
2. Create either:
   - `A` record for `www` to the same IP, or
   - `CNAME` record for `www` pointing to `lascel.com`.
3. Wait for propagation.
4. Verify:
   - `https://lascel.com`
   - `https://www.lascel.com`

## Useful Commands

```bash
npm run lint
npm run build
sudo journalctl -u lascel -f
```
