import "dotenv/config";
// Patches Express 4 so rejected promises in async route handlers reach the
// error-handling middleware below instead of crashing the request.
import "express-async-errors";
import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import { authRouter } from "./routes/auth.js";
import { institutesRouter } from "./routes/institutes.js";
import { inspectionsRouter } from "./routes/inspections.js";

// The Express app with all API routes mounted. No listen() and no static
// serving here, so it can be used both by the local server (server/index.ts)
// and the Vercel serverless function (api/index.ts).
const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

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
