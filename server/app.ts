import "dotenv/config";
// Patches Express 4 so rejected promises in async route handlers reach the
// error-handling middleware below instead of crashing the request.
import "express-async-errors";
import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
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

// Centralised error handler: log the real error (visible in server / Vercel
// function logs) and return its message as JSON so the client shows something
// useful instead of a generic "Network error".
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("API error:", err);
  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ error: message });
});

export default app;
