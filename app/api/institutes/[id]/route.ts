import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  telephone: z.string().optional(),
  website: z.string().optional(),
  email: z.string().optional(),
  societyName: z.string().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const institute = await prisma.institute.findUnique({
    where: { id },
    include: {
      inspections: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!institute) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ institute });
}

export async function PATCH(req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }
  const institute = await prisma.institute.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ institute });
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.institute.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
