// Auth helpers for the Express API: password hashing (bcrypt), cookie-backed
// session management and current-user lookup (Prisma).

import bcrypt from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import { prisma } from "./prisma.js";
import {
  SESSION_COOKIE,
  type SessionPayload,
  sessionCookieOptions,
  signSession,
  verifySession,
} from "./session.js";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function createUserSession(res: Response, user: SessionUser): Promise<void> {
  const token = await signSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions());
}

export function destroySession(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

export async function getSession(req: Request): Promise<SessionPayload | null> {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return null;
  return verifySession(token);
}

/** The signed-in user (fresh from DB), or null. */
export async function getCurrentUser(req: Request) {
  const session = await getSession(req);
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

/** Express middleware that 401s unauthenticated requests and attaches req.user. */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = await getCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  req.user = user;
  next();
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string; name: string; email: string; role: string; createdAt: Date };
    }
  }
}
