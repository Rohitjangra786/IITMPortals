import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../lib/auth.js";
import { createEmptyInspectionData } from "../../src/lib/jac-config.js";
import { computeSummaryFields, parseInspectionData } from "../../src/lib/inspection.js";

export const inspectionsRouter = Router();

inspectionsRouter.use(requireAuth);

const createSchema = z.object({
  instituteId: z.string().min(1),
  session: z.string().optional().default("2026-27"),
  dateOfVisit: z.string().optional().default(""),
});

const patchSchema = z.object({
  // Full InspectionData object (validated structurally by the scoring layer).
  data: z.record(z.string(), z.unknown()).optional(),
  dateOfVisit: z.string().optional(),
  session: z.string().optional(),
  status: z.enum(["draft", "submitted"]).optional(),
});

inspectionsRouter.get("/", async (_req, res) => {
  const inspections = await prisma.inspection.findMany({
    orderBy: { updatedAt: "desc" },
    include: { institute: { select: { id: true, name: true } } },
  });
  res.json({ inspections });
});

inspectionsRouter.post("/", async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "An institute must be selected." });
    return;
  }

  const institute = await prisma.institute.findUnique({
    where: { id: parsed.data.instituteId },
  });
  if (!institute) {
    res.status(404).json({ error: "Institute not found." });
    return;
  }

  // Pre-fill particulars from the institute record so the report starts populated.
  const data = createEmptyInspectionData();
  data.particulars.instituteName = institute.name;
  data.particulars.instituteAddress = institute.address;
  data.particulars.district = institute.district;
  data.particulars.telephone = institute.telephone;
  data.particulars.website = institute.website;
  data.particulars.email = institute.email;
  data.particulars.societyName = institute.societyName;
  data.particulars.dateTimeOfVisit = parsed.data.dateOfVisit;

  const summary = computeSummaryFields(data);

  const inspection = await prisma.inspection.create({
    data: {
      instituteId: institute.id,
      session: parsed.data.session,
      dateOfVisit: parsed.data.dateOfVisit,
      data: JSON.stringify(data),
      createdById: req.user!.id,
      ...summary,
    },
  });

  res.status(201).json({ inspection });
});

inspectionsRouter.get("/:id", async (req, res) => {
  const inspection = await prisma.inspection.findUnique({
    where: { id: req.params.id },
    include: { institute: true, createdBy: { select: { name: true, email: true } } },
  });
  if (!inspection) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ inspection });
});

inspectionsRouter.patch("/:id", async (req, res) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload." });
    return;
  }

  const existing = await prisma.inspection.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  const updateData: Record<string, unknown> = {};

  if (parsed.data.data) {
    // Re-parse through the template, then recompute the summary columns.
    const data = parseInspectionData(JSON.stringify(parsed.data.data));
    updateData.data = JSON.stringify(data);
    Object.assign(updateData, computeSummaryFields(data));
    // Keep top-level dateOfVisit in sync with the particulars field.
    if (data.particulars?.dateTimeOfVisit) {
      updateData.dateOfVisit = data.particulars.dateTimeOfVisit;
    }
  }
  if (parsed.data.dateOfVisit !== undefined) updateData.dateOfVisit = parsed.data.dateOfVisit;
  if (parsed.data.session !== undefined) updateData.session = parsed.data.session;
  if (parsed.data.status !== undefined) updateData.status = parsed.data.status;

  const inspection = await prisma.inspection.update({
    where: { id: req.params.id },
    data: updateData,
  });
  res.json({
    inspection: {
      id: inspection.id,
      status: inspection.status,
      partIIPercent: inspection.partIIPercent,
      partIIIPercent: inspection.partIIIPercent,
      category: inspection.category,
      updatedAt: inspection.updatedAt,
    },
  });
});

inspectionsRouter.delete("/:id", async (req, res) => {
  await prisma.inspection.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
