HOS — Hostel Operating System
A full-stack Hostel Operating System for managing a college/university hostel, with separate Student and Warden portals.
> **Status: Phase 1 complete.** Project setup, database schema foundation, JWT authentication, role-based protected routes, and basic dashboards for both roles. Complaints, leave, fees, gate passes, mess, etc. are scaffolded in the plan but land in Phases 2–6 (see `PROJECT_PLAN` section below).
---
1. Stack
Layer	Tech
Frontend	React 18 + TypeScript + Vite + Tailwind CSS + React Router + Axios + lucide-react
Backend	Node.js + Express + TypeScript
Database	PostgreSQL
Auth	JWT + bcrypt, role-based access control
---
2. Project structure
```
/project
  /frontend        React app (Vite)
  /backend         Express API
  /database
    /schema        SQL migration files (run in order)
    /seed          Demo data seed script
  README.md
```
---
3. Prerequisites
Node.js 18+ and npm
PostgreSQL 14+ running locally (or a connection string to a hosted instance)
---
4. Setup
4.1 Create the database
```bash
createdb hos
# or, from psql:
# CREATE DATABASE hos;
```
4.2 Backend
```bash
cd backend
cp .env.example .env
```
Edit `.env` and set at minimum:
```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/hos
JWT_SECRET=<generate a long random string>
```
You can generate a strong `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Install dependencies, run migrations, seed demo data, then start the API:
```bash
npm install
npm run migrate   # applies database/schema/*.sql in order
npm run seed       # creates demo warden + students + rooms
npm run dev        # starts the API on http://localhost:4000
```
4.3 Frontend
In a second terminal:
```bash
cd frontend
cp .env.example .env   # defaults already point to http://localhost:4000/api
npm install
npm run dev             # starts the app on http://localhost:5173
```
Open http://localhost:5173.
---
5. Environment variables
Backend (`backend/.env`)
Variable	Required	Description
`PORT`	No (default 4000)	API port
`NODE_ENV`	No	`development` / `production`
`CORS_ORIGIN`	Yes	Frontend origin allowed to call the API
`DATABASE_URL`	Yes	PostgreSQL connection string
`JWT_SECRET`	Yes	Secret used to sign JWTs — never commit this
`JWT_EXPIRES_IN`	No (default 7d)	Session token lifetime
Frontend (`frontend/.env`)
Variable	Required	Description
`VITE_API_URL`	Yes	Base URL of the backend API
No secrets are hard-coded anywhere in the codebase — both `.env.example` files list every variable required.
---
6. Demo credentials
Created by `npm run seed` (backend). All data is fictional placeholder data — no real personal information.
Role	Email	Password
Warden	`warden@demo.hos`	`Warden@123`
Student	`s1@demo.hos`	`Student@123`
Student	`s2@demo.hos`	`Student@123`
Student	`s3@demo.hos`	`Student@123`
---
7. Testing the two login flows
Student login
Go to `http://localhost:5173` → click Student Login.
Sign in with `s1@demo.hos` / `Student@123`.
You should land on `/student/dashboard` showing the student's name, ID, course, year and room.
Try visiting `http://localhost:5173/warden/dashboard` directly — you should be redirected back to `/student/dashboard` (role-based route protection).
Warden login
Go to `http://localhost:5173` → click Warden Login.
Sign in with `warden@demo.hos` / `Warden@123`.
You should land on `/warden/dashboard` showing hostel-wide stats (total students, room occupancy, etc.) computed live from the database.
Visit `/warden/students` to see the searchable student list, also pulled live from the database.
Try visiting `http://localhost:5173/student/dashboard` directly — you should be redirected back to `/warden/dashboard`.
API sanity check
```bash
curl http://localhost:4000/api/health
# {"success":true,"data":{"status":"ok"}}

curl -X POST http://localhost:4000/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"email":"s1@demo.hos","password":"Student@123"}'
```
---
8. What's implemented in Phase 1
Project scaffold for frontend, backend, database exactly per the spec's folder layout
PostgreSQL schema: `users`, `students`, `wardens`, `rooms`, `audit_logs` (remaining tables from the full data model land in Phases 3–6 alongside the features that use them)
bcrypt password hashing, JWT auth, rate-limited login endpoints
Role-based middleware (`authenticate` + `requireRole`) protecting all non-auth API routes
Role-based frontend route guards (`ProtectedRoute`) — a student can never reach a warden route and vice versa
Landing page with role-specific login entry points
Student dashboard, profile (read-only), room info — all backed by real API calls, not mock data
Warden dashboard (live occupancy/student counts) and searchable student directory
Consistent `{ success, data }` / `{ success, error }` API response shape
Loading / error / empty states on every data-driven page
`.env.example` for both frontend and backend; no secrets committed
9. Known limitations / what's next (Phases 2–6)
This is intentionally a Phase 1 slice, not the full spec. Not yet built:
Complaints, maintenance, leave, gate pass, visitors, laundry, notices, Wi-Fi issues, attendance, lost & found, SOS, feedback, fees/payments/receipts, reports, notifications, audit-log UI — all called out as "coming in a later phase" in the current UI, with disabled quick-action buttons rather than fake/dead buttons
Profile editing (currently read-only)
Toast notification system
Charts on the warden dashboard
Mobile bottom-navigation (current responsive layout uses a collapsible sidebar; a dedicated mobile nav pattern is a Phase 2+ polish item)
Each of these has its database tables, API routes and pages already named in this plan — Phase 2 onward wires them up the same way Phase 1 wired login → dashboard → live data.
10. Known issue to verify on your machine
This code was written in a sandboxed environment without network/database access, so `npm install` and the actual migrate/seed/login flow have not been run end-to-end yet. The code is written to be correct, but please run through Section 7 above and report back anything that errors — most likely candidates are a version mismatch in `package.json` or a typo, both quick fixes.
