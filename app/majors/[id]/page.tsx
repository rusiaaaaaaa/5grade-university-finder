import Link from "next/link";
import { notFound } from "next/navigation";
import DisclaimerBox from "@/components/DisclaimerBox";
import { sampleMajors, sampleUniversities, subjectCategoryLabels } from "@/lib/sampleData";

export function generateStaticParams() {
  return sampleMajors.map((major) => ({ id: major.id }));
}

export default async function MajorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const major = sampleMajors.find((item) => item.id === id);

  if (!major) {
    notFound();
  }

  const relatedDepartments = sampleUniversities.flatMap((university) =>
    university.departments
      .filter((department) => department.majorId === major.id)
      .map((department) => ({ university, department }))
  );

  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-lg bg-ink p-6 text-white shadow-glow sm:p-8">
          <p className="text-sm font-black text-blue-200">전공 상세</p>
          <h1 className="mt-2 text-3xl font-black">{major.name}</h1>
          <p className="mt-3 max-w-3xl leading-8 text-stone-200">{major.description}</p>
        </div>

        <DisclaimerBox />

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
            <h2 className="text-xl font-black text-ink">전공 프로필</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-bold text-stone-500">계열</dt>
                <dd className="mt-1 text-stone-800">{major.field}</dd>
              </div>
              <div>
                <dt className="font-bold text-stone-500">관련 과목</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {major.relatedSubjects.map((subject) => (
                    <span key={subject} className="rounded-full bg-linen px-3 py-1 text-xs font-bold text-stone-700">
                      {subjectCategoryLabels[subject]}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="font-bold text-stone-500">고교 주요 과목</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {major.highSchoolSubjects.map((subject) => (
                    <span key={subject} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-700">
                      {subject}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
            <h2 className="text-xl font-black text-ink">적합할 수 있는 학생</h2>
            <p className="mt-3 leading-7 text-stone-700">
              {major.activities.join(", ")} 활동을 좋아하고 {major.highSchoolSubjects.slice(0, 3).join(", ")} 과목을
              꾸준히 보완할 수 있는 학생에게 잘 맞을 수 있습니다.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-linen p-4">
                <p className="font-black text-ink">가능한 진로</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-stone-700">
                  {major.careers.map((career) => (
                    <li key={career}>{career}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg bg-linen p-4">
                <p className="font-black text-ink">주의할 점</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-stone-700">
                  {major.cautionNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ink">연결된 대학·학과</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {relatedDepartments.length ? (
              relatedDepartments.map(({ university, department }) => (
                <Link
                  key={department.id}
                  className="rounded-lg border border-stone-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                  href={`/universities/${university.id}`}
                >
                  <p className="text-sm font-bold text-blue-600">{university.region}</p>
                  <h3 className="mt-1 font-black text-ink">
                    {university.name} {department.name}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">기준 등급 {department.referenceGradeRange.label}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-stone-600">현재 연결된 학과가 없습니다.</p>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
