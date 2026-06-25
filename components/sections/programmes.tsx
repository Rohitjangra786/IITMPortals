import { TS_CASES } from "@/lib/jac-config";
import { scoreProgramme } from "@/lib/scoring";
import type { InspectionData, Programme } from "@/lib/types";
import { Button } from "../ui";
import { NumberField, SectionCard, Select, TextField } from "../form-fields";

type Props = {
  data: InspectionData;
  update: (mutator: (draft: InspectionData) => void) => void;
};

function newProgramme(): Programme {
  return {
    id: crypto.randomUUID(),
    name: "",
    tsCaseId: 1,
    duration: 3,
    intake: 0,
    admitted: 0,
    studentsPerDivision: 60,
    divisions: 1,
    teachersAvailable: 0,
    professors: 0,
    associateProfessors: 0,
    assistantProfessors: 0,
  };
}

function Metric({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-bold text-slate-900">{value}</p>
      {hint ? <p className="text-[11px] text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function ProgrammesSection({ data, update }: Props) {
  return (
    <SectionCard
      title="Programmes & Faculty"
      subtitle="Drives Teacher-Student Ratio (II-B i) and Faculty Cadre Ratio (II-B ii). Marks update live."
      right={
        <Button
          variant="secondary"
          onClick={() => update((d) => void d.programmes.push(newProgramme()))}
        >
          + Add programme
        </Button>
      }
    >
      {data.programmes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
          No programmes added yet. Add programmes to compute the ratio marks.
        </p>
      ) : (
        <div className="space-y-5">
          {data.programmes.map((prog, i) => {
            const score = scoreProgramme(prog);
            return (
              <div key={prog.id} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Programme {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => update((d) => void d.programmes.splice(i, 1))}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <TextField
                    label="Programme name"
                    className="sm:col-span-2 lg:col-span-3"
                    value={prog.name}
                    onChange={(v) => update((d) => void (d.programmes[i].name = v))}
                  />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      TS ratio case
                    </label>
                    <Select
                      value={prog.tsCaseId}
                      onChange={(e) =>
                        update((d) => void (d.programmes[i].tsCaseId = Number(e.target.value)))
                      }
                    >
                      {TS_CASES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <NumberField
                    label="Duration (years, D)"
                    value={prog.duration}
                    onChange={(v) => update((d) => void (d.programmes[i].duration = v))}
                  />
                  <NumberField
                    label="Total intake (A)"
                    value={prog.intake}
                    onChange={(v) => update((d) => void (d.programmes[i].intake = v))}
                  />
                  <NumberField
                    label="Admitted (last yr)"
                    value={prog.admitted}
                    onChange={(v) => update((d) => void (d.programmes[i].admitted = v))}
                  />
                  <NumberField
                    label="Students / division (S)"
                    value={prog.studentsPerDivision}
                    onChange={(v) => update((d) => void (d.programmes[i].studentsPerDivision = v))}
                  />
                  <NumberField
                    label="Divisions (N)"
                    value={prog.divisions}
                    onChange={(v) => update((d) => void (d.programmes[i].divisions = v))}
                  />
                  <NumberField
                    label="Teachers available (C)"
                    value={prog.teachersAvailable}
                    onChange={(v) => update((d) => void (d.programmes[i].teachersAvailable = v))}
                  />
                  <NumberField
                    label="Professors"
                    value={prog.professors}
                    onChange={(v) => update((d) => void (d.programmes[i].professors = v))}
                  />
                  <NumberField
                    label="Associate Professors"
                    value={prog.associateProfessors}
                    onChange={(v) => update((d) => void (d.programmes[i].associateProfessors = v))}
                  />
                  <NumberField
                    label="Assistant Professors"
                    value={prog.assistantProfessors}
                    onChange={(v) => update((d) => void (d.programmes[i].assistantProfessors = v))}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                  <Metric label="Teachers req. (B)" value={score.teachersRequired} />
                  <Metric label="TS ratio" value={score.tsRatioLabel} />
                  <Metric
                    label="II-B(i) marks"
                    value={score.tsMarks}
                    hint="out of 100"
                  />
                  <Metric label="Faculty req. (K)" value={score.kRequired} />
                  <Metric label="Senior / Junior" value={`${score.seniorRequired} / ${score.juniorRequired}`} />
                  <Metric label="CRF (f)" value={score.crf} />
                  <Metric
                    label="II-B(ii) marks"
                    value={score.fcrMarks}
                    hint="out of 100"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
