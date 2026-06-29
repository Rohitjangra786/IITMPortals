// Server-side helpers that bridge the stored JSON blob and the scoring engine.

import { createEmptyInspectionData } from "./jac-config.js";
import { scoreInspection } from "./scoring.js";
import type { InspectionData } from "./types.js";

/** Parse the stored JSON, filling any missing top-level keys from a template. */
export function parseInspectionData(raw: string | null | undefined): InspectionData {
  const base = createEmptyInspectionData();
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Partial<InspectionData>;
    return { ...base, ...parsed };
  } catch {
    return base;
  }
}

/** Recompute the persisted summary columns from the full form data. */
export function computeSummaryFields(data: InspectionData) {
  const s = scoreInspection(data);
  return {
    partIIMax: Math.round(s.partIIMax),
    partIIAwarded: Math.round(s.partIIAwarded),
    partIIPercent: s.partIIPercent,
    partIIIMax: Math.round(s.partIIIMax),
    partIIIAwarded: Math.round(s.partIIIAwarded),
    partIIIPercent: s.partIIIPercent,
    category: s.overallCategory,
  };
}
