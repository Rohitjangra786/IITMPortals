import { ShieldCheck } from "lucide-react";

export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-sm ring-1 ring-inset ring-white/10"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <ShieldCheck strokeWidth={2} style={{ width: size * 0.55, height: size * 0.55 }} />
    </div>
  );
}

export function BrandTitle({ subtitle }: { subtitle?: string }) {
  return (
    <div className="leading-tight">
      <p className="font-display text-sm font-bold tracking-tight text-slate-900">
        JAC Inspection Portal
      </p>
      <p className="text-xs text-slate-500">{subtitle ?? "GGSIPU · GNCT of Delhi"}</p>
    </div>
  );
}
