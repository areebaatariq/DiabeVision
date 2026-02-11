import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import analysesRoutes from "./routes/analyses.js";

const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:3000,https://diabevision.onrender.com")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const app = express();
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (CORS_ORIGINS.includes(origin)) return cb(null, origin);
      return cb(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/analyses", analysesRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", db: "diabevision" });
});

app.use((err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err.message?.includes("File too large") || err.message?.includes("Only image")) {
    res.status(400).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`DiabeVision backend running at http://localhost:${PORT} (DB: diabevision)`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
