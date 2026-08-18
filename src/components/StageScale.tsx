import React from 'react';
import { StageOption, CrossCuttingPillar } from '../types';
import {
  STAGES_LIST,
  STAGE_CONFIG,
  CROSS_CUTTING_PILLARS,
  CROSS_CUTTING_CONFIG,
} from '../data/organisations';

interface StageScaleProps {
  stageCounts: Record<StageOption, number>;
  selectedStage: StageOption | null;
  onSelectStage: (stage: StageOption | null) => void;
  pillarCounts: Record<CrossCuttingPillar, number>;
  selectedPillar: CrossCuttingPillar | null;
  onSelectPillar: (pillar: CrossCuttingPillar | null) => void;
  totalFiltered: number;
}

export const StageScale: React.FC<StageScaleProps> = ({
  stageCounts,
  selectedStage,
  onSelectStage,
  pillarCounts,
  selectedPillar,
  onSelectPillar,
  totalFiltered,
}) => {
  const countsArray = STAGES_LIST.map((stage) => stageCounts[stage] || 0);
  const maxCount = Math.max(...countsArray, 1);

  // Dynamic circle diameter with pronounced size differences (38px to 92px)
  const getCircleSize = (count: number) => {
    if (count === 0) return 38;
    const minSize = 40;
    const maxSize = 92;
    const ratio = Math.pow(count / maxCount, 1.1);
    return Math.round(minSize + ratio * (maxSize - minSize));
  };

  return (
    <section className="bg-[#fbfbf9] border-b border-[#e1e1db] px-4 sm:px-6 lg:px-8 py-5">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-[#1a2521]">
                Founder journey stage & cross-cutting distribution
              </h2>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-[#1a2521]/10 text-[#1a2521] px-2 py-0.5 rounded">
                Framework
              </span>
            </div>
            <p className="text-xs text-[#51615a] mt-0.5">
              5 sequential venture maturity milestones underpinned by 3 continuous support tracks running across all stages
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {(selectedStage || selectedPillar) && (
              <button
                id="clear-stage-pillar-selection-btn"
                onClick={() => {
                  onSelectStage(null);
                  onSelectPillar(null);
                }}
                className="text-[11px] font-semibold text-[#166e73] hover:underline flex items-center gap-1"
              >
                <span>Clear framework filter</span>
                <span>×</span>
              </button>
            )}
          </div>
        </div>

        {/* Master Framework Canvas: Sequential Milestones + Continuous Enablers */}
        <div className="bg-white border border-[#e1e1db] rounded-xl p-4 sm:p-5 shadow-xs space-y-5">
          {/* TIER 1: Sequential Venture Milestones (Stages 1 – 5) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1a2521]">
                  Sequential venture milestones
                </span>
                <span className="text-[11px] text-[#51615a]">
                  (Click any stage circle to filter)
                </span>
              </div>
              <span className="text-[11px] text-[#51615a] hidden sm:inline">
                Ideation → Scale
              </span>
            </div>

            {/* Pipeline Container */}
            <div className="py-3 px-2 sm:px-4 bg-[#fbfbf9] border border-[#e5e5e0] rounded-lg overflow-x-auto relative">
              {/* Connecting Horizontal Line across all 5 milestones */}
              <div className="hidden md:block absolute top-[74px] left-[10%] right-[10%] h-[3px] bg-[#d8d8d2] z-0 pointer-events-none" />

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-2 min-w-[560px] md:min-w-0 relative z-10">
                {STAGES_LIST.map((stage, index) => {
                  const count = stageCounts[stage] || 0;
                  const size = getCircleSize(count);
                  const isSelected = selectedStage === stage;
                  const config = STAGE_CONFIG[stage];
                  const percentage =
                    totalFiltered > 0
                      ? Math.round((count / totalFiltered) * 100)
                      : 0;

                  return (
                    <div
                      key={stage}
                      onClick={() => {
                        onSelectStage(isSelected ? null : stage);
                      }}
                      className={`flex flex-col items-center text-center cursor-pointer p-2 rounded-lg transition-all relative ${
                        isSelected
                          ? 'bg-white ring-2 ring-[#1a2521] shadow-xs'
                          : 'hover:bg-white/80'
                      }`}
                    >
                      <span className="text-[10px] font-bold text-[#51615a] mb-1.5">
                        Stage {config.stepNumber}
                      </span>

                      {/* Sized Solid Circle sitting on the connecting line */}
                      <div className="h-[96px] flex items-center justify-center relative w-full">
                        <div
                          id={`stage-circle-${index + 1}`}
                          style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            backgroundColor: config.color,
                            color: config.textColor,
                          }}
                          className={`rounded-full flex flex-col items-center justify-center transition-all duration-300 relative z-10 shadow-xs ring-4 ring-[#fbfbf9] ${
                            isSelected
                              ? 'scale-110 shadow-md ring-4 ring-[#1a2521]/20'
                              : 'hover:scale-105'
                          }`}
                        >
                          <span className="text-sm sm:text-base font-bold leading-none">
                            {count}
                          </span>
                          {size >= 50 && (
                            <span className="text-[8px] font-medium opacity-90 leading-none mt-0.5">
                              {count === 1 ? 'org' : 'orgs'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stage Label & Details */}
                      <div className="mt-1.5">
                        <h3
                          className={`text-xs font-semibold leading-tight ${
                            isSelected
                              ? 'text-[#1a2521] font-bold'
                              : 'text-[#1a2521]'
                          }`}
                        >
                          {stage}
                        </h3>
                        <p className="text-[10px] text-[#51615a] mt-0.5">
                          {percentage}% of view
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TIER 2: Continuous Support Tracks (Arrows running left to right from Stage 1 to 5 with proportional thickness & shade) */}
          <div className="pt-3 border-t border-[#e5e5e0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1a2521]">
                Continuous support tracks
              </span>
              <span className="text-[11px] text-[#51615a]">
                Arrows span Stage 01 → 05 • Line thickness & shade indicate organisation volume
              </span>
            </div>

            {/* Continuous tracks spanning full width */}
            <div className="space-y-2">
              {CROSS_CUTTING_PILLARS.map((pillar) => {
                const config = CROSS_CUTTING_CONFIG[pillar];
                const count = pillarCounts[pillar] || 0;
                const isSelected = selectedPillar === pillar;
                const minPillarCount = Math.min(
                  ...CROSS_CUTTING_PILLARS.map((p) => pillarCounts[p] || 0)
                );
                const maxPillarCount = Math.max(
                  ...CROSS_CUTTING_PILLARS.map((p) => pillarCounts[p] || 0),
                  1
                );
                const countSpread = maxPillarCount - minPillarCount;
                const relativeRatio =
                  countSpread > 0 ? (count - minPillarCount) / countSpread : 0.5;

                // Refined thickness scale: 1.5px (fewest orgs) to 6px (most orgs)
                const thickness = Math.round((1.5 + relativeRatio * 4.5) * 2) / 2;

                // High-contrast shade: 0.20 (very transparent) to 1.0 (deep solid shade)
                const shadeOpacity = Math.max(
                  0.20,
                  Math.min(1.0, 0.20 + relativeRatio * 0.80)
                );
                const arrowSize = Math.max(8, Math.round(thickness * 2.2));

                return (
                  <div
                    key={pillar}
                    id={`pillar-track-${pillar.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    onClick={() => onSelectPillar(isSelected ? null : pillar)}
                    className={`w-full py-2.5 px-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'shadow-xs'
                        : 'bg-[#fbfbf9] hover:bg-[#f2f2ee] border-[#e1e1db]'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${config.color}15` : undefined,
                      borderColor: isSelected ? `${config.color}50` : undefined,
                    }}
                  >
                    {/* Title in the middle on top of the line */}
                    <div className="flex items-center justify-center gap-2 mb-1.5 text-center">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: isSelected ? config.color : '#1a2521' }}
                      >
                        {config.title}
                      </span>
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${config.color}20`,
                          color: config.color,
                        }}
                      >
                        {count} {count === 1 ? 'organisation' : 'organisations'}
                      </span>
                    </div>

                    {/* Arrow running from left to right with thickness & shade reflecting number of organisations */}
                    <div
                      className="w-full flex items-center transition-opacity duration-300"
                      style={{ opacity: isSelected ? 1 : shadeOpacity }}
                    >
                      <div
                        className="flex-1 rounded-l-full transition-all duration-300"
                        style={{
                          height: `${thickness}px`,
                          backgroundColor: config.color,
                        }}
                      />
                      <svg
                        width={arrowSize}
                        height={arrowSize}
                        viewBox="0 0 12 12"
                        className="shrink-0 -ml-[1px]"
                      >
                        <path
                          d="M 1 2 L 10 6 L 1 10 Z"
                          fill={config.color}
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
