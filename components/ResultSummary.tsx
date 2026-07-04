"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, ClipboardList, Printer, RotateCcw } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import FilterPanel from "./FilterPanel";
import MajorCard from "./MajorCard";
import ScoreBar from "./ScoreBar";
import SimulationPanel from "./SimulationPanel";
import UniversityCard from "./UniversityCard";
import {
  calculateRelatedSubjectAverage,
  calculateSubjectStrengthProfile,
  calculateTrendScore,
  calculateWeightedAverage,
  getSubjectGradeValue,
  getOverallGradeAverage,
  getTrendSemesters
} from "@/lib/gradeCalculator";
import { getMajorRecommendations } from "@/lib/majorRecommendation";
import { ADMISSION_CATEGORY_META } from "@/lib/scoring";
import {
  defaultGradeInput,
  subjectCategoryLabels
} from "@/lib/sampleData";
import {
  defaultFilters,
  getUniversityRecommendations
} from "@/lib/universityRecommendation";
import type { AdmissionCategory, GradeInput, RecommendationFilters, SortOption } from "@/lib/types";

const gradeStorageKey = "gradePath.gradeInput";
const admissionCategoryOrder: AdmissionCategory[] = [
  "veryStable",
  "stable",
  "appropriate",
  "ambitious",
  "reach"
];

