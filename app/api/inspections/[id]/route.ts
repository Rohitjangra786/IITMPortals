import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeSummaryFields, parseInspectionData } from "@/lib/inspection";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const patchSchema = z.object({
  // Full InspectionData object (validated structurally by the scoring layer).
  data: z.record(z.string(), z.unknown()).optional(),
  dateOfVisit: z.string().optional(),
  session: z.string().optional(),
  status: z.enum(["draft", "submitted"]).optional(),
});

export async function GET(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const inspection = await prisma.inspection.findUnique({
    where: { id },
    include: { institute: true, createdBy: { select: { name: true, email: true } } },
  });
  if (!inspection) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ inspection });
}

export async function PATCH(req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const existing = await prisma.inspection.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

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

  const inspection = await prisma.inspection.update({ where: { id }, data: updateData });
  return NextResponse.json({
    inspection: {
      id: inspection.id,
      status: inspection.status,
      partIIPercent: inspection.partIIPercent,
      partIIIPercent: inspection.partIIIPercent,
      category: inspection.category,
      updatedAt: inspection.updatedAt,
    },
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.inspection.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
