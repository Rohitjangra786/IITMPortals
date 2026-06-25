// Pure scoring engine for the JAC report. No I/O — given an InspectionData it
// returns a fully-computed ScoreSummary. All formulas follow the GGSIPU
// guidelines (Part One: Faculty Cadre Ratio, Part Two: Teacher-Student Ratio).

import {
  ANCILLARY,
  COMPUTER_CENTRE,
  GRIEVANCE,
  LABS,
  LIBRARY,
  LLB,
  PART_II_MAX,
  PRACTICAL_TRAINING,
  getTSCase,
  naacMarksForGrade,
} from "./jac-config";
import type { SubCriterion } from "./jac-config";
import type {
  Category,
  InspectionData,
  ParameterScore,
  Programme,
  ProgrammeScore,
  ScoreSummary,
} from "./types";

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Number.isFinite(n) ? n : 0));

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Teacher-Student ratio marks for one programme.
 * t = students per teacher (A/C). Marks = 50 + slope*(worst - t), capped at 100.
 * The moment (worst - t) is negative, marks are zero.
 */
export function teacherStudentMarks(p: Programme): {
  t: number;
  marks: number;
  required: number;
} {
  const tsCase = getTSCase(p.tsCaseId);
  const required = Math.ceil((p.intake || 0) / tsCase.requiredRatio); // B
  if (!p.teachersAvailable || p.teachersAvailable <= 0 || !p.intake) {
    return { t: Infinity, marks: 0, required };
  }
  const t = p.intake / p.teachersAvailable;
  const gap = tsCase.worstRatio - t;
  if (gap < 0) return { t, marks: 0, required };
  return { t, marks: clamp(50 + tsCase.slope * gap, 0, 100), required };
}

/**
 * Faculty Cadre Ratio marks for one programme.
 * K = (S*N*D)/requiredRatio. SF = Professors + Associate Professors in position.
 * CRF f = (K - SF)/SF, treated as at least 2. Marks = 50 + 10*(7 - f), cap 100;
 * once (7 - f) is negative, marks are zero.
 */
export function facultyCadreMarks(p: Programme): {
  k: number;
  seniorRequired: number;
  juniorRequired: number;
  crf: number;
  marks: number;
} {
  const tsCase = getTSCase(p.tsCaseId);
  const k =
    tsCase.requiredRatio > 0
      ? (p.studentsPerDivision * p.divisions * p.duration) / tsCase.requiredRatio
      : 0;
  const seniorRequired = Math.ceil(k / 3); // 1 part senior, rounded up
  const juniorRequired = Math.floor((2 * k) / 3); // 2 parts junior, decimals ignored
  const sf = (p.professors || 0) + (p.associateProfessors || 0);

  if (sf <= 0 || k <= 0) {
    return { k: round2(k), seniorRequired, juniorRequired, crf: Infinity, marks: 0 };
  }
  let f = (k - sf) / sf;
  if (f < 2) f = 2; // guideline floor
  const gap = 7 - f;
  const marks = gap < 0 ? 0 : clamp(50 + 10 * gap, 0, 100);
  return { k: round2(k), seniorRequired, juniorRequired, crf: round2(f), marks: round2(marks) };
}

function ratioLabel(t: number): string {
  if (!Number.isFinite(t)) return "—";
  return `1:${round2(t)}`;
}

export function scoreProgramme(p: Programme): ProgrammeScore {
  const ts = teacherStudentMarks(p);
  const fcr = facultyCadreMarks(p);
  return {
    id: p.id,
    name: p.name,
    teachersRequired: ts.required,
    tsRatioValue: Number.isFinite(ts.t) ? round2(ts.t) : 0,
    tsRatioLabel: ratioLabel(ts.t),
    tsMarks: round2(ts.marks),
    kRequired: fcr.k,
    seniorRequired: fcr.seniorRequired,
    juniorRequired: fcr.juniorRequired,
    crf: Number.isFinite(fcr.crf) ? fcr.crf : 0,
    fcrMarks: fcr.marks,
  };
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return round2(nums.reduce((a, b) => a + b, 0) / nums.length);
}

/** Sum a marks-map, clamping each entry to its configured maximum. */
function sumMarks(map: Record<string, number>, criteria: SubCriterion[]): number {
  return criteria.reduce((total, c) => total + clamp(map?.[c.key] ?? 0, 0, c.max), 0);
}

export function categoryFromPercent(p: number): Category {
  if (p >= 75) return "A";
  if (p >= 65) return "B";
  if (p >= 50) return "C";
  return "D";
}

const CATEGORY_RANK: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, "": 4 };

/** The worse (lower) of two categories. */
export function worseCategory(a: Category, b: Category): Category {
  return CATEGORY_RANK[a] >= CATEGORY_RANK[b] ? a : b;
}

