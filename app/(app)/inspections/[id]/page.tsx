import { notFound } from "next/navigation";
import { InspectionEditor } from "@/components/inspection-editor";
import { parseInspectionData } from "@/lib/inspection";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function InspectionPage({
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
    <InspectionEditor
      inspectionId={inspection.id}
      instituteName={inspection.institute.name}
      session={inspection.session}
      initialData={data}
      initialStatus={inspection.status}
    />
  );
}
