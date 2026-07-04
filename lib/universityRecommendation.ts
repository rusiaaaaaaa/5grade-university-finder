import { getOverallGradeAverage } from "./gradeCalculator";
import {
  ADMISSION_CATEGORY_META,
  clamp,
  distanceToScore,
  estimateNineGradeFromFiveGrade,
  getCategoryLabel,
  roundTo
} from "./scoring";
import { sampleMajors, sampleUniversities } from "./sampleData";
import type {
  AdmissionCategory,
  Department,
  GradeInput,
  MajorArea,
  MajorFitScore,
  RecommendationFilters,
  SortOption,
  University,
  UniversityMatch
} from "./types";

export const defaultFilters: RecommendationFilters = {
  region: "",
  universityType: "",
  admissionType: "",
  majorArea: "",
  departmentNames: [],
  category: "",
  maxReferenceGrade: "",
  csatRequired: "all"
};

export const admissionTypeOptions = ["학생부교과", "학생부종합"] as const;

export const majorAreaOptions: MajorArea[] = ["인문", "자연", "사회", "공학", "교육", "예체능", "교양"];

const UNIVERSITY_BENCHMARK_GRADES = new Map<string, number>([
  ["seoul-national", 1.0],
  ["yonsei", 1.0],
  ["korea", 1.0],
  ["kaist", 1.0],
  ["postech", 1.0],
  ["unist", 1.1],
  ["dgist", 1.1],
  ["gist", 1.1],
  ["sogang", 1.1],
  ["sungkyunkwan", 1.1],
  ["hanyang", 1.1],
  ["chungang", 1.2],
  ["kyunghee", 1.2],
  ["hufs", 1.2],
  ["uos", 1.2],
  ["ewha", 1.2],
  ["konkuk", 1.3],
  ["dongguk", 1.3],
  ["hongik", 1.3],
  ["sookmyung", 1.3],
  ["kookmin", 1.4],
  ["soongsil", 1.4],
  ["ajou", 1.4],
  ["sejong", 1.4],
  ["inha", 1.4],
  ["seoultech", 1.4]
]);

export function normalizeAdmissionType(type: string): string {
  return type.includes("교과") || type.includes("지역") ? "학생부교과" : "학생부종합";
}

export function getDepartmentArea(department: Pick<Department, "field" | "majorId" | "name">): MajorArea {
  const major = sampleMajors.find((item) => item.id === department.majorId);
  const text = `${department.name} ${department.field} ${major?.name ?? ""} ${major?.field ?? ""}`;

  if (/디자인|예술|체육|스포츠|미술|음악|무용|연극|영화|공연|패션/.test(text)) {
    return "예체능";
  }

  if (/자유전공|무학과|단일계열|기초학부|융복합|교양|인문사회 교양|글로벌인재학부|언더우드/.test(text)) {
    return "교양";
  }

  if (/교육|사범|교직|유아교육|초등교육|특수교육|교육학|교육공학|국어교육|영어교육|수학교육|과학교육|사회교육|역사교육|지리교육|윤리교육|한문교육|일반사회교육/.test(text)) {
    return "교육";
  }

  if (/공학|컴퓨터|소프트웨어|인공지능|AI|데이터|전자|전기|기계|화공|신소재|건축|도시|토목|반도체|로봇|자동차|항공|에너지|산업공학|정보통신|보안|시스템|IT|메카트로닉스/.test(text)) {
    return "공학";
  }

  if (/의예|의학|치의|한의|약학|간호|수의|보건|물리|화학|생명|생물|수학|통계|지구|환경|해양|식품|농생명|자연과학|과학|천문|대기|원예|산림|동물/.test(text)) {
    return "자연";
  }

  if (/경영|경제|행정|정치|외교|사회|심리|미디어|언론|법학|무역|통상|국제|금융|회계|세무|관광|호텔|복지|부동산|정책|물류|소비자|아동|문헌정보/.test(text)) {
    return "사회";
  }

  return "인문";
}

