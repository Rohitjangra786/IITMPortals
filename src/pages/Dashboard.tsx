import { ArrowRight, Building2, ClipboardList, FileClock } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryBadge } from "@/components/ui";
import { useResource } from "@/hooks/useResource";

const TONES = {
  brand: "bg-brand-50 text-brand-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
} as const;

interface InspectionRow {
  id: string;
  session: string;
  status: string;
  partIIPercent: number;
  partIIIPercent: number;
  category: string;
  updatedAt: string;
  institute: { id: string; name: string };
}

interface InstituteRow {
  id: string;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: typeof Building2;
  tone: keyof typeof TONES;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          {sub ? <p className="mt-1 text-xs text-slate-400">{sub}</p> : null}
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${TONES[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const submitted = status === "submitted";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        submitted
          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
          : "bg-amber-50 text-amber-700 ring-amber-600/20"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${submitted ? "bg-emerald-500" : "bg-amber-500"}`}
        aria-hidden
      />
      {submitted ? "Submitted" : "Draft"}
    </span>
  );
}

export function DashboardPage() {
  const institutes = useResource<{ institutes: InstituteRow[] }>("/api/institutes");
  const inspections = useResource<{ inspections: InspectionRow[] }>("/api/inspections");

  const instituteCount = institutes.data?.institutes.length ?? 0;
  const all = inspections.data?.inspections ?? [];
  const inspectionCount = all.length;
  const submittedCount = all.filter((i) => i.status === "submitted").length;
  const recent = all.slice(0, 8);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Joint Assessment Committee · Existing Institutes · Session 2026-27
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Institutes"
          value={instituteCount}
          sub="Registered for assessment"
          icon={Building2}
          tone="brand"
        />
        <StatCard
          label="Inspections"
          value={inspectionCount}
          sub={`${submittedCount} submitted`}
          icon={ClipboardList}
          tone="emerald"
        />
        <StatCard
          label="Drafts in progress"
          value={inspectionCount - submittedCount}
          sub="Awaiting completion"
          icon={FileClock}
          tone="amber"
        />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-slate-900">Recent inspections</h2>
          <Link
            to="/institutes"
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Manage institutes <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {inspections.loading ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-400">
            Loading…
          </div>
        ) : recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">
              No inspections yet. Go to{" "}
              <Link to="/institutes" className="font-semibold text-brand-700">
                Institutes
              </Link>{" "}
              to start one.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Institute</th>
                  <th className="px-4 py-3 font-semibold">Session</th>
                  <th className="px-4 py-3 font-semibold">Part II</th>
                  <th className="px-4 py-3 font-semibold">Part III</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((insp) => (
                  <tr key={insp.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {insp.institute.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{insp.session}</td>
                    <td className="px-4 py-3 tabular-nums text-slate-600">
                      {insp.partIIPercent.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 tabular-nums text-slate-600">
                      {insp.partIIIPercent.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={insp.category} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={insp.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/inspections/${insp.id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
                      >
                        Open <ArrowRight className="h-4 w-4" aria-hidden />
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
