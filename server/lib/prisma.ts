import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function createPrismaClient(): PrismaClient {
  // 1. Turso (cloud libSQL) — persistent production DB, when configured.
  if (process.env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSQL({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  // 2. Serverless (Vercel) WITHOUT Turso — plain SQLite for now. The deployment
  // filesystem is read-only except /tmp, so copy the bundled seed DB there once
  // and use it. Reads + writes work, but data resets on cold start (per
  // instance) — fine as a "no database yet" preview. Add Turso later for
  // persistence (just set TURSO_DATABASE_URL) and this branch is skipped.
  if (process.env.VERCEL) {
    const tmpDb = "/tmp/dev.db";
    try {
      if (!existsSync(tmpDb)) {
        const seed = join(process.cwd(), "prisma", "dev.db");
        if (existsSync(seed)) copyFileSync(seed, tmpDb);
      }
    } catch (err) {
      console.error("Could not stage seed DB into /tmp:", err);
    }
    const adapter = new PrismaLibSQL({ url: `file:${tmpDb}` });
    return new PrismaClient({ adapter });
  }

  // 3. Local dev — native SQLite via the datasource url (file:./dev.db).
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
