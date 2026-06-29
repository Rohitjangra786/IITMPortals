import { ShieldCheck } from "lucide-react";

/** General (default) brand mark — a neutral shield, not institute-specific. */
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

/** IITM Janakpuri logo — shown only for signed-in IITM users. */
export function IitmMark({
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
      <p className="text-xs text-slate-500">{subtitle ?? "GGSIPU · GNCT of Delhi"}</p>
    </div>
  );
}
