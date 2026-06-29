import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";

export const institutesRouter = Router();

// Every institute endpoint requires an authenticated committee member.
institutesRouter.use(requireAuth);

const instituteSchema = z.object({
  name: z.string().min(2, "Institute name is required"),
  address: z.string().optional().default(""),
  district: z.string().optional().default(""),
  telephone: z.string().optional().default(""),
  website: z.string().optional().default(""),
  email: z.string().optional().default(""),
  societyName: z.string().optional().default(""),
});

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  telephone: z.string().optional(),
  website: z.string().optional(),
  email: z.string().optional(),
  societyName: z.string().optional(),
});

institutesRouter.get("/", async (_req, res) => {
  const institutes = await prisma.institute.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { inspections: true } } },
  });
  res.json({ institutes });
});

institutesRouter.post("/", async (req, res) => {
  const parsed = instituteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
    return;
  }
  const institute = await prisma.institute.create({ data: parsed.data });
  res.status(201).json({ institute });
});

institutesRouter.get("/:id", async (req, res) => {
  const institute = await prisma.institute.findUnique({
    where: { id: req.params.id },
    include: { inspections: { orderBy: { createdAt: "desc" } } },
  });
  if (!institute) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ institute });
});

institutesRouter.patch("/:id", async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input." });
    return;
  }
  const institute = await prisma.institute.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json({ institute });
});

institutesRouter.delete("/:id", async (req, res) => {
  await prisma.institute.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
