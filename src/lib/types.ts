// Shared TypeScript types describing the full JAC inspection report payload.
// The whole `InspectionData` object is serialised to JSON and stored in
// Inspection.data. Keep this in sync with lib/jac-config.ts and lib/scoring.ts.

export type YesNo = "Yes" | "No" | "";

/** A programme offered by the institute — drives Teacher-Student & Cadre ratio. */
export interface Programme {
  id: string;
  name: string;
  /** Which Teacher-Student ratio case applies (see TS_CASES in jac-config). */
  tsCaseId: number;
  /** Duration of the programme in years (D). */
  duration: number;
  /** Total sanctioned student intake up to session (A). */
  intake: number;
  /** Number of students admitted last year (informational). */
  admitted: number;
  /** Students per division (S) — for Faculty Cadre Ratio. */
  studentsPerDivision: number;
  /** Number of divisions approved (N). */
  divisions: number;
  /** Total teachers available for this programme (C). */
  teachersAvailable: number;
  /** Teachers in position by cadre. */
  professors: number;
  associateProfessors: number;
  assistantProfessors: number;
}

export interface CommitteeMember {
  role: string;
  name: string;
}

export interface Particulars {
  dateTimeOfVisit: string;
  instituteName: string;
  instituteAddress: string;
  district: string;
  telephone: string;
  website: string;
  email: string;
  societyName: string;
  societyAddress: string;
  societyTelephone: string;
  societyEmail: string;
  chairpersonName: string;
  chairpersonAddress: string;
  chairpersonTelephone: string;
  chairpersonEmail: string;
  directorName: string;
  directorAddress: string;
  directorTelephone: string;
  directorEmail: string;
}

export interface PartI {
  landBuildingOwned: YesNo;
  rentedConforming: YesNo;
  landAsPerNorms: YesNo;
  landUseCertificate: YesNo;
  landNonConforming: YesNo;
  sanctionedBuildingPlan: YesNo;
  sanctioningAuthority: string;
  occupancyCertificate: YesNo;
  spaceAsPerNorms: YesNo;
  structuralSafetyCert: YesNo;
  earthquakeResistant: YesNo;
  fireFightingDevices: YesNo;
  fireSafetyCert: YesNo;
  fireSafetyValidUpto: string;
  basementApproved: YesNo;
  basementOtherThanApproved: YesNo;
  nocFromStateDept: YesNo;
  remarks: string;
}

/** Generic map of sub-criterion key -> marks awarded. */
export type MarksMap = Record<string, number>;

export interface PartII {
  directorPrincipal: { compliant: YesNo; marks: number; remarks: string };
  ratioRemarks: string; // shared remarks for IIB
  computerCentre: { marks: MarksMap; remarks: string };
  library: { marks: MarksMap; remarks: string };
  labs: { applicable: boolean; marks: MarksMap; remarks: string };
  practicalTraining: { applicable: boolean; marks: MarksMap; remarks: string };
  llb: { applicable: boolean; marks: MarksMap; remarks: string };
  ancillary: { marks: MarksMap; remarks: string };
  grievance: { marks: MarksMap; remarks: string };
  accreditation: {
    naacApplicable: boolean;
    naacGrade: string; // A++ | A+ | A | B++ | B+ | B | C | D | ""
    nbaApplicable: boolean; // true for AICTE-approved technical courses
    nbaAccredited: boolean;
    remarks: string;
  };
}

export interface PartIII {
  academicAudit: number; // out of 100
  jacNocConditions: number; // out of 100
  reasons: string;
}

export interface ProgrammeRecommendation {
  id: string;
  name: string;
  recommended: YesNo;
  intakeRecommended: string;
  spaceFactor: string;
  spaceRequired: string;
  reasonIfNot: string;
}

export interface Recommendations {
  programmes: ProgrammeRecommendation[];
  totalPlotArea: string;
  coveredAreaRequired: string;
  availableCoveredArea: string;
  farAchieved: string;
  categoryRecommended: string;
  provisionalAffiliation: "Placed" | "Not Placed" | "";
}

export interface InspectionData {
  committee: CommitteeMember[];
  particulars: Particulars;
  programmes: Programme[];
  partI: PartI;
  partII: PartII;
  partIII: PartIII;
  recommendations: Recommendations;
  remarks: string;
}

/** Result of scoring an inspection (computed, never stored verbatim). */
export interface ProgrammeScore {
  id: string;
  name: string;
  teachersRequired: number; // B
  tsRatioValue: number; // t = students per teacher
  tsRatioLabel: string; // "1:20"
  tsMarks: number;
  kRequired: number; // K
  seniorRequired: number;
  juniorRequired: number;
  crf: number; // f
  fcrMarks: number;
}

export interface ParameterScore {
  key: string;
  label: string;
  max: number;
  awarded: number;
  applicable: boolean;
}

export interface ScoreSummary {
  programmeScores: ProgrammeScore[];
  tsRatioMarks: number; // IIB(i) average
  fcrMarks: number; // IIB(ii) average
  partII: ParameterScore[];
  partIIMax: number;
  partIIAwarded: number;
  partIIPercent: number;
  partIICategory: Category;
  partIIIMax: number;
  partIIIAwarded: number;
  partIIIPercent: number;
  partIIICategory: Category;
  overallCategory: Category;
}

export type Category = "A" | "B" | "C" | "D" | "";
