export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl bg-brand-700 font-bold text-white shadow-sm"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      JAC
    </div>
  );
}

export function BrandTitle({ subtitle }: { subtitle?: string }) {
  return (
    <div>
      <p className="text-sm font-bold tracking-tight text-slate-900">
        JAC Inspection Portal
      </p>
      <p className="text-xs text-slate-500">{subtitle ?? "GGSIPU · GNCT of Delhi"}</p>
    </div>
  );
}
