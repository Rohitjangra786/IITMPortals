import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import { authRouter } from "./routes/auth";
import { institutesRouter } from "./routes/institutes";
import { inspectionsRouter } from "./routes/inspections";

// The Express app with all API routes mounted. No listen() and no static
// serving here, so it can be used both by the local server (server/index.ts)
// and the Vercel serverless function (api/index.ts).
const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// Graceful preview mode: if no database is configured yet (e.g. deployed to
// Vercel before Turso is connected), return a clear message instead of a raw
// DB error. Locally DATABASE_URL is always set, so this never triggers in dev.
const dbConfigured = Boolean(process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL);
if (!dbConfigured) {
  app.use("/api", (_req, res) => {
    res.status(503).json({
      error: "Database not connected yet. The site is live; data features come online once the database is configured.",
    });
  });
}

app.use("/api/auth", authRouter);
app.use("/api/institutes", institutesRouter);
app.use("/api/inspections", inspectionsRouter);

// Unknown API routes return JSON (never an HTML shell).
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
