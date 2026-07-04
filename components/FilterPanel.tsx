"use client";

import { SlidersHorizontal } from "lucide-react";
import { ADMISSION_CATEGORY_META, GRADE_SCALE } from "@/lib/scoring";
import { regions } from "@/lib/sampleData";
import {
  admissionTypeOptions,
  majorAreaOptions
} from "@/lib/universityRecommendation";
import type { MajorArea, RecommendationFilters, SortOption, UniversityType } from "@/lib/types";

const universityTypeLabels: Record<UniversityType, string> = {
  national: "국립",
  public: "공립",
  private: "사립"
};

const sortLabels: Partial<Record<SortOption, string>> = {
  closest: "가장 가까운 내신",
  majorFit: "학과 적합도 높은 순",
  safest: "안정 추천 우선",
  ambitious: "상향 추천 우선",
  region: "지역순"
};

const fieldClass =
  "mt-2 w-full rounded-xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100";

const labelClass = "text-sm font-black text-slate-700";

export default function FilterPanel({
  filters,
  onChange,
  sort,
  onSortChange
}: {
  filters: RecommendationFilters;
  onChange: (filters: RecommendationFilters) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}) {
  const update = <K extends keyof RecommendationFilters>(key: K, value: RecommendationFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const updateMajorArea = (majorArea: MajorArea | "") => {
    onChange({ ...filters, majorArea, departmentNames: [] });
  };

  return (
    <section className="rounded-3xl border border-blue-100 bg-white/95 p-5 shadow-soft print:hidden sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <SlidersHorizontal aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-black text-blue-600">Smart filters</p>
            <h2 className="text-xl font-black tracking-tight text-ink">추천 필터</h2>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-500">조건을 바꾸면 결과가 즉시 다시 정렬됩니다.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className={labelClass}>지역</span>
          <select className={fieldClass} value={filters.region} onChange={(event) => update("region", event.target.value)}>
            <option value="">전체</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>대학 유형</span>
          <select
            className={fieldClass}
            value={filters.universityType}
            onChange={(event) => update("universityType", event.target.value as RecommendationFilters["universityType"])}
          >
            <option value="">전체</option>
            {Object.entries(universityTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>전형</span>
          <select className={fieldClass} value={filters.admissionType} onChange={(event) => update("admissionType", event.target.value)}>
            <option value="">전체</option>
            {admissionTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>학과 분야</span>
          <select
            className={fieldClass}
            value={filters.majorArea}
            onChange={(event) => updateMajorArea(event.target.value as MajorArea | "")}
          >
            <option value="">전체</option>
            {majorAreaOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>안정도</span>
          <select className={fieldClass} value={filters.category} onChange={(event) => update("category", event.target.value as RecommendationFilters["category"])}>
            <option value="">전체</option>
            {Object.entries(ADMISSION_CATEGORY_META).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>최대 기준 등급</span>
          <input
            className={fieldClass}
            max={GRADE_SCALE.worst}
            min={GRADE_SCALE.best}
            placeholder="예: 3.0"
            step={0.1}
            type="number"
            value={filters.maxReferenceGrade}
            onChange={(event) => update("maxReferenceGrade", event.target.value)}
          />
        </label>

        <label className="block">
          <span className={labelClass}>최저학력기준</span>
          <select className={fieldClass} value={filters.csatRequired} onChange={(event) => update("csatRequired", event.target.value as RecommendationFilters["csatRequired"])}>
            <option value="all">전체</option>
            <option value="required">최저 있음</option>
            <option value="none">최저 없음 중심</option>
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>정렬</span>
          <select className={fieldClass} value={sort} onChange={(event) => onSortChange(event.target.value as SortOption)}>
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
