import React from 'react';
import { OahaLogo } from './OahaLogo';

interface HeaderProps {
  totalCount: number;
  filteredCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  filteredCount,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <header className="bg-white border-b border-[#e1e1db] px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* OAHA Logo & Website Brand */}
        <div className="flex items-center gap-4">
          <OahaLogo size="md" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a2521] tracking-tight">
              UK founder ecosystem & stage map
            </h1>
            <p className="text-xs text-[#51615a] mt-0.5">
              Regional founder support, stages of venture readiness, and community focus across the UK
            </p>
          </div>
        </div>

        {/* Counter & Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-[#fbfbf9] border border-[#e1e1db] rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs text-[#1a2521]">
            <span className="w-2 h-2 rounded-full bg-[#3EB049]"></span>
            <span className="font-bold text-[#1a2521]">{filteredCount}</span>
            <span className="text-[#51615a]">of {totalCount} organisations</span>
          </div>

          {hasActiveFilters && (
            <button
              id="reset-all-filters-btn"
              onClick={onResetFilters}
              className="bg-white hover:bg-[#f8f8f6] border border-[#e1e1db] text-[#51615a] hover:text-[#1a2521] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
