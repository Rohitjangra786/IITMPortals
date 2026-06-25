import { scoreInspection } from "@/lib/scoring";
import type { InspectionData, ProgrammeRecommendation, YesNo } from "@/lib/types";
import { Button } from "../ui";
import { SectionCard, Select, TextField } from "../form-fields";

type Props = {
  data: InspectionData;
  update: (mutator: (draft: InspectionData) => void) => void;
};

function emptyRow(name = ""): ProgrammeRecommendation {
  return {
    id: crypto.randomUUID(),
    name,
    recommended: "",
    intakeRecommended: "",
    spaceFactor: "",
    spaceRequired: "",
    reasonIfNot: "",
  };
}

export function RecommendationsSection({ data, update }: Props) {
  const rec = data.recommendations;
  const score = scoreInspection(data);

  return (
    <div className="space-y-6">
      <SectionCard
        title="Recommendation regarding Programme(s)"
        subtitle="Justification on the basis of space factor (covered area) per Statutory Body / University / GNCTD policy."
        right={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() =>
                update((d) => {
                  d.recommendations.programmes = d.programmes.map((p) => emptyRow(p.name));
                })
              }
            >
              Pull from programmes
            </Button>
            <Button
              variant="secondary"
              onClick={() => update((d) => void d.recommendations.programmes.push(emptyRow()))}
            >
              + Row
            </Button>
          </div>
        }
      >
        {rec.programmes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
            No rows yet. Use “Pull from programmes” to populate from the Programmes section.
          </p>
        ) : (
          <div className="space-y-3">
            {rec.programmes.map((row, i) => (
              <div key={row.id} className="rounded-lg border border-slate-200 p-3">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <TextField
                    label="Programme"
                    className="lg:col-span-2"
                    value={row.name}
                    onChange={(v) => update((d) => void (d.recommendations.programmes[i].name = v))}
                  />
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Recommended
                    </label>
                    <Select
                      value={row.recommended}
                      onChange={(e) =>
                        update(
                          (d) =>
                            void (d.recommendations.programmes[i].recommended = e.target
                              .value as YesNo),
                        )
                      }
                    >
                      <option value="">—</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Select>
                  </div>
                  <TextField
                    label="Intake / duration recommended"
                    value={row.intakeRecommended}
                    onChange={(v) =>
                      update((d) => void (d.recommendations.programmes[i].intakeRecommended = v))
                    }
                  />
                  <TextField
                    label="Space factor (Sq. Mtrs.)"
                    value={row.spaceFactor}
                    onChange={(v) =>
                      update((d) => void (d.recommendations.programmes[i].spaceFactor = v))
                    }
                  />
                  <TextField
                    label="Space required (Sq. Mtrs.)"
                    value={row.spaceRequired}
                    onChange={(v) =>
                      update((d) => void (d.recommendations.programmes[i].spaceRequired = v))
                    }
                  />
                  <TextField
                    label="If not recommended, reason"
                    className="lg:col-span-3"
                    value={row.reasonIfNot}
                    onChange={(v) =>
                      update((d) => void (d.recommendations.programmes[i].reasonIfNot = v))
                    }
                  />
                </div>
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => update((d) => void d.recommendations.programmes.splice(i, 1))}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove row
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Space & FAR" subtitle="Permissible FAR: 225%.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Total plot area (Sq. Mtrs. / Acres)"
            value={rec.totalPlotArea}
            onChange={(v) => update((d) => void (d.recommendations.totalPlotArea = v))}
          />
          <TextField
            label="Total covered area required for recommended intake"
            value={rec.coveredAreaRequired}
            onChange={(v) => update((d) => void (d.recommendations.coveredAreaRequired = v))}
          />
          <TextField
            label="Available covered area (sanctioned building plan)"
            value={rec.availableCoveredArea}
            onChange={(v) => update((d) => void (d.recommendations.availableCoveredArea = v))}
          />
          <TextField
            label="FAR achieved (%)"
            value={rec.farAchieved}
            onChange={(v) => update((d) => void (d.recommendations.farAchieved = v))}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Recommendation regarding Category"
        subtitle="Based on Part II & Part III. Suggested overall category is shown for reference."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category recommended
            </label>
            <Select
              value={rec.categoryRecommended}
              onChange={(e) =>
                update((d) => void (d.recommendations.categoryRecommended = e.target.value))
              }
            >
              <option value="">— Select —</option>
              <option value="A">Category A (≥ 75%)</option>
              <option value="B">Category B (65–75%)</option>
              <option value="C">Category C (50–65%)</option>
              <option value="D">Category D (&lt; 50%, No Admission)</option>
            </Select>
            <p className="mt-1 text-xs text-slate-500">
              Computed suggestion: <span className="font-semibold">Category {score.overallCategory || "—"}</span>{" "}
              (Part II {score.partIICategory || "—"}, Part III {score.partIIICategory || "—"})
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Provisional affiliation 2026-27
            </label>
            <Select
              value={rec.provisionalAffiliation}
              onChange={(e) =>
                update(
                  (d) =>
                    void (d.recommendations.provisionalAffiliation = e.target.value as
                      | "Placed"
                      | "Not Placed"
                      | ""),
                )
              }
            >
              <option value="">— Select —</option>
              <option value="Placed">Placed under provisional affiliation</option>
              <option value="Not Placed">Not placed under provisional affiliation</option>
            </Select>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Remarks / Observations">
        <textarea
          className="min-h-[120px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={data.remarks}
          onChange={(e) => update((d) => void (d.remarks = e.target.value))}
          placeholder="Overall remarks and observations of the committee…"
        />
      </SectionCard>
    </div>
  );
}
