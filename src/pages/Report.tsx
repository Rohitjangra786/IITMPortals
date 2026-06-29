import { Link, useParams } from "react-router-dom";
import { PrintButton } from "@/components/print-button";
import { Report } from "@/components/report";
import { parseInspectionData } from "@/lib/inspection";
import { useResource } from "@/hooks/useResource";

interface ReportResponse {
  inspection: {
    id: string;
    session: string;
    status: string;
    dateOfVisit: string;
    data: string;
    institute: { name: string };
  };
}

export function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useResource<ReportResponse>(`/api/inspections/${id}`);
  const inspection = data?.inspection;

  if (loading) return <p className="text-sm text-slate-400">Loading…</p>;
  if (error || !inspection) return <p className="text-sm text-slate-500">Inspection not found.</p>;

  return (
    <div>
      <div className="no-print mb-4 flex items-center justify-between">
        <Link
          to={`/inspections/${inspection.id}`}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Back to editor
        </Link>
        <PrintButton />
      </div>
      <Report
        data={parseInspectionData(inspection.data)}
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
