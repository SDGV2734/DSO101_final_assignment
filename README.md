# CST Booking System

A production-ready booking application scaffold for CST student laundry and football ground reservations.

The project is intentionally split into separate applications:

- `backend/` - Express.js, TypeScript, Prisma ORM, PostgreSQL, JWT auth.
- `frontend/` - React + Vite + Tailwind + TypeScript UI implementation.

## Step 1: PostgreSQL Database Schema

The Prisma schema is defined in [backend/prisma/schema.prisma](/Users/sonamdorjighalley/Desktop/SEM-6/DSO101/final-project/backend/prisma/schema.prisma).

The initial migration is defined in [backend/prisma/migrations/20260520000000_init/migration.sql](/Users/sonamdorjighalley/Desktop/SEM-6/DSO101/final-project/backend/prisma/migrations/20260520000000_init/migration.sql).

Core tables:

- `User` stores student accounts with unique email and student ID.
- `LaundryBooking` stores washer/dryer reservations.
- `GroundBooking` stores football ground reservations.
- `Notification` stores simulated in-app booking confirmations and cancellation notices.

Important production constraints:

- Passwords are stored as bcrypt hashes, never plaintext.
- `LaundryBooking_active_slot_unique` prevents two active bookings for the same laundry resource and start time.
- `GroundBooking_active_slot_unique` prevents two active bookings for the same ground and start time.
- Partial unique indexes allow cancelled bookings to remain in history while freeing the slot for another active booking.
- Query indexes support dashboard, availability, and user booking history lookups.

## Step 2: Backend API Architecture

The backend follows a layered structure:

- `routes/` maps HTTP endpoints.
- `controllers/` handles request/response concerns.
- `services/` contains business logic and database transactions.
- `schemas/` contains Zod validation.
- `middleware/` contains auth, validation, and global error handling.
- `config/` contains environment and Prisma setup.

API endpoints are mounted under `/api`:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/dashboard`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/laundry/availability?date=YYYY-MM-DD&resourceType=WASHER&resourceNumber=1`
- `POST /api/laundry/bookings`
- `PATCH /api/laundry/bookings/:id/cancel`
- `GET /api/ground/availability?date=YYYY-MM-DD`
- `POST /api/ground/bookings`
- `PATCH /api/ground/bookings/:id/cancel`

## Running The Backend

From `backend/`:

```bash
cp .env.example .env
npm install
npm run prisma:migrate
npm run dev
```

Required environment values live in [backend/.env.example](/Users/sonamdorjighalley/Desktop/SEM-6/DSO101/final-project/backend/.env.example).

For production:

```bash
npm run build
npm run prisma:deploy
npm start
```

## Verification

The backend currently passes:

```bash
npm run prisma:generate
npm run lint
npm run build
```

The frontend currently passes:

```bash
npm run lint
npm run build
```

## Running Both Apps

Start the backend from `backend/`:

```bash
cp .env.example .env
npm install
npm run prisma:migrate
npm run dev
```

Start the frontend from `frontend/`:

```bash
cp .env.example .env
npm install
npm run dev
```

Then open `http://localhost:5173`.
