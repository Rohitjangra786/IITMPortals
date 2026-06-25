import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const instituteSchema = z.object({
  name: z.string().min(2, "Institute name is required"),
  address: z.string().optional().default(""),
  district: z.string().optional().default(""),
  telephone: z.string().optional().default(""),
  website: z.string().optional().default(""),
  email: z.string().optional().default(""),
  societyName: z.string().optional().default(""),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const institutes = await prisma.institute.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { inspections: true } } },
  });
  return NextResponse.json({ institutes });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = instituteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }
  const institute = await prisma.institute.create({ data: parsed.data });
  return NextResponse.json({ institute }, { status: 201 });
}
