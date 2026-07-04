"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
  semesterTemplates,
  subjectCategoryLabels
} from "@/lib/sampleData";
import { GRADE_SCALE } from "@/lib/scoring";
import type {
  AchievementLevel,
  AssessmentType,
  SubjectCategory,
  SubjectGrade
} from "@/lib/types";

const achievementLevels: AchievementLevel[] = ["", "A", "B", "C"];

type SubjectPresetSection = {
  label: string;
  assessmentType: AssessmentType;
  subjects: string[];
};

type SubjectPresetGroup = {
  title: string;
  category: SubjectCategory;
  tone: string;
  sections: SubjectPresetSection[];
};

const relative = "relative" satisfies AssessmentType;
const absolute = "absolute" satisfies AssessmentType;

const subjectPresetGroups: SubjectPresetGroup[] = [
  {
    title: "국어",
    category: "Korean",
    tone: "border-blue-100 bg-blue-50/70",
    sections: [
      { label: "공통", assessmentType: relative, subjects: ["공통국어1", "공통국어2"] },
      { label: "일반", assessmentType: relative, subjects: ["화법과 언어", "독서와 작문", "문학"] },
      { label: "진로", assessmentType: relative, subjects: ["주제 탐구 독서", "문학과 영상", "직무 의사소통"] },
      { label: "융합", assessmentType: relative, subjects: ["독서 토론과 글쓰기", "매체 의사소통", "언어생활 탐구"] }
    ]
  },
  {
    title: "수학",
    category: "Math",
    tone: "border-blue-100 bg-blue-50/70",
    sections: [
      { label: "공통", assessmentType: relative, subjects: ["공통수학1", "공통수학2"] },
      { label: "일반", assessmentType: relative, subjects: ["대수", "미적분 I", "확률과 통계"] },
      { label: "진로", assessmentType: relative, subjects: ["미적분 II", "기하", "경제 수학", "인공지능 수학", "직무 수학"] },
      { label: "융합", assessmentType: relative, subjects: ["수학과 문화", "실용 통계", "수학과제 탐구"] }
    ]
  },
  {
    title: "영어",
    category: "English",
    tone: "border-blue-100 bg-blue-50/70",
    sections: [
      { label: "공통", assessmentType: relative, subjects: ["공통영어1", "공통영어2"] },
      { label: "일반", assessmentType: relative, subjects: ["영어 I", "영어 II", "영어 독해와 작문"] },
      {
        label: "진로",
        assessmentType: relative,
        subjects: ["직무 영어", "영어 발표와 토론", "심화 영어", "영미 문학 읽기", "심화 영어 독해와 작문"]
      },
      { label: "융합", assessmentType: relative, subjects: ["실생활 영어 회화", "미디어 영어", "세계 문화와 영어"] }
    ]
  },
  {
    title: "과학",
    category: "Science",
    tone: "border-blue-100 bg-blue-50/70",
    sections: [
      { label: "공통", assessmentType: relative, subjects: ["통합과학1", "통합과학2"] },
      { label: "실험", assessmentType: absolute, subjects: ["과학탐구실험1", "과학탐구실험2"] },
      { label: "일반", assessmentType: relative, subjects: ["물리학", "화학", "생명과학", "지구과학"] },
      {
        label: "진로",
        assessmentType: relative,
        subjects: [
          "역학과 에너지",
          "전자기와 양자",
          "물질과 에너지",
          "화학 반응의 세계",
          "세포와 물질대사",
          "생물의 유전",
          "지구시스템과학",
          "행성우주과학"
        ]
      },
      { label: "융합", assessmentType: absolute, subjects: ["과학의 역사와 문화", "기후변화와 환경생태", "융합과학 탐구"] }
    ]
  },
  {
    title: "사회",
    category: "Social Studies",
    tone: "border-blue-100 bg-blue-50/70",
    sections: [
      { label: "공통", assessmentType: relative, subjects: ["통합사회1", "통합사회2", "한국사1", "한국사2"] },
      { label: "일반", assessmentType: relative, subjects: ["사회와 문화", "세계시민과 지리", "현대사회와 윤리", "세계사"] },
      {
        label: "진로",
        assessmentType: relative,
        subjects: [
          "정치",
          "법과 사회",
          "경제",
          "국제 관계의 이해",
          "한국지리 탐구",
          "도시의 미래 탐구",
          "윤리와 사상",
          "인문학과 윤리",
          "동아시아 역사 기행"
        ]
      },
      {
        label: "융합",
        assessmentType: absolute,
        subjects: ["금융과 경제생활", "사회문제 탐구", "여행지리", "기후변화와 지속가능한 세계", "윤리 문제 탐구", "역사로 탐구하는 현대 세계"]
      }
    ]
  },
  {
    title: "한국사",
    category: "History",
    tone: "border-blue-100 bg-blue-50/70",
    sections: [{ label: "공통", assessmentType: relative, subjects: ["한국사1", "한국사2"] }]
  },
  {
    title: "정보",
    category: "Computer Science",
    tone: "border-blue-100 bg-blue-50/70",
    sections: [
      { label: "일반", assessmentType: relative, subjects: ["정보"] },
      { label: "진로", assessmentType: relative, subjects: ["인공지능 기초", "데이터 과학"] },
      { label: "융합", assessmentType: relative, subjects: ["소프트웨어와 생활"] }
    ]
  },
  {
    title: "제2외국어",
    category: "Second Foreign Language",
    tone: "border-blue-100 bg-blue-50/70",
    sections: [
      { label: "일반", assessmentType: relative, subjects: ["독일어", "프랑스어", "스페인어", "중국어", "일본어", "러시아어", "아랍어", "베트남어"] },
      { label: "심화", assessmentType: relative, subjects: ["심화 독일어", "심화 프랑스어", "심화 스페인어", "심화 중국어", "심화 일본어", "심화 러시아어", "심화 아랍어", "심화 베트남어"] },
      { label: "회화", assessmentType: relative, subjects: ["독일어 회화", "프랑스어 회화", "스페인어 회화", "중국어 회화", "일본어 회화", "러시아어 회화", "아랍어 회화", "베트남어 회화"] },
      { label: "문화", assessmentType: relative, subjects: ["독일어권 문화", "프랑스어권 문화", "스페인어권 문화", "중국 문화", "일본 문화", "러시아 문화", "아랍 문화", "베트남 문화"] }
    ]
  },
  {
    title: "한문",
    category: "Classical Chinese",
    tone: "border-blue-100 bg-blue-50/70",
    sections: [
      { label: "일반", assessmentType: relative, subjects: ["한문"] },
      { label: "진로", assessmentType: relative, subjects: ["한문 고전 읽기"] },
      { label: "융합", assessmentType: relative, subjects: ["언어생활과 한자"] }
    ]
  },
  {
    title: "기술·가정",
    category: "Technology & Home Economics",
    tone: "border-blue-100 bg-blue-50/70",
    sections: [
      { label: "일반", assessmentType: relative, subjects: ["기술·가정"] },
      { label: "진로", assessmentType: relative, subjects: ["로봇과 공학세계", "생활과학 탐구"] },
      { label: "융합", assessmentType: relative, subjects: ["창의 공학 설계", "지식 재산 일반", "아동발달과 부모", "생애 설계와 자립"] }
    ]
  }
];