export default function ResultSummary() {
  const [input, setInput] = useState<GradeInput>(defaultGradeInput);
  const [hasSavedInput, setHasSavedInput] = useState(false);
  const [filters, setFilters] = useState<RecommendationFilters>(defaultFilters);
  const [sort, setSort] = useState<SortOption>("closest");
  const [expandedCategories, setExpandedCategories] = useState<AdmissionCategory[]>([]);

  useEffect(() => {
    const storedInput = window.localStorage.getItem(gradeStorageKey);
    if (storedInput) {
      setInput(JSON.parse(storedInput) as GradeInput);
      setHasSavedInput(true);
    }
  }, []);

  const hasSubjectGradeInput = useMemo(
    () => input.mode === "subject" && input.subjects.some((subject) => getSubjectGradeValue(subject) !== null),
    [input]
  );
  const majorScores = useMemo(
    () => (hasSubjectGradeInput ? getMajorRecommendations(input) : []),
    [hasSubjectGradeInput, input]
  );
  const matches = useMemo(
    () =>
      hasSavedInput
        ? getUniversityRecommendations({
            input,
            majorFitScores: hasSubjectGradeInput ? majorScores : undefined,
            filters,
            sort
          })
        : [],
    [filters, hasSavedInput, hasSubjectGradeInput, input, majorScores, sort]
  );
  const groupedMatches = useMemo(
    () =>
      admissionCategoryOrder.map((category) => ({
        category,
        matches: matches.filter((match) => match.category === category)
      })),
    [matches]
  );
  const topMajor = majorScores[0];
  const topMatch = matches[0];
  const overallAverage = getOverallGradeAverage(input);
  const weightedAverage = calculateWeightedAverage(input.subjects);
  const relatedAverage = topMajor
    ? calculateRelatedSubjectAverage(input.subjects, topMajor.major.relatedSubjects)
    : 0;
  const trendScore = calculateTrendScore(getTrendSemesters(input));
  const strengthProfile = calculateSubjectStrengthProfile(input.subjects);

  const clearData = () => {
    window.localStorage.removeItem(gradeStorageKey);
    setInput(defaultGradeInput);
    setHasSavedInput(false);
    setExpandedCategories([]);
  };

  const toggleCategory = (category: AdmissionCategory) => {
    setExpandedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  };

  return (
    <div className="space-y-10">
      {!hasSavedInput ? (
        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-soft print:hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <ClipboardList aria-hidden className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-ink">내신 입력 후 결과를 확인할 수 있습니다</h2>
              <p className="mt-2 text-sm leading-6 text-stone-700">
                저장된 내신 성적이 없어서 추천 결과를 계산하지 않았습니다. 실제 성적을 입력하면 이 화면에
                대학과 학과 추천이 표시됩니다.
              </p>
            </div>
          </div>
          <Link className="font-bold underline" href="/input">
            내신 입력하러 가기
          </Link>
        </section>
      ) : null}

      {!hasSavedInput ? null : (
        <>
      <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 aria-hidden className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-black text-ink">내신 요약</h2>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden sm:flex-nowrap">
            <button
              className="inline-flex min-w-[124px] items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
              onClick={clearData}
              type="button"
            >
              <RotateCcw aria-hidden className="h-4 w-4" />
              입력 지우기
            </button>
            <button
              className="inline-flex min-w-[124px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700"
              onClick={() => window.print()}
              type="button"
            >
              <Printer aria-hidden className="h-4 w-4" />
              리포트 인쇄
            </button>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["G 전체 평균", overallAverage ? `${overallAverage.toFixed(2)}등급` : "입력 필요"],
            ["W 가중 평균", weightedAverage ? `${weightedAverage.toFixed(2)}등급` : "과목 입력 필요"],
            [
              "R 관련 과목",
              hasSubjectGradeInput && relatedAverage ? `${relatedAverage.toFixed(2)}등급` : "과목별 입력 필요"
            ],
            ["T 상승 추세", `${trendScore.toFixed(1)}점`]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-blue-50/70 p-4 ring-1 ring-blue-100">
              <p className="text-sm font-bold text-stone-500">{label}</p>
              <p className="mt-2 text-2xl font-black text-ink">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h3 className="font-black text-ink">과목 강점 프로필</h3>
            <div className="mt-3 space-y-3">
              {strengthProfile.length ? (
                strengthProfile.slice(0, 5).map((strength) => (
                  <ScoreBar
                    key={strength.category}
                    label={`${subjectCategoryLabels[strength.category]} 평균 ${strength.average.toFixed(2)}등급`}
                    value={strength.score}
                  />
                ))
              ) : (
                <p className="rounded-2xl bg-blue-50/60 p-4 text-sm text-slate-600">
                  과목별 입력을 추가하면 강점 프로필이 더 정확해집니다.
                </p>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-blue-50/60 p-4 ring-1 ring-blue-100">
            <h3 className="font-black text-ink">성적 추세 분석</h3>
            <p className="mt-2 text-sm leading-6 text-stone-700">
              최근 학기 등급이 낮은 숫자 방향으로 움직일수록 상승 추세 점수가 높아집니다. 현재 추세 점수는
              <span className="font-black text-ink"> {trendScore.toFixed(1)}점</span>입니다.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {getTrendSemesters(input).slice(-3).map((semester) => (
                <div key={semester.id} className="rounded-2xl bg-white p-3 ring-1 ring-blue-100">
                  <p className="text-xs font-bold text-stone-500">{semester.label}</p>
                  <p className="mt-1 text-xl font-black text-ink">
                    {typeof semester.grade === "number" ? semester.grade.toFixed(2) : "-"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FilterPanel filters={filters} onChange={setFilters} sort={sort} onSortChange={setSort} />

      <section className={`grid gap-6 ${hasSubjectGradeInput ? "xl:grid-cols-[1.1fr_0.9fr]" : ""}`}>
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black text-blue-600">Recommended universities</p>
              <h2 className="text-2xl font-black text-ink">5단계별 추천 대학·학과</h2>
            </div>
            <p className="text-sm font-semibold text-stone-500">{matches.length}개 결과</p>
          </div>
          <div className="space-y-7">
            {groupedMatches.map(({ category, matches: categoryMatches }) => {
              const meta = ADMISSION_CATEGORY_META[category];
              const isExpanded = expandedCategories.includes(category);
              const hasMoreMatches = categoryMatches.length > 3;
              const visibleMatches = isExpanded ? categoryMatches : categoryMatches.slice(0, 3);
              return (
                <section
                  key={category}
                  className="border-t border-blue-100 pt-6 first:border-t-0 first:pt-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      aria-expanded={isExpanded}
                      className="group flex items-center gap-2 rounded-full pr-2 text-left transition hover:text-blue-700 disabled:hover:text-inherit"
                      disabled={!categoryMatches.length}
                      onClick={() => toggleCategory(category)}
                      type="button"
                    >
                      <CategoryBadge category={category} />
                      <span className="font-black text-ink transition group-hover:text-blue-700">{meta.label} 추천</span>
                      {hasMoreMatches ? (
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-600 ring-1 ring-blue-100">
                          {isExpanded ? "접기" : "전체 보기"}
                        </span>
                      ) : null}
                    </button>
                    <p className="text-sm font-semibold text-stone-500">{categoryMatches.length}개</p>
                  </div>
                  {categoryMatches.length ? (
                    <div className="mt-4 space-y-4">
                      {visibleMatches.map((match) => (
                        <UniversityCard key={`${match.university.id}-${match.department.id}`} match={match} />
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 rounded-2xl bg-blue-50/60 p-4 text-sm text-slate-600">
                      현재 입력값과 필터 조건에 맞는 {meta.label} 결과가 없습니다.
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        {hasSubjectGradeInput ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-black text-blue-600">Subject-based majors</p>
              <h2 className="text-2xl font-black text-ink">과목별 성적 기반 추천 학과</h2>
            </div>
            <div className="space-y-4">
              {majorScores.slice(0, 5).map((score) => (
                <MajorCard key={score.major.id} score={score} />
              ))}
            </div>
          </div>
        ) : (
          <aside className="rounded-3xl border border-blue-100 bg-white p-6 shadow-soft">
            <p className="text-sm font-black text-blue-600">Major recommendations paused</p>
            <h2 className="mt-1 text-2xl font-black text-ink">학과 추천은 과목별 성적 입력 후 제공됩니다</h2>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              현재는 학기 평균 입력 기준이라 대학 추천만 표시합니다. 수학, 국어, 영어, 과학, 사회, 정보 등
              과목별 등급과 단위수를 입력하면 관련 과목 평균과 강점 프로필을 바탕으로 학과 적합도를 계산합니다.
            </p>
            <Link
              className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700"
              href="/input"
            >
              과목별 성적 입력하기
            </Link>
          </aside>
        )}
      </section>

      {hasSubjectGradeInput && topMajor ? (
        <SimulationPanel input={input} topMajor={topMajor} topMatch={topMatch} />
      ) : null}

      <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-soft" id="print-report">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-black text-blue-600">Printable report</p>
            <h2 className="text-2xl font-black text-ink">5등급제 내신대학찾기 추천 리포트</h2>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-blue-50/70 p-4 ring-1 ring-blue-100">
            <p className="text-sm font-bold text-stone-500">학생 입력 요약</p>
            <p className="mt-2 text-sm leading-6 text-stone-700">
              전체 평균 {overallAverage.toFixed(2)}등급, 입력 방식{" "}
              {input.mode === "subject" ? "과목별 성적" : "학기 평균"} 기준.
            </p>
          </div>
          <div className="rounded-2xl bg-blue-50/70 p-4 ring-1 ring-blue-100">
            <p className="text-sm font-bold text-stone-500">상위 학과</p>
            {hasSubjectGradeInput && topMajor ? (
              <>
                <p className="mt-2 text-xl font-black text-ink">{topMajor.major.name}</p>
                <p className="text-sm text-stone-600">{topMajor.finalScore.toFixed(1)}점</p>
              </>
            ) : (
              <p className="mt-2 text-sm leading-6 text-stone-600">과목별 성적 입력 시 제공됩니다.</p>
            )}
          </div>
          <div className="rounded-2xl bg-blue-50/70 p-4 ring-1 ring-blue-100">
            <p className="text-sm font-bold text-stone-500">상위 대학 추천</p>
            {topMatch ? (
              <div className="mt-2 flex items-center gap-2">
                <CategoryBadge category={topMatch.category} />
                <span className="font-black text-ink">{topMatch.university.name}</span>
              </div>
            ) : (
              <p className="mt-2 text-sm text-stone-600">조건에 맞는 결과가 없습니다.</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="font-black text-ink">5단계별 대학·학과 추천</h3>
            <div className="mt-3 space-y-3 text-sm">
              {groupedMatches.map(({ category, matches: categoryMatches }) => {
                const meta = ADMISSION_CATEGORY_META[category];
                return (
                  <div key={category} className="rounded-2xl bg-blue-50/60 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-black text-ink">{meta.label}</span>
                      <span className="font-semibold text-stone-500">{categoryMatches.length}개</span>
                    </div>
                    {categoryMatches.length ? (
                      <ol className="mt-2 space-y-1">
                        {categoryMatches.slice(0, 3).map((match, index) => (
                          <li key={`${match.university.id}-${match.department.id}`}>
                            {index + 1}. {match.university.name} {match.department.name}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="mt-2 text-stone-600">해당 단계 결과 없음</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {hasSubjectGradeInput ? (
            <div>
              <h3 className="font-black text-ink">Top 10 학과</h3>
              <ol className="mt-3 space-y-2 text-sm">
                {majorScores.slice(0, 10).map((score, index) => (
                  <li key={score.major.id} className="flex justify-between gap-3 rounded-2xl bg-blue-50/60 p-3">
                    <span>
                      {index + 1}. {score.major.name}
                    </span>
                    <span className="font-bold">{score.finalScore.toFixed(1)}점</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="rounded-2xl bg-blue-50/60 p-4 text-sm leading-6 text-slate-700">
              <h3 className="font-black text-ink">학과 추천 안내</h3>
              <p className="mt-2">
                학과 추천은 과목별 성적 입력 시에만 생성됩니다. 평균 등급만 입력한 리포트에는 대학 추천과
                내신 추세만 포함됩니다.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-slate-700">
          <p className="font-black">다음 입력 제안</p>
          <p className="mt-1">
            {hasSubjectGradeInput
              ? "상위 전공의 관련 과목을 우선 보완하면 학과 적합도 점수를 더 높일 수 있습니다."
              : "학과 적합도를 보려면 다음 입력에서 과목별 등급과 단위수를 입력해 주세요."}
          </p>
        </div>
      </section>
        </>
      )}
    </div>
  );
}
