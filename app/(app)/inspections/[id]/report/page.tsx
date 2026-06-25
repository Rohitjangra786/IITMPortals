import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { Report } from "@/components/report";
import { parseInspectionData } from "@/lib/inspection";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inspection = await prisma.inspection.findUnique({
    where: { id },
    include: { institute: { select: { name: true } } },
  });
  if (!inspection) notFound();

  const data = parseInspectionData(inspection.data);

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <Link
          href={`/inspections/${inspection.id}`}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back to editor
        </Link>
        <PrintButton />
      </div>
      <Report
        data={data}
        meta={{
          instituteName: inspection.institute.name,
          session: inspection.session,
          dateOfVisit: inspection.dateOfVisit,
          status: inspection.status,
        }}
      />
    </div>
  );
}
