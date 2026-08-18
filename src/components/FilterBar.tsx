import React from 'react';
import {
  LocationOption,
  DemographicOption,
  StageOption,
  CrossCuttingPillar,
} from '../types';
import {
  LOCATIONS_LIST,
  DEMOGRAPHICS_LIST,
  DEMOGRAPHIC_LABELS,
} from '../data/organisations';

interface FilterBarProps {
  selectedLocations: LocationOption[];
  onToggleLocation: (loc: LocationOption) => void;
  selectedDemographics: DemographicOption[];
  onToggleDemographic: (demo: DemographicOption) => void;
  selectedStage: StageOption | null;
  onClearStage: () => void;
  selectedPillar?: CrossCuttingPillar | null;
  onClearPillar?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalFilteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedLocations,
  onToggleLocation,
  selectedDemographics,
  onToggleDemographic,
  selectedStage,
  onClearStage,
  selectedPillar,
  onClearPillar,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <section className="bg-[#fbfbf9] border-b border-[#e1e1db] px-4 sm:px-6 lg:px-8 py-5">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* ROW 1: Location Filter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1a2521]">
                Location
              </span>
              <span className="text-[11px] text-[#51615a]">
                (Select one or multiple nations)
              </span>
            </div>
            {selectedLocations.length > 0 && (
              <span className="text-[11px] font-semibold text-[#166e73]">
                {selectedLocations.length} selected
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {LOCATIONS_LIST.map((loc) => {
              const isSelected = selectedLocations.includes(loc);

              return (
                <button
                  key={loc}
                  id={`filter-location-${loc.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onToggleLocation(loc)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#26B7BD] text-white border border-[#26B7BD]'
                      : 'bg-white hover:bg-[#f4f4f0] border border-[#d8d8d2] text-[#1a2521]'
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </div>

        {/* ROW 2: Founder Community Focus */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1a2521]">
                Founder community focus
              </span>
              <span className="text-[11px] text-[#51615a]">
                (Multi-select focus groups)
              </span>
            </div>
            {selectedDemographics.length > 0 && (
              <span className="text-[11px] font-semibold text-[#2c8535]">
                {selectedDemographics.length} selected
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {DEMOGRAPHICS_LIST.map((demo) => {
              const isSelected = selectedDemographics.includes(demo);
              const meta = DEMOGRAPHIC_LABELS[demo];

              return (
                <button
                  key={demo}
                  id={`filter-type-${demo.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onToggleDemographic(demo)}
                  title={meta?.description || demo}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-[#3EB049] text-white border border-[#3EB049]'
                      : 'bg-white hover:bg-[#f4f4f0] border border-[#d8d8d2] text-[#1a2521]'
                  }`}
                >
                  {meta?.label || demo}
                </button>
              );
            })}
          </div>
        </div>

        {/* SEARCH & ACTIVE CRITERIA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#e5e5e0]">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#51615a] font-medium">Active criteria:</span>

            {selectedLocations.length === 0 && selectedDemographics.length === 0 && !selectedStage && !selectedPillar && (
              <span className="text-[#51615a] italic text-xs">
                All UK regions and founder backgrounds
              </span>
            )}

            {selectedLocations.map((loc) => (
              <button
                key={loc}
                onClick={() => onToggleLocation(loc)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a2521] bg-white border border-[#d8d8d2] px-2.5 py-0.5 rounded-md hover:border-[#8A9091]"
                title="Click to remove"
              >
                <span>{loc}</span>
                <span className="text-[#8A9091] hover:text-[#1a2521]">×</span>
              </button>
            ))}

            {selectedDemographics.map((demo) => (
              <button
                key={demo}
                onClick={() => onToggleDemographic(demo)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a2521] bg-white border border-[#d8d8d2] px-2.5 py-0.5 rounded-md hover:border-[#8A9091]"
                title="Click to remove"
              >
                <span>{DEMOGRAPHIC_LABELS[demo]?.shortLabel || demo}</span>
                <span className="text-[#8A9091] hover:text-[#1a2521]">×</span>
              </button>
            ))}

            {selectedStage && (
              <button
                onClick={onClearStage}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F69C1A] bg-white border border-[#F69C1A]/50 px-2.5 py-0.5 rounded-md hover:bg-[#F69C1A]/10"
                title="Click to clear stage filter"
              >
                <span>Stage: {selectedStage}</span>
                <span>×</span>
              </button>
            )}

            {selectedPillar && (
              <button
                onClick={onClearPillar}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#26B7BD] bg-white border border-[#26B7BD]/50 px-2.5 py-0.5 rounded-md hover:bg-[#26B7BD]/10"
                title="Click to clear cross-cutting pillar filter"
              >
                <span>Track: {selectedPillar}</span>
                <span>×</span>
              </button>
            )}
          </div>

          <div className="w-full sm:w-72">
            <input
              id="search-organisations-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, city, initiative..."
              className="w-full bg-white border border-[#d8d8d2] focus:border-[#26B7BD] focus:ring-1 focus:ring-[#26B7BD] text-xs text-[#1a2521] placeholder-[#8A9091] rounded-lg px-3 py-1.5 transition-all outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
