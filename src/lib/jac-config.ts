// Static configuration mirroring the GGSIPU JAC report (Existing Institutes,
// Technical & Non-Technical, Session 2026-27). Sub-criteria keys/labels/max
// marks live here so the form UI and scoring engine stay data-driven.

import type { InspectionData } from "./types.js";

export interface SubCriterion {
  key: string;
  label: string;
  max: number;
}

/** Teacher-Student ratio marking cases (Guidelines, Part Two). */
export interface TSCase {
  id: number;
  label: string;
  requiredRatio: number; // denominator of required TS ratio (1:requiredRatio)
  worstRatio: number; // worst acceptable denominator
  slope: number; // marks per unit improvement
  examples: string;
}

export const TS_CASES: TSCase[] = [
  {
    id: 1,
    label: "Case 1 — Required 1:20, worst 1:25",
    requiredRatio: 20,
    worstRatio: 25,
    slope: 10,
    examples: "BBA, BCA, BA(Eco/Eng), B.Sc-Yoga, B.Com, BJMC, B.Tech, BHMCT, MCA, MBA",
  },
  {
    id: 2,
    label: "Case 2 — Required 1:16, worst 1:20",
    requiredRatio: 16,
    worstRatio: 20,
    slope: 12.5,
    examples: "B.Arch, B.Plan",
  },
  {
    id: 3,
    label: "Case 3 — Required 1:15, worst 1:20",
    requiredRatio: 15,
    worstRatio: 20,
    slope: 10,
    examples: "MA-Criminology, M.Sc-Forensic Science, MAHM, MCPHM",
  },
  {
    id: 4,
    label: "Case 4 — Required 1:12, worst 1:15",
    requiredRatio: 12,
    worstRatio: 15,
    slope: 16.67,
    examples: "M.Tech, MHMCT",
  },
  {
    id: 5,
    label: "Case 5 — Required 1:20, worst 1:40 (Law)",
    requiredRatio: 20,
    worstRatio: 40,
    slope: 2.5,
    examples: "LLB, LLM and other Law programmes",
  },
];

export function getTSCase(id: number): TSCase {
  return TS_CASES.find((c) => c.id === id) ?? TS_CASES[0];
}

// ---- Part II sub-criteria ----

export const COMPUTER_CENTRE: SubCriterion[] = [
  { key: "terminals", label: "Number & configuration of terminals", max: 25 },
  { key: "software", label: "Availability of licensed software", max: 25 },
  { key: "internet", label: "Internet connectivity", max: 25 },
  { key: "peripherals", label: "Peripherals (printers, scanners, server)", max: 25 },
];

export const LIBRARY: SubCriterion[] = [
  { key: "titlesVolumes", label: "Total titles / volumes (existing + new)", max: 60 },
  { key: "journals", label: "Journals (national / international)", max: 60 },
  { key: "magazines", label: "Magazines / newspapers", max: 30 },
  { key: "computerization", label: "Computerization / online subscription", max: 25 },
  { key: "readingRoom", label: "Reading room & reprographic facilities", max: 25 },
  { key: "eBooks", label: "Subscription of e-books", max: 50 },
];

export const LABS: SubCriterion[] = [
  { key: "equipment", label: "Availability of equipment / instruments / work stations", max: 50 },
  { key: "staff", label: "Technical lab / workshop staff", max: 30 },
  { key: "size", label: "Size of lab as per statutory norms", max: 20 },
];

export const PRACTICAL_TRAINING: SubCriterion[] = [
  { key: "summerTraining", label: "Summer training / project reports / presentations", max: 50 },
  { key: "groupDiscussions", label: "Group discussions / mock interviews / case studies / programming", max: 25 },
  { key: "participation", label: "Participation in workshops, seminars & conferences", max: 25 },
];

export const LLB: SubCriterion[] = [
  { key: "mootCourt", label: "Moot court, pre-trial preparation, trial proceedings", max: 40 },
  { key: "publicInterest", label: "Public interest lawyering / case studies / Lok Adalats", max: 20 },
  { key: "drafting", label: "Drafting, pleading, conveyancing & court visits", max: 20 },
  { key: "participation", label: "Participation in workshops, seminars & conferences", max: 20 },
];

export const ANCILLARY: SubCriterion[] = [
  { key: "medical", label: "Medical / First-Aid facility with medical room & doctors", max: 20 },
  { key: "sports", label: "Sports & games (indoor / outdoor)", max: 20 },
  { key: "computerInternet", label: "Computer & internet facility for faculty / students / staff", max: 30 },
  { key: "diffAbledLift", label: "Differently-abled: Lift", max: 4 },
  { key: "diffAbledRamp", label: "Differently-abled: Ramp", max: 4 },
  { key: "diffAbledToilet", label: "Differently-abled: Toilet", max: 4 },
  { key: "diffAbledRailing", label: "Differently-abled: Railing", max: 4 },
  { key: "diffAbledTactile", label: "Differently-abled: Tactile pathways", max: 4 },
  { key: "commonRooms", label: "Separate common rooms for boys & girls with wash rooms", max: 20 },
  { key: "canteen", label: "Students canteen", max: 20 },
  { key: "powerBackup", label: "Availability of power backup", max: 10 },
  { key: "potableWater", label: "Potable water & water coolers", max: 10 },
  { key: "facultyCubicles", label: "Faculty cubicles", max: 15 },
  { key: "solarEnergy", label: "Solar energy utilization", max: 10 },
  { key: "environment", label: "Environmental upgradation (tree plantation, greenery)", max: 10 },
  { key: "buildingMaintenance", label: "Building maintenance", max: 20 },
  { key: "cleanliness", label: "General cleanliness & hygiene", max: 15 },
  { key: "rainWaterHarvesting", label: "Rain water harvesting", max: 10 },
  { key: "recordMaintenance", label: "Record maintenance", max: 10 },
  { key: "signages", label: "Display of boards & signages", max: 10 },
];

