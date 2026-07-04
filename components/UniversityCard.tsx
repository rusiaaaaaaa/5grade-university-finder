import { MapPin } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import ScoreBar from "./ScoreBar";
import type { UniversityMatch, UniversityType } from "@/lib/types";

const universityTypeLabels: Record<UniversityType, string> = {
  national: "국립",
  public: "공립",
  private: "사립"
};

function formatReferenceGrade(label: string) {
  return label.split(" / ")[0];
}

export default function UniversityCard({ match }: { match: UniversityMatch }) {
  return (
    <article className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-soft sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={match.category} />
            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
              {universityTypeLabels[match.university.type]}
            </span>
          </div>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-ink">
            {match.university.name}
          </h3>
          <p className="mt-1 text-lg font-bold text-slate-700">
            {match.department.name}
          </p>
        </div>
        <div className="rounded-2xl bg-blue-50 px-5 py-3 text-right ring-1 ring-blue-100">
          <p className="text-xs font-black text-blue-600">추천 점수</p>
          <p className="text-3xl font-black tracking-tight text-ink">{match.score.toFixed(1)}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-x-8 gap-y-2 text-sm text-slate-600 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <MapPin aria-hidden className="h-4 w-4 text-blue-600" />
          {match.university.region} · {match.university.campus}
        </div>
        <div className="font-bold text-slate-700">전형: {match.department.admissionType}</div>
        <div>기준 등급: {formatReferenceGrade(match.department.referenceGradeRange.label)}</div>
        <div>최저학력기준: {match.department.minimumCsatRequirement}</div>
      </div>

      {match.majorFitScore !== null ? (
        <div className="mt-4">
          <ScoreBar label="과목별 성적 기반 학과 적합도" tone="bg-blue-600" value={match.majorFitScore} />
        </div>
      ) : null}
    </article>
  );
}
