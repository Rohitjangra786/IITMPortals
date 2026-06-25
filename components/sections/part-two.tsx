import {
  ANCILLARY,
  COMPUTER_CENTRE,
  GRIEVANCE,
  LABS,
  LIBRARY,
  LLB,
  NAAC_GRADES,
  PRACTICAL_TRAINING,
  naacMarksForGrade,
} from "@/lib/jac-config";
import { scoreInspection } from "@/lib/scoring";
import type { InspectionData } from "@/lib/types";
import { Textarea } from "../ui";
import {
  ApplicableToggle,
  CriteriaGroup,
  SectionCard,
  Select,
  YesNoField,
} from "../form-fields";

type Props = {
  data: InspectionData;
  update: (mutator: (draft: InspectionData) => void) => void;
};

function ComputedBadge({ value }: { value: number }) {
  return (
    <span className="rounded-md bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700">
      {value} / 100
    </span>
  );
}

export function PartTwoSection({ data, update }: Props) {
  const pII = data.partII;
  const score = scoreInspection(data);
  const acc = pII.accreditation;
  const naacMarks = acc.naacApplicable ? naacMarksForGrade(acc.naacGrade) : 0;
  const nbaMarks = acc.nbaApplicable && acc.nbaAccredited ? 20 : 0;

  return (
    <div className="space-y-6">
      {/* II-A */}
      <SectionCard
        title="II-A · Status of Director / Principal"
        subtitle="Max 100 — award 100 if eligible and all documents provided, else 0."
        right={<ComputedBadge value={pII.directorPrincipal.marks} />}
      >
        <YesNoField
          label="Director/Principal in position as per norms with all documents provided?"
          value={pII.directorPrincipal.compliant}
          onChange={(v) =>
            update((d) => {
              d.partII.directorPrincipal.compliant = v;
              d.partII.directorPrincipal.marks = v === "Yes" ? 100 : 0;
            })
          }
        />
        <Textarea
          className="mt-3"
          placeholder="Remarks…"
          value={pII.directorPrincipal.remarks}
          onChange={(e) => update((d) => void (d.partII.directorPrincipal.remarks = e.target.value))}
        />
      </SectionCard>

      {/* II-B */}
      <SectionCard
        title="II-B · Teacher-Student Ratio & Faculty Cadre Ratio"
        subtitle="Computed automatically from the Programmes section (average across programmes)."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-600">II-B(i) Teacher-Student Ratio</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {score.tsRatioMarks}
              <span className="text-base font-normal text-slate-400"> / 100</span>
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-600">II-B(ii) Faculty Cadre Ratio</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {score.fcrMarks}
              <span className="text-base font-normal text-slate-400"> / 100</span>
            </p>
          </div>
        </div>
        {data.programmes.length === 0 ? (
          <p className="mt-3 text-sm text-amber-600">
            Add programmes in the Programmes section to compute these marks.
          </p>
        ) : null}
        <Textarea
          className="mt-3"
          placeholder="Remarks for II-B…"
          value={pII.ratioRemarks}
          onChange={(e) => update((d) => void (d.partII.ratioRemarks = e.target.value))}
        />
      </SectionCard>

      {/* II-C */}
      <SectionCard title="II-C · Computer Centre" subtitle="Max 100">
        <CriteriaGroup
          criteria={COMPUTER_CENTRE}
          values={pII.computerCentre.marks}
          onChange={(key, v) => update((d) => void (d.partII.computerCentre.marks[key] = v))}
        />
        <Textarea
          className="mt-3"
          placeholder="Remarks…"
          value={pII.computerCentre.remarks}
          onChange={(e) => update((d) => void (d.partII.computerCentre.remarks = e.target.value))}
        />
      </SectionCard>

      {/* II-D */}
      <SectionCard title="II-D · Status of Library" subtitle="Max 250">
        <CriteriaGroup
          criteria={LIBRARY}
          values={pII.library.marks}
          onChange={(key, v) => update((d) => void (d.partII.library.marks[key] = v))}
        />
        <Textarea
          className="mt-3"
          placeholder="Remarks…"
          value={pII.library.remarks}
          onChange={(e) => update((d) => void (d.partII.library.remarks = e.target.value))}
        />
      </SectionCard>

      {/* II-E(i) */}
      <SectionCard
        title="II-E(i) · Labs / Workshops"
        subtitle="Max 100 — wherever applicable."
        right={
          <ApplicableToggle
            label="Applicable"
            applicable={pII.labs.applicable}
            onChange={(v) => update((d) => void (d.partII.labs.applicable = v))}
          />
        }
      >
        {pII.labs.applicable ? (
          <CriteriaGroup
            criteria={LABS}
            values={pII.labs.marks}
            onChange={(key, v) => update((d) => void (d.partII.labs.marks[key] = v))}
          />
        ) : (
          <p className="text-sm text-slate-400">Marked not applicable — excluded from totals.</p>
        )}
      </SectionCard>

      {/* II-E(ii) */}
      <SectionCard
        title="II-E(ii) · Practical Training"
        subtitle="Max 100 — all programmes except LLB."
        right={
          <ApplicableToggle
            label="Applicable"
            applicable={pII.practicalTraining.applicable}
            onChange={(v) => update((d) => void (d.partII.practicalTraining.applicable = v))}
          />
        }
      >
        {pII.practicalTraining.applicable ? (
          <CriteriaGroup
            criteria={PRACTICAL_TRAINING}
            values={pII.practicalTraining.marks}
            onChange={(key, v) => update((d) => void (d.partII.practicalTraining.marks[key] = v))}
          />
        ) : (
          <p className="text-sm text-slate-400">Marked not applicable — excluded from totals.</p>
        )}
      </SectionCard>

      {/* II-E(iii) */}
      <SectionCard
        title="II-E(iii) · 5-year Integrated LLB"
        subtitle="Max 100 — only for the integrated LLB programme."
        right={
          <ApplicableToggle
            label="Applicable"
            applicable={pII.llb.applicable}
            onChange={(v) => update((d) => void (d.partII.llb.applicable = v))}
          />
        }
      >
        {pII.llb.applicable ? (
          <CriteriaGroup
            criteria={LLB}
            values={pII.llb.marks}
            onChange={(key, v) => update((d) => void (d.partII.llb.marks[key] = v))}
          />
        ) : (
          <p className="text-sm text-slate-400">Marked not applicable — excluded from totals.</p>
        )}
      </SectionCard>

      {/* II-F */}
      <SectionCard title="II-F · Ancillary & Other Essential Facilities" subtitle="Max 250">
        <CriteriaGroup
          criteria={ANCILLARY}
          values={pII.ancillary.marks}
          onChange={(key, v) => update((d) => void (d.partII.ancillary.marks[key] = v))}
        />
        <Textarea
          className="mt-3"
          placeholder="Remarks…"
          value={pII.ancillary.remarks}
          onChange={(e) => update((d) => void (d.partII.ancillary.remarks = e.target.value))}
        />
      </SectionCard>

      {/* II-G */}
      <SectionCard title="II-G · Students' Grievance Redressal Mechanism" subtitle="Max 100">
        <CriteriaGroup
          criteria={GRIEVANCE}
          values={pII.grievance.marks}
          onChange={(key, v) => update((d) => void (d.partII.grievance.marks[key] = v))}
        />
        <Textarea
          className="mt-3"
          placeholder="Remarks…"
          value={pII.grievance.remarks}
          onChange={(e) => update((d) => void (d.partII.grievance.remarks = e.target.value))}
        />
      </SectionCard>

      {/* II-H */}
      <SectionCard
        title="II-H · NAAC / NBA Accreditation"
        subtitle="NAAC 20 (all) + NBA 20 (AICTE technical courses)."
        right={
          <span className="rounded-md bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand-700">
            {naacMarks + nbaMarks} / {acc.nbaApplicable ? 40 : 20}
          </span>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <ApplicableToggle
              label="NAAC accreditation applicable"
              applicable={acc.naacApplicable}
              onChange={(v) => update((d) => void (d.partII.accreditation.naacApplicable = v))}
            />
            {acc.naacApplicable ? (
              <div className="mt-3 flex items-center gap-3">
                <label className="text-sm font-medium text-slate-700">NAAC grade</label>
                <Select
                  className="max-w-xs"
                  value={acc.naacGrade}
                  onChange={(e) =>
                    update((d) => void (d.partII.accreditation.naacGrade = e.target.value))
                  }
                >
                  <option value="">— Select grade —</option>
                  {NAAC_GRADES.map((g) => (
                    <option key={g.grade} value={g.grade}>
                      {g.grade} ({g.marks} marks)
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <ApplicableToggle
              label="NBA applicable (AICTE-approved technical course)"
              applicable={acc.nbaApplicable}
              onChange={(v) => update((d) => void (d.partII.accreditation.nbaApplicable = v))}
            />
            {acc.nbaApplicable ? (
              <div className="mt-3">
                <ApplicableToggle
                  label="NBA accredited (20 marks)"
                  applicable={acc.nbaAccredited}
                  onChange={(v) => update((d) => void (d.partII.accreditation.nbaAccredited = v))}
                />
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-400">
                Non-technical institution — total assessed out of 20.
              </p>
            )}
          </div>

          <Textarea
            placeholder="Remarks…"
            value={acc.remarks}
            onChange={(e) => update((d) => void (d.partII.accreditation.remarks = e.target.value))}
          />
        </div>
      </SectionCard>
    </div>
  );
}
