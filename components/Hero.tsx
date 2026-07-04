import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calculator,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Target
} from "lucide-react";
import { sampleMajors, sampleUniversities } from "@/lib/sampleData";

const departmentCount = sampleUniversities.reduce(
  (sum, university) => sum + university.departments.length,
  0
);

const stats = [
  { label: "대학 데이터", value: sampleUniversities.length.toLocaleString("ko-KR") },
  { label: "대학·학과 조합", value: departmentCount.toLocaleString("ko-KR") },
  { label: "전공 사전", value: sampleMajors.length.toLocaleString("ko-KR") },
  { label: "추천 단계", value: "5단계" }
];

const features = [
  { icon: Calculator, title: "5등급제 기반 추천", copy: "현재 내신과 기준 등급의 차이를 계산해 현실적인 추천 단계를 보여줍니다." },
  { icon: Target, title: "과목별 학과 적합도", copy: "과목 성적을 입력했을 때만 관련 과목 강점과 전공 적합도를 분석합니다." },
  { icon: ShieldCheck, title: "안정도 5단계 분류", copy: "매우 안정, 안정, 적정, 소신, 상향으로 결과를 나눠 빠르게 비교할 수 있습니다." },
  { icon: BarChart3, title: "현재 내신 비교", copy: "기준 등급과 현재 내신을 나란히 보여줘 결과를 빠르게 확인할 수 있습니다." },
  { icon: Sparkles, title: "성적 변화 시뮬레이션", copy: "다음 학기 성적 변화가 학과 추천에 미치는 영향을 확인할 수 있습니다." },
  { icon: GraduationCap, title: "필터 기반 탐색", copy: "지역, 대학 유형, 전형, 학과 분야로 원하는 결과만 정리할 수 있습니다." }
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(37,99,235,0.12),transparent_30rem),radial-gradient(circle_at_88%_18%,rgba(14,165,233,0.10),transparent_28rem)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:py-20">
        <div className="animate-rise space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            <ShieldCheck aria-hidden className="h-4 w-4" />
            5등급제 기준 · 합격 보장이 아닌 참고용 분석
          </div>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              현재 내신으로 대학과 학과 가능성을 더 차분하게 분석하세요
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              내신 평균, 과목별 성적, 전형 조건을 바탕으로 대학 추천을 5단계로 정리합니다.
              학과 추천은 과목별 성적을 입력한 경우에만 계산되어 결과가 더 명확합니다.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              href="/input"
            >
              내신 입력하기
              <ArrowRight aria-hidden className="h-5 w-5" />
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-xl border border-blue-100 bg-white px-6 py-3.5 font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
              href="/results"
            >
              결과 화면 보기
            </Link>
          </div>
          <div className="grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-blue-100 bg-white/80 p-4 shadow-sm backdrop-blur">
                <p className="text-2xl font-black text-blue-700">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in rounded-[2rem] border border-blue-100 bg-white/80 p-3 shadow-soft backdrop-blur">
          <div className="rounded-[1.5rem] border border-blue-50 bg-white p-5 text-ink">
            <div className="flex items-center justify-between border-b border-blue-50 pb-5">
              <div>
                <p className="text-sm font-bold text-blue-600">AI 추천 대시보드</p>
                <p className="mt-1 text-2xl font-black tracking-tight">컴퓨터공학 중심 분석</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100">
                적정
              </span>
            </div>
            <div className="mt-5 grid gap-4">
              {[
                ["현재 내신", "2.16", "72%"],
                ["관련 과목", "1.84", "83%"],
                ["학과 적합도", "84.7", "85%"]
              ].map(([label, value, width]) => (
                <div key={label} className="rounded-2xl border border-blue-50 bg-blue-50/40 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-600">{label}</span>
                    <span className="font-black text-ink">{value}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-blue-600" style={{ width }} />
                  </div>
                </div>
              ))}
              <div className="rounded-2xl bg-ink p-5 text-white">
                <p className="text-sm font-bold text-blue-200">분석 요약</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  수학·정보 과목 강점과 기준 등급 범위를 함께 비교해 추천 안정도를 계산했습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative border-t border-blue-100 bg-blue-50/60 px-5 py-10">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
                <Icon aria-hidden className="h-5 w-5 text-blue-600" />
                <h2 className="mt-4 text-lg font-black tracking-tight text-ink">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.copy}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
