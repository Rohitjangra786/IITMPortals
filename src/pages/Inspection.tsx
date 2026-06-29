import { useParams } from "react-router-dom";
import { InspectionEditor } from "@/components/inspection-editor";
import { parseInspectionData } from "@/lib/inspection";
import { useResource } from "@/hooks/useResource";

interface InspectionResponse {
  inspection: {
    id: string;
    session: string;
    status: string;
    data: string;
    institute: { name: string };
  };
}

export function InspectionPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useResource<InspectionResponse>(`/api/inspections/${id}`);
  const inspection = data?.inspection;

  if (loading) return <p className="text-sm text-slate-400">Loading…</p>;
  if (error || !inspection) return <p className="text-sm text-slate-500">Inspection not found.</p>;

  return (
    <InspectionEditor
      inspectionId={inspection.id}
      instituteName={inspection.institute.name}
      session={inspection.session}
      initialData={parseInspectionData(inspection.data)}
      initialStatus={inspection.status}
    />
  );
}
