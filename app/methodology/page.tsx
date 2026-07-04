import DisclaimerBox from "@/components/DisclaimerBox";
import { ADMISSION_CATEGORY_META, FIVE_TO_NINE_GRADE_ANCHORS, GRADE_SCALE } from "@/lib/scoring";

const items = [
  ["G", "학기 평균 또는 과목 입력 기반 전체 내신 평균입니다."],
  ["W", "과목별 단위수를 반영한 가중 평균입니다."],
  ["R", "추천 전공의 관련 과목만 골라 계산한 관련 과목 평균입니다."],
  ["T", "최근 학기 등급이 개선되는지 보는 추세 점수입니다."],
  ["S", "전공 추천 최종 점수입니다. S = 0.30A + 0.25I + 0.20C + 0.15D + 0.10M"]
];

export default function MethodologyPage() {
  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-sm font-black text-blue-600">Methodology</p>
          <h1 className="mt-2 text-3xl font-black text-ink">산출 방식과 한계</h1>
          <p className="mt-3 leading-8 text-stone-700">
            5등급제 내신대학찾기는 현재 내신과 선택 조건을 바탕으로 대학과 학과 가능성을 정리합니다. 현재 버전은 {GRADE_SCALE.label} 기준으로
            계산하며, 낮은 숫자가 더 좋은 성적이므로 1.2등급은 2.1등급보다 우수하게 처리합니다.
          </p>
        </div>

        <DisclaimerBox />

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-ink">5등급제 환산 기준</h2>
          <p className="mt-3 leading-7 text-stone-700">
            5등급제에서는 0.1등급 차이가 기존 9등급제보다 크게 작용하므로, 대학군별 기준점을 좁게 잡아
            상위권 대학이 과도하게 추천되지 않도록 보정합니다.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FIVE_TO_NINE_GRADE_ANCHORS.map((anchor) => (
              <div key={anchor.fiveGrade} className="rounded-lg bg-linen p-4">
                <p className="text-lg font-black text-ink">
                  5등급 {anchor.fiveGrade.toFixed(2)} → 9등급 약 {anchor.nineGrade.toFixed(2)}
                </p>
                <p className="mt-2 text-sm font-semibold text-blue-600">{anchor.group}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-ink">성적 지표</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {items.map(([symbol, copy]) => (
              <div key={symbol} className="rounded-lg bg-linen p-4">
                <p className="text-2xl font-black text-ink">{symbol}</p>
                <p className="mt-2 text-sm leading-6 text-stone-700">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-ink">학과 추천 점수</h2>
          <p className="mt-3 leading-7 text-stone-700">
            A는 학업 적합도, I는 흥미 적합도, C는 진로 적합도, D는 난도 적합도, M은 시장·진로 전망
            적합도입니다. 최종 점수 S는 100점 만점의 전공 적합도 지표입니다.
          </p>
          <div className="mt-4 rounded-lg bg-ink p-4 font-mono text-sm text-blue-200">
            S = 0.30A + 0.25I + 0.20C + 0.15D + 0.10M
          </div>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-ink">매우 안정/안정/적정/소신/상향 분류</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {Object.entries(ADMISSION_CATEGORY_META).map(([key, meta]) => (
              <div key={key} className="rounded-lg bg-stone-50 p-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${meta.tone}`}>
                  {meta.label}
                </span>
                <p className="mt-3 text-sm leading-6 text-stone-700">{meta.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-ink">한계와 데이터 관리</h2>
          <p className="mt-3 leading-7 text-stone-700">
            실제 서비스에서는 대학이 공개한 모집요강, 전년도 입시 결과, 전형별
            반영 교과, 최저학력기준, 모집 인원 변화를 검증된 출처로 업데이트해야 합니다. 학교별 산식,
            면접, 서류 평가, 생기부 맥락은 이후 데이터 확장 시 함께 반영할 수 있습니다.
          </p>
        </section>
      </div>
    </section>
  );
}
