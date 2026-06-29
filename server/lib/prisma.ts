import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

// Production (Vercel) uses Turso / libSQL via the driver adapter — set when
// TURSO_DATABASE_URL is present. Local dev has no Turso env, so it falls back
// to the native SQLite engine using DATABASE_URL (file:./dev.db) — unchanged.
function createPrismaClient(): PrismaClient {
  const url = process.env.TURSO_DATABASE_URL;
  if (url) {
    const adapter = new PrismaLibSQL({ url, authToken: process.env.TURSO_AUTH_TOKEN });
    return new PrismaClient({ adapter });
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Reuse a single PrismaClient across hot-reloads / warm serverless invocations.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
