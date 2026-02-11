# DiabeVision

RetinaCheck – AI-powered diabetic retinopathy screening for medical professionals. Upload retinal fundus images, get severity grading and detailed findings.

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend:** Express, TypeScript, MongoDB (database: `diabevision` only)
- **Auth:** JWT; register / login with email and password

## Quick start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # edit .env with MONGODB_URI, JWT_SECRET, etc.
npm run dev
```

Runs at **http://localhost:4000**. See [backend/README.md](backend/README.md) for API and DB isolation details.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at **http://localhost:3000**. Optional: set `NEXT_PUBLIC_API_URL` in `.env.local` if the API is not at `http://localhost:4000`.

### From repo root (workspaces)

```bash
npm install
npm run dev:backend   # terminal 1 – backend
npm run dev           # terminal 2 – frontend
```

## Project layout

| Path        | Description                    |
|------------|--------------------------------|
| `frontend/`| Next.js app (login, dashboard, analyze, history, results) |
| `backend/` | Express API (auth, analyses, GridFS images), MongoDB using DB `diabevision` |

## Features

- **Auth:** Register and sign in; session stored via JWT in localStorage.
- **Analyze:** Upload a retinal image (JPG/PNG, max 5MB); mock AI returns severity (No DR → Proliferative DR) and findings.
- **History:** List and search past analyses; images loaded with auth.
- **Results:** View a single analysis with charts and detailed findings.
- **Dashboard:** Overview stats and recent analyses from the API.

## Database

The backend uses a **single MongoDB database name: `diabevision`**. The connection string may point at a shared cluster; the app never uses the database name from the URL (e.g. `scopeshift`), so other projects on the same cluster are not affected.
