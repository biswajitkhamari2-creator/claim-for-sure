# ClaimForSure — Hostinger / cPanel Deployment Guide

End-to-end production deployment of the PHP + MySQL backend on **Hostinger**
(or any cPanel host: Bluehost, Namecheap, SiteGround, etc.). When finished
you'll have:

- API at `https://api.claimforsure.in`
- Site at `https://claimforsure.in` (your React build)
- MySQL database holding all users, claims, documents, admins
- SMTP sending from `support@claimforsure.in`
- No Supabase, no Lovable Cloud

---

## 1. Final folder structure on the server

```
/home/USER/
├── domains/
│   └── claimforsure.in/
│       └── public_html/                ← React build (index.html, assets/)
│
└── domains/
    └── api.claimforsure.in/
        ├── public_html/                ← document root = php-backend/public
        │   ├── index.php
        │   └── .htaccess
        └── private/
            └── php-backend/            ← rest of the app, NOT web-accessible
                ├── .env                ← your real secrets (chmod 600)
                ├── .env.example
                ├── config/
                ├── lib/
                ├── api/
                ├── migrations/
                ├── scripts/
                ├── uploads/            ← chmod 775, owner = web user
                └── README.md
```

Why two folders? Only `public/` should be reachable from the web. `.env`,
uploads, and source files live one level up so nobody can read them via URL.

On Hostinger the equivalent paths are:
- `public_html/` → site root for `claimforsure.in`
- `domains/api.claimforsure.in/public_html/` → API root
- Anything outside `public_html/` is private.

---

## 2. Create the subdomain

**Hostinger hPanel** → *Domains* → *Subdomains* → Create:

| Field          | Value                  |
|----------------|------------------------|
| Subdomain      | `api`                  |
| Domain         | `claimforsure.in`      |
| Document root  | `domains/api.claimforsure.in/public_html` |

cPanel: *Domains* → *Subdomains* → Create `api.claimforsure.in`.

Wait 5–15 min for DNS, then `ping api.claimforsure.in` should resolve.

---

## 3. Create the MySQL database

**Hostinger hPanel** → *Databases* → *Management* → Create new:

| Field              | Example                       |
|--------------------|-------------------------------|
| Database name      | `u123456_claimforsure`        |
| Username           | `u123456_cfs`                 |
| Password           | (long random — save it)       |
| Host               | `localhost` (always)          |

Grant the user **ALL PRIVILEGES** on the database. Note the exact names —
Hostinger prepends your account ID (`u123456_`); use those full names in `.env`.

---

## 4. Upload the backend

Option A — File Manager: zip `php-backend/`, upload, extract into
`domains/api.claimforsure.in/private/`.

Option B — SSH (preferred):
```bash
ssh USER@your-server -p 65002       # Hostinger SSH port = 65002
cd ~/domains/api.claimforsure.in
mkdir -p private
cd private
# upload php-backend.zip via SCP or git clone, then:
unzip php-backend.zip
```

Now point the API document root at `public/`. On Hostinger this is set when
creating the subdomain; if you need to change it later use *Subdomains* →
*Manage* → *Document root* and set:
```
domains/api.claimforsure.in/private/php-backend/public
```

If your host won't let you point outside `public_html/`, instead **move only
the contents of `php-backend/public/` into `public_html/`** and put the rest
of `php-backend/` next to it as a sibling folder; then edit
`public_html/index.php` to require from the new location.

---

## 5. Import the database schema

**phpMyAdmin** → select your DB → *Import* → choose
`php-backend/migrations/001_init.sql` → *Go*.

Or via SSH:
```bash
mysql -u u123456_cfs -p u123456_claimforsure \
  < ~/domains/api.claimforsure.in/private/php-backend/migrations/001_init.sql
```

Verify 7 tables exist: `users, admins, claims, claim_documents,
password_resets, email_verification_tokens, activity_logs`.

---

## 6. Generate the JWT secret

SSH (any one of these):
```bash
openssl rand -hex 64
# or
php -r 'echo bin2hex(random_bytes(64)), PHP_EOL;'
```

Copy the 128-char hex string — you'll paste it into `JWT_SECRET` below.

No SSH? Use https://www.random.org/strings/ → 128 chars, hex.

---

## 7. Configure `.env`

