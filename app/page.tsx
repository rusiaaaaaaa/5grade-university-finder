import Link from "next/link";
import { ArrowRight, Database, FileText, ShieldCheck } from "lucide-react";
import Hero from "@/components/Hero";
import DisclaimerBox from "@/components/DisclaimerBox";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <section className="bg-white px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-sm font-black text-blue-600">Why 5등급제 내신대학찾기</p>
            <h2 className="text-3xl font-black tracking-tight text-ink sm:text-4xl">
              입시 상담 전에 스스로 확인하는 기준점
            </h2>
            <p className="leading-8 text-slate-600">
              5등급제 내신대학찾기는 기준 범위와 현재 입력값 사이의 차이를 바탕으로 대학과 학과 가능성을 정리합니다.
              학과 추천은 과목별 성적과 관련 과목 강점을 기준으로만 계산해 혼동을 줄였습니다.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700"
                href="/input"
              >
                시작하기
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-xl border border-blue-100 bg-white px-6 py-3.5 font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
                href="/admin/data"
              >
                대학 데이터 보기
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [ShieldCheck, "명확한 단계", "현재 내신 기준으로 매우 안정부터 상향까지 한눈에 정리합니다."],
              [FileText, "설명 가능한 계산", "등급, 전형, 기준 범위, 과목 적합도를 분리해 보여줍니다."],
              [Database, "교체 가능한 데이터", "JSON 파일을 나중에 Supabase나 PostgreSQL로 옮기기 쉽습니다."]
            ].map(([Icon, title, copy]) => {
              const CardIcon = Icon as typeof ShieldCheck;
              return (
                <div key={title as string} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
                  <CardIcon aria-hidden className="h-6 w-6 text-blue-600" />
                  <h3 className="mt-4 font-black tracking-tight text-ink">{title as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{copy as string}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl">
          <DisclaimerBox />
        </div>
      </section>
    </>
  );
}