export function scoreInspection(data: InspectionData): ScoreSummary {
  const programmeScores = (data.programmes ?? []).map(scoreProgramme);
  const tsRatioMarks = average(programmeScores.map((s) => s.tsMarks));
  const fcrMarks = average(programmeScores.map((s) => s.fcrMarks));

  const pII = data.partII;
  const acc = pII.accreditation;
  const naacMarks = acc.naacApplicable ? naacMarksForGrade(acc.naacGrade) : 0;
  const nbaMarks = acc.nbaApplicable && acc.nbaAccredited ? 20 : 0;
  const accreditationMax = acc.nbaApplicable
    ? PART_II_MAX.accreditationTechnical
    : PART_II_MAX.accreditationNonTechnical;

  const partII: ParameterScore[] = [
    {
      key: "directorPrincipal",
      label: "II-A · Status of Director / Principal",
      max: PART_II_MAX.directorPrincipal,
      awarded: clamp(pII.directorPrincipal.marks, 0, PART_II_MAX.directorPrincipal),
      applicable: true,
    },
    {
      key: "teacherStudentRatio",
      label: "II-B(i) · Teacher-Student Ratio",
      max: PART_II_MAX.teacherStudentRatio,
      awarded: tsRatioMarks,
      applicable: programmeScores.length > 0,
    },
    {
      key: "facultyCadreRatio",
      label: "II-B(ii) · Faculty Cadre Ratio",
      max: PART_II_MAX.facultyCadreRatio,
      awarded: fcrMarks,
      applicable: programmeScores.length > 0,
    },
    {
      key: "computerCentre",
      label: "II-C · Computer Centre",
      max: PART_II_MAX.computerCentre,
      awarded: sumMarks(pII.computerCentre.marks, COMPUTER_CENTRE),
      applicable: true,
    },
    {
      key: "library",
      label: "II-D · Status of Library",
      max: PART_II_MAX.library,
      awarded: sumMarks(pII.library.marks, LIBRARY),
      applicable: true,
    },
    {
      key: "labs",
      label: "II-E(i) · Labs / Workshops",
      max: PART_II_MAX.labs,
      awarded: sumMarks(pII.labs.marks, LABS),
      applicable: pII.labs.applicable,
    },
    {
      key: "practicalTraining",
      label: "II-E(ii) · Practical Training",
      max: PART_II_MAX.practicalTraining,
      awarded: sumMarks(pII.practicalTraining.marks, PRACTICAL_TRAINING),
      applicable: pII.practicalTraining.applicable,
    },
    {
      key: "llb",
      label: "II-E(iii) · 5-yr Integrated LLB",
      max: PART_II_MAX.llb,
      awarded: sumMarks(pII.llb.marks, LLB),
      applicable: pII.llb.applicable,
    },
    {
      key: "ancillary",
      label: "II-F · Ancillary & Other Facilities",
      max: PART_II_MAX.ancillary,
      awarded: sumMarks(pII.ancillary.marks, ANCILLARY),
      applicable: true,
    },
    {
      key: "grievance",
      label: "II-G · Students' Grievance Redressal",
      max: PART_II_MAX.grievance,
      awarded: sumMarks(pII.grievance.marks, GRIEVANCE),
      applicable: true,
    },
    {
      key: "accreditation",
      label: "II-H · NAAC / NBA Accreditation",
      max: accreditationMax,
      awarded: clamp(naacMarks + nbaMarks, 0, accreditationMax),
      applicable: true,
    },
  ];

  const applicable = partII.filter((p) => p.applicable);
  const partIIMax = applicable.reduce((t, p) => t + p.max, 0);
  const partIIAwarded = round2(applicable.reduce((t, p) => t + p.awarded, 0));
  const partIIPercent = partIIMax > 0 ? round2((partIIAwarded * 100) / partIIMax) : 0;

  const partIIIMax = 200;
  const partIIIAwarded = round2(
    clamp(data.partIII.academicAudit, 0, 100) + clamp(data.partIII.jacNocConditions, 0, 100),
  );
  const partIIIPercent = round2((partIIIAwarded * 100) / partIIIMax);

  const partIICategory = categoryFromPercent(partIIPercent);
  const partIIICategory = categoryFromPercent(partIIIPercent);

  return {
    programmeScores,
    tsRatioMarks,
    fcrMarks,
    partII,
    partIIMax,
    partIIAwarded,
    partIIPercent,
    partIICategory,
    partIIIMax,
    partIIIAwarded,
    partIIIPercent,
    partIIICategory,
    overallCategory: worseCategory(partIICategory, partIIICategory),
  };
}