export function classifyAdmissionChance(
  userGrade: number,
  referenceGradeRange: Department["referenceGradeRange"]
): AdmissionCategory {
  if (!userGrade) {
    return "reach";
  }

  const targetGrade = (referenceGradeRange.min + referenceGradeRange.max) / 2;
  const gap = userGrade - targetGrade;

  if (gap <= -0.16) {
    return "veryStable";
  }

  if (gap <= -0.06) {
    return "stable";
  }

  if (gap <= 0.06) {
    return "appropriate";
  }

  if (gap <= 0.18) {
    return "ambitious";
  }

  return "reach";
}

function isUltraSelectiveMedicalDepartment(department: Pick<Department, "field" | "majorId" | "name">): boolean {
  const text = `${department.name} ${department.field} ${department.majorId}`;
  return /의예|의학|치의예|치의학|한의예|한의학|수의예|수의학|medicine|korean-medicine|veterinary-medicine/.test(text);
}

function isPharmacyDepartment(department: Pick<Department, "field" | "majorId" | "name">): boolean {
  const text = `${department.name} ${department.field} ${department.majorId}`;
  return /약학|pharmacy/.test(text);
}

function getMoreConservativeCategory(category: AdmissionCategory, cap: AdmissionCategory | null): AdmissionCategory {
  if (!cap) {
    return category;
  }

  return ADMISSION_CATEGORY_META[category].rank <= ADMISSION_CATEGORY_META[cap].rank ? category : cap;
}

function getUniversityBenchmarkGrade(universityId?: string): number | null {
  return universityId ? UNIVERSITY_BENCHMARK_GRADES.get(universityId) ?? null : null;
}

function classifyBenchmarkAdmissionChance(userGrade: number, benchmarkGrade: number): AdmissionCategory {
  const gap = userGrade - benchmarkGrade;

  if (gap <= -0.08) {
    return "veryStable";
  }

  if (gap <= -0.03) {
    return "stable";
  }

  if (gap <= 0.03) {
    return "appropriate";
  }

  if (gap <= 0.15) {
    return "ambitious";
  }

  return "reach";
}

function getUniversitySelectivityCap(userGrade: number, universityId?: string): AdmissionCategory | null {
  const benchmarkGrade = getUniversityBenchmarkGrade(universityId);
  return benchmarkGrade ? classifyBenchmarkAdmissionChance(userGrade, benchmarkGrade) : null;
}

export function classifyDepartmentAdmissionChance(
  userGrade: number,
  department: Department,
  university?: Pick<University, "id">
): AdmissionCategory {
  if (!userGrade) {
    return "reach";
  }

  let category: AdmissionCategory;

  if (isUltraSelectiveMedicalDepartment(department)) {
    if (userGrade <= 1.12) {
      category = "veryStable";
    } else if (userGrade <= 1.2) {
      category = "stable";
    } else if (userGrade <= 1.3) {
      category = "appropriate";
    } else if (userGrade <= 1.4) {
      category = "ambitious";
    } else {
      category = "reach";
    }
    return getMoreConservativeCategory(category, getUniversitySelectivityCap(userGrade, university?.id));
  }

  if (isPharmacyDepartment(department)) {
    if (userGrade <= 1.18) {
      category = "veryStable";
    } else if (userGrade <= 1.28) {
      category = "stable";
    } else if (userGrade <= 1.4) {
      category = "appropriate";
    } else if (userGrade <= 1.55) {
      category = "ambitious";
    } else {
      category = "reach";
    }
    return getMoreConservativeCategory(category, getUniversitySelectivityCap(userGrade, university?.id));
  }

  category = classifyAdmissionChance(userGrade, department.referenceGradeRange);
  return getMoreConservativeCategory(category, getUniversitySelectivityCap(userGrade, university?.id));
}

function categoryBaseScore(category: AdmissionCategory): number {
  return {
    veryStable: 94,
    stable: 86,
    appropriate: 74,
    ambitious: 55,
    reach: 28
  }[category];
}

