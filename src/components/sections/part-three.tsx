import { scoreInspection } from "@/lib/scoring";
import type { InspectionData } from "@/lib/types";
import { Textarea } from "../ui";
import { MarkInput, SectionCard } from "../form-fields";

type Props = {
  data: InspectionData;
  update: (mutator: (draft: InspectionData) => void) => void;
};

export function PartThreeSection({ data, update }: Props) {
  const p = data.partIII;
  const score = scoreInspection(data);

  return (
    <SectionCard
      title="Part III · Status of Compliance"
      subtitle="Max 200 — compliance with Academic Audit and JAC / NOC / Affiliation conditions of the previous year."
      right={
        <span className="rounded-md bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700">
          {score.partIIIAwarded} / 200 · {score.partIIIPercent}%
        </span>
      }
    >
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
              <td className="px-3 py-3 text-slate-700">
                <span className="font-medium text-slate-500">A.</span> Compliance of observations of
                last Academic Audit
              </td>
              <td className="w-40 px-3 py-3">
                <div className="flex justify-end">
                  <MarkInput
                    value={p.academicAudit}
                    max={100}
                    onChange={(v) => update((d) => void (d.partIII.academicAudit = v))}
                  />
                </div>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-3 py-3 text-slate-700">
                <span className="font-medium text-slate-500">B.</span> Compliance of observations of
                JAC / NOC / Conditions of Affiliation Order of previous year
              </td>
              <td className="w-40 px-3 py-3">
                <div className="flex justify-end">
                  <MarkInput
                    value={p.jacNocConditions}
                    max={100}
                    onChange={(v) => update((d) => void (d.partIII.jacNocConditions = v))}
                  />
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-900">
              <td className="px-3 py-2 text-right">Total marks</td>
              <td className="px-3 py-2 text-right tabular-nums">{score.partIIIAwarded} / 200</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Reasons for the award of marks (recorded in writing)
        </label>
        <Textarea
          value={p.reasons}
          onChange={(e) => update((d) => void (d.partIII.reasons = e.target.value))}
          placeholder="Record the justification for the marks awarded in Part III…"
        />
      </div>
    </SectionCard>
  );
}