export const GRIEVANCE: SubCriterion[] = [
  { key: "sgrcAvailability", label: "Availability of Students' Grievance Redressal Committee (SGRC)", max: 10 },
  { key: "electedRep", label: "Elected student representative & UGC-compliant composition", max: 15 },
  { key: "documentation", label: "Verifiable documentation of SGRC proceedings", max: 15 },
  { key: "counsellor", label: "Availability of psychiatrist, psychologist & counsellor", max: 15 },
  { key: "published", label: "SGRC details published on website & prospectus", max: 15 },
  { key: "satisfaction", label: "Student satisfaction with SGRC effectiveness", max: 10 },
  { key: "reports", label: "Reports sent to University every semester", max: 10 },
  { key: "directions", label: "University directions on grievance redressal complied", max: 10 },
];

export const NAAC_GRADES: { grade: string; marks: number }[] = [
  { grade: "A++", marks: 20 },
  { grade: "A+", marks: 16 },
  { grade: "A", marks: 14 },
  { grade: "B++", marks: 10 },
  { grade: "B+", marks: 8 },
  { grade: "B", marks: 6 },
  { grade: "C", marks: 4 },
  { grade: "D", marks: 0 },
];

export function naacMarksForGrade(grade: string): number {
  return NAAC_GRADES.find((g) => g.grade === grade)?.marks ?? 0;
}

/** Fixed maximum marks for each Part II parameter. */
export const PART_II_MAX = {
  directorPrincipal: 100,
  teacherStudentRatio: 100,
  facultyCadreRatio: 100,
  computerCentre: 100,
  library: 250,
  labs: 100,
  practicalTraining: 100,
  llb: 100,
  ancillary: 250,
  grievance: 100,
  // NAAC (20) + NBA (20 if technical)
  accreditationTechnical: 40,
  accreditationNonTechnical: 20,
} as const;

export const CATEGORY_BENCHMARKS = [
  { category: "A", label: "Category 'A' — 75% marks or more" },
  { category: "B", label: "Category 'B' — 65% or more but less than 75%" },
  { category: "C", label: "Category 'C' — 50% or more but less than 65%" },
  { category: "D", label: "Category 'D' — less than 50% (No Admission)" },
];

function emptyMarks(criteria: SubCriterion[]): Record<string, number> {
  return Object.fromEntries(criteria.map((c) => [c.key, 0]));
}

/** Build a fresh, fully-initialised inspection payload. */
export function createEmptyInspectionData(prefill?: Partial<InspectionData>): InspectionData {
  const data: InspectionData = {
    committee: [
      { role: "Chairperson", name: "" },
      { role: "Expert 1", name: "" },
      { role: "Expert 2", name: "" },
      { role: "Expert 3", name: "" },
      { role: "Expert 4", name: "" },
      { role: "Expert 5", name: "" },
      { role: "Convenor", name: "" },
    ],
    particulars: {
      dateTimeOfVisit: "",
      instituteName: "",
      instituteAddress: "",
      district: "",
      telephone: "",
      website: "",
      email: "",
      societyName: "",
      societyAddress: "",
      societyTelephone: "",
      societyEmail: "",
      chairpersonName: "",
      chairpersonAddress: "",
      chairpersonTelephone: "",
      chairpersonEmail: "",
      directorName: "",
      directorAddress: "",
      directorTelephone: "",
      directorEmail: "",
    },
    programmes: [],
    partI: {
      landBuildingOwned: "",
      rentedConforming: "",
      landAsPerNorms: "",
      landUseCertificate: "",
      landNonConforming: "",
      sanctionedBuildingPlan: "",
      sanctioningAuthority: "",
      occupancyCertificate: "",
      spaceAsPerNorms: "",
      structuralSafetyCert: "",
      earthquakeResistant: "",
      fireFightingDevices: "",
      fireSafetyCert: "",
      fireSafetyValidUpto: "",
      basementApproved: "",
      basementOtherThanApproved: "",
      nocFromStateDept: "",
      remarks: "",
    },
    partII: {
      directorPrincipal: { compliant: "", marks: 0, remarks: "" },
      ratioRemarks: "",
      computerCentre: { marks: emptyMarks(COMPUTER_CENTRE), remarks: "" },
      library: { marks: emptyMarks(LIBRARY), remarks: "" },
      labs: { applicable: true, marks: emptyMarks(LABS), remarks: "" },
      practicalTraining: { applicable: true, marks: emptyMarks(PRACTICAL_TRAINING), remarks: "" },
      llb: { applicable: false, marks: emptyMarks(LLB), remarks: "" },
      ancillary: { marks: emptyMarks(ANCILLARY), remarks: "" },
      grievance: { marks: emptyMarks(GRIEVANCE), remarks: "" },
      accreditation: {
        naacApplicable: true,
        naacGrade: "",
        nbaApplicable: false,
        nbaAccredited: false,
        remarks: "",
      },
    },
    partIII: { academicAudit: 0, jacNocConditions: 0, reasons: "" },
    recommendations: {
      programmes: [],
      totalPlotArea: "",
      coveredAreaRequired: "",
      availableCoveredArea: "",
      farAchieved: "",
      categoryRecommended: "",
      provisionalAffiliation: "",
    },
    remarks: "",
  };
  return { ...data, ...prefill };
}
