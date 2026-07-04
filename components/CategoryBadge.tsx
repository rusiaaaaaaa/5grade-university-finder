import { ADMISSION_CATEGORY_META } from "@/lib/scoring";
import type { AdmissionCategory } from "@/lib/types";

const categoryTone: Record<AdmissionCategory, string> = {
  veryStable: "border-emerald-200 bg-emerald-50 text-emerald-700",
  stable: "border-blue-200 bg-blue-50 text-blue-700",
  appropriate: "border-sky-200 bg-sky-50 text-sky-700",
  ambitious: "border-indigo-200 bg-indigo-50 text-indigo-700",
  reach: "border-red-200 bg-red-50 text-red-700"
};

export default function CategoryBadge({ category }: { category: AdmissionCategory }) {
  const meta = ADMISSION_CATEGORY_META[category];

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${categoryTone[category]}`}>
      {meta.label}
    </span>
  );
}
