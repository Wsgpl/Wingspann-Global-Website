# Wingspann Website

Corporate website and content platform for Wingspann Global. This repository contains a React/Vite frontend and an Express/MySQL backend that power the public website, careers pipeline, newsroom, media uploads, and admin login flow.

## Overview

This project is split into two apps:

- `frontend/` is the public-facing website and the `/admin` interface.
- `backend/` is the API server, upload handler, mailer, auth layer, and production host for the built frontend.

The public site includes:

- Home, About, Technology, Solutions, Careers, Press, Publications, Apps, Contact, Privacy Policy, and Terms pages
- Data-driven product pages for UAS, space systems, aerospace components, and optical systems
- News content loaded from MySQL
- Career applications with optional resume upload
- Footer social links loaded from database settings

The backend includes:

- Contact form storage plus email notifications
- Career application storage plus email notifications
- Admin authentication with HttpOnly JWT cookies
- Protected resume downloads
- Public media uploads for images and video
- MySQL-backed routes for news, products, technology items, careers, and social links

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Three.js
- Backend: Node.js, Express, MySQL2, bcryptjs, JWT, Nodemailer, Multer
- Security: Helmet, rate limiting, input validation, cookie-based auth, file signature checks

## Repository Structure

```text
.
|-- backend/
|   |-- db/                  # schema files, migrations, DB helpers
|   |-- mailer/              # SMTP transport and outgoing email templates
|   |-- middleware/          # auth and upload validation
|   |-- private/resumes/     # protected resume storage
|   |-- routes/              # public and admin API routes
|   |-- uploads/             # public media uploads
|   `-- server.js            # Express entry point
|-- frontend/
|   |-- public/              # static media, PDFs, HTML viewers
|   |-- src/components/      # reusable UI blocks
|   |-- src/lib/             # API clients and shared helpers
|   |-- src/pages/           # routed pages, including /admin
|   `-- vite.config.ts       # Vite config and /api proxy
`-- README.md
```

## Architecture

In development:

- Vite serves the frontend on `http://localhost:5173`
- Express serves the API on `http://localhost:5000`
- `frontend/vite.config.ts` proxies `/api` requests to the backend

In production:

- Build the frontend into `frontend/dist`
- Start the Express server from `backend/`
- The backend serves both `frontend/dist` and the API

Special case:

- `space-showcase.html`, `space-6u.html`, and `space-12u.html` are served directly by the backend so CSP nonces can be injected into their script tags

## Key Features

- Responsive marketing site with video-heavy aerospace visuals
- Data-backed newsroom and dynamic product catalog
- Careers page with database-driven role cards and application modal
- Contact page with optional attachment support
- Admin sign-in at `/admin`
- Secure media handling:
  - contact attachments are processed in memory
  - resumes are stored privately in `backend/private/resumes`
  - admin media uploads are stored publicly in `backend/uploads/media`

## API Areas

Public API routes include:

- `/api/health`
- `/api/contact`
- `/api/apply`
- `/api/careers/positions`
- `/api/news`
- `/api/technology/:category`
- `/api/products`
- `/api/products/:slug`
- `/api/social-links`

Protected/admin routes include:

- `/api/admin/login`
- `/api/admin/logout`
- `/api/admin/me`
- `/api/admin/upload`
- `/api/admin/careers`
- `/api/admin/social-links`
- `/api/admin/settings/credentials`
- `/api/admin/resumes/:filename`
- protected content write routes for news, products, and technology

## Local Development

### Prerequisites

- Node.js 18+ and npm
- MySQL 8+ or a compatible MySQL/MariaDB instance
- SMTP credentials for outgoing email

### 1. Install dependencies

Install the backend and frontend separately. There is no root `package.json`.

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create `backend/.env` from `backend/.env.example`, then add the variables the current code expects.

Backend example:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=wingspann_db

SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@example.com
SMTP_PASS=your_email_password

EMAIL_INFO=info@example.com
EMAIL_HR=hr@example.com

