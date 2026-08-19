import { TIERS } from '../types/domain';

export function TierLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[27px] text-gray-400">
      {TIERS.map((t) => (
        <span key={t.code} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} />
          {t.label}
        </span>
      ))}
    </div>
  );
}
