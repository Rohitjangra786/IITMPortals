import { useState } from "react";
import {
  applyTextScale,
  DEFAULT_SCALE,
  getTextScale,
  MAX_SCALE,
  MIN_SCALE,
  STEP,
} from "@/text-size";
import { cn } from "./ui";

/** Accessibility text-size control (A− / A / A+) — scales the whole app. */
export function TextSizeSwitcher() {
  const [scale, setScale] = useState(getTextScale);

  function set(next: number) {
    setScale(applyTextScale(next));
  }

  const btn =
    "flex h-8 items-center justify-center rounded-md px-2 font-display font-bold leading-none text-slate-700 transition-colors hover:bg-slate-100 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div
      role="group"
      aria-label="Text size"
      title="Adjust text size"
      className="hidden items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm sm:flex"
    >
      <button
        type="button"
        onClick={() => set(scale - STEP)}
        disabled={scale <= MIN_SCALE}
        aria-label="Decrease text size"
        className={cn(btn, "text-xs")}
      >
        A−
      </button>
      <button
        type="button"
        onClick={() => set(DEFAULT_SCALE)}
        aria-label="Reset text size"
        className={cn(btn, "text-sm", scale === DEFAULT_SCALE && "text-brand-700")}
      >
        A
      </button>
      <button
        type="button"
        onClick={() => set(scale + STEP)}
        disabled={scale >= MAX_SCALE}
        aria-label="Increase text size"
        className={cn(btn, "text-lg")}
      >
        A+
      </button>
    </div>
  );
}