function createSubjectRow({
  assessmentType = relative,
  category = "Elective",
  credit = 3,
  grade = "",
  achievementLevel = "",
  semesterId,
  subjectName = ""
}: {
  assessmentType?: AssessmentType;
  category?: SubjectCategory;
  credit?: number | "";
  grade?: number | "";
  achievementLevel?: AchievementLevel;
  semesterId?: string;
  subjectName?: string;
} = {}): SubjectGrade {
  const semester = semesterTemplates.find((item) => item.id === semesterId) ?? semesterTemplates[0];
  return {
    id: `subject-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    semesterId: semester.id,
    semesterLabel: semester.label,
    subjectName,
    category,
    assessmentType,
    grade: assessmentType === absolute ? "" : grade,
    achievementLevel: assessmentType === absolute ? achievementLevel : "",
    credit
  };
}

function assessmentLabel(type: AssessmentType | undefined) {
  return type === absolute ? "A/B/C" : "등급";
}

export default function SubjectInputTable({
  subjects,
  onChange
}: {
  subjects: SubjectGrade[];
  onChange: (subjects: SubjectGrade[]) => void;
}) {
  const [quickSemesterId, setQuickSemesterId] = useState(semesterTemplates[0].id);
  const [quickGrade, setQuickGrade] = useState<number | "">("");
  const [quickAchievement, setQuickAchievement] = useState<AchievementLevel>("");
  const [quickCredit, setQuickCredit] = useState<number | "">(3);
  const [openGroupTitle, setOpenGroupTitle] = useState(subjectPresetGroups[0].title);

  const openGroup = useMemo(
    () => subjectPresetGroups.find((group) => group.title === openGroupTitle) ?? subjectPresetGroups[0],
    [openGroupTitle]
  );

  const updateRow = (id: string, updates: Partial<SubjectGrade>) => {
    onChange(subjects.map((subject) => (subject.id === id ? { ...subject, ...updates } : subject)));
  };

  const removeRow = (id: string) => {
    onChange(subjects.filter((subject) => subject.id !== id));
  };

  const addSubject = (subjectName: string, category: SubjectCategory, assessmentType: AssessmentType) => {
    const existing = subjects.find(
      (subject) => subject.semesterId === quickSemesterId && subject.subjectName === subjectName
    );

    if (existing) {
      removeRow(existing.id);
      return;
    }

    onChange([
      ...subjects,
      createSubjectRow({
        subjectName,
        category,
        assessmentType,
        semesterId: quickSemesterId,
        grade: quickGrade,
        achievementLevel: quickAchievement,
        credit: quickCredit
      })
    ]);
  };

  const addSection = (section: SubjectPresetSection) => {
    const sectionSubjects = subjects.filter(
      (subject) => subject.semesterId === quickSemesterId && section.subjects.includes(subject.subjectName)
    );
    const allSelected = section.subjects.every((subjectName) =>
      subjects.some((subject) => subject.semesterId === quickSemesterId && subject.subjectName === subjectName)
    );

    if (allSelected) {
      onChange(subjects.filter((subject) => !sectionSubjects.some((selected) => selected.id === subject.id)));
      return;
    }

    const additions = section.subjects
      .filter(
        (subjectName) =>
          !subjects.some((subject) => subject.semesterId === quickSemesterId && subject.subjectName === subjectName)
      )
      .map((subjectName) =>
        createSubjectRow({
          subjectName,
          category: openGroup.category,
          assessmentType: section.assessmentType,
          semesterId: quickSemesterId,
          grade: quickGrade,
          achievementLevel: quickAchievement,
          credit: quickCredit
        })
      );

    if (additions.length) {
      onChange([...subjects, ...additions]);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-lg font-black text-ink">빠른 과목 추가</h3>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              학기, 성적, 단위수를 먼저 정한 뒤 과목을 누르면 아래 입력 목록에 바로 추가됩니다.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[680px]">
            <label className="block">
              <span className="text-xs font-bold text-stone-600">학기</span>
              <select
                className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
                value={quickSemesterId}
                onChange={(event) => setQuickSemesterId(event.target.value)}
              >
                {semesterTemplates.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold text-stone-600">등급 과목</span>
              <input
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm tabular-nums"
                max={GRADE_SCALE.worst}
                min={GRADE_SCALE.best}
                placeholder="1.70"
                step={0.01}
                type="number"
                value={quickGrade}
                onChange={(event) => setQuickGrade(event.target.value === "" ? "" : Number(event.target.value))}
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-stone-600">성취평가 과목</span>
              <select
                className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
                value={quickAchievement}
                onChange={(event) => setQuickAchievement(event.target.value as AchievementLevel)}
              >
                {achievementLevels.map((level) => (
                  <option key={level || "empty"} value={level}>
                    {level || "선택"}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-bold text-stone-600">단위수</span>
              <input
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm tabular-nums"
                min={1}
                step={1}
                type="number"
                value={quickCredit}
                onChange={(event) => setQuickCredit(event.target.value === "" ? "" : Number(event.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {subjectPresetGroups.map((group) => (
            <button
              key={group.title}
              className={`shrink-0 rounded-full border px-3 py-2 text-sm font-black transition ${
                openGroup.title === group.title
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-blue-100 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              }`}
              onClick={() => setOpenGroupTitle(group.title)}
              type="button"
            >
              {group.title}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-3xl border p-4 ${openGroup.tone}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-stone-600">{subjectCategoryLabels[openGroup.category]}</p>
              <h4 className="text-lg font-black text-ink">{openGroup.title} 과목</h4>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {openGroup.sections.map((section) => (
              <div key={section.label} className="rounded-lg bg-white/70 p-3 ring-1 ring-white/70">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-ink">{section.label}</p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-stone-600 ring-1 ring-stone-200">
                      {assessmentLabel(section.assessmentType)}
                    </span>
                  </div>
                  <button
                    className="rounded-md px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100 transition hover:bg-white"
                    onClick={() => addSection(section)}
                    type="button"
                  >
                    묶음 추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {section.subjects.map((subjectName) => {
                    const exists = subjects.some(
                      (subject) => subject.semesterId === quickSemesterId && subject.subjectName === subjectName
                    );
                    return (
                      <button
                        key={subjectName}
                        className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
                          exists
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-slate-700 ring-1 ring-blue-100 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                        onClick={() => addSubject(subjectName, openGroup.category, section.assessmentType)}
                        type="button"
                      >
                        {subjectName}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-ink">입력한 과목</h3>
            <p className="mt-1 text-sm text-stone-600">{subjects.length}개 과목</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {subjects.map((subject) => {
            const assessmentType = subject.assessmentType ?? relative;
            return (
              <article key={subject.id} className="rounded-2xl border border-blue-100 p-4">
                <div className="grid gap-3 lg:grid-cols-[150px_minmax(180px,1fr)_160px_120px_120px_110px_44px] lg:items-end">
                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">학기</span>
                    <select
                      className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
                      value={subject.semesterId}
                      onChange={(event) => {
                        const semester = semesterTemplates.find((item) => item.id === event.target.value);
                        updateRow(subject.id, {
                          semesterId: event.target.value,
                          semesterLabel: semester?.label ?? event.target.value
                        });
                      }}
                    >
                      {semesterTemplates.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                          {semester.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">과목명</span>
                    <div className="mt-1 min-h-10 w-full rounded-md border border-blue-100 bg-blue-50/60 px-3 py-2 text-sm font-semibold text-slate-700">
                      {subject.subjectName || "과목명 없음"}
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">분류</span>
                    <div className="mt-1 min-h-10 w-full rounded-md border border-blue-100 bg-blue-50/60 px-3 py-2 text-sm font-semibold text-slate-700">
                      {subjectCategoryLabels[subject.category]}
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">평가</span>
                    <select
                      className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
                      value={assessmentType}
                      onChange={(event) => {
                        const nextType = event.target.value as AssessmentType;
                        updateRow(subject.id, {
                          assessmentType: nextType,
                          grade: nextType === absolute ? "" : subject.grade,
                          achievementLevel: nextType === absolute ? subject.achievementLevel : ""
                        });
                      }}
                    >
                      <option value={relative}>등급</option>
                      <option value={absolute}>A/B/C</option>
                    </select>
                  </label>
                  {assessmentType === absolute ? (
                    <label className="block">
                      <span className="text-xs font-bold text-stone-500">성취도</span>
                      <select
                        className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
                        value={subject.achievementLevel}
                        onChange={(event) =>
                          updateRow(subject.id, { achievementLevel: event.target.value as AchievementLevel })
                        }
                      >
                        {achievementLevels.map((level) => (
                          <option key={level || "empty"} value={level}>
                            {level || "선택"}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <label className="block">
                      <span className="text-xs font-bold text-stone-500">등급</span>
                      <input
                        className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm tabular-nums"
                        max={GRADE_SCALE.worst}
                        min={GRADE_SCALE.best}
                        placeholder="2.00"
                        step={0.01}
                        type="number"
                        value={subject.grade}
                        onChange={(event) =>
                          updateRow(subject.id, {
                            grade: event.target.value === "" ? "" : Number(event.target.value)
                          })
                        }
                      />
                    </label>
                  )}
                  <label className="block">
                    <span className="text-xs font-bold text-stone-500">단위수</span>
                    <input
                      className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm tabular-nums"
                      min={1}
                      step={1}
                      type="number"
                      value={subject.credit}
                      onChange={(event) =>
                        updateRow(subject.id, {
                          credit: event.target.value === "" ? "" : Number(event.target.value)
                        })
                      }
                    />
                  </label>
                  <button
                    aria-label="과목 삭제"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone-500 transition hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    onClick={() => removeRow(subject.id)}
                    type="button"
                  >
                    <Trash2 aria-hidden className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
