import type { AdmissionCategory } from "./types";

export const GRADE_SCALE = {
  label: "5등급제",
  best: 1,
  worst: 5,
  scoreFloor: 20
} as const;

export const FIVE_TO_NINE_GRADE_ANCHORS = [
  { fiveGrade: 1.0, nineGrade: 1.0, group: "서울대·연세대·고려대권" },
  { fiveGrade: 1.1, nineGrade: 1.25, group: "서강대·성균관대·한양대권" },
  { fiveGrade: 1.2, nineGrade: 1.5, group: "중앙대·경희대·외대·시립대권" },
  { fiveGrade: 1.3, nineGrade: 1.75, group: "건국대·동국대·홍익대권" },
  { fiveGrade: 1.4, nineGrade: 2.0, group: "국민대·숭실대·세종대·단국대권" },
  { fiveGrade: 1.5, nineGrade: 2.13, group: "지방거점·수도권 주요대 참고권" }
] as const;

export const ADMISSION_CATEGORY_META: Record<
  AdmissionCategory,
  { label: string; tone: string; description: string; rank: number }
> = {
  veryStable: {
    label: "매우 안정",
    tone: "bg-teal-100 text-teal-900 ring-teal-200",
    description: "현재 내신이 기준 범위보다 뚜렷하게 우세합니다.",
    rank: 5
  },
  stable: {
    label: "안정",
    tone: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    description: "현재 내신이 기준 범위보다 우세합니다.",
    rank: 4
  },
  appropriate: {
    label: "적정",
    tone: "bg-sky-100 text-sky-800 ring-sky-200",
    description: "현재 내신이 기준 범위와 매우 가깝습니다.",
    rank: 3
  },
  ambitious: {
    label: "소신",
    tone: "bg-amber-100 text-amber-900 ring-amber-200",
    description: "현재 내신이 기준 범위보다 약간 약합니다.",
    rank: 2
  },
  reach: {
    label: "상향",
    tone: "bg-rose-100 text-rose-800 ring-rose-200",
    description: "현재 내신이 기준 범위보다 의미 있게 약합니다.",
    rank: 1
  }
};

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function roundTo(value: number, digits = 1): number {
  const unit = 10 ** digits;
  return Math.round(value * unit) / unit;
}

export function roundGrade(value: number): number {
  return roundTo(value, 2);
}

export function gradeToScore(grade: number): number {
  const gradeRange = GRADE_SCALE.worst - GRADE_SCALE.best;
  return clamp(
    ((GRADE_SCALE.worst - grade) / gradeRange) * (100 - GRADE_SCALE.scoreFloor) +
      GRADE_SCALE.scoreFloor,
    0,
    100
  );
}

export function distanceToScore(distance: number, maxDistance: number): number {
  return clamp(100 - (Math.abs(distance) / maxDistance) * 100, 0, 100);
}

export function weightedAverage(items: Array<{ value: number; weight: number }>): number {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) {
    return 0;
  }

  return items.reduce((sum, item) => sum + item.value * item.weight, 0) / totalWeight;
}

export function getCategoryLabel(category: AdmissionCategory): string {
  return ADMISSION_CATEGORY_META[category].label;
}

export function estimateNineGradeFromFiveGrade(fiveGrade: number): number {
  const anchors = FIVE_TO_NINE_GRADE_ANCHORS;
  if (fiveGrade <= anchors[0].fiveGrade) {
    return anchors[0].nineGrade;
  }

  for (let index = 1; index < anchors.length; index += 1) {
    const previous = anchors[index - 1];
    const current = anchors[index];
    if (fiveGrade <= current.fiveGrade) {
      const ratio =
        (fiveGrade - previous.fiveGrade) / (current.fiveGrade - previous.fiveGrade);
      return roundTo(previous.nineGrade + (current.nineGrade - previous.nineGrade) * ratio, 2);
    }
  }

  const last = anchors[anchors.length - 1];
  return roundTo(last.nineGrade + (fiveGrade - last.fiveGrade) * 1.2, 2);
}
