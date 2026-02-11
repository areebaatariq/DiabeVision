# Deploying DiabeVision on Render

This guide walks you through deploying the **backend** (Express API) and **frontend** (Next.js) as separate Web Services on [Render](https://render.com). You need to deploy the backend first so you have its URL for the frontend.

---

## Prerequisites

- **GitHub (or GitLab) repo** with DiabeVision pushed
- **Render account** — [render.com](https://render.com) → Sign up / Log in
- **MongoDB Atlas** (or any MongoDB) — connection string for the backend

---

## 1. Deploy the Backend

1. In the [Render Dashboard](https://dashboard.render.com), click **New** → **Web Service**.
2. Connect your repository (e.g. GitHub) and select the **DiabeVision** repo.
3. Configure the service:

   | Field | Value |
   |--------|--------|
   | **Name** | `diabevision-backend` (or any name) |
   | **Region** | Choose closest to your users |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm run start` |
   | **Instance Type** | Free or paid |

4. **Environment variables** — Add these (use **Environment** tab):

   | Key | Value | Notes |
   |-----|--------|--------|
   | `MONGODB_URI` | `mongodb+srv://...` | Your Atlas (or MongoDB) connection string |
   | `JWT_SECRET` | Long random string | e.g. generate with `openssl rand -hex 32` |
   | `PORT` | `4000` | Optional; Render sets `PORT` automatically |
   | `CORS_ORIGIN` | `https://diabevision.onrender.com` | Optional; backend already whitelists this by default |

5. Click **Create Web Service**. Wait for the first deploy to finish.
6. Copy the service URL: **https://diabevision-backend.onrender.com**. Use it for the frontend’s `NEXT_PUBLIC_API_URL`.

---

## 2. Set Backend CORS to Your Frontend URL

After you create the frontend service (next step), you’ll get: **https://diabevision.onrender.com**.

1. Open your **backend** service on Render → **Environment**.
2. Set **CORS_ORIGIN** to `https://diabevision.onrender.com` (or leave unset; it’s whitelisted by default).
3. Save. Render will redeploy the backend with the new env.

---

## 3. Deploy the Frontend

1. In the Render Dashboard, click **New** → **Web Service** again.
2. Select the **same** DiabeVision repo.
3. Configure:

   | Field | Value |
   |--------|--------|
   | **Name** | `diabevision-frontend` (or any name) |
   | **Region** | Same as backend (recommended) |
   | **Root Directory** | `frontend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm run start` |
   | **Instance Type** | Free or paid |

4. **Environment variables**:

   | Key | Value |
   |-----|--------|
   | `NEXT_PUBLIC_API_URL` | `https://diabevision-backend.onrender.com` |

   Use the exact backend URL (no trailing slash). This is baked in at build time, so if you change it later you must **redeploy** the frontend.

5. Click **Create Web Service**. Wait for the build and deploy.

---

## 4. Final CORS Check

- Backend whitelists **https://diabevision.onrender.com** by default. For a custom frontend domain, set **CORS_ORIGIN** (comma-separated if needed) and redeploy the backend.

---

## 5. Custom Domains (Optional)

- **Backend:** Render → your backend service → **Settings** → **Custom Domains**.
- **Frontend:** Same for the frontend service.
- If you add custom domains, update:
  - **CORS_ORIGIN** on the backend to the frontend’s public URL (custom or Render).
  - **NEXT_PUBLIC_API_URL** on the frontend to the backend’s public URL, then redeploy the frontend.

---

## 6. Health Check

- Backend: open [https://diabevision-backend.onrender.com/health](https://diabevision-backend.onrender.com/health). You should see `{"status":"ok","db":"diabevision"}`.
- Frontend: open [https://diabevision.onrender.com](https://diabevision.onrender.com) and sign in or register; use **Analyze** to hit the API.

---

## 7. Free Tier Notes

- Render free instances **spin down** after inactivity. The first request after idle can take 30–60 seconds (cold start). If you see **"Failed to fetch"**, wait ~1 minute and retry (backend may be waking up).
- Free backend + free frontend is fine for demos; for production consider at least one paid instance to reduce cold starts.

## 8. "Failed to fetch" troubleshooting

- **Cold start:** Open [backend /health](https://diabevision-backend.onrender.com/health) first; once it responds, the frontend should connect.
- **CORS:** The frontend sends requests with `credentials: "include"`; the backend whitelists `https://diabevision.onrender.com`. No extra config needed.
- **API URL:** Production builds default to `https://diabevision-backend.onrender.com`; you can still set `NEXT_PUBLIC_API_URL` on the frontend service if needed.

---

## Summary

| Service   | Root Directory | Build Command              | Start Command   | Important env vars                          |
|-----------|----------------|----------------------------|-----------------|---------------------------------------------|
| Backend   | `backend`      | `npm install && npm run build` | `npm run start` | `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`  |
| Frontend  | `frontend`     | `npm install && npm run build` | `npm run start` | `NEXT_PUBLIC_API_URL` (backend URL)         |

After both are deployed and **CORS_ORIGIN** points to your frontend URL, the app is ready to use.
