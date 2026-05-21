# CST Booking System

## Document Control

| Field | Value |
| --- | --- |
| Title | CST Booking System: Technical Implementation, DevOps, and CI/CD Report |
| Version | 1.0.0 |
| Classification | Internal Technical Documentation |
| System | CST Booking System |
| Scope | React frontend, Express backend, PostgreSQL database, Docker, GitHub Actions, Render deployment |

## Executive Summary

CST Booking System is a full-stack booking platform for student laundry reservations and football ground bookings. It includes student registration and login, authenticated dashboards, laundry and ground slot availability, booking cancellation, booking history, and in-app notifications.

The application is implemented as two separate applications:

- `backend/` - Express.js, TypeScript, Prisma ORM, PostgreSQL, JWT authentication.
- `frontend/` - React, Vite, TypeScript, Tailwind CSS.

The project also includes a production-oriented DevOps setup with Docker, PostgreSQL local orchestration, GitHub Actions CI/CD, Render deployment hooks, security scanning, accessibility checks, performance testing, and container vulnerability gates.

## System Architecture

| Component | Technology | Responsibility |
| --- | --- | --- |
| Frontend | React, Vite, TypeScript, Tailwind CSS | Student-facing UI for auth, dashboards, booking flows, cancellations, and notifications. |
| Backend | Node.js, Express.js, TypeScript, Prisma ORM | REST API, authentication, validation, booking logic, transactions, notifications, and persistence. |
| Database | PostgreSQL | Relational storage for users, laundry bookings, ground bookings, and notifications. |
| CI/CD | GitHub Actions | Automated test, security, performance, and deployment gates. |
| Deployment | Render | Hosted backend, frontend, and managed PostgreSQL. |

## Project Structure

```text
.
├── backend/
│   ├── Dockerfile
│   ├── prisma/
│   ├── src/
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   ├── docker/nginx.conf
│   ├── src/
│   └── package.json
├── e2e/
├── scripts/
├── .github/
│   ├── codeql/codeql-config.yml
│   └── workflows/ci-cd.yml
├── docker-compose.yml
├── playwright.config.ts
└── README.md
```

## Core Features

- Student registration and login with JWT authentication.
- Password hashing with bcrypt.
- Secure cookie support for deployed cross-origin frontend/backend communication.
- Student dashboard with upcoming and past booking history.
- In-app notification records for booking confirmation and cancellation events.
- Laundry availability for washers and dryers.
- Football ground availability.
- Booking cancellation before a slot starts.
- Database-level uniqueness constraints to prevent double-booking.
- Responsive frontend UI with accessible navigation and axe-core checks.

## Database Design

The Prisma schema is located at:

```text
backend/prisma/schema.prisma
```

The initial SQL migration is located at:

```text
backend/prisma/migrations/20260520000000_init/migration.sql
```

Core tables:

| Table | Purpose |
| --- | --- |
| `User` | Stores student accounts with unique email and student ID. |
| `LaundryBooking` | Stores washer/dryer reservations. |
| `GroundBooking` | Stores football ground reservations. |
| `Notification` | Stores simulated in-app confirmation and cancellation notices. |

Important constraints and indexes:

- User emails are unique.
- Student IDs are unique.
- Passwords are stored as bcrypt hashes, never plaintext.
- Active laundry bookings are unique by `resource_type`, `resource_number`, and `starts_at`.
- Active ground bookings are unique by `ground_name` and `starts_at`.
- Partial unique indexes allow cancelled bookings to remain in history while freeing the slot.
- Query indexes support dashboard, availability, and booking history lookups.

## Backend Architecture

The backend follows a layered Express architecture:

| Layer | Directory | Responsibility |
| --- | --- | --- |
| Routes | `backend/src/routes` | Defines HTTP endpoints and route grouping. |
| Controllers | `backend/src/controllers` | Handles request/response behavior. |
| Services | `backend/src/services` | Contains business logic, Prisma queries, and transactions. |
| Schemas | `backend/src/schemas` | Zod validation definitions. |
| Middleware | `backend/src/middleware` | Authentication, validation, 404 handling, and global error handling. |
| Config | `backend/src/config` | Environment and Prisma setup. |

