import ResultSummary from "@/components/ResultSummary";

export default function ResultsPage() {
  return (
    <section className="px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black text-blue-600">Recommendation results</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">추천 결과</h1>
          <p className="mt-4 leading-8 text-slate-600">
            대학 추천은 매우 안정, 안정, 적정, 소신, 상향 5단계로 표시됩니다.
            과목별 성적을 입력한 경우에만 학과 적합도가 함께 제공됩니다.
          </p>
        </div>
        <ResultSummary />
      </div>
    </section>
  );
}
