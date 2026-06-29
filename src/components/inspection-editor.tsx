import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { scoreInspection } from "@/lib/scoring";
import type { InspectionData } from "@/lib/types";
import { ParticularsSection } from "./sections/particulars";
import { ProgrammesSection } from "./sections/programmes";
import { PartOneSection } from "./sections/part-one";
import { PartTwoSection } from "./sections/part-two";
import { PartThreeSection } from "./sections/part-three";
import { RecommendationsSection } from "./sections/recommendations";
import { SummaryView } from "./sections/summary";
import { Button, CategoryBadge, cn } from "./ui";

type Mutator = (draft: InspectionData) => void;

const SECTIONS = [
  { id: "particulars", label: "Particulars" },
  { id: "programmes", label: "Programmes" },
  { id: "partI", label: "Part I" },
  { id: "partII", label: "Part II" },
  { id: "partIII", label: "Part III" },
  { id: "recommendations", label: "Recommendation" },
  { id: "summary", label: "Summary" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];
type SaveStatus = "idle" | "saving" | "saved" | "error";

export function InspectionEditor({
  inspectionId,
  instituteName,
  session,
  initialData,
  initialStatus,
}: {
  inspectionId: string;
  instituteName: string;
  session: string;
  initialData: InspectionData;
  initialStatus: string;
}) {
  const [data, setData] = useState<InspectionData>(initialData);
  const [active, setActive] = useState<SectionId>("particulars");
  const [status, setStatus] = useState(initialStatus);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const firstRender = useRef(true);

  const update = useCallback((mutator: Mutator) => {
    setData((prev) => {
      const draft = structuredClone(prev);
      mutator(draft);
      return draft;
    });
  }, []);

  // Debounced autosave whenever the form data changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSaveStatus("saving");
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/inspections/${inspectionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
        });
        setSaveStatus(res.ok ? "saved" : "error");
      } catch {
        setSaveStatus("error");
      }
    }, 800);
    return () => clearTimeout(handle);
  }, [data, inspectionId]);

  async function toggleStatus() {
    const next = status === "submitted" ? "draft" : "submitted";
    const res = await fetch(`/api/inspections/${inspectionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) setStatus(next);
  }

  const score = scoreInspection(data);

  const saveLabel: Record<SaveStatus, string> = {
    idle: "All changes saved",
    saving: "Saving…",
    saved: "Saved",
    error: "Save failed — retrying on next change",
  };
  const saveStyle: Record<SaveStatus, string> = {
    idle: "bg-slate-50 text-slate-600 ring-slate-200",
    saving: "bg-amber-50 text-amber-700 ring-amber-200",
    saved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    error: "bg-red-50 text-red-700 ring-red-200",
  };
  const saveDot: Record<SaveStatus, string> = {
    idle: "bg-slate-400",
    saving: "bg-amber-500 animate-pulse",
    saved: "bg-emerald-500",
    error: "bg-red-500",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {instituteName || "Inspection"}
          </h1>
          <p className="text-sm text-slate-500">JAC Assessment Report · Session {session}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/inspections/${inspectionId}/report`} target="_blank">
            <Button variant="secondary">View / print report</Button>
          </Link>
          <Button variant={status === "submitted" ? "secondary" : "primary"} onClick={toggleStatus}>
            {status === "submitted" ? "Re-open as draft" : "Mark as submitted"}
          </Button>
        </div>
      </div>

      {/* Sticky summary + section tabs */}
      <div className="sticky top-[4.25rem] z-10 space-y-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <span className="text-slate-600">
              Part II:{" "}
              <span className="font-bold text-slate-900">{score.partIIPercent}%</span>
            </span>
            <span className="text-slate-600">
              Part III:{" "}
              <span className="font-bold text-slate-900">{score.partIIIPercent}%</span>
            </span>
            <CategoryBadge category={score.overallCategory} />
          </div>
          <span
            aria-live="polite"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium ring-1 ring-inset",
              saveStyle[saveStatus],
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", saveDot[saveStatus])} aria-hidden />
            {saveLabel[saveStatus]}
          </span>
        </div>
        <nav className="flex flex-wrap gap-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-semibold transition-all",
                active === s.id
                  ? "bg-brand-700 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Active section (re-animates on switch via the key) */}
      <div key={active} className="anim-section">
        {active === "particulars" && <ParticularsSection data={data} update={update} />}
        {active === "programmes" && <ProgrammesSection data={data} update={update} />}
        {active === "partI" && <PartOneSection data={data} update={update} />}
        {active === "partII" && <PartTwoSection data={data} update={update} />}
        {active === "partIII" && <PartThreeSection data={data} update={update} />}
        {active === "recommendations" && <RecommendationsSection data={data} update={update} />}
        {active === "summary" && <SummaryView data={data} />}
      </div>
    </div>
  );
}
