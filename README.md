# Nexa — SaaS Admin Dashboard

A portfolio-ready full-stack SaaS dashboard built with Next.js App Router, TypeScript, Node.js route handlers, MongoDB, Mongoose, Recharts, Zod, and custom CSS.

> This is a personal demo project. Revenue and activity chart values are illustrative demo data; user counts and user records come from MongoDB.

## Features

- Responsive light-theme SaaS dashboard
- Session-based admin login using signed JWT in an HTTP-only cookie
- Dashboard metrics and revenue visualization
- User management: list, search, create, edit, and delete
- Server-side input validation with Zod
- MongoDB persistence with Mongoose
- Seed script with demo admin and sample users
- API routes protected by session authentication

## Requirements

- Node.js 20.9 or newer
- npm
- MongoDB local instance or MongoDB Atlas database

## Quick start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Update `MONGODB_URI` and set a unique `JWT_SECRET` with at least 32 characters. Change the demo admin password before deployment.

4. Seed the database:

   ```bash
   npm run seed
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 and sign in using the values configured in `.env.local`.

## Environment variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign session tokens (32+ characters) |
| `ADMIN_NAME` | Demo administrator name |
| `ADMIN_EMAIL` | Demo administrator email |
| `ADMIN_PASSWORD` | Demo administrator password; change before deployment |

## API routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate admin and set session cookie |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/dashboard` | Return dashboard stats and recent users |
| GET | `/api/users` | List users; supports `?q=` search |
| POST | `/api/users` | Create a user |
| PATCH | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

All dashboard and user endpoints require an authenticated session.

## Project structure

```text
app/
  api/                 # Node.js route handlers
  login/               # Login page
  globals.css          # Responsive application styles
  layout.tsx           # Root layout and metadata
  page.tsx             # Protected dashboard entry
components/
  Dashboard.tsx        # Dashboard, charts, user management UI
  LoginForm.tsx        # Login form
lib/
  auth.ts              # JWT session helpers
  db.ts                # MongoDB connection cache
  validators.ts        # Zod schemas
models/
  Admin.ts             # Admin model
  User.ts              # Workspace user model
scripts/
  seed.ts              # Demo data and admin seeder
```

## Before deploying

- Replace demo credentials and rotate `JWT_SECRET`.
- Use a production MongoDB database and restrict its network access.
- Configure HTTPS and production environment variables in your hosting provider.
- Add rate limiting to authentication and mutation endpoints.
- Review authorization rules before introducing multiple admin roles.
- Replace illustrative revenue/activity metrics with real billing and analytics data.
- Run `npm run build` and test all flows before publishing.

## Portfolio notes

Suggested portfolio title: **Nexa SaaS Admin Dashboard — Full Stack Web App**.

Describe it accurately as a personal project. Do not claim that illustrative revenue metrics represent real business revenue or that the project was commissioned by a client.
