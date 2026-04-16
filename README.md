# Food e-commerce platform

Arabic (RTL) grocery storefront with **Next.js** (frontend) and **NestJS** + **Prisma** + **SQLite** (backend API). Features include multi-branch catalog, cart, **cash on delivery (COD)** checkout, admin dashboard, driver handoff, loyalty points, ads, and reports.

## Prerequisites

- **Node.js** 20+ recommended  
- **npm** (ships with Node)

## Repository layout

| Path        | Description                                      |
|------------|---------------------------------------------------|
| `frontend/` | Next.js 16 — store, account, admin, driver UIs   |
| `backend/`  | NestJS 11 — REST API under `/api`                |

## Quick start

### 1. Backend API

```bash
cd backend
npm install
cp .env.example .env   # if .env is missing; defaults work for local SQLite
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

API listens on **http://localhost:4000** with global prefix **`/api`** (e.g. health: `GET http://localhost:4000/api`).

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

```bash
npm run dev
```

App: **http://localhost:3000**

## Demo accounts

Password for all seeded users: **`Demo123!`**

| Email                 | Role            |
|-----------------------|-----------------|
| `customer@demo.com`   | Customer        |
| `driver@demo.com`     | Driver          |
| `driver2@demo.com`    | Driver          |
| `manager.north@demo.com` | Branch manager |
| `admin@demo.com`      | Admin           |
| `superadmin@demo.com` | Super admin     |

## Product images (demo)

Seed data uses **curated food photos from [Unsplash](https://unsplash.com)** (`backend/prisma/food-images.ts`). They are suitable for **development and demos only**. For production, replace `imageUrl` values with your own product photography and hosting (CDN / object storage).

## Scripts

### Backend

| Command              | Purpose                |
|----------------------|------------------------|
| `npm run start:dev`  | Dev server + watch     |
| `npm run build`      | Production build       |
| `npm run test`       | Unit tests             |
| `npx prisma db seed` | Reseed demo data       |

### Frontend

| Command        | Purpose           |
|----------------|-------------------|
| `npm run dev`  | Dev server        |
| `npm run build`| Production build  |

## Environment variables

### Backend (`backend/.env`)

- `DATABASE_URL` — SQLite file (default `file:./dev.db`)
- `JWT_SECRET` — signing key for JWTs
- `PORT` — default `4000`
- `CORS_ORIGIN` — default `http://localhost:3000`

### Frontend (`frontend/.env.local`)

- `NEXT_PUBLIC_API_URL` — API base including `/api`, e.g. `http://localhost:4000/api`

## Production notes

- Switch **SQLite** to **PostgreSQL** (or another server DB) via `DATABASE_URL` and Prisma.
- Set a strong **`JWT_SECRET`**, serve over **HTTPS**, and review **CORS** origins.
- Replace demo images and user accounts; do not ship seed data to production unchanged.

## Quality checks (from repo root)

```bash
cd backend && npm run build && npm run test && npm run test:e2e
cd ../frontend && npm run build && npm run lint
```

## UI routes (reference)

| Area | Path |
|------|------|
| Store home | `/` |
| Products | `/products`, `/products/[id]` |
| Cart / checkout | `/cart`, `/checkout` |
| Account | `/account/orders`, `/account/loyalty` |
| Auth | `/login`, `/register` |
| Admin | `/admin`, `/admin/orders`, … |
| Driver | `/driver` |
