import "dotenv/config";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import express from "express";
import { authRouter } from "./routes/auth";
import { institutesRouter } from "./routes/institutes";
import { inspectionsRouter } from "./routes/inspections";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const isProd = process.env.NODE_ENV === "production";

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// ---- API ----
app.use("/api/auth", authRouter);
app.use("/api/institutes", institutesRouter);
app.use("/api/inspections", inspectionsRouter);

// Unknown API routes return JSON (never the SPA shell).
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// ---- Static SPA (production) ----
// In dev the Vite server (port 5173) serves the frontend and proxies /api here,
// so we only serve the built bundle when it exists.
const distDir = join(__dirname, "..", "dist");
if (isProd || existsSync(distDir)) {
  app.use(express.static(distDir));
  // SPA fallback: every non-API route returns index.html so client routing works.
  app.get("*", (_req, res) => {
    res.sendFile(join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
  if (!isProd) {
    console.log("Dev frontend: run `npm run dev` (Vite on http://localhost:5173)");
  }
});