JWT_SECRET=replace-with-a-long-random-secret
PUBLIC_API_URL=http://localhost:5000
API_URL=http://localhost:5000
```

Notes:

- `JWT_SECRET` is required for admin login and protected routes.
- `PUBLIC_API_URL` or `API_URL` is used when the backend needs to turn `/uploads/...` paths into absolute public URLs.
- `backend/.env.example` currently includes `EMAIL_TECH`, but the active mailer logic uses `EMAIL_INFO` and `EMAIL_HR`.

Create `frontend/.env.local` with:

```env
VITE_API_URL=http://localhost:5000
```

Notes:

- Some frontend calls use the Vite proxy, but many pages build API URLs from `VITE_API_URL`, so setting it is recommended.

### 3. Create the database

Run the SQL files in `backend/db/` against the database named in `DB_NAME`.

Minimum setup for a fresh database:

1. `backend/db/schema.sql`
2. `backend/db/admin-schema.sql`

Recommended follow-up migrations for parity with the current codebase:

1. `backend/db/migrate-news.sql`
2. `backend/db/migrate-products.sql`
3. `backend/db/migrate-social-links.sql`
4. `backend/db/migrate-career-positions.sql`

What these do:

- `schema.sql` creates the base contact and application tables
- `admin-schema.sql` creates admin/content tables such as `admin_users`, `news`, `technology_items`, `products`, `social_links_settings`, and `career_positions`
- `migrate-news.sql` aligns the `news` schema and inserts sample articles
- `migrate-products.sql` aligns the `products` schema
- `migrate-social-links.sql` ensures the singleton social links settings row exists
- `migrate-career-positions.sql` creates or aligns `career_positions` and seeds default roles

### 4. Set the admin password

`admin-schema.sql` inserts an `admin` user with a placeholder hash, so you must replace that hash before the admin panel can be used.

Generate a bcrypt hash:

```bash
cd backend
node generate-hash.js your-strong-password
```

Then update the `admin_users` table with the generated hash.

The admin UI is available at:

```text
http://localhost:5173/admin
```

### 5. Start the apps

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

## Available Scripts

Backend:

- `npm run dev` - start the API with `nodemon`
- `npm start` - start the API with Node
- `node generate-hash.js <password>` - generate an admin password hash

Frontend:

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build in `frontend/dist`
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint
- `npm run typecheck` - run TypeScript without emitting files

## Data and Upload Behavior

- Contact submissions are stored in `contact_submissions`
- Career applications are stored in `career_applications`
- Contact attachments:
  - accepted: `.pdf`, `.doc`, `.docx`, `.jpg`, `.jpeg`, `.png`
  - size limit: 5 MB
  - handled in memory and attached to email
- Resume uploads:
  - accepted: `.pdf`, `.doc`, `.docx`
  - size limit: 10 MB
  - validated by file signature, not just extension
  - saved privately to `backend/private/resumes`
- Admin media uploads:
  - accepted: common image and video formats
  - size limit: 100 MB
  - saved to `backend/uploads/media`

## Security Notes

- Admin authentication uses HttpOnly cookies instead of storing JWTs in `localStorage`
- Helmet adds CSP and other security headers
- Rate limiting is enabled:
  - contact submissions: 5 requests per 15 minutes
  - career applications: 5 requests per 15 minutes
  - admin login: 10 requests per 15 minutes
  - general API traffic: 200 requests per 15 minutes
- Public media and resume uploads use content validation to reduce spoofed file uploads
- Resume downloads are protected behind admin auth and filename sanitization

## Production Build and Deployment

### Build

```bash
cd frontend
npm run build
```

### Run

```bash
cd backend
npm start
```

Production requirements:

- `NODE_ENV=production`
- `frontend/dist` must exist before starting the backend
- set `FRONTEND_URL`, `PUBLIC_API_URL`, database credentials, SMTP credentials, and `JWT_SECRET`

When running in production, `backend/server.js` will:

- serve `frontend/dist`
- expose `/uploads` as public static assets
- keep resumes private behind `/api/admin/resumes/:filename`
- serve the standalone space viewer HTML files

## Current Maintenance Notes

- The repo currently has no automated test suite configured.
- The root of the repository is documentation-only; install and run `frontend/` and `backend/` separately.
- Product and technology pages are database-driven, so empty tables will result in sparse or empty sections on the public site.
- The backend contains protected CRUD routes for products and technology. The current shipped admin UI visibly focuses on news, careers, social links, and account settings.
- `backend/db/productCatalog.js` contains reference product data, but the current startup path validates schema only; it does not automatically seed the `products` table.

## License

All rights reserved by Wingspann.
