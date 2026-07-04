export type UniversityType = "national" | "public" | "private";

export type SubjectCategory =
  | "Korean"
  | "Math"
  | "English"
  | "Science"
  | "Social Studies"
  | "Computer Science"
  | "History"
  | "Second Foreign Language"
  | "Classical Chinese"
  | "Technology & Home Economics"
  | "Elective"
  | "Other";

export type AchievementLevel = "A" | "B" | "C" | "D" | "E" | "";

export type AssessmentType = "relative" | "absolute";

export type GradeInputMode = "semester" | "subject";

export type AdmissionCategory = "veryStable" | "stable" | "appropriate" | "ambitious" | "reach";

export type MajorArea = "인문" | "자연" | "사회" | "공학" | "교육" | "예체능" | "교양";

export type SortOption =
  | "closest"
  | "majorFit"
  | "safest"
  | "ambitious"
  | "region"
  | "competition";

export interface ReferenceGradeRange {
  min: number;
  max: number;
  label: string;
}

export interface SemesterAverage {
  id: string;
  label: string;
  grade: number | "";
}

export interface SubjectGrade {
  id: string;
  semesterId: string;
  semesterLabel: string;
  subjectName: string;
  category: SubjectCategory;
  assessmentType?: AssessmentType;
  grade: number | "";
  achievementLevel: AchievementLevel;
  credit: number | "";
}

export interface GradeInput {
  mode: GradeInputMode;
  semesterAverages: SemesterAverage[];
  subjects: SubjectGrade[];
}

export interface SubjectStrength {
  category: SubjectCategory;
  average: number;
  score: number;
  count: number;
}

export interface Major {
  id: string;
  name: string;
  field: string;
  relatedSubjects: SubjectCategory[];
  keywords: string[];
  activities: string[];
  careers: string[];
  highSchoolSubjects: string[];
  similarMajorIds: string[];
  description: string;
  cautionNotes: string[];
  difficultyLevel: number;
  marketOutlook: number;
  employmentOriented: boolean;
  researchOriented: boolean;
}

export interface Department {
  id: string;
  majorId: string;
  name: string;
  field: string;
  relatedSubjects: SubjectCategory[];
  referenceGradeRange: ReferenceGradeRange;
  admissionType: string;
  minimumCsatRequirement: string;
  competitionRate: number;
  employmentNotes: string;
  description: string;
  cautionNotes: string;
  tags: string[];
  employmentOriented: boolean;
  researchOriented: boolean;
}

export interface University {
  id: string;
  name: string;
  region: string;
  type: UniversityType;
  campus: string;
  admissionTypes: string[];
  departments: Department[];
  websiteUrl: string;
}

export interface MajorFitScore {
  major: Major;
  finalScore: number;
  academicFit: number;
  interestFit: number;
  careerFit: number;
  difficultyFit: number;
  marketFit: number;
  recommendationReason: string;
  cautionNotes: string[];
  alternativeMajors: Major[];
}

export interface UniversityMatch {
  university: University;
  department: Department;
  category: AdmissionCategory;
  score: number;
  userGrade: number;
  gradeGap: number;
  majorFitScore: number | null;
  explanation: string;
  cautionNotes: string[];
  tags: string[];
}

export interface RecommendationFilters {
  region: string;
  universityType: UniversityType | "";
  admissionType: string;
  majorArea: MajorArea | "";
  departmentNames: string[];
  category: AdmissionCategory | "";
  maxReferenceGrade: string;
  csatRequired: "all" | "required" | "none";
}

export interface FutureGradeChange {
  subjectName: string;
  category: SubjectCategory;
  grade: number;
  credit: number;
}

export interface FutureGradeSimulation {
  previousAverage: number;
  newAverage: number;
  averageDelta: number;
  previousRelatedAverage: number;
  newRelatedAverage: number;
  relatedDelta: number;
  updatedInput: GradeInput;
  improvementSubjects: string[];
}
