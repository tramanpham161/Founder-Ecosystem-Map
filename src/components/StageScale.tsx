import React from 'react';
import { StageOption } from '../types';
import { STAGES_LIST, STAGE_CONFIG } from '../data/organisations';

interface StageScaleProps {
  stageCounts: Record<StageOption, number>;
  selectedStage: StageOption | null;
  onSelectStage: (stage: StageOption | null) => void;
  totalFiltered: number;
}

export const StageScale: React.FC<StageScaleProps> = ({
  stageCounts,
  selectedStage,
  onSelectStage,
  totalFiltered,
}) => {
  const countsArray = STAGES_LIST.map((stage) => stageCounts[stage] || 0);
  const maxCount = Math.max(...countsArray, 1);

  // Dynamic circle diameter with pronounced size differences (38px to 96px)
  const getCircleSize = (count: number) => {
    if (count === 0) return 38;
    const minSize = 40;
    const maxSize = 96;
    const ratio = Math.pow(count / maxCount, 1.1);
    return Math.round(minSize + ratio * (maxSize - minSize));
  };

  return (
    <section className="bg-[#fbfbf9] border-b border-[#e1e1db] px-4 sm:px-6 lg:px-8 py-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#1a2521]">
              Founder journey stage distribution
            </h2>
            <p className="text-xs text-[#51615a] mt-0.5">
              Circle dimensions reflect the relative volume of support programmes available across venture milestones
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#51615a]">
              Filter by milestone:
            </span>
            {selectedStage && (
              <button
                id="clear-stage-selection-btn"
                onClick={() => onSelectStage(null)}
                className="text-[11px] font-semibold text-[#166e73] hover:underline"
              >
                Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Pipeline with Connected Stage Line */}
        <div className="py-5 px-3 sm:px-6 bg-white border border-[#e1e1db] rounded-xl overflow-x-auto relative">
          {/* Connecting Line between all stage circles (Desktop view across all 5 milestones) */}
          <div className="hidden md:block absolute top-[82px] left-[10%] right-[10%] h-[3px] bg-[#d8d8d2] z-0 pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-2 min-w-[580px] md:min-w-0 relative z-10">
            {STAGES_LIST.map((stage, index) => {
              const count = stageCounts[stage] || 0;
              const size = getCircleSize(count);
              const isSelected = selectedStage === stage;
              const config = STAGE_CONFIG[stage];
              const percentage = totalFiltered > 0 ? Math.round((count / totalFiltered) * 100) : 0;

              return (
                <div
                  key={stage}
                  onClick={() => onSelectStage(isSelected ? null : stage)}
                  className={`flex flex-col items-center text-center cursor-pointer p-2.5 rounded-lg transition-all relative ${
                    isSelected
                      ? 'bg-[#f4f4f0] ring-2 ring-[#1a2521]'
                      : 'hover:bg-[#fbfbf9]'
                  }`}
                >
                  <span className="text-[10px] font-semibold text-[#51615a] mb-2">
                    Stage {config.stepNumber}
                  </span>

                  {/* Sized Solid Circle sitting on the connecting line */}
                  <div className="h-[104px] flex items-center justify-center relative w-full">
                    {/* Circle */}
                    <div
                      id={`stage-circle-${index + 1}`}
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        backgroundColor: config.color,
                        color: config.textColor,
                      }}
                      className={`rounded-full flex flex-col items-center justify-center transition-all duration-300 relative z-10 shadow-xs ring-4 ring-white ${
                        isSelected ? 'scale-110 shadow-md ring-4 ring-[#1a2521]/20' : ''
                      }`}
                    >
                      <span className="text-sm sm:text-base font-bold leading-none">
                        {count}
                      </span>
                      {size >= 52 && (
                        <span className="text-[8.5px] font-medium opacity-90 leading-none mt-0.5">
                          {count === 1 ? 'org' : 'orgs'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stage Label & Details */}
                  <div className="mt-2">
                    <h3 className={`text-xs font-semibold leading-tight ${isSelected ? 'text-[#1a2521] font-bold' : 'text-[#1a2521]'}`}>
                      {stage}
                    </h3>
                    <p className="text-[10px] text-[#51615a] mt-0.5">
                      {percentage}% of active
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
