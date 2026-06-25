import { scoreInspection } from "@/lib/scoring";
import type { InspectionData } from "@/lib/types";
import { CategoryBadge } from "../ui";

export function SummaryView({ data }: { data: InspectionData }) {
  const s = scoreInspection(data);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-3">
          <h3 className="text-base font-semibold text-slate-900">Summary of Marks · Part II</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Parameter</th>
              <th className="px-4 py-2 text-right font-semibold">Max</th>
              <th className="px-4 py-2 text-right font-semibold">Awarded</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {s.partII.map((p) => (
              <tr key={p.key} className={p.applicable ? "" : "text-slate-400"}>
                <td className="px-4 py-2">
                  {p.label}
                  {!p.applicable ? (
                    <span className="ml-2 text-xs text-slate-400">(N/A)</span>
                  ) : null}
                </td>
                <td className="px-4 py-2 text-right tabular-nums">{p.applicable ? p.max : "—"}</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {p.applicable ? p.awarded : "—"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50 font-bold text-slate-900">
              <td className="px-4 py-2.5 text-right">Total of Part II</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{s.partIIMax}</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{s.partIIAwarded}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Part II</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{s.partIIPercent}%</p>
          <p className="mt-1 text-xs text-slate-400">
            {s.partIIAwarded} / {s.partIIMax} marks
          </p>
          <div className="mt-2">
            <CategoryBadge category={s.partIICategory} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Part III</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{s.partIIIPercent}%</p>
          <p className="mt-1 text-xs text-slate-400">
            {s.partIIIAwarded} / {s.partIIIMax} marks
          </p>
          <div className="mt-2">
            <CategoryBadge category={s.partIIICategory} />
          </div>
        </div>
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-brand-700">Overall recommendation</p>
          <p className="mt-1 text-3xl font-bold text-brand-900">
            {s.overallCategory ? `Category ${s.overallCategory}` : "—"}
          </p>
          <p className="mt-1 text-xs text-brand-600">Lower of Part II &amp; Part III categories</p>
        </div>
      </div>
    </div>
  );
}
