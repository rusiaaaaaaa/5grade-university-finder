"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ClipboardList, RotateCcw, Save } from "lucide-react";
import SubjectInputTable from "./SubjectInputTable";
import {
  defaultGradeInput,
  semesterTemplates
} from "@/lib/sampleData";
import { getSubjectGradeValue, validateGrade } from "@/lib/gradeCalculator";
import { GRADE_SCALE } from "@/lib/scoring";
import type { GradeInput, GradeInputMode, SemesterAverage } from "@/lib/types";

const gradeStorageKey = "gradePath.gradeInput";

function cloneInput(input: GradeInput): GradeInput {
  return JSON.parse(JSON.stringify(input)) as GradeInput;
}

function removeBlankStarterRows(input: GradeInput): GradeInput {
  return {
    ...input,
    subjects: input.subjects.filter((subject) => {
      const isStarterRow = subject.id.startsWith("sub-g1-s1-");
      const isBlank = subject.grade === "" && subject.achievementLevel === "";
      return !(isStarterRow && isBlank);
    })
  };
}

export default function GradeInputForm() {
  const router = useRouter();
  const [input, setInput] = useState<GradeInput>(() => cloneInput(defaultGradeInput));
  const [errors, setErrors] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(gradeStorageKey);
    if (stored) {
      setInput(removeBlankStarterRows(JSON.parse(stored) as GradeInput));
    }
  }, []);

  const numericGradeCount = useMemo(() => {
    if (input.mode === "semester") {
      return input.semesterAverages.filter((semester) => typeof semester.grade === "number").length;
    }

    return input.subjects.filter((subject) => getSubjectGradeValue(subject) !== null).length;
  }, [input]);

  const updateMode = (mode: GradeInputMode) => {
    setSaved(false);
    setInput((current) => ({
      ...current,
      mode,
      subjects: current.subjects
    }));
  };

  const updateSemester = (id: string, grade: number | "") => {
    setSaved(false);
    setInput((current) => ({
      ...current,
      semesterAverages: current.semesterAverages.map((semester) =>
        semester.id === id ? { ...semester, grade } : semester
      )
    }));
  };

  const validateInput = (): string[] => {
    const nextErrors: string[] = [];

    if (numericGradeCount === 0) {
      nextErrors.push("최소 1개 이상의 내신 등급을 입력해 주세요.");
    }

    if (input.mode === "semester") {
      input.semesterAverages.forEach((semester) => {
        const message = validateGrade(semester.grade);
        if (message) {
          nextErrors.push(`${semester.label}: ${message}`);
        }
      });
    } else {
      input.subjects.forEach((subject, index) => {
        const label = subject.subjectName || `${index + 1}번째 과목`;
        if (subject.assessmentType === "absolute") {
          if (!["A", "B", "C"].includes(subject.achievementLevel)) {
            nextErrors.push(`${label}: 성취도 A/B/C 중 하나를 선택해 주세요.`);
          }
        } else {
          const gradeMessage = validateGrade(subject.grade);
          if (gradeMessage) {
            nextErrors.push(`${label}: ${gradeMessage}`);
          }
        }
        if (subject.credit !== "" && subject.credit <= 0) {
          nextErrors.push(`${label}: 단위수는 1 이상이어야 합니다.`);
        }
      });
    }

    return Array.from(new Set(nextErrors));
  };

  const saveInput = () => {
    const nextErrors = validateInput();
    setErrors(nextErrors);
    if (nextErrors.length > 0) {
      return false;
    }

    window.localStorage.setItem(gradeStorageKey, JSON.stringify(input));
    setSaved(true);
    return true;
  };

  const goNext = () => {
    if (saveInput()) {
      router.push("/results");
    }
  };

  const reset = () => {
    window.localStorage.removeItem(gradeStorageKey);
    setInput(cloneInput(defaultGradeInput));
    setErrors([]);
    setSaved(false);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-blue-100 bg-white p-5 text-sm leading-7 text-slate-600 shadow-soft">
        <p className="font-black text-ink">{GRADE_SCALE.label} 기준 입력</p>
        <p className="mt-1">
          {GRADE_SCALE.best}등급이 가장 우수하고 {GRADE_SCALE.worst}등급이 가장 낮은 기준으로 계산합니다.
          모든 평균, 관련 과목, 시뮬레이션 등급은 {GRADE_SCALE.best}~{GRADE_SCALE.worst} 범위만 허용됩니다.
        </p>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-white p-2 shadow-soft">
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { id: "semester", label: "학기 평균 입력", description: "빠르게 평균 등급만 입력" },
            { id: "subject", label: "과목별 입력", description: "단위수와 과목 강점까지 분석" }
          ].map((mode) => (
            <button
              key={mode.id}
              className={`rounded-2xl px-4 py-3 text-left transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                input.mode === mode.id ? "bg-blue-600 text-white shadow-glow" : "bg-blue-50/60 text-slate-700 hover:bg-blue-50"
              }`}
              onClick={() => updateMode(mode.id as GradeInputMode)}
              type="button"
            >
              <span className="block font-bold">{mode.label}</span>
              <span className={`mt-1 block text-sm ${input.mode === mode.id ? "text-stone-200" : "text-stone-500"}`}>
                {mode.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {errors.length > 0 ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <p className="font-bold">입력값을 확인해 주세요.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-3xl border border-blue-100 bg-white p-5 shadow-soft sm:p-6">
        {input.mode === "semester" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {input.semesterAverages.map((semester: SemesterAverage) => (
              <label key={semester.id} className="block">
                <span className="text-sm font-bold text-stone-700">{semester.label}</span>
                <input
                  className="mt-2 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-lg font-bold tabular-nums text-ink shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  max={GRADE_SCALE.worst}
                  min={GRADE_SCALE.best}
                  placeholder="2.35"
                  step={0.01}
                  type="number"
                  value={semester.grade}
                  onChange={(event) =>
                    updateSemester(semester.id, event.target.value === "" ? "" : Number(event.target.value))
                  }
                />
              </label>
            ))}
          </div>
        ) : (
          <SubjectInputTable
            subjects={input.subjects}
            onChange={(subjects) => {
              setSaved(false);
              setInput((current) => ({ ...current, subjects }));
            }}
          />
        )}
      </div>

      <div className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-stone-600">
            <ClipboardList aria-hidden className="h-5 w-5 text-blue-600" />
            <span>
              현재 {numericGradeCount}개 등급이 입력되었습니다. {GRADE_SCALE.label} 기준으로{" "}
              {GRADE_SCALE.best}등급에 가까울수록 우수합니다.
            </span>
          </div>
          {saved ? <span className="text-sm font-bold text-blue-600">저장되었습니다.</span> : null}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-3 font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
          onClick={reset}
          type="button"
        >
          <RotateCcw aria-hidden className="h-4 w-4" />
          초기화
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
          onClick={saveInput}
          type="button"
        >
          <Save aria-hidden className="h-4 w-4" />
          저장
        </button>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          onClick={goNext}
          type="button"
        >
          결과 보기
          <ArrowRight aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
