# ClaimForSure — PHP + MySQL Backend

A zero-dependency PHP 8.1+ REST API. Deployable on any shared PHP/MySQL host
(Hostinger, cPanel, Bluehost, etc.) or a VPS with Apache/Nginx + PHP-FPM.

## 1. Requirements

- PHP **8.1+** with extensions: `pdo_mysql`, `mbstring`, `json`, `fileinfo`, `openssl`
- MySQL 5.7+ or MariaDB 10.4+
- Apache (`mod_rewrite`) or Nginx

## 2. Install

```bash
# 1. Copy files to your host (everything inside php-backend/)
# 2. Create the database
mysql -u root -p -e "CREATE DATABASE claimforsure CHARACTER SET utf8mb4;"
mysql -u root -p claimforsure < migrations/001_init.sql

# 3. Configure
cp .env.example .env
# edit .env — set DB credentials and a strong JWT_SECRET (openssl rand -hex 64)

# 4. Make uploads writable
mkdir -p uploads && chmod 775 uploads

# 5. Create first admin
php scripts/create_admin.php you@example.com 'StrongPass1!' 'Your Name'
```

Point your web server **document root** at `php-backend/public/`. The included
`.htaccess` rewrites everything to `index.php` (the front controller).

### Nginx example
```nginx
root /var/www/claimforsure/php-backend/public;
location / { try_files $uri $uri/ /index.php?$query_string; }
location ~ \.php$ { fastcgi_pass unix:/run/php/php8.1-fpm.sock; include fastcgi_params; fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name; }
```

## 3. API Reference

All requests/responses are JSON unless noted. Auth via `Authorization: Bearer <jwt>`.

| Method | Path                          | Auth   | Body / Notes |
|--------|-------------------------------|--------|--------------|
| POST   | `/api/auth/signup`            | none   | `{email,password,full_name,phone}` |
| POST   | `/api/auth/login`             | none   | `{email,password}` → `{token,user}` |
| POST   | `/api/auth/logout`            | user   | — |
| GET    | `/api/auth/me`                | user   | current user + `is_admin` |
| POST   | `/api/auth/forgot`            | none   | `{email}` |
| POST   | `/api/auth/reset`             | none   | `{token,password}` |
| GET/POST | `/api/auth/verify`          | none   | `?token=…` or `{token}` |
| POST   | `/api/auth/resend-verify`     | user   | — |
| GET    | `/api/profile`                | user   | — |
| PUT    | `/api/profile`                | user   | `{full_name,phone}` |
| GET    | `/api/claims`                 | user   | list current user's claims |
| POST   | `/api/claims`                 | user   | submit claim (see fields below) |
| GET    | `/api/claims/{id}`            | user   | claim + documents |
| POST   | `/api/claims/upload`          | user   | **multipart**: `file`, `claim_id`, `doc_type` (`policy\|hospital\|other`) |
| GET    | `/api/admin/stats`            | admin  | counts |
| GET    | `/api/admin/claims`           | admin  | `?status=&limit=&offset=` |
| PATCH  | `/api/admin/claims/{id}`      | admin  | `{status}` |
| GET    | `/api/admin/users`            | admin  | `?limit=&offset=` |

**Claim fields**: `full_name, phone, email, city, state, insurance_type, insurance_company, policy_number, claim_amount, rejection_date (YYYY-MM-DD), rejection_reason`.

## 4. Security

- Passwords hashed with `password_hash(..., PASSWORD_BCRYPT)`.
- All SQL goes through PDO **prepared statements**.
- JWT (HS256) signed with `JWT_SECRET`; 24 h expiry by default.
- Strict CORS via `CORS_ALLOWED_ORIGINS`.
- File uploads: extension whitelist, size limit, stored outside webroot (default).
- Activity logged to `activity_logs`.

Because this API uses bearer JWTs (not cookies), traditional CSRF is not a vector
— do **not** also accept the token from a cookie. If you switch to cookie auth,
add a CSRF token (double-submit pattern).

## 5. Connect the React frontend

Set one environment variable in the frontend build:

```
VITE_API_BASE_URL=https://api.claimforsure.in
```

Then replace Supabase calls with `fetch(\`${VITE_API_BASE_URL}/api/...\`)` and
store the returned JWT in `localStorage` (or an httpOnly cookie if you proxy).
A typed client wrapper is the recommended pattern — see `frontend-client.example.ts`
in this folder.

## 6. Email (optional)

`forgot` and `signup` currently return the verification/reset link in the JSON
response so you can test. For production, install PHPMailer
(`composer require phpmailer/phpmailer`) and send the link via SMTP using
the `MAIL_*` env vars.
