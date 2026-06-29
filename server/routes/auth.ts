import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  createUserSession,
  destroySession,
  getCurrentUser,
  hashPassword,
  verifyPassword,
} from "../lib/auth.js";

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "chairperson", "expert", "convenor", "member"]).optional(),
});

authRouter.get("/me", async (req, res) => {
  const user = await getCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ user });
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please enter a valid email and password." });
    return;
  }
  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }
  await createUserSession(res, user);
  res.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }
  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name.trim(),
      email,
      passwordHash: await hashPassword(parsed.data.password),
      role: parsed.data.role ?? "member",
    },
  });
  await createUserSession(res, user);
  res.json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
});

authRouter.post("/logout", (_req, res) => {
  destroySession(res);
  res.json({ ok: true });
});
