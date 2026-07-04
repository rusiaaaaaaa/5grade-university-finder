import {
  calculateRelatedSubjectAverage,
  calculateSubjectStrengthProfile,
  getOverallGradeAverage
} from "./gradeCalculator";
import { clamp, gradeToScore, roundTo } from "./scoring";
import { sampleMajors } from "./sampleData";
import type { GradeInput, Major, MajorFitScore, SubjectCategory } from "./types";

function relatedSubjectFit(major: Major, input: GradeInput): number {
  const strengthProfile = calculateSubjectStrengthProfile(input.subjects);
  const relatedStrengths = strengthProfile.filter((strength) =>
    major.relatedSubjects.includes(strength.category as SubjectCategory)
  );

  if (relatedStrengths.length === 0) {
    return 45;
  }

  const averageStrength =
    relatedStrengths.reduce((sum, strength) => sum + strength.score, 0) / relatedStrengths.length;
  const coverageBonus = Math.min(relatedStrengths.length / Math.max(major.relatedSubjects.length, 1), 1) * 10;

  return clamp(averageStrength + coverageBonus, 0, 100);
}

function careerScore(major: Major): number {
  return clamp(
    major.marketOutlook +
      (major.employmentOriented ? 4 : 0) +
      (major.researchOriented ? 3 : 0) -
      (major.difficultyLevel - 3) * 2,
    15,
    100
  );
}

function difficultyScore(major: Major, input: GradeInput): number {
  const overallGrade = getOverallGradeAverage(input) || 3.2;
  const academicBase = gradeToScore(overallGrade);
  const difficultyPenalty = (major.difficultyLevel - 3) * 8;
  return clamp(academicBase - difficultyPenalty + 10, 15, 100);
}

function buildAlternativeMajors(major: Major): Major[] {
  return major.similarMajorIds
    .map((id) => sampleMajors.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is Major => Boolean(candidate))
    .slice(0, 3);
}

export function calculateMajorFitScore(
  major: Major,
  input: GradeInput
): MajorFitScore {
  const relatedAverage = calculateRelatedSubjectAverage(input.subjects, major.relatedSubjects);
  const strengthProfile = calculateSubjectStrengthProfile(input.subjects);
  const strengthBonus = strengthProfile.some(
    (strength) => major.relatedSubjects.includes(strength.category as SubjectCategory) && strength.score >= 78
  )
    ? 6
    : 0;
  const overallGrade = getOverallGradeAverage(input) || 3.1;
  const academicFit = clamp(gradeToScore(relatedAverage || overallGrade) + strengthBonus, 0, 100);
  const interestFit = relatedSubjectFit(major, input);
  const careerFit = careerScore(major);
  const difficultyFit = difficultyScore(major, input);
  const marketFit = clamp(major.marketOutlook + (major.employmentOriented ? 4 : 0), 0, 100);
  const finalScore = roundTo(
    0.3 * academicFit + 0.25 * interestFit + 0.2 * careerFit + 0.15 * difficultyFit + 0.1 * marketFit
  );
  const score: MajorFitScore = {
    major,
    finalScore,
    academicFit: roundTo(academicFit),
    interestFit: roundTo(interestFit),
    careerFit: roundTo(careerFit),
    difficultyFit: roundTo(difficultyFit),
    marketFit: roundTo(marketFit),
    recommendationReason: "",
    cautionNotes: [],
    alternativeMajors: buildAlternativeMajors(major)
  };

  return {
    ...score,
    recommendationReason: generateRecommendationReason(score, input),
    cautionNotes: generateCautionNotes(score)
  };
}

export function generateRecommendationReason(
  score: MajorFitScore,
  input: GradeInput
): string {
  const relatedAverage = calculateRelatedSubjectAverage(input.subjects, score.major.relatedSubjects);
  const subjectText =
    relatedAverage > 0
      ? `관련 과목 평균 ${relatedAverage.toFixed(2)}등급`
      : `전체 평균 ${getOverallGradeAverage(input).toFixed(2)}등급`;
  const importantSubjects = score.major.highSchoolSubjects.slice(0, 3).join(", ");

  return `${subjectText}과 ${importantSubjects} 과목군의 연결성을 반영해 ${score.major.name} 적합도가 ${score.finalScore}점으로 계산되었습니다. 이 점수는 과목별 성적 기반 전공 적합도 지표입니다.`;
}

export function generateCautionNotes(score: MajorFitScore): string[] {
  const notes = [...score.major.cautionNotes];

  if (score.academicFit < 58) {
    notes.push("관련 교과 성취가 낮게 계산되어 다음 학기 보완 과목을 먼저 정하는 것이 좋습니다.");
  }

  if (score.interestFit < 55) {
    notes.push("관련 과목 입력이 부족하거나 과목 강점이 약하게 계산되어 전공 적합도 해석에 주의가 필요합니다.");
  }

  return Array.from(new Set(notes)).slice(0, 4);
}

export function getMajorRecommendations(input: GradeInput): MajorFitScore[] {
  return sampleMajors
    .map((major) => calculateMajorFitScore(major, input))
    .sort((a, b) => b.finalScore - a.finalScore);
}
