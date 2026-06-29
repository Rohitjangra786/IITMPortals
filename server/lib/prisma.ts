import { copyFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";

const require = createRequire(import.meta.url);

function createPrismaClient(): PrismaClient {
  // 1. Turso (cloud libSQL) — persistent production DB, only when configured.
  //    The adapter (and its native @libsql binding) is required LAZILY so it is
  //    never loaded in the no-Turso path — loading it eagerly crashes the
  //    serverless function when the native binding isn't bundled.
  if (process.env.TURSO_DATABASE_URL) {
    const { PrismaLibSQL } = require("@prisma/adapter-libsql") as typeof import("@prisma/adapter-libsql");
    const adapter = new PrismaLibSQL({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  // 2. Serverless (Vercel) without Turso — plain SQLite via Prisma's native
  //    engine (which Vercel bundles for us). The deployment FS is read-only
  //    except /tmp, so copy the bundled seed DB there and point Prisma at it.
  //    Reads + writes work; data resets on cold start (per instance) — fine as
  //    a "no database yet" preview. Set TURSO_DATABASE_URL later for persistence.
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
    return new PrismaClient({ datasourceUrl: `file:${tmpDb}` });
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
