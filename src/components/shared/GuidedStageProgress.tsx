import type { GuidedStageItem } from '@/lib/mockDemoStageProgress';

export function GuidedStageProgress({ stages }: { stages: GuidedStageItem[] }) {
  return (
    <div className="mb-6 rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[#101011] px-4 py-4 md:px-5">
      <div className="flex items-center justify-between gap-2 md:gap-3">
        {stages.map((stage, index) => {
          const isCompleted = stage.status === 'completed';
          const isActive = stage.status === 'active';

          return (
            <div key={stage.key} className="min-w-0 flex-1">
              <div
                className={`h-1.5 w-full rounded-full transition-all ${
                  isActive
                    ? 'bg-[#FF843D] shadow-[0_0_18px_rgba(255,132,61,0.35)]'
                    : isCompleted
                      ? 'bg-[rgba(255,132,61,0.7)]'
                      : 'bg-[#242427]'
                }`}
              />
              <div
                className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors md:text-[11px] ${
                  isActive
                    ? 'text-[#FFFFFF]'
                    : isCompleted
                      ? 'text-[#D8B39B]'
                      : 'text-[#6F6F77]'
                }`}
              >
                {stage.label}
              </div>
              {index < stages.length - 1 ? <div className="sr-only" /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
