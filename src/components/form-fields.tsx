import type { SubCriterion } from "@/lib/jac-config";
import type { YesNo } from "@/lib/types";
import { Input, Select, cn } from "./ui";

/** A titled white panel used for each report section. */
export function SectionCard({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  className,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  className,
  min = 0,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  className?: string;
  min?: number;
  step?: number;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <Input
        type="number"
        min={min}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    </div>
  );
}

/** Yes / No radio pair. */
export function YesNoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex shrink-0 overflow-hidden rounded-lg ring-1 ring-slate-300">
        {(["Yes", "No"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(value === opt ? "" : opt)}
            className={cn(
              "px-3 py-1 text-sm font-medium transition-colors",
              value === opt
                ? opt === "Yes"
                  ? "bg-emerald-600 text-white"
                  : "bg-red-500 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/** A single marks input with a "/ max" cap, auto-clamped. */
export function MarkInput({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <input
        type="number"
        min={0}
        max={max}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => {
          const raw = e.target.value === "" ? 0 : Number(e.target.value);
          onChange(Math.max(0, Math.min(max, raw)));
        }}
        className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1 text-right text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      <span className="w-12 text-sm text-slate-400">/ {max}</span>
    </div>
  );
}

/** A list of sub-criteria, each with a marks input, plus a footer total. */
export function CriteriaGroup({
  criteria,
  values,
  onChange,
}: {
  criteria: SubCriterion[];
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
}) {
  const max = criteria.reduce((t, c) => t + c.max, 0);
  const awarded = criteria.reduce(
    (t, c) => t + Math.max(0, Math.min(c.max, values?.[c.key] ?? 0)),
    0,
  );
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <tbody className="divide-y divide-slate-100">
          {criteria.map((c) => (
            <tr key={c.key} className="hover:bg-slate-50">
              <td className="px-3 py-2 text-slate-700">{c.label}</td>
              <td className="w-40 px-3 py-2 text-right">
                <div className="flex justify-end">
                  <MarkInput
                    value={values?.[c.key] ?? 0}
                    max={c.max}
                    onChange={(v) => onChange(c.key, v)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-200 bg-slate-50 font-semibold text-slate-900">
            <td className="px-3 py-2 text-right">Total marks</td>
            <td className="px-3 py-2 text-right tabular-nums">
              {awarded} / {max}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export function ApplicableToggle({
  label,
  applicable,
  onChange,
}: {
  label: string;
  applicable: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
      <input
        type="checkbox"
        checked={applicable}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}

export { Select };