```bash
cd ~/domains/api.claimforsure.in/private/php-backend
cp .env.example .env
nano .env
```

Paste these values (replace bracketed parts):

```ini
# ===== Database =====
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u123456_claimforsure
DB_USER=u123456_cfs
DB_PASS=YOUR_DB_PASSWORD

# ===== JWT =====
JWT_SECRET=PASTE_THE_128_CHAR_HEX_HERE
JWT_ISSUER=claimforsure
JWT_TTL_SECONDS=86400

# ===== App =====
APP_ENV=production
APP_URL=https://api.claimforsure.in
FRONTEND_URL=https://claimforsure.in
CORS_ALLOWED_ORIGINS=https://claimforsure.in,https://www.claimforsure.in

# ===== Uploads =====
UPLOAD_DIR=/home/USER/domains/api.claimforsure.in/private/php-backend/uploads
MAX_UPLOAD_BYTES=10485760
ALLOWED_UPLOAD_EXTS=pdf,jpg,jpeg,png,doc,docx

# ===== SMTP (Hostinger Email — support@claimforsure.in) =====
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USER=support@claimforsure.in
MAIL_PASS=YOUR_MAILBOX_PASSWORD
MAIL_FROM=support@claimforsure.in
MAIL_FROM_NAME="ClaimForSure"
```

Lock the file:
```bash
chmod 600 .env
```

---

## 8. Uploads directory + permissions

```bash
cd ~/domains/api.claimforsure.in/private/php-backend
mkdir -p uploads
chmod 775 uploads          # cPanel/Hostinger PHP runs as your user
find uploads -type d -exec chmod 775 {} \;
```

Block direct web access (defense in depth — uploads is already outside the
docroot, but if you had to put it under `public_html/`, drop this `.htaccess`
**inside `uploads/`**):
```apache
# uploads/.htaccess  (only needed if uploads is under public_html)
Require all denied
```

---

## 9. Apache `.htaccess` for the API

`php-backend/public/.htaccess` is already provided. Confirm the file exists
and contains:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.php [QSA,L]

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

Add a top-level **redirect from HTTP to HTTPS** in the SAME `.htaccess`
(after the `RewriteEngine On` line):

