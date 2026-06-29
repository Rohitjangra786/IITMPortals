import { Link, useParams } from "react-router-dom";
import { DeleteButton, StartInspectionButton } from "@/components/actions";
import { CategoryBadge } from "@/components/ui";
import { useResource } from "@/hooks/useResource";

interface InspectionSummary {
  id: string;
  session: string;
  dateOfVisit: string;
  partIIPercent: number;
  partIIIPercent: number;
  category: string;
  status: string;
}

interface InstituteDetail {
  id: string;
  name: string;
  address: string;
  district: string;
  telephone: string;
  website: string;
  email: string;
  societyName: string;
  inspections: InspectionSummary[];
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 py-1.5 text-sm">
      <span className="w-32 shrink-0 text-slate-500">{label}</span>
      <span className="text-slate-900">{value}</span>
    </div>
  );
}

export function InstituteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useResource<{ institute: InstituteDetail }>(
    `/api/institutes/${id}`,
  );
  const institute = data?.institute;

  if (loading) {
    return <p className="text-sm text-slate-400">Loading…</p>;
  }
  if (error || !institute) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">Institute not found.</p>
        <Link to="/institutes" className="text-sm font-semibold text-brand-700">
          ← Back to institutes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/institutes" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Institutes
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{institute.name}</h1>
          {institute.address ? (
            <p className="mt-1 max-w-2xl text-sm text-slate-500">{institute.address}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <StartInspectionButton instituteId={institute.id} />
          <DeleteButton
            url={`/api/institutes/${institute.id}`}
            confirmText={`Delete "${institute.name}" and all its inspections? This cannot be undone.`}
            redirectTo="/institutes"
            label="Delete institute"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Particulars
        </h2>
        <DetailRow label="District" value={institute.district} />
        <DetailRow label="Telephone" value={institute.telephone} />
        <DetailRow label="Website" value={institute.website} />
        <DetailRow label="Email" value={institute.email} />
        <DetailRow label="Society / Trust" value={institute.societyName} />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Inspection reports</h2>
        {institute.inspections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="mb-4 text-sm text-slate-500">No inspection reports yet.</p>
            <StartInspectionButton instituteId={institute.id} label="Start first inspection" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Session</th>
                  <th className="px-4 py-3 font-semibold">Date of visit</th>
                  <th className="px-4 py-3 font-semibold">Part II</th>
                  <th className="px-4 py-3 font-semibold">Part III</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {institute.inspections.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{insp.session}</td>
                    <td className="px-4 py-3 text-slate-600">{insp.dateOfVisit || "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{insp.partIIPercent.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-slate-600">{insp.partIIIPercent.toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={insp.category} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          insp.status === "submitted"
                            ? "text-xs font-semibold text-emerald-700"
                            : "text-xs font-semibold text-amber-600"
                        }
                      >
                        {insp.status === "submitted" ? "Submitted" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/inspections/${insp.id}`}
                        className="text-sm font-semibold text-brand-700 hover:text-brand-800"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