function getMajorFit(majorFitScores: MajorFitScore[] | undefined, department: Department): number | null {
  return majorFitScores?.find((score) => score.major.id === department.majorId)?.finalScore ?? null;
}

function calculateGradeGap(userGrade: number, department: Department): number {
  if (userGrade <= department.referenceGradeRange.max) {
    return roundTo(userGrade - department.referenceGradeRange.min, 2);
  }

  return roundTo(userGrade - department.referenceGradeRange.max, 2);
}

function createExplanation(
  userGrade: number,
  department: Department,
  category: AdmissionCategory,
  majorFitScore: number | null
): string {
  const label = getCategoryLabel(category);
  const range = department.referenceGradeRange.label;
  const estimatedNineGrade = estimateNineGradeFromFiveGrade(userGrade);
  const majorFitText =
    majorFitScore === null
      ? "과목별 성적을 입력하지 않아 학과 적합도는 제외했습니다."
      : `학과 적합도 ${majorFitScore.toFixed(1)}점과 전형, 지역 조건을 함께 반영했습니다.`;
  const selectiveText = isUltraSelectiveMedicalDepartment(department)
    ? " 의예·치의예·한의예·수의예 계열은 일반 학과보다 훨씬 보수적인 별도 기준을 적용했습니다."
    : isPharmacyDepartment(department)
      ? " 약학 계열은 일반 자연계 학과보다 보수적인 별도 기준을 적용했습니다."
      : "";

  return `현재 평균 ${userGrade.toFixed(2)}등급은 9등급제 환산 약 ${estimatedNineGrade.toFixed(2)}등급으로 보고, 기준 범위 ${range}와 비교해 ${label} 범위로 분류했습니다.${selectiveText} ${majorFitText}`;
}

export function calculateUniversityMatch(
  university: University,
  department: Department,
  input: GradeInput,
  majorFitScores?: MajorFitScore[]
): UniversityMatch {
  const userGrade = getOverallGradeAverage(input) || 3.3;
  const category = classifyDepartmentAdmissionChance(userGrade, department, university);
  const majorFitScore = getMajorFit(majorFitScores, department);
  const midPoint = (department.referenceGradeRange.min + department.referenceGradeRange.max) / 2;
  const benchmarkGrade = getUniversityBenchmarkGrade(university.id);
  const gradeReferencePoint = benchmarkGrade ?? midPoint;
  const gradeProximityScore = distanceToScore(userGrade - gradeReferencePoint, benchmarkGrade ? 0.42 : 0.5);
  const selectivityPenalty = isUltraSelectiveMedicalDepartment(department)
    ? userGrade > 1.4
      ? 18
      : userGrade > 1.3
        ? 10
        : 0
    : isPharmacyDepartment(department) && userGrade > 1.55
      ? 10
      : 0;
  const benchmarkPenalty = benchmarkGrade
    ? clamp((userGrade - benchmarkGrade - 0.15) * 90, 0, 24)
    : 0;
  const score = roundTo(
    clamp(
      categoryBaseScore(category) * 0.62 +
        gradeProximityScore * 0.28 +
        (majorFitScore ?? 60) * 0.1 -
        selectivityPenalty -
        benchmarkPenalty,
      0,
      100
    )
  );

  return {
    university,
    department: {
      ...department,
      admissionType: normalizeAdmissionType(department.admissionType)
    },
    category,
    score,
    userGrade,
    gradeGap: calculateGradeGap(userGrade, department),
    majorFitScore,
    explanation: createExplanation(userGrade, department, category, majorFitScore),
    cautionNotes: [
      department.cautionNotes,
      ADMISSION_CATEGORY_META[category].description
    ],
    tags: Array.from(new Set([university.region, normalizeAdmissionType(department.admissionType), ...department.tags]))
  };
}