All API endpoints are mounted under `/api`.

### API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health check. |
| `POST` | `/api/auth/register` | Register a student. |
| `POST` | `/api/auth/login` | Login a student. |
| `POST` | `/api/auth/logout` | Logout and clear auth cookie. |
| `GET` | `/api/auth/me` | Get authenticated user profile. |
| `GET` | `/api/dashboard` | Get upcoming/past bookings and notifications. |
| `GET` | `/api/notifications` | List notifications. |
| `PATCH` | `/api/notifications/:id/read` | Mark notification as read. |
| `GET` | `/api/laundry/availability?date=YYYY-MM-DD&resourceType=WASHER&resourceNumber=1` | Get laundry slots. |
| `POST` | `/api/laundry/bookings` | Create laundry booking. |
| `PATCH` | `/api/laundry/bookings/:id/cancel` | Cancel laundry booking. |
| `GET` | `/api/ground/availability?date=YYYY-MM-DD` | Get football ground slots. |
| `POST` | `/api/ground/bookings` | Create ground booking. |
| `PATCH` | `/api/ground/bookings/:id/cancel` | Cancel ground booking. |

## Frontend Architecture

The frontend is a Vite-based React application using client-side routing.

Frontend implementation includes:

- React Router for public and protected routes.
- Auth context for session state.
- Typed API client for backend communication.
- Reusable components such as `Button`, `Input`, `Card`, `SlotGrid`, and `BookingCard`.
- Tailwind CSS for responsive styling.
- Accessibility improvements such as skip links, semantic navigation labels, status/alert regions, and improved color contrast.

The frontend uses this environment variable:

```env
VITE_API_URL="http://localhost:4000/api"
```

On Render, this should point to the deployed backend API:

```env
VITE_API_URL="https://your-backend.onrender.com/api"
```

## Local Development

### 1. Start PostgreSQL

You can use a local PostgreSQL installation or Docker Compose.

```bash
docker compose up -d postgres
```

The Compose database uses:

```text
Database: cst_booking_system
User: postgres
Password: postgres
Port: 5432
```

Example local database URL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cst_booking_system?schema=public"
```

### 2. Run Backend

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run dev
```

