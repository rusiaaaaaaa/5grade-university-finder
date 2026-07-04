import {
  GRADE_SCALE,
  clamp,
  gradeToScore,
  roundGrade,
  roundTo,
  weightedAverage
} from "./scoring";
import type {
  FutureGradeChange,
  FutureGradeSimulation,
  GradeInput,
  SemesterAverage,
  SubjectCategory,
  SubjectGrade,
  SubjectStrength
} from "./types";

function isNumericGrade(value: number | ""): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= GRADE_SCALE.best &&
    value <= GRADE_SCALE.worst
  );
}

function validGrades(values: Array<number | "">): number[] {
  return values.filter(isNumericGrade);
}

export function getSubjectGradeValue(subject: SubjectGrade): number | null {
  if (subject.assessmentType === "absolute") {
    return null;
  }

  return isNumericGrade(subject.grade) ? subject.grade : null;
}

export function calculateSimpleAverage(values: Array<number | "">): number {
  const grades = validGrades(values);
  if (grades.length === 0) {
    return 0;
  }

  return roundGrade(grades.reduce((sum, grade) => sum + grade, 0) / grades.length);
}

export function calculateWeightedAverage(subjects: SubjectGrade[]): number {
  const items = subjects
    .map((subject) => ({
      value: getSubjectGradeValue(subject),
      weight: typeof subject.credit === "number" && subject.credit > 0 ? subject.credit : 1
    }))
    .filter((item): item is { value: number; weight: number } => item.value !== null);

  if (items.length === 0) {
    return 0;
  }

  return roundGrade(weightedAverage(items));
}

export function calculateRelatedSubjectAverage(
  subjects: SubjectGrade[],
  relatedSubjects: SubjectCategory[]
): number {
  const related = subjects.filter(
    (subject) => relatedSubjects.includes(subject.category) && getSubjectGradeValue(subject) !== null
  );

  if (related.length === 0) {
    return 0;
  }

  return calculateWeightedAverage(related);
}

export function calculateTrendScore(semesterAverages: SemesterAverage[]): number {
  const grades = semesterAverages.filter((semester) => isNumericGrade(semester.grade));

  if (grades.length < 2) {
    return 60;
  }

  const first = grades[0].grade as number;
  const latest = grades[grades.length - 1].grade as number;
  const improvement = first - latest;
  const consistencyPenalty =
    grades.reduce((sum, semester, index) => {
      if (index === 0) {
        return sum;
      }

      const previous = grades[index - 1].grade as number;
      const current = semester.grade as number;
      return current > previous + 0.25 ? sum + 5 : sum;
    }, 0) || 0;

  return roundTo(clamp(62 + improvement * 32 - consistencyPenalty, 20, 100));
}

export function calculateSubjectStrengthProfile(subjects: SubjectGrade[]): SubjectStrength[] {
  const groups = subjects.reduce<Record<string, number[]>>((acc, subject) => {
    const gradeValue = getSubjectGradeValue(subject);
    if (gradeValue === null) {
      return acc;
    }

    acc[subject.category] = [...(acc[subject.category] ?? []), gradeValue];
    return acc;
  }, {});

  return Object.entries(groups)
    .map(([category, grades]) => {
      const average = calculateSimpleAverage(grades);
      return {
        category: category as SubjectCategory,
        average,
        score: roundTo(gradeToScore(average)),
        count: grades.length
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function getSemesterAverageFromSubjects(subjects: SubjectGrade[]): SemesterAverage[] {
  const groups = subjects.reduce<Record<string, SubjectGrade[]>>((acc, subject) => {
    acc[subject.semesterId] = [...(acc[subject.semesterId] ?? []), subject];
    return acc;
  }, {});

  return Object.entries(groups).map(([id, group]) => ({
    id,
    label: group[0]?.semesterLabel ?? id,
    grade: calculateWeightedAverage(group) || ""
  }));
}

export function getOverallGradeAverage(input: GradeInput): number {
  if (input.mode === "subject") {
    const weighted = calculateWeightedAverage(input.subjects);
    if (weighted > 0) {
      return weighted;
    }
  }

  return calculateSimpleAverage(input.semesterAverages.map((semester) => semester.grade));
}

export function getTrendSemesters(input: GradeInput): SemesterAverage[] {
  if (input.mode === "subject") {
    const fromSubjects = getSemesterAverageFromSubjects(input.subjects);
    if (fromSubjects.length > 1) {
      return fromSubjects;
    }
  }

  return input.semesterAverages;
}

export function validateGrade(value: number | ""): string {
  if (value === "") {
    return "";
  }

  if (value < GRADE_SCALE.best || value > GRADE_SCALE.worst) {
    return `내신 등급은 ${GRADE_SCALE.label} 기준 ${GRADE_SCALE.best.toFixed(2)}부터 ${GRADE_SCALE.worst.toFixed(2)} 사이로 입력해 주세요.`;
  }

  return "";
}

export function simulateFutureGrades(
  input: GradeInput,
  changes: FutureGradeChange[],
  relatedSubjects: SubjectCategory[] = []
): FutureGradeSimulation {
  const validChanges = changes.filter(
    (change) => change.grade >= GRADE_SCALE.best && change.grade <= GRADE_SCALE.worst
  );
  const previousAverage = getOverallGradeAverage(input);
  const previousRelatedAverage = relatedSubjects.length
    ? calculateRelatedSubjectAverage(input.subjects, relatedSubjects)
    : 0;
  const futureAverage = calculateSimpleAverage(validChanges.map((change) => change.grade));
  const futureSemester: SemesterAverage = {
    id: "future-g3-s2",
    label: "예상 3학년 2학기",
    grade: futureAverage || ""
  };
  const futureSubjects: SubjectGrade[] = validChanges.map((change) => ({
    id: `future-${change.category}-${change.subjectName}`,
    semesterId: "future-g3-s2",
    semesterLabel: "예상 3학년 2학기",
    subjectName: change.subjectName,
    category: change.category,
    assessmentType: "relative",
    grade: change.grade,
    achievementLevel: "",
    credit: change.credit
  }));
  const withoutExistingFuture = input.subjects.filter(
    (subject) => subject.semesterId !== "future-g3-s2"
  );
  const updatedInput: GradeInput = {
    ...input,
    semesterAverages: [
      ...input.semesterAverages.filter((semester) => semester.id !== futureSemester.id),
      futureSemester
    ],
    subjects: [...withoutExistingFuture, ...futureSubjects]
  };
  const newAverage = getOverallGradeAverage(updatedInput);
  const newRelatedAverage = relatedSubjects.length
    ? calculateRelatedSubjectAverage(updatedInput.subjects, relatedSubjects)
    : 0;
  const improvementSubjects = validChanges
    .filter((change) => relatedSubjects.includes(change.category) && change.grade <= 2)
    .map((change) => change.subjectName);

  return {
    previousAverage,
    newAverage,
    averageDelta: roundGrade(newAverage - previousAverage),
    previousRelatedAverage,
    newRelatedAverage,
    relatedDelta:
      previousRelatedAverage && newRelatedAverage
        ? roundGrade(newRelatedAverage - previousRelatedAverage)
        : 0,
    updatedInput,
    improvementSubjects
  };
}
