import {
  ANCILLARY,
  COMPUTER_CENTRE,
  GRIEVANCE,
  LABS,
  LIBRARY,
  LLB,
  PRACTICAL_TRAINING,
  type SubCriterion,
} from "@/lib/jac-config";
import { scoreInspection } from "@/lib/scoring";
import type { InspectionData, YesNo } from "@/lib/types";

function clampMark(v: number, max: number) {
  return Math.max(0, Math.min(max, v ?? 0));
}

function MarksTable({
  title,
  criteria,
  values,
}: {
  title: string;
  criteria: SubCriterion[];
  values: Record<string, number>;
}) {
  const max = criteria.reduce((t, c) => t + c.max, 0);
  const awarded = criteria.reduce((t, c) => t + clampMark(values?.[c.key] ?? 0, c.max), 0);
  return (
    <div className="print-avoid-break mb-4">
      <h4 className="mb-1 text-sm font-bold text-slate-800">{title}</h4>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="bg-slate-100 text-left">
            <th className="border border-slate-300 px-2 py-1">Criteria</th>
            <th className="w-20 border border-slate-300 px-2 py-1 text-right">Max</th>
            <th className="w-20 border border-slate-300 px-2 py-1 text-right">Awarded</th>
          </tr>
        </thead>
        <tbody>
          {criteria.map((c) => (
            <tr key={c.key}>
              <td className="border border-slate-300 px-2 py-1">{c.label}</td>
              <td className="border border-slate-300 px-2 py-1 text-right">{c.max}</td>
              <td className="border border-slate-300 px-2 py-1 text-right">
                {clampMark(values?.[c.key] ?? 0, c.max)}
              </td>
            </tr>
          ))}
          <tr className="bg-slate-50 font-bold">
            <td className="border border-slate-300 px-2 py-1 text-right">Total</td>
            <td className="border border-slate-300 px-2 py-1 text-right">{max}</td>
            <td className="border border-slate-300 px-2 py-1 text-right">{awarded}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function YesNoTable({ rows }: { rows: { label: string; value: YesNo }[] }) {
  return (
    <table className="mb-4 w-full border-collapse text-xs">
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td className="border border-slate-300 px-2 py-1">{r.label}</td>
            <td className="w-24 border border-slate-300 px-2 py-1 text-center font-semibold">
              {r.value || "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="print-avoid-break mb-6">
      <h3 className="mb-2 border-b-2 border-slate-800 pb-1 text-base font-bold text-slate-900">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 py-0.5 text-xs">
      <span className="w-44 shrink-0 font-semibold text-slate-600">{label}</span>
      <span className="text-slate-900">{value || "—"}</span>
    </div>
  );
}

export function Report({
  data,
  meta,
}: {
  data: InspectionData;
  meta: { instituteName: string; session: string; dateOfVisit: string; status: string };
}) {
  const s = scoreInspection(data);
  const p = data.particulars;
  const pI = data.partI;
  const pII = data.partII;

  return (
    <div className="mx-auto max-w-4xl bg-white p-8 text-slate-900 shadow-sm print:p-0 print:shadow-none">
      {/* Title */}
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold uppercase">Guru Gobind Singh Indraprastha University</h1>
        <p className="text-xs text-slate-600">
          A State University established by Govt. of NCT of Delhi · Sector-16C, Dwarka, New Delhi - 110078
        </p>
        <h2 className="mt-3 text-base font-bold">
          Report of Joint Assessment Committee — Existing Institutes
        </h2>
        <p className="text-xs text-slate-600">
          Technical &amp; Non-Technical Courses · Academic Session {meta.session}
        </p>
      </div>

      {/* Committee */}
      <Section title="Committee Members">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="border border-slate-300 px-2 py-1">Designation</th>
              <th className="border border-slate-300 px-2 py-1">Name</th>
              <th className="w-32 border border-slate-300 px-2 py-1">Signature</th>
            </tr>
          </thead>
          <tbody>
            {data.committee.map((m) => (
              <tr key={m.role}>
                <td className="border border-slate-300 px-2 py-1 font-semibold">{m.role}</td>
                <td className="border border-slate-300 px-2 py-1">{m.name || "—"}</td>
                <td className="border border-slate-300 px-2 py-1" />
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Particulars */}
      <Section title="Particulars of the Institute">
        <Detail label="Name of institute" value={p.instituteName || meta.instituteName} />
        <Detail label="Address" value={p.instituteAddress} />
        <Detail label="District" value={p.district} />
        <Detail label="Telephone" value={p.telephone} />
        <Detail label="Website" value={p.website} />
        <Detail label="Email" value={p.email} />
        <Detail label="Date & time of visit" value={p.dateTimeOfVisit || meta.dateOfVisit} />
        <div className="mt-2 border-t border-slate-200 pt-2">
          <Detail label="Society / Trust / Company" value={p.societyName} />
          <Detail label="Society address" value={p.societyAddress} />
          <Detail label="Chairperson of Society" value={p.chairpersonName} />
          <Detail label="Director / Principal" value={p.directorName} />
        </div>
      </Section>

      {/* Programmes */}
      <Section title="Programmes — Teacher-Student & Faculty Cadre Ratio">
        {s.programmeScores.length === 0 ? (
          <p className="text-xs text-slate-500">No programmes recorded.</p>
        ) : (
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="border border-slate-300 px-2 py-1">Programme</th>
                <th className="border border-slate-300 px-2 py-1 text-right">Teachers req.</th>
                <th className="border border-slate-300 px-2 py-1 text-right">TS ratio</th>
                <th className="border border-slate-300 px-2 py-1 text-right">II-B(i)</th>
                <th className="border border-slate-300 px-2 py-1 text-right">K</th>
                <th className="border border-slate-300 px-2 py-1 text-right">CRF</th>
                <th className="border border-slate-300 px-2 py-1 text-right">II-B(ii)</th>
              </tr>
            </thead>
            <tbody>
              {s.programmeScores.map((ps) => (
                <tr key={ps.id}>
                  <td className="border border-slate-300 px-2 py-1">{ps.name || "—"}</td>
                  <td className="border border-slate-300 px-2 py-1 text-right">{ps.teachersRequired}</td>
                  <td className="border border-slate-300 px-2 py-1 text-right">{ps.tsRatioLabel}</td>
                  <td className="border border-slate-300 px-2 py-1 text-right">{ps.tsMarks}</td>
                  <td className="border border-slate-300 px-2 py-1 text-right">{ps.kRequired}</td>
                  <td className="border border-slate-300 px-2 py-1 text-right">{ps.crf}</td>
                  <td className="border border-slate-300 px-2 py-1 text-right">{ps.fcrMarks}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold">
                <td className="border border-slate-300 px-2 py-1 text-right" colSpan={3}>
                  Average marks
                </td>
                <td className="border border-slate-300 px-2 py-1 text-right">{s.tsRatioMarks}</td>
                <td className="border border-slate-300 px-2 py-1" colSpan={2} />
                <td className="border border-slate-300 px-2 py-1 text-right">{s.fcrMarks}</td>
              </tr>
            </tbody>
          </table>
        )}
      </Section>

      {/* Part I */}
      <Section title="Part I · Physical Infrastructure (no marks)">
        <YesNoTable
          rows={[
            { label: "Land & building owned by Society/Trust/Company", value: pI.landBuildingOwned },
            { label: "Rented building in conforming area", value: pI.rentedConforming },
            { label: "Land available as per norms in conforming area", value: pI.landAsPerNorms },
            { label: "Land use certificate of institutional area", value: pI.landUseCertificate },
            { label: "Land in non-conforming area & as per statutory norms", value: pI.landNonConforming },
            { label: "Sanctioned building plan (DDA/MCD/Govt.)", value: pI.sanctionedBuildingPlan },
            { label: "Building occupancy certificate", value: pI.occupancyCertificate },
            { label: "Space available as per norms for proposed programmes", value: pI.spaceAsPerNorms },
            { label: "Structural safety certificate", value: pI.structuralSafetyCert },
            { label: "Building earthquake resistant", value: pI.earthquakeResistant },
            { label: "Fire-fighting devices available", value: pI.fireFightingDevices },
            { label: "Fire safety certificate", value: pI.fireSafetyCert },
            { label: "Basement used for approved purpose", value: pI.basementApproved },
            { label: "Basement used other than approved purpose", value: pI.basementOtherThanApproved },
            { label: "NOC from State Govt. dept. (where applicable)", value: pI.nocFromStateDept },
          ]}
        />
        {pI.remarks ? <p className="text-xs"><b>Remarks:</b> {pI.remarks}</p> : null}
      </Section>

      {/* Part II */}
      <Section title="Part II · Academic Standards & Infrastructure">
        <table className="mb-4 w-full border-collapse text-xs">
          <tbody>
            <tr>
              <td className="border border-slate-300 px-2 py-1">II-A · Status of Director / Principal</td>
              <td className="w-24 border border-slate-300 px-2 py-1 text-right">
                {pII.directorPrincipal.marks} / 100
              </td>
            </tr>
          </tbody>
        </table>
        <MarksTable title="II-C · Computer Centre" criteria={COMPUTER_CENTRE} values={pII.computerCentre.marks} />
        <MarksTable title="II-D · Library" criteria={LIBRARY} values={pII.library.marks} />
        {pII.labs.applicable ? (
          <MarksTable title="II-E(i) · Labs / Workshops" criteria={LABS} values={pII.labs.marks} />
        ) : null}
        {pII.practicalTraining.applicable ? (
          <MarksTable
            title="II-E(ii) · Practical Training"
            criteria={PRACTICAL_TRAINING}
            values={pII.practicalTraining.marks}
          />
        ) : null}
        {pII.llb.applicable ? (
          <MarksTable title="II-E(iii) · 5-yr Integrated LLB" criteria={LLB} values={pII.llb.marks} />
        ) : null}
        <MarksTable title="II-F · Ancillary & Other Facilities" criteria={ANCILLARY} values={pII.ancillary.marks} />
        <MarksTable title="II-G · Students' Grievance Redressal" criteria={GRIEVANCE} values={pII.grievance.marks} />
      </Section>

      {/* Summary of marks */}
      <Section title="Summary of Marks">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="border border-slate-300 px-2 py-1">Parameter</th>
              <th className="w-20 border border-slate-300 px-2 py-1 text-right">Max</th>
              <th className="w-20 border border-slate-300 px-2 py-1 text-right">Awarded</th>
            </tr>
          </thead>
          <tbody>
            {s.partII.map((par) => (
              <tr key={par.key} className={par.applicable ? "" : "text-slate-400"}>
                <td className="border border-slate-300 px-2 py-1">
                  {par.label}
                  {par.applicable ? "" : " (N/A)"}
                </td>
                <td className="border border-slate-300 px-2 py-1 text-right">
                  {par.applicable ? par.max : "—"}
                </td>
                <td className="border border-slate-300 px-2 py-1 text-right">
                  {par.applicable ? par.awarded : "—"}
                </td>
              </tr>
            ))}
            <tr className="bg-slate-50 font-bold">
              <td className="border border-slate-300 px-2 py-1 text-right">Total of Part II</td>
              <td className="border border-slate-300 px-2 py-1 text-right">{s.partIIMax}</td>
              <td className="border border-slate-300 px-2 py-1 text-right">{s.partIIAwarded}</td>
            </tr>
            <tr className="font-bold">
              <td className="border border-slate-300 px-2 py-1 text-right">Part II percentage</td>
              <td className="border border-slate-300 px-2 py-1 text-right" colSpan={2}>
                {s.partIIPercent}% · Category {s.partIICategory}
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* Part III */}
      <Section title="Part III · Status of Compliance (Max 200)">
        <table className="w-full border-collapse text-xs">
          <tbody>
            <tr>
              <td className="border border-slate-300 px-2 py-1">
                A · Compliance of last Academic Audit observations
              </td>
              <td className="w-24 border border-slate-300 px-2 py-1 text-right">
                {clampMark(data.partIII.academicAudit, 100)} / 100
              </td>
            </tr>
            <tr>
              <td className="border border-slate-300 px-2 py-1">
                B · Compliance of JAC / NOC / Affiliation conditions
              </td>
              <td className="border border-slate-300 px-2 py-1 text-right">
                {clampMark(data.partIII.jacNocConditions, 100)} / 100
              </td>
            </tr>
            <tr className="bg-slate-50 font-bold">
              <td className="border border-slate-300 px-2 py-1 text-right">Part III total</td>
              <td className="border border-slate-300 px-2 py-1 text-right">
                {s.partIIIAwarded} / 200
              </td>
            </tr>
            <tr className="font-bold">
              <td className="border border-slate-300 px-2 py-1 text-right">Part III percentage</td>
              <td className="border border-slate-300 px-2 py-1 text-right">
                {s.partIIIPercent}% · Category {s.partIIICategory}
              </td>
            </tr>
          </tbody>
        </table>
        {data.partIII.reasons ? (
          <p className="mt-2 text-xs"><b>Reasons:</b> {data.partIII.reasons}</p>
        ) : null}
      </Section>

      {/* Recommendation */}
      <Section title="Recommendation regarding Category">
        <div className="rounded border border-slate-300 p-3 text-sm">
          <p>
            Based on the assessment of Part II and Part III, the Inspecting Team recommends the
            institute be placed in{" "}
            <b>
              Category {data.recommendations.categoryRecommended || s.overallCategory || "—"}
            </b>
            .
          </p>
          <p className="mt-1">
            Provisional affiliation for {meta.session}:{" "}
            <b>{data.recommendations.provisionalAffiliation || "—"}</b>
          </p>
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            <Detail label="Total plot area" value={data.recommendations.totalPlotArea} />
            <Detail label="Covered area required" value={data.recommendations.coveredAreaRequired} />
            <Detail label="Available covered area" value={data.recommendations.availableCoveredArea} />
            <Detail label="FAR achieved (permissible 225%)" value={data.recommendations.farAchieved} />
          </div>
        </div>
      </Section>

      {data.remarks ? (
        <Section title="Remarks / Observations">
          <p className="whitespace-pre-wrap text-xs">{data.remarks}</p>
        </Section>
      ) : null}

      {/* Signatures */}
      <div className="print-avoid-break mt-10 grid grid-cols-2 gap-8 text-xs">
        {data.committee.map((m) => (
          <div key={m.role} className="pt-6">
            <div className="border-t border-slate-400 pt-1">
              <p className="font-semibold">{m.name || "________________"}</p>
              <p className="text-slate-500">{m.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