Local backend `.env` example:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cst_booking_system?schema=public"
JWT_SECRET="local-secret-at-least-32-characters-long"
JWT_EXPIRES_IN="7d"
CLIENT_ORIGIN="http://localhost:5173"
COOKIE_SECURE=false
LAUNDRY_RESOURCE_COUNT=4
GROUND_RESOURCE_NAME="CST Football Ground"
RUN_MIGRATIONS=false
```

### 3. Run Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Verification Commands

Backend:

```bash
cd backend
npm run prisma:generate
npm run lint
npm run test:unit
npm run test:integration
npm run test:contract
npm run build
npm run audit:prod
```

Frontend:

```bash
cd frontend
npm run lint
npm run test:unit
npm run test:integration
npm run build
npm run audit:prod
```

End-to-end:

```bash
E2E_BASE_URL="https://your-staging-frontend.onrender.com" npm run test:e2e
```

Performance:

```bash
cd frontend
npm run perf:lighthouse
```

```bash
API_BASE_URL="https://your-staging-api.onrender.com/api" k6 run scripts/k6/booking-smoke.js
```

## Docker

### Backend Container

File:

```text
backend/Dockerfile
```

The backend Dockerfile uses multi-stage builds:

- `deps` installs dependencies and prepares Prisma schema context.
- `build` generates Prisma Client and compiles TypeScript.
- `runtime` installs production dependencies, generates Prisma Client, copies compiled output, and starts the Express server.

Runtime hardening:

- Uses `node:22-alpine`.
- Installs patched OS packages with explicit constraints such as `zlib>=1.3.2-r0`.
- Uses `dumb-init` for signal handling.
- Runs as the non-root `node` user.
- Removes npm and npx from the final runtime layer.
- Uses `./node_modules/.bin/prisma` instead of `npx`.
- Runs migrations from `backend/docker/entrypoint.sh` when `RUN_MIGRATIONS=true`.

Build:

```bash
docker build --pull -t cst-booking-backend ./backend
```

### Frontend Container

File:

```text
frontend/Dockerfile
```

The frontend Dockerfile uses multi-stage builds:

- `deps` installs Node dependencies.
- `build` compiles the Vite app into static assets.
- `runtime` serves static files through Nginx.

Runtime hardening:

- Uses `nginx:1.29-alpine`.
- Installs patched OS packages such as `zlib>=1.3.2-r0` and `nghttp2-libs>=1.68.1`.
- Serves static assets with `frontend/docker/nginx.conf`.
- Supports React Router SPA fallback with `try_files $uri $uri/ /index.html`.
- Adds basic security headers.

Build:

```bash
docker build --pull --build-arg VITE_API_URL="https://your-api-domain/api" -t cst-booking-frontend ./frontend
```

### Docker Compose

File:

```text
docker-compose.yml
```

Start local PostgreSQL:

```bash
docker compose up -d postgres
```

## CI/CD Pipeline

Workflow file:

```text
.github/workflows/ci-cd.yml
```

The workflow runs on:

- Pushes to `main`.
- Pull requests targeting `main`.
- Manual workflow dispatch.

The workflow is a blocking quality gate. A failure in any required stage prevents later stages and deployment.

### Preflight: Secret Scan

Tooling:

- TruffleHog.

Purpose:

- Detect committed credentials or verified secrets before tests and deployment.
- Uses full git history with `fetch-depth: 0`.

### Stage 1: Unit Tests

Tooling:

- Vitest.
- V8 coverage provider.
- GitHub Actions matrix.

Behavior:

- Backend and frontend unit tests run in parallel.
- Coverage thresholds are enforced at 80% for the currently unit-tested helper layer.
- A coverage drop fails the job.

Configs:

```text
backend/vitest.unit.config.ts
frontend/vitest.config.ts
```

### Stage 2: Integration Tests

Tooling:

- PostgreSQL service container.
- Prisma.
- Vitest.
- MSW.

Behavior:

- Starts real PostgreSQL 16 in GitHub Actions.
- Runs a destructive migration guard before migration deployment.
- Applies Prisma migrations.
- Runs backend database integration tests.
- Runs frontend network-layer integration tests with MSW.

The destructive migration guard blocks migration SQL containing dangerous operations such as:

- `DROP TABLE`
- `DROP COLUMN`
- `DROP DATABASE`
- `DROP SCHEMA`
- `TRUNCATE`

### Stage 3: API Contract Tests

Tooling:

- Supertest.
- Vitest.
- PostgreSQL service container.

Behavior:

- Applies migrations.
- Validates API status codes and response payload contracts.
- Confirms the health endpoint and validation error envelope remain stable.

### Stage 4: End-to-End Tests

Tooling:

- Playwright.
- Chromium.
- axe-core accessibility checks.

Behavior:

- Runs against the deployed staging frontend URL from `STAGING_URL`.
- Registers a unique E2E user.
- Verifies dashboard access.
- Navigates laundry and ground booking workflows.
- Runs axe accessibility checks.
- Uploads Playwright artifacts on failure.

Artifacts on failure:

- `playwright-report/`
- `test-results/`

### Stage 5: Performance Tests

Tooling:

- Lighthouse CI.
- k6.

Behavior:

- Builds the frontend.
- Runs Lighthouse assertions from `frontend/lighthouserc.cjs`.
- Verifies k6 reads `__ENV.API_BASE_URL`.
- Runs smoke load tests against `STAGING_API_URL`.

k6 thresholds:

- Request failure rate below 2%.
- 95th percentile request duration below 750ms.

### Stage 6: Security and Quality Gates

Tooling:

- TypeScript.
- npm audit.
- CodeQL.
- Docker.
- Trivy.

Behavior:

- Runs backend and frontend type checks.
- Runs production dependency audits.
- Runs CodeQL JavaScript/TypeScript analysis.
- Builds backend and frontend images with `docker build --pull`.
- Scans final images with Trivy.
- Fails on high or critical fixed vulnerabilities.

CodeQL config:

```text
.github/codeql/codeql-config.yml
```

The CodeQL config limits analysis to app source and scripts while ignoring generated directories such as `dist/`, `node_modules/`, coverage output, Playwright reports, and test results.

### Deployment to Render

Deployment runs only when:

- The branch is `main`.
- The event is a push.
- All CI/CD stages have passed.

The deployment job:

- Triggers Render backend deploy hook.
- Triggers Render frontend deploy hook.
- Waits for backend health at `${RENDER_API_URL}/api/health`.
- Checks frontend reachability at `${RENDER_FRONTEND_URL}`.
- Optionally triggers `RENDER_ROLLBACK_DEPLOY_HOOK` if a deployment smoke check fails.

## Render Deployment Guide

### Disable Automatic Deploys

For every Render service:

1. Open the Render dashboard.
2. Select the service.
3. Go to `Settings`.
4. Find `Build & Deploy`.
5. Set `Auto-Deploy` to `No`.
6. Copy the service deploy hook URL.
7. Store the hook URL in GitHub Actions secrets.

This ensures deployment only happens through GitHub Actions after all checks pass.

### Backend Render Service

| Setting | Value |
| --- | --- |
| Service Type | Web Service |
| Runtime | Docker |
| Root Directory | `backend` |
| Dockerfile Path | `Dockerfile` |
| Health Endpoint | `/api/health` |
| Auto Deploy | Disabled |

Backend Render environment variables:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://...
JWT_SECRET=<strong-random-secret-at-least-32-characters>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://your-frontend.onrender.com
COOKIE_SECURE=true
LAUNDRY_RESOURCE_COUNT=4
GROUND_RESOURCE_NAME=CST Football Ground
RUN_MIGRATIONS=true
```

