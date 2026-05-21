# CST Booking System DevOps Blueprint

This project contains a production-oriented CI/CD and containerization setup for:

- React frontend in `frontend/`
- Express.js backend in `backend/`
- PostgreSQL database

## Docker

Backend:

- File: `backend/Dockerfile`
- Multi-stage Node.js image.
- Runs as the non-root `node` user.
- Generates Prisma Client during build/runtime.
- Runs `prisma migrate deploy` on container start when `RUN_MIGRATIONS=true`.

Frontend:

- File: `frontend/Dockerfile`
- Multi-stage Vite build.
- Serves static assets with Nginx.
- File: `frontend/docker/nginx.conf`
- Uses `try_files $uri $uri/ /index.html` for React Router SPA routing.

Local PostgreSQL:

- File: `docker-compose.yml`
- Starts PostgreSQL 16 with database `cst_booking_system`.

```bash
docker compose up -d postgres
```

Local backend connection string:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cst_booking_system?schema=public"
```

## CI/CD Pipeline

Workflow file:

- `.github/workflows/ci-cd.yml`

The workflow is intentionally sequential. Each stage uses `needs`, so a failed stage blocks everything after it.

Stages:

0. Preflight Secret Scan
1. Unit Tests
2. Integration Tests with a real PostgreSQL service container
3. API Contract Tests with Supertest
4. End-to-End Tests with Playwright against staging
5. Performance Tests with Lighthouse CI and k6
6. Security & Quality Gates with CodeQL, TypeScript checks, and npm audit

Deployment to Render only runs after all six stages pass on a push to `main`.

Additional gates:

- Unit tests enforce 80% coverage thresholds for the currently unit-tested helper layer.
- Playwright uploads `playwright-report/` and `test-results/` artifacts when E2E fails.
- E2E includes axe-core accessibility assertions.
- k6 is verified to read `__ENV.API_BASE_URL`.
- Prisma migrations are scanned for destructive SQL such as `DROP TABLE`, `DROP COLUMN`, and `TRUNCATE`.
- Trivy scans backend and frontend Docker images for high/critical CVEs.
- A best-effort rollback hook can be configured with `RENDER_ROLLBACK_DEPLOY_HOOK`.

## Test Runner Configuration

Backend:

- `backend/vitest.unit.config.ts`
- `backend/vitest.integration.config.ts`
- `backend/vitest.contract.config.ts`

Backend scripts:

```bash
npm run test:unit
npm run test:integration
npm run test:contract
```

Frontend:

- `frontend/vitest.config.ts`
- `frontend/vitest.integration.config.ts`
- `frontend/src/test/msw.ts`

Frontend scripts:

```bash
npm run test:unit
npm run test:integration
```

E2E:

- `playwright.config.ts`
- `e2e/booking.spec.ts`

```bash
E2E_BASE_URL="https://your-staging-frontend.onrender.com" npm run test:e2e
```

Performance:

- `frontend/lighthouserc.cjs`
- `scripts/k6/booking-smoke.js`

```bash
cd frontend
npm run perf:lighthouse
```

```bash
API_BASE_URL="https://your-staging-api.onrender.com/api" k6 run scripts/k6/booking-smoke.js
```

## Render Blue/Green Architecture

Recommended Render services:

- `cst-booking-api-blue` - Render Web Service, backend Docker service.
- `cst-booking-api-green` - Render Web Service, backend Docker service.
- `cst-booking-frontend-blue` - Render Static Site or Docker-backed web service.
- `cst-booking-frontend-green` - Render Static Site or Docker-backed web service.
- Optional `cst-booking-router` - a tiny stable routing/proxy service or CDN/DNS layer that points production traffic to the active color.

Render Deploy Hooks trigger builds/deploys. They do not, by themselves, switch a public custom domain between blue and green. For fully automated blue/green promotion, use one of these patterns:

- Preferred: put Cloudflare or another DNS/CDN layer in front and switch the production CNAME after the inactive color passes smoke checks.
- Render-only: use a small stable Render router service. Update its active upstream through Render API or configuration, then trigger `RENDER_PROMOTE_DEPLOY_HOOK`.
- Manual fallback: deploy inactive color through CI, smoke check it, then update the production custom domain in Render.

The included workflow deploys the inactive color based on the repository variable `RENDER_ACTIVE_COLOR`, smoke checks it, and optionally triggers `RENDER_PROMOTE_DEPLOY_HOOK`.

## Disable Automatic Render Git Deploys

For every Render service/static site:

1. Open the Render dashboard.
2. Select the service.
3. Go to `Settings`.
4. Find `Build & Deploy`.
5. Set `Auto-Deploy` to `No`.
6. Copy the service deploy hook URL.
7. Store the hook URL as a GitHub repository secret.

This ensures production deploys happen only when GitHub Actions posts to the deploy hook after all CI/CD gates pass.

## GitHub Repository Secrets

Required staging secrets:

- `STAGING_URL` - staging frontend URL, for example `https://cst-booking-staging.onrender.com`.
- `STAGING_API_URL` - staging backend API base URL including `/api`, for example `https://cst-booking-api-staging.onrender.com/api`.
- `K6_AUTH_TOKEN` - optional staging JWT for authenticated k6 paths.

Required Render blue/green secrets:

Required Render deployment secrets:

- `RENDER_BACKEND_DEPLOY_HOOK`
- `RENDER_FRONTEND_DEPLOY_HOOK`
- `RENDER_API_URL` - backend service root URL, without `/api`.
- `RENDER_FRONTEND_URL`
- `RENDER_ROLLBACK_DEPLOY_HOOK` - optional hook for your previous known-good deployment/router.

Optional security secrets:

- `SNYK_TOKEN` - only needed if you add a Snyk scan step.

## Render Backend Environment Variables

Set these on both blue and green backend services:

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://...
JWT_SECRET=<strong random secret>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://your-production-frontend-domain
COOKIE_SECURE=true
LAUNDRY_RESOURCE_COUNT=4
GROUND_RESOURCE_NAME=CST Football Ground
RUN_MIGRATIONS=true
```

Use the same managed PostgreSQL database for blue and green backend services unless you are also doing database blue/green, which is more complex and usually unnecessary for this application.

## Render Frontend Environment Variables

For Render Static Site builds:

```env
VITE_API_URL=https://your-production-api-domain/api
```

For Docker-backed frontend builds:

```bash
docker build --build-arg VITE_API_URL=https://your-production-api-domain/api -t cst-booking-frontend ./frontend
```

## Render Service Settings

Backend Web Service:

- Runtime: Docker
- Root directory: `backend`
- Dockerfile path: `Dockerfile`
- Health endpoint: `/api/health`
- Auto-Deploy: disabled

Frontend Static Site:

- Root directory: `frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Auto-Deploy: disabled

Frontend Docker alternative:

- Runtime: Docker
- Root directory: `frontend`
- Dockerfile path: `Dockerfile`
- Auto-Deploy: disabled
