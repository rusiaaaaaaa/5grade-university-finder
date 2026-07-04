import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";
import DisclaimerBox from "@/components/DisclaimerBox";
import { sampleMajors, sampleUniversities } from "@/lib/sampleData";
import type { UniversityType } from "@/lib/types";

const universityTypeLabels: Record<UniversityType, string> = {
  national: "국립",
  public: "공립",
  private: "사립"
};

export function generateStaticParams() {
  return sampleUniversities.map((university) => ({ id: university.id }));
}

export default async function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const university = sampleUniversities.find((item) => item.id === id);

  if (!university) {
    notFound();
  }

  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-lg bg-ink p-6 text-white shadow-glow sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="mt-2 text-3xl font-black">{university.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-stone-200">
                <MapPin aria-hidden className="h-4 w-4 text-blue-200" />
                {university.region} · {university.campus} · {universityTypeLabels[university.type]}
              </p>
            </div>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-4 py-3 font-bold text-white transition hover:bg-white/10"
              href={university.websiteUrl}
              rel="noreferrer"
              target="_blank"
            >
              대학 웹사이트
              <ExternalLink aria-hidden className="h-4 w-4" />
            </a>
          </div>
        </div>

        <DisclaimerBox />

        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ink">개설 학과</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {university.departments.map((department) => {
              const major = sampleMajors.find((item) => item.id === department.majorId);
              return (
                <article key={department.id} className="rounded-lg border border-stone-200 p-4">
                  <p className="text-sm font-bold text-blue-600">{department.field}</p>
                  <h3 className="mt-1 text-xl font-black text-ink">{department.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{department.description}</p>
                  <dl className="mt-4 grid gap-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="font-bold text-stone-500">전형</dt>
                      <dd>{department.admissionType}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="font-bold text-stone-500">기준 등급</dt>
                      <dd>{department.referenceGradeRange.label}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="font-bold text-stone-500">경쟁률</dt>
                      <dd>{department.competitionRate.toFixed(1)}:1</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {department.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-linen px-3 py-1 text-xs font-bold text-stone-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {major ? (
                    <Link className="mt-4 inline-flex font-bold text-blue-700 hover:text-ink" href={`/majors/${major.id}`}>
                      {major.name} 전공 정보 보기
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
