// Vercel serverless entry point. Vercel routes /api/* to this function (see
// vercel.json) and serves the built SPA in dist/ as static files. The Express
// app handles all /api routes; env (TURSO_DATABASE_URL, AUTH_SECRET, …) comes
// from the Vercel project settings.
import app from "../server/app.js";

export default app;