function matchesFilters(match: UniversityMatch, filters: RecommendationFilters): boolean {
  if (filters.region && match.university.region !== filters.region) {
    return false;
  }
  if (filters.universityType && match.university.type !== filters.universityType) {
    return false;
  }
  if (filters.admissionType && normalizeAdmissionType(match.department.admissionType) !== filters.admissionType) {
    return false;
  }
  if (filters.majorArea && getDepartmentArea(match.department) !== filters.majorArea) {
    return false;
  }
  if (filters.category && match.category !== filters.category) {
    return false;
  }
  if (filters.maxReferenceGrade && match.department.referenceGradeRange.max > Number(filters.maxReferenceGrade)) {
    return false;
  }
  if (filters.csatRequired === "required" && match.department.minimumCsatRequirement.includes("없음")) {
    return false;
  }
  if (filters.csatRequired === "none" && !match.department.minimumCsatRequirement.includes("없음")) {
    return false;
  }
  return true;
}

function sortMatches(matches: UniversityMatch[], sort: SortOption): UniversityMatch[] {
  const categoryRank = (category: AdmissionCategory) => ADMISSION_CATEGORY_META[category].rank;

  return [...matches].sort((a, b) => {
    if (sort === "majorFit") {
      return (b.majorFitScore ?? 0) - (a.majorFitScore ?? 0);
    }
    if (sort === "safest") {
      return categoryRank(b.category) - categoryRank(a.category) || b.score - a.score;
    }
    if (sort === "ambitious") {
      return categoryRank(a.category) - categoryRank(b.category) || b.score - a.score;
    }
    if (sort === "region") {
      return a.university.region.localeCompare(b.university.region, "ko") || b.score - a.score;
    }
    if (sort === "competition") {
      return a.department.competitionRate - b.department.competitionRate;
    }

    return Math.abs(a.gradeGap) - Math.abs(b.gradeGap) || b.score - a.score;
  });
}

function pickRepresentativeUniversityMatch(current: UniversityMatch, candidate: UniversityMatch): UniversityMatch {
  if (candidate.score !== current.score) {
    return candidate.score > current.score ? candidate : current;
  }

  const candidateMajorFit = candidate.majorFitScore ?? -1;
  const currentMajorFit = current.majorFitScore ?? -1;
  if (candidateMajorFit !== currentMajorFit) {
    return candidateMajorFit > currentMajorFit ? candidate : current;
  }

  const candidateGap = Math.abs(candidate.gradeGap);
  const currentGap = Math.abs(current.gradeGap);
  if (candidateGap !== currentGap) {
    return candidateGap < currentGap ? candidate : current;
  }

  return candidate.department.competitionRate < current.department.competitionRate ? candidate : current;
}

function dedupeByUniversity(matches: UniversityMatch[]): UniversityMatch[] {
  const representativeByUniversity = new Map<string, UniversityMatch>();

  matches.forEach((match) => {
    const current = representativeByUniversity.get(match.university.id);
    representativeByUniversity.set(
      match.university.id,
      current ? pickRepresentativeUniversityMatch(current, match) : match
    );
  });

  return Array.from(representativeByUniversity.values());
}

export function getUniversityRecommendations({
  input,
  majorFitScores,
  filters = defaultFilters,
  sort = "closest"
}: {
  input: GradeInput;
  majorFitScores?: MajorFitScore[];
  filters?: RecommendationFilters;
  sort?: SortOption;
}): UniversityMatch[] {
  const matches = sampleUniversities.flatMap((university) =>
    university.departments.map((department) =>
      calculateUniversityMatch(university, department, input, majorFitScores)
    )
  );

  const filteredMatches = matches.filter((match) => matchesFilters(match, filters));
  return sortMatches(dedupeByUniversity(filteredMatches), sort);
}

export function getDepartmentOptionsByArea(area: MajorArea | ""): string[] {
  return Array.from(
    new Set(
      sampleUniversities.flatMap((university) =>
        university.departments
          .filter((department) => !area || getDepartmentArea(department) === area)
          .map((department) => department.name)
      )
    )
  ).sort((a, b) => a.localeCompare(b, "ko"));
}

export function getMajorByDepartment(department: Department) {
  return sampleMajors.find((major) => major.id === department.majorId);
}
