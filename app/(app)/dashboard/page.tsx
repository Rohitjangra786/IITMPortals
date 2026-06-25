import Link from "next/link";
import { CategoryBadge } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
      {sub ? <p className="mt-1 text-xs text-slate-400">{sub}</p> : null}
    </div>
  );
}

export default async function DashboardPage() {
  const [instituteCount, inspectionCount, submittedCount, recent] = await Promise.all([
    prisma.institute.count(),
    prisma.inspection.count(),
    prisma.inspection.count({ where: { status: "submitted" } }),
    prisma.inspection.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8,
      include: { institute: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Joint Assessment Committee · Existing Institutes · Session 2026-27
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Institutes" value={instituteCount} sub="Registered for assessment" />
        <StatCard label="Inspections" value={inspectionCount} sub={`${submittedCount} submitted`} />
        <StatCard
          label="Drafts in progress"
          value={inspectionCount - submittedCount}
          sub="Awaiting completion"
        />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent inspections</h2>
          <Link href="/institutes" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            Manage institutes →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm text-slate-500">
              No inspections yet. Go to{" "}
              <Link href="/institutes" className="font-semibold text-brand-700">
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
                  <tr key={insp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {insp.institute.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{insp.session}</td>
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
                        href={`/inspections/${insp.id}`}
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
