import Link from "next/link";
import { BookOpen, BriefcaseBusiness } from "lucide-react";
import ScoreBar from "./ScoreBar";
import type { MajorFitScore } from "@/lib/types";

export default function MajorCard({ score }: { score: MajorFitScore }) {
  return (
    <article className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-black text-blue-600">{score.major.field}</p>
          <h3 className="mt-1 text-2xl font-black tracking-tight text-ink">
            <Link className="transition hover:text-blue-700" href={`/majors/${score.major.id}`}>
              {score.major.name}
            </Link>
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{score.major.description}</p>
        </div>
        <div className="min-w-[142px] shrink-0 rounded-2xl bg-ink px-5 py-4 text-center text-white">
          <p className="text-xs font-black text-blue-200">최종 적합도</p>
          <p className="text-3xl font-black tracking-tight">{score.finalScore.toFixed(1)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ScoreBar label="학업 적합도" value={score.academicFit} />
        <ScoreBar label="관련 과목 강점" tone="bg-blue-600" value={score.interestFit} />
        <ScoreBar label="전공 전망 점수" tone="bg-sky-500" value={score.careerFit} />
        <ScoreBar label="난도 적합도" tone="bg-indigo-500" value={score.difficultyFit} />
        <div className="md:col-span-2">
          <ScoreBar label="취업·연구 전망" tone="bg-ink" value={score.marketFit} />
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 font-black text-slate-800">
            <BookOpen aria-hidden className="h-4 w-4 text-blue-600" />
            중요한 고교 과목
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {score.major.highSchoolSubjects.map((subject) => (
              <span key={subject} className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-100">
                {subject}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 font-black text-slate-800">
            <BriefcaseBusiness aria-hidden className="h-4 w-4 text-blue-600" />
            가능한 진로
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {score.major.careers.map((career) => (
              <span key={career} className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-100">
                {career}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-blue-100 p-4">
        <p className="font-black text-ink">주의할 점</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
          {score.cautionNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 text-sm">
        <span className="font-black text-slate-700">유사 전공: </span>
        {score.alternativeMajors.map((major, index) => (
          <span key={major.id}>
            <Link className="font-black text-blue-700 transition hover:text-blue-900" href={`/majors/${major.id}`}>
              {major.name}
            </Link>
            {index < score.alternativeMajors.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
    </article>
  );
}
