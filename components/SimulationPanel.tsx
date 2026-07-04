"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import ScoreBar from "./ScoreBar";
import { calculateMajorFitScore } from "@/lib/majorRecommendation";
import { GRADE_SCALE } from "@/lib/scoring";
import { classifyDepartmentAdmissionChance } from "@/lib/universityRecommendation";
import { simulateFutureGrades } from "@/lib/gradeCalculator";
import type { GradeInput, MajorFitScore, UniversityMatch } from "@/lib/types";

export default function SimulationPanel({
  input,
  topMajor,
  topMatch
}: {
  input: GradeInput;
  topMajor: MajorFitScore;
  topMatch?: UniversityMatch;
}) {
  const [mathGrade, setMathGrade] = useState(1.5);
  const [physicsGrade, setPhysicsGrade] = useState(1.8);
  const [infoGrade, setInfoGrade] = useState(1.5);

  const simulation = useMemo(() => {
    const changes = [
      { subjectName: "수학", category: "Math" as const, grade: mathGrade, credit: 4 },
      { subjectName: "물리학", category: "Science" as const, grade: physicsGrade, credit: 3 },
      { subjectName: "정보", category: "Computer Science" as const, grade: infoGrade, credit: 3 }
    ];

    return simulateFutureGrades(input, changes, topMajor.major.relatedSubjects);
  }, [infoGrade, input, mathGrade, physicsGrade, topMajor.major.relatedSubjects]);

  const nextMajorScore = calculateMajorFitScore(topMajor.major, simulation.updatedInput);
  const nextCategory = topMatch
    ? classifyDepartmentAdmissionChance(simulation.newAverage, topMatch.department, topMatch.university)
    : undefined;
  const majorDelta = nextMajorScore.finalScore - topMajor.finalScore;

  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-soft print:hidden">
      <div className="flex items-center gap-2">
        <Calculator aria-hidden className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-black text-ink">다음 학기 성적 시뮬레이션</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-600">
        예비 3학년 2학기 성적을 바꿔 보면 평균 등급과 전공 적합도, 추천 분류가 어떻게 움직이는지
        확인할 수 있습니다.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[
          ["수학", mathGrade, setMathGrade],
          ["물리학", physicsGrade, setPhysicsGrade],
          ["정보", infoGrade, setInfoGrade]
        ].map(([label, value, setter]) => (
          <label key={label as string} className="block rounded-2xl bg-blue-50/70 p-4 ring-1 ring-blue-100">
            <span className="font-bold text-stone-800">{label as string} 예상 등급</span>
            <input
              className="mt-3 w-full rounded-xl border border-blue-100 bg-white px-4 py-2 text-lg font-bold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              max={GRADE_SCALE.worst}
              min={GRADE_SCALE.best}
              step={0.1}
              type="number"
              value={value as number}
              onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))}
            />
          </label>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-100 p-4">
          <p className="text-sm font-bold text-stone-500">새 평균 등급</p>
          <p className="mt-2 text-2xl font-black text-ink">{simulation.newAverage.toFixed(2)}</p>
          <p className="mt-1 text-sm text-stone-600">
            {simulation.averageDelta < 0 ? "개선" : "변화"} {Math.abs(simulation.averageDelta).toFixed(2)}등급
          </p>
        </div>
        <div className="rounded-2xl border border-blue-100 p-4">
          <p className="text-sm font-bold text-stone-500">전공 적합도 변화</p>
          <p className="mt-2 text-2xl font-black text-ink">
            {nextMajorScore.finalScore.toFixed(1)}
            <span className={`ml-2 text-sm ${majorDelta >= 0 ? "text-blue-600" : "text-sky-600"}`}>
              {majorDelta >= 0 ? "+" : ""}
              {majorDelta.toFixed(1)}
            </span>
          </p>
          <p className="mt-1 text-sm text-stone-600">{topMajor.major.name} 기준</p>
        </div>
        <div className="rounded-2xl border border-blue-100 p-4">
          <p className="text-sm font-bold text-stone-500">추천 분류 변화</p>
          <div className="mt-3 flex items-center gap-2">
            {topMatch ? <CategoryBadge category={topMatch.category} /> : null}
            <span className="text-stone-400">→</span>
            {nextCategory ? <CategoryBadge category={nextCategory} /> : null}
          </div>
          <p className="mt-2 text-sm text-stone-600">상위 대학 추천 카드 기준</p>
        </div>
      </div>

      <div className="mt-5">
        <ScoreBar label="시뮬레이션 후 전공 적합도" tone="bg-blue-600" value={nextMajorScore.finalScore} />
      </div>

      <div className="mt-5 rounded-2xl bg-blue-50/60 p-4 text-sm leading-6 text-slate-700">
        <p className="font-bold text-ink">개선 영향이 큰 과목</p>
        <p className="mt-1">
          {simulation.improvementSubjects.length
            ? `${simulation.improvementSubjects.join(", ")} 과목 성적이 개선되면 ${topMajor.major.name} 관련 과목 평균이 좋아집니다.`
            : "관련 과목을 2등급 이내로 끌어올리면 전공 적합도와 일부 대학 추천 분류가 함께 개선될 수 있습니다."}
        </p>
      </div>
    </section>
  );
}
