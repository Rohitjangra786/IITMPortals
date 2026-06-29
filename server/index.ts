import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import app from "./app.js";

// Local / self-hosted entry point. On Vercel the app is served by the
// serverless function in api/index.ts instead (Vercel serves dist/ statically).
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const isProd = process.env.NODE_ENV === "production";

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