```apache
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

PHP version: hPanel → *Advanced* → *PHP Configuration* → set **PHP 8.1+**
and enable extensions: `pdo_mysql, mbstring, json, fileinfo, openssl`.

---

## 10. SSL / HTTPS

Hostinger: *Security* → *SSL* → install free **Let's Encrypt** on BOTH
`claimforsure.in` AND `api.claimforsure.in`. Wait 5–10 min.

cPanel: *Security* → *SSL/TLS Status* → "Run AutoSSL".

Verify: open `https://api.claimforsure.in/api/auth/me` — you should see
`{"error":"unauthorized"}` (that's correct; it proves HTTPS + routing work).

---

## 11. SMTP from support@claimforsure.in

**Create the mailbox** first:
hPanel → *Emails* → *Email Accounts* → Create `support@claimforsure.in`.
Save the mailbox password — you'll put it in `MAIL_PASS`.

**Install PHPMailer** (the only optional dependency). SSH:
```bash
cd ~/domains/api.claimforsure.in/private/php-backend
# If composer is available:
composer require phpmailer/phpmailer

# No composer? Download the release zip from
# https://github.com/PHPMailer/PHPMailer/releases and extract to:
#   php-backend/vendor/phpmailer/
```

Add a thin mailer helper at `php-backend/lib/mailer.php`:

```php
<?php
declare(strict_types=1);
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

function send_mail(string $to, string $subject, string $html): bool {
    $m = new PHPMailer(true);
    $m->isSMTP();
    $m->Host       = env('MAIL_HOST');
    $m->Port       = (int) env('MAIL_PORT', '465');
    $m->SMTPAuth   = true;
    $m->Username   = env('MAIL_USER');
    $m->Password   = env('MAIL_PASS');
    $m->SMTPSecure = $m->Port === 465 ? 'ssl' : 'tls';
    $m->setFrom(env('MAIL_FROM'), env('MAIL_FROM_NAME', 'ClaimForSure'));
    $m->addAddress($to);
    $m->isHTML(true);
    $m->Subject = $subject;
    $m->Body    = $html;
    return $m->send();
}
```

Then in `api/auth/forgot.php` and `api/auth/signup.php` replace the part that
returns `reset_link` / `verify_link` with:

```php
require_once __DIR__ . '/../../lib/mailer.php';
send_mail($email, 'Reset your ClaimForSure password',
  '<p>Click to reset: <a href="' . FRONTEND_URL . '/auth/reset?token=' . $token . '">Reset password</a></p>');
json_response(['ok' => true]);
```

DNS records to add at your domain (hPanel → DNS Zone Editor):
- **SPF (TXT @)**: `v=spf1 include:_spf.mail.hostinger.com ~all`
- **DKIM**: hPanel → *Emails* → *DKIM* → Enable → copy the TXT it generates
- **DMARC (TXT _dmarc)**: `v=DMARC1; p=quarantine; rua=mailto:support@claimforsure.in`

---

## 12. Domain & frontend hosting

Build the React app locally pointing at the API:

```bash
# in your local frontend project
echo "VITE_API_BASE_URL=https://api.claimforsure.in" > .env.production
npm run build
# upload everything inside dist/ to:
#   domains/claimforsure.in/public_html/
```

Drop this `.htaccess` in `public_html/` so React Router deep links work:

```apache
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```

---

## 13. Create the first admin

SSH:
```bash
cd ~/domains/api.claimforsure.in/private/php-backend
php scripts/create_admin.php biswajitkhamari2@gmail.com 'Biswa@12' 'Biswajit Khamari'
```

You should see `Admin ready: biswajitkhamari2@gmail.com`.

No SSH? Use hPanel → *Advanced* → *Cron Jobs* → add a one-off job:
```
php /home/USER/domains/api.claimforsure.in/private/php-backend/scripts/create_admin.php you@mail.com 'YourPass' 'Your Name'
```
Set it to run once in the next minute, then delete it.

---

## 14. Production security checklist

Before going live, tick every box:

- [ ] `.env` permissions are `600` and the file is OUTSIDE `public_html/`
- [ ] `JWT_SECRET` is 64+ random bytes (NOT the example value)
- [ ] `APP_ENV=production` (PHP errors are not displayed to users)
- [ ] DB user has access to ONLY this database, not `*.*`
- [ ] HTTPS works on both domains; HTTP → HTTPS 301 redirect active
- [ ] `CORS_ALLOWED_ORIGINS` lists only your real frontend origin(s) — no `*`
- [ ] `uploads/` directory is OUTSIDE `public_html/` (or has `Require all denied`)
- [ ] PHP version ≥ 8.1; `display_errors=Off` in php.ini
- [ ] phpMyAdmin is protected (Hostinger gates it behind hPanel login)
- [ ] SSH password disabled — key-only auth where possible
- [ ] SPF, DKIM, DMARC records verified at https://mxtoolbox.com
- [ ] Default `admin@example.com` test account, if any, is deleted
- [ ] Database backups scheduled (next section)
- [ ] You ran the test checklist (section 16) end-to-end

---

## 15. Backups & restore

### Daily DB dump (Hostinger cron)
hPanel → *Advanced* → *Cron Jobs* → add:
```
0 3 * * *  mysqldump -u u123456_cfs -p'YOUR_DB_PASSWORD' u123456_claimforsure \
  | gzip > /home/USER/backups/cfs-$(date +\%F).sql.gz \
  && find /home/USER/backups -name 'cfs-*.sql.gz' -mtime +14 -delete
```

### Weekly uploads tarball
```
0 4 * * 0  tar -czf /home/USER/backups/uploads-$(date +\%F).tar.gz \
  -C /home/USER/domains/api.claimforsure.in/private/php-backend uploads
```

### Manual download
```bash
scp -P 65002 USER@host:~/backups/cfs-YYYY-MM-DD.sql.gz .
```

### Restore
```bash
gunzip < cfs-YYYY-MM-DD.sql.gz | mysql -u u123456_cfs -p u123456_claimforsure
tar -xzf uploads-YYYY-MM-DD.tar.gz \
  -C ~/domains/api.claimforsure.in/private/php-backend
```

Also keep a copy off-server (Google Drive, S3, local disk).

---

## 16. End-to-end test checklist

Use Postman, `curl`, or the deployed frontend. Replace `TOKEN` with the JWT
returned from login.

### 1. Health (no auth)
```bash
curl https://api.claimforsure.in/api/auth/me
# → {"error":"unauthorized"}   ✅ proves routing + HTTPS
```

### 2. Signup → expect 201 + verify link in email
```bash
curl -X POST https://api.claimforsure.in/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@you.com","password":"TestPass1!","full_name":"Test","phone":"9999999999"}'
```
- [ ] Response includes `token` and `user`
- [ ] Email arrives at `test@you.com` from `support@claimforsure.in`
- [ ] Verify link works → DB row `users.email_verified = 1`

### 3. Login
```bash
curl -X POST https://api.claimforsure.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@you.com","password":"TestPass1!"}'
```
- [ ] Returns `token`; wrong password returns 401

### 4. Forgot + reset password
```bash
curl -X POST https://api.claimforsure.in/api/auth/forgot \
  -H "Content-Type: application/json" -d '{"email":"test@you.com"}'
```
- [ ] Reset email arrives → link opens the React reset page
- [ ] New password works for login; old password fails

### 5. Submit a claim
```bash
curl -X POST https://api.claimforsure.in/api/claims \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"full_name":"Test","phone":"9999999999","email":"test@you.com",
       "city":"Mumbai","state":"MH","insurance_type":"Health",
       "insurance_company":"ACME","policy_number":"P1","claim_amount":50000,
       "rejection_date":"2025-01-01","rejection_reason":"Pre-existing"}'
```
- [ ] Returns `id` + `claim_id`
- [ ] Row visible in `claims` table

### 6. Upload a document
```bash
curl -X POST https://api.claimforsure.in/api/claims/upload \
  -H "Authorization: Bearer TOKEN" \
  -F "claim_id=THE_UUID" -F "doc_type=policy" -F "file=@/path/to/sample.pdf"
```
- [ ] Returns 201 with `path`
- [ ] File exists under `uploads/USER_ID/CLAIM_ID/`
- [ ] Row in `claim_documents`

### 7. Profile update
```bash
curl -X PUT https://api.claimforsure.in/api/profile \
  -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" \
  -d '{"full_name":"Test Updated","phone":"8888888888"}'
```
- [ ] `users` row updated

### 8. Admin dashboard
Login as the admin you created in step 13:
- [ ] `GET /api/admin/stats` → counts
- [ ] `GET /api/admin/claims` → list includes the test claim
- [ ] `PATCH /api/admin/claims/{id}` `{"status":"approved"}` → status changes
- [ ] Non-admin token on the same endpoints returns **403**

### 9. Security spot-checks
- [ ] `https://api.claimforsure.in/.env` → 403 / 404 (NEVER the file)
- [ ] `https://api.claimforsure.in/config/config.php` → 403 / 404
- [ ] Browser dev-tools: requests from your site succeed; from any other origin CORS blocks them

---

## 17. Putting it all together — one-page runbook

1. Create subdomain `api.claimforsure.in` → docroot `…/private/php-backend/public`.
2. Create MySQL DB + user; note `DB_NAME`, `DB_USER`, `DB_PASS`.
3. Upload `php-backend/` into `…/private/`.
4. Import `migrations/001_init.sql` via phpMyAdmin.
5. SSH: `cp .env.example .env`, fill values, `chmod 600 .env`.
6. `mkdir uploads && chmod 775 uploads` (outside docroot).
7. Confirm `public/.htaccess` exists; add HTTP→HTTPS redirect.
8. Install Let's Encrypt SSL on both domains.
9. Create `support@claimforsure.in`; add SPF/DKIM/DMARC; install PHPMailer; wire `mailer.php`.
10. `php scripts/create_admin.php you@mail.com 'StrongPass' 'Name'`.
11. Run the 9 tests in section 16 — every box must be checked.
12. Schedule daily DB dump + weekly uploads tarball (section 15).
13. Tick every item in the security checklist (section 14).
14. Build the React app with `VITE_API_BASE_URL=https://api.claimforsure.in` and upload `dist/` to `claimforsure.in/public_html/`.
15. Tell me when this is all done → I'll swap every Supabase call in the frontend for the new `api.*` client.

Once you're done, the entire stack — auth, claims, documents, admin, email —
lives on your Hostinger account. Lovable Cloud and Supabase can be safely
disabled.
