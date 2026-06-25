import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createEmptyInspectionData } from "@/lib/jac-config";
import { computeSummaryFields } from "@/lib/inspection";

export const runtime = "nodejs";

const createSchema = z.object({
  instituteId: z.string().min(1),
  session: z.string().optional().default("2026-27"),
  dateOfVisit: z.string().optional().default(""),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const inspections = await prisma.inspection.findMany({
    orderBy: { updatedAt: "desc" },
    include: { institute: { select: { id: true, name: true } } },
  });
  return NextResponse.json({ inspections });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "An institute must be selected." }, { status: 400 });
  }

  const institute = await prisma.institute.findUnique({ where: { id: parsed.data.instituteId } });
  if (!institute) return NextResponse.json({ error: "Institute not found." }, { status: 404 });

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
      createdById: user.id,
      ...summary,
    },
  });

  return NextResponse.json({ inspection }, { status: 201 });
}
