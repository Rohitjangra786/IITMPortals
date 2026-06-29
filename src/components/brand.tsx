// IITM Janakpuri brand assets. The logo is a maroon "IITM — Nurturing
// Excellence" wordmark; a white variant is used on dark surfaces.

export function BrandMark({
  height = 36,
  variant = "color",
  className,
}: {
  height?: number;
  variant?: "color" | "white";
  className?: string;
}) {
  const src = variant === "white" ? "/iitm-logo-white.png" : "/iitm-logo.png";
  return (
    <img
      src={src}
      alt="IITM Janakpuri — Institute of Information Technology & Management"
      style={{ height }}
      className={className}
    />
  );
}

export function BrandTitle({ subtitle }: { subtitle?: string }) {
  return (
    <div className="leading-tight">
      <p className="font-display text-sm font-bold tracking-tight text-slate-900">
        JAC Inspection Portal
      </p>
      <p className="text-xs text-slate-500">
        {subtitle ?? "IITM Janakpuri · Affiliated to GGSIPU"}
      </p>
    </div>
  );
}
