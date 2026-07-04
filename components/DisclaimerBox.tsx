import { Info } from "lucide-react";

export default function DisclaimerBox({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-blue-950">
      <div className="flex gap-3">
        <span className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white text-blue-600 ring-1 ring-blue-100">
          <Info aria-hidden className="h-5 w-5" />
        </span>
        <div className="space-y-2">
          <p className="font-black tracking-tight">추천 기준 안내</p>
          <p className={compact ? "text-sm leading-6 text-slate-600" : "text-sm leading-7 text-slate-600"}>
            입력한 현재 내신과 선택 조건을 바탕으로 대학과 학과를 5단계로 정리합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
