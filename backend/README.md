# CST Booking System Backend

Express + TypeScript API for student registration, JWT authentication, laundry booking, football ground booking, dashboard history, and in-app notifications.

## Architecture

- `src/routes` - endpoint registration.
- `src/controllers` - HTTP request/response logic.
- `src/services` - business logic, Prisma queries, and transactions.
- `src/schemas` - Zod request validation.
- `src/middleware` - auth, validation, 404, and global error handling.
- `prisma` - PostgreSQL schema and migrations.

## Local Setup

```bash
cp .env.example .env
npm install
npm run prisma:migrate
npm run dev
```

## Booking Safety

Booking creation uses serializable Prisma transactions and PostgreSQL partial unique indexes:

- Active laundry bookings are unique by `resource_type`, `resource_number`, and `starts_at`.
- Active ground bookings are unique by `ground_name` and `starts_at`.
- Cancelled bookings stay in the database for history but no longer block the slot.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
```