Use the Render PostgreSQL internal database URL for `DATABASE_URL` when the backend and database are both on Render.

### Frontend Render Service

Static Site option:

| Setting | Value |
| --- | --- |
| Service Type | Static Site |
| Root Directory | `frontend` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |
| Auto Deploy | Disabled |

Docker option:

| Setting | Value |
| --- | --- |
| Service Type | Web Service |
| Runtime | Docker |
| Root Directory | `frontend` |
| Dockerfile Path | `Dockerfile` |
| Auto Deploy | Disabled |

Frontend Render environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

For Render Static Sites using React Router, add this rewrite rule:

| Source | Destination | Action |
| --- | --- | --- |
| `/*` | `/index.html` | Rewrite |

This prevents direct routes like `/register`, `/dashboard`, `/laundry`, and `/ground` from returning 404.

## GitHub Actions Secrets

Required staging secrets:

| Secret | Purpose | Example |
| --- | --- | --- |
| `STAGING_URL` | Deployed frontend URL for Playwright. | `https://cst-booking-frontend.onrender.com` |
| `STAGING_API_URL` | Deployed backend API URL for k6. Must include `/api`. | `https://cst-booking-api.onrender.com/api` |
| `K6_AUTH_TOKEN` | JWT for authenticated k6 requests. | `eyJ...` |

Required Render deployment secrets:

