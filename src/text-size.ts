// App-wide text scaling. Scaling the root font-size makes every rem-based
// Tailwind text/spacing size grow or shrink together. The value is persisted
// and applied early (see the inline script in index.html) to avoid a flash.

export const TEXT_SCALE_KEY = "jac-text-scale";
export const MIN_SCALE = 0.9;
export const MAX_SCALE = 1.3;
export const STEP = 0.1;
export const DEFAULT_SCALE = 1;

function clamp(scale: number): number {
  const rounded = Math.round(scale * 10) / 10;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, rounded));
}

export function getTextScale(): number {
  if (typeof window === "undefined") return DEFAULT_SCALE;
  const raw = Number(window.localStorage.getItem(TEXT_SCALE_KEY));
  return raw >= MIN_SCALE && raw <= MAX_SCALE ? raw : DEFAULT_SCALE;
}

/** Apply (and persist) a text scale; returns the clamped value used. */
export function applyTextScale(scale: number): number {
  const s = clamp(scale);
  document.documentElement.style.fontSize = `${s * 100}%`;
  try {
    window.localStorage.setItem(TEXT_SCALE_KEY, String(s));
  } catch {
    /* ignore storage failures (private mode, etc.) */
  }
  return s;
}
