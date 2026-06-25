import type { InspectionData } from "@/lib/types";
import { SectionCard, TextField } from "../form-fields";

type Props = {
  data: InspectionData;
  update: (mutator: (draft: InspectionData) => void) => void;
};

export function ParticularsSection({ data, update }: Props) {
  const p = data.particulars;
  return (
    <div className="space-y-6">
      <SectionCard
        title="Committee Members"
        subtitle="Names of the Joint Assessment Committee members."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {data.committee.map((m, i) => (
            <TextField
              key={m.role}
              label={m.role}
              value={m.name}
              onChange={(v) =>
                update((d) => {
                  d.committee[i].name = v;
                })
              }
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Particulars of the Institute">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Date & time of visit"
            value={p.dateTimeOfVisit}
            onChange={(v) => update((d) => void (d.particulars.dateTimeOfVisit = v))}
          />
          <TextField
            label="District"
            value={p.district}
            onChange={(v) => update((d) => void (d.particulars.district = v))}
          />
          <TextField
            label="Name of institute"
            className="sm:col-span-2"
            value={p.instituteName}
            onChange={(v) => update((d) => void (d.particulars.instituteName = v))}
          />
          <TextField
            label="Address of institute"
            className="sm:col-span-2"
            value={p.instituteAddress}
            onChange={(v) => update((d) => void (d.particulars.instituteAddress = v))}
          />
          <TextField
            label="Telephone"
            value={p.telephone}
            onChange={(v) => update((d) => void (d.particulars.telephone = v))}
          />
          <TextField
            label="Website"
            value={p.website}
            onChange={(v) => update((d) => void (d.particulars.website = v))}
          />
          <TextField
            label="Email"
            value={p.email}
            onChange={(v) => update((d) => void (d.particulars.email = v))}
          />
        </div>
      </SectionCard>

      <SectionCard title="Society / Trust / Company">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Name"
            className="sm:col-span-2"
            value={p.societyName}
            onChange={(v) => update((d) => void (d.particulars.societyName = v))}
          />
          <TextField
            label="Address"
            className="sm:col-span-2"
            value={p.societyAddress}
            onChange={(v) => update((d) => void (d.particulars.societyAddress = v))}
          />
          <TextField
            label="Telephone"
            value={p.societyTelephone}
            onChange={(v) => update((d) => void (d.particulars.societyTelephone = v))}
          />
          <TextField
            label="Email"
            value={p.societyEmail}
            onChange={(v) => update((d) => void (d.particulars.societyEmail = v))}
          />
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Chairperson of Society">
          <div className="space-y-4">
            <TextField
              label="Name"
              value={p.chairpersonName}
              onChange={(v) => update((d) => void (d.particulars.chairpersonName = v))}
            />
            <TextField
              label="Address"
              value={p.chairpersonAddress}
              onChange={(v) => update((d) => void (d.particulars.chairpersonAddress = v))}
            />
            <TextField
              label="Telephone"
              value={p.chairpersonTelephone}
              onChange={(v) => update((d) => void (d.particulars.chairpersonTelephone = v))}
            />
            <TextField
              label="Email"
              value={p.chairpersonEmail}
              onChange={(v) => update((d) => void (d.particulars.chairpersonEmail = v))}
            />
          </div>
        </SectionCard>

        <SectionCard title="Director / Principal">
          <div className="space-y-4">
            <TextField
              label="Name"
              value={p.directorName}
              onChange={(v) => update((d) => void (d.particulars.directorName = v))}
            />
            <TextField
              label="Address"
              value={p.directorAddress}
              onChange={(v) => update((d) => void (d.particulars.directorAddress = v))}
            />
            <TextField
              label="Telephone"
              value={p.directorTelephone}
              onChange={(v) => update((d) => void (d.particulars.directorTelephone = v))}
            />
            <TextField
              label="Email"
              value={p.directorEmail}
              onChange={(v) => update((d) => void (d.particulars.directorEmail = v))}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