| Secret | Purpose | Example |
| --- | --- | --- |
| `RENDER_BACKEND_DEPLOY_HOOK` | Render deploy hook for backend service. | Render-provided hook URL |
| `RENDER_FRONTEND_DEPLOY_HOOK` | Render deploy hook for frontend service. | Render-provided hook URL |
| `RENDER_API_URL` | Backend root URL for health checks. Must not include `/api`. | `https://cst-booking-api.onrender.com` |
| `RENDER_FRONTEND_URL` | Frontend root URL for smoke checks. | `https://cst-booking-frontend.onrender.com` |
| `RENDER_ROLLBACK_DEPLOY_HOOK` | Optional rollback hook for previous known-good deployment/router. | Render-provided hook URL |

Optional security secret:

| Secret | Purpose |
| --- | --- |
| `SNYK_TOKEN` | Only needed if a Snyk scan step is added later. |

## Operational Notes

### Authentication Cookies on Render

For local development:

```env
CLIENT_ORIGIN=http://localhost:5173
COOKIE_SECURE=false
```

For Render:

```env
CLIENT_ORIGIN=https://your-frontend.onrender.com
COOKIE_SECURE=true
```

When `COOKIE_SECURE=true`, the backend uses `SameSite=None; Secure` cookies so authenticated dashboard requests work across deployed frontend/backend domains.

### Getting `K6_AUTH_TOKEN`

Login to the deployed backend:

```bash
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@student.com","password":"TestPassword123"}'
```

Copy the returned `token` value into the GitHub secret:

```text
K6_AUTH_TOKEN
```

### Health Check

Backend health endpoint:

```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "cst-booking-system-api"
}
```

## Security Controls

Implemented controls:

- bcrypt password hashing.
- JWT authentication.
- HttpOnly cookies.
- Secure cross-site cookie behavior in production.
- Zod validation on backend input.
- Prisma parameterized queries.
- PostgreSQL constraints to prevent double-booking.
- Helmet security headers.
- Nginx security headers for frontend container.
- TruffleHog secret scanning.
- npm production dependency audits.
- CodeQL static analysis.
- Trivy container scanning.
- Explicit patched OS package constraints in Docker images.

## Accessibility Controls

Implemented accessibility controls:

- Semantic navigation landmark with `aria-label`.
- Skip-to-main-content link.
- Proper form labels.
- Status and alert regions for booking messages and errors.
- Improved color contrast for muted text.
- axe-core checks inside Playwright E2E tests.
- Lighthouse accessibility assertions.

## Performance Controls

Implemented performance controls:

- Vite production build.
- Nginx static asset serving.
- Long-lived immutable cache headers for `/assets/`.
- gzip compression in Nginx.
- Lighthouse CI performance assertions.
- k6 smoke load test for API health and availability paths.

## Future Recommendations

| Recommendation | Rationale |
| --- | --- |
| Implement automated rollback through Render API or a routing layer. | The current rollback hook is optional and best-effort. |
| Add observability through OpenTelemetry, Grafana Cloud, Prometheus, or Datadog. | Metrics, traces, and structured logs improve incident response. |
| Add database backup verification and restore testing. | Booking systems depend on durable operational data. |
| Expand service-level unit/integration coverage. | More coverage improves confidence in booking concurrency and cancellation behavior. |
| Add formal concurrent booking load scenarios. | Validates double-booking protection under realistic traffic. |
| Add preview environments for pull requests. | Reviewers can validate changes before merging. |
| Add dependency update automation with Renovate or Dependabot. | Reduces exposure time for vulnerable packages. |
| Publish SBOM artifacts for container images. | Improves supply-chain visibility and compliance. |
| Add formal database migration review policy. | Helps prevent destructive production data changes. |

## Conclusion

CST Booking System now has a production-oriented architecture based on React, Express, PostgreSQL, Prisma, Docker, GitHub Actions, and Render. The project includes repeatable builds, controlled deployments, real database validation, API contract testing, E2E journeys, accessibility checks, performance testing, static analysis, dependency audits, secret scanning, and container vulnerability management.

The CI/CD workflow ensures that deployment is blocked unless functionality, security, performance, and quality gates pass. Render deployments are controlled through deploy hooks rather than automatic Git tracking, giving the project an auditable and reliable release process.
