// JWT session helpers — sign/verify via jose. Framework-agnostic; the Express
// route layer is responsible for reading/writing the cookie.

import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "jac_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) {
    // Falls back so dev never hard-crashes; production must set AUTH_SECRET.
    return new TextEncoder().encode("dev-insecure-secret-change-me-please-0000000000");
  }
  return new TextEncoder().encode(s);
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      name: String(payload.name),
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

/** Cookie options for Express's res.cookie (maxAge is in milliseconds). */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS * 1000,
  };
}
