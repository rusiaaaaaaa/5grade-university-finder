import GradeInputForm from "@/components/GradeInputForm";

export default function InputPage() {
  return (
    <section className="px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-black text-blue-600">Grade input</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-ink sm:text-4xl">내신 등급 입력</h1>
          <p className="mt-4 leading-8 text-slate-600">
            학기 평균만 빠르게 입력하거나 과목별 등급과 단위수를 입력해 더 자세한 추천을 확인할 수 있습니다.
            학과 추천은 과목별 성적을 입력했을 때만 제공됩니다.
          </p>
        </div>
        <GradeInputForm />
      </div>
    </section>
  );
}
