import type { InspectionData, YesNo } from "@/lib/types";
import { Textarea } from "../ui";
import { SectionCard, TextField, YesNoField } from "../form-fields";

type Props = {
  data: InspectionData;
  update: (mutator: (draft: InspectionData) => void) => void;
};

export function PartOneSection({ data, update }: Props) {
  const p = data.partI;
  const set = (key: keyof typeof p, v: YesNo) =>
    update((d) => void ((d.partI[key] as YesNo) = v));

  return (
    <div className="space-y-6">
      <SectionCard
        title="Parameter 1A · Legality of ownership & land use"
        subtitle="Part I carries no marks — all items are verified Yes / No."
      >
        <div className="divide-y divide-slate-100">
          <YesNoField
            label="Land & building owned by the Society/Trust/Company"
            value={p.landBuildingOwned}
            onChange={(v) => set("landBuildingOwned", v)}
          />
          <YesNoField
            label="Rented building in conforming area"
            value={p.rentedConforming}
            onChange={(v) => set("rentedConforming", v)}
          />
          <YesNoField
            label="Land available as per norms in conforming area"
            value={p.landAsPerNorms}
            onChange={(v) => set("landAsPerNorms", v)}
          />
          <YesNoField
            label="Land use certificate of institutional area"
            value={p.landUseCertificate}
            onChange={(v) => set("landUseCertificate", v)}
          />
          <YesNoField
            label="Land in non-conforming area & as per statutory norms (UGC/AICTE/NCTE/BCI)"
            value={p.landNonConforming}
            onChange={(v) => set("landNonConforming", v)}
          />
        </div>
      </SectionCard>

      <SectionCard title="Parameter 1B · Space & sanctioned building plan">
        <div className="divide-y divide-slate-100">
          <YesNoField
            label="Sanctioned building plan approved by DDA / MCD / Govt. body"
            value={p.sanctionedBuildingPlan}
            onChange={(v) => set("sanctionedBuildingPlan", v)}
          />
          <YesNoField
            label="Building occupancy certificate"
            value={p.occupancyCertificate}
            onChange={(v) => set("occupancyCertificate", v)}
          />
          <YesNoField
            label="Availability of space as per norms for proposed programme(s)"
            value={p.spaceAsPerNorms}
            onChange={(v) => set("spaceAsPerNorms", v)}
          />
        </div>
        <div className="mt-4">
          <TextField
            label="Name of the sanctioning authority"
            value={p.sanctioningAuthority}
            onChange={(v) => update((d) => void (d.partI.sanctioningAuthority = v))}
          />
        </div>
      </SectionCard>

      <SectionCard title="Parameter 1C · Safety measures">
        <div className="divide-y divide-slate-100">
          <YesNoField
            label="Structural safety certificate by registered architect / structural engineer"
            value={p.structuralSafetyCert}
            onChange={(v) => set("structuralSafetyCert", v)}
          />
          <YesNoField
            label="Certificate that building is earthquake resistant"
            value={p.earthquakeResistant}
            onChange={(v) => set("earthquakeResistant", v)}
          />
          <YesNoField
            label="Availability of fire-fighting devices"
            value={p.fireFightingDevices}
            onChange={(v) => set("fireFightingDevices", v)}
          />
          <YesNoField
            label="Fire safety certificate by Delhi Fire Service / State dept."
            value={p.fireSafetyCert}
            onChange={(v) => set("fireSafetyCert", v)}
          />
          <YesNoField
            label="Basement used for approved purpose"
            value={p.basementApproved}
            onChange={(v) => set("basementApproved", v)}
          />
          <YesNoField
            label="Basement used other than approved purpose"
            value={p.basementOtherThanApproved}
            onChange={(v) => set("basementOtherThanApproved", v)}
          />
          <YesNoField
            label="NOC from concerned State Govt. dept. (wherever applicable)"
            value={p.nocFromStateDept}
            onChange={(v) => set("nocFromStateDept", v)}
          />
        </div>
        <div className="mt-4">
          <TextField
            label="Fire safety certificate valid up to"
            value={p.fireSafetyValidUpto}
            onChange={(v) => update((d) => void (d.partI.fireSafetyValidUpto = v))}
          />
        </div>
      </SectionCard>

      <SectionCard title="Remarks (Part I)">
        <Textarea
          value={p.remarks}
          onChange={(e) => update((d) => void (d.partI.remarks = e.target.value))}
          placeholder="Observations on physical infrastructure…"
        />
      </SectionCard>
    </div>
  );
}
