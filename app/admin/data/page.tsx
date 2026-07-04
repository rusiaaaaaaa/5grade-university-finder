import Link from "next/link";
import { sampleMajors, sampleUniversities } from "@/lib/sampleData";

export default function AdminDataPage() {
  const departmentCount = sampleUniversities.reduce(
    (sum, university) => sum + university.departments.length,
    0
  );

  return (
    <section className="px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mt-2 text-3xl font-black text-ink">대학·학과 데이터 미리보기</h1>
            <p className="mt-3 leading-7 text-stone-700">
              실제 관리자 기능 대신, 첫 버전에서는 JSON 데이터가 추천 로직에 어떻게 연결되는지 확인할 수
              있는 읽기 전용 화면을 제공합니다.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["대학", sampleUniversities.length],
            ["학과", departmentCount],
            ["전공 사전", sampleMajors.length]
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
              <p className="text-sm font-bold text-stone-500">{label as string}</p>
              <p className="mt-2 text-3xl font-black text-ink">{value as number}</p>
            </div>
          ))}
        </div>

        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ink">대학 JSON</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-stone-100 text-stone-700">
                <tr>
                  <th className="px-4 py-3">대학</th>
                  <th className="px-4 py-3">지역</th>
                  <th className="px-4 py-3">유형</th>
                  <th className="px-4 py-3">전형</th>
                  <th className="px-4 py-3">학과</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sampleUniversities.map((university) => (
                  <tr key={university.id}>
                    <td className="px-4 py-3 font-bold">
                      <Link className="text-blue-700 hover:text-ink" href={`/universities/${university.id}`}>
                        {university.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{university.region}</td>
                    <td className="px-4 py-3">{university.type}</td>
                    <td className="px-4 py-3">{university.admissionTypes.join(", ")}</td>
                    <td className="px-4 py-3">{university.departments.map((department) => department.name).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-black text-ink">전공 JSON</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {sampleMajors.map((major) => (
              <Link
                key={major.id}
                className="rounded-lg border border-stone-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
                href={`/majors/${major.id}`}
              >
                <p className="text-sm font-bold text-blue-600">{major.field}</p>
                <h3 className="mt-1 font-black text-ink">{major.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{major.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
