import { clamp, roundTo } from "@/lib/scoring";

export default function ScoreBar({
  label,
  value,
  tone = "bg-blue-600"
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  const safeValue = roundTo(clamp(value, 0, 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="tabular-nums font-black text-ink">{safeValue.toFixed(1)}</span>
      </div>
      <div
        aria-label={`${label} ${safeValue.toFixed(1)}점`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={safeValue}
        className="h-2.5 overflow-hidden rounded-full bg-blue-50 ring-1 ring-blue-100"
        role="progressbar"
      >
        <div className={`h-full rounded-full ${tone} transition-all duration-500`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
