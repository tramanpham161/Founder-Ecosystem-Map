import React, { useState, useMemo } from 'react';
import {
  Organisation,
  LocationOption,
  DemographicOption,
  StageOption,
} from './types';
import {
  ORGANISATIONS,
} from './data/organisations';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { StageScale } from './components/StageScale';
import { EcosystemMap } from './components/EcosystemMap';
import { OrganisationDetail } from './components/OrganisationDetail';
import { OrganisationTable } from './components/OrganisationTable';
import { SendMessageModal } from './components/SendMessageModal';

export default function App() {
  // State for Filters
  const [selectedLocations, setSelectedLocations] = useState<LocationOption[]>([]);
  const [selectedDemographics, setSelectedDemographics] = useState<DemographicOption[]>([]);
  const [selectedStage, setSelectedStage] = useState<StageOption | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected organisation for Map & Detail sync (default null so full UK map is in view)
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(null);

  // Modal States
  const [modalOrg, setModalOrg] = useState<Organisation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle Location in multi-select
  const handleToggleLocation = (loc: LocationOption) => {
    setSelectedLocations((prev) => {
      if (loc === 'UK') {
        if (prev.includes('UK')) {
          return [];
        }
        return ['UK'];
      } else {
        const withoutUK = prev.filter((item) => item !== 'UK');
        if (withoutUK.includes(loc)) {
          return withoutUK.filter((item) => item !== loc);
        } else {
          return [...withoutUK, loc];
        }
      }
    });
  };

  // Toggle Demographic in multi-select
  const handleToggleDemographic = (demo: DemographicOption) => {
    setSelectedDemographics((prev) => {
      if (prev.includes(demo)) {
        return prev.filter((d) => d !== demo);
      } else {
        return [...prev, demo];
      }
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedLocations([]);
    setSelectedDemographics([]);
    setSelectedStage(null);
    setSearchQuery('');
  };

  // Primary filtering logic
  const filteredOrganisations = useMemo(() => {
    return ORGANISATIONS.filter((org) => {
      // 1. Location match
      if (selectedLocations.length > 0) {
        if (!selectedLocations.includes('UK')) {
          const matchNation = selectedLocations.some((loc) => {
            if (loc === 'England' && (org.nation === 'England' || org.nation === 'UK-Wide')) return true;
            if (loc === 'Scotland' && (org.nation === 'Scotland' || org.nation === 'UK-Wide')) return true;
            if (loc === 'Wales' && (org.nation === 'Wales' || org.nation === 'UK-Wide')) return true;
            if (loc === 'Northern Ireland' && (org.nation === 'Northern Ireland' || org.nation === 'UK-Wide')) return true;
            return false;
          });
          if (!matchNation) return false;
        }
      }

      // 2. Demographic match
      if (selectedDemographics.length > 0) {
        const matchesDemo = selectedDemographics.some((demo) =>
          org.demographics.includes(demo)
        );
        if (!matchesDemo) return false;
      }

      // 3. Stage match
      if (selectedStage) {
        if (!org.stages.includes(selectedStage)) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          org.name.toLowerCase().includes(q) ||
          org.city.toLowerCase().includes(q) ||
          org.nation.toLowerCase().includes(q) ||
          org.director.toLowerCase().includes(q) ||
          org.lookingFor.toLowerCase().includes(q) ||
          org.activeInitiative.toLowerCase().includes(q) ||
          org.sector.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [selectedLocations, selectedDemographics, selectedStage, searchQuery]);

  // Compute Stage Counts based on currently active filtered organisations
  const stageCounts = useMemo(() => {
    const baseFiltered = ORGANISATIONS.filter((org) => {
      if (selectedLocations.length > 0 && !selectedLocations.includes('UK')) {
        const matchNation = selectedLocations.some((loc) => {
          if (loc === 'England' && (org.nation === 'England' || org.nation === 'UK-Wide')) return true;
          if (loc === 'Scotland' && (org.nation === 'Scotland' || org.nation === 'UK-Wide')) return true;
          if (loc === 'Wales' && (org.nation === 'Wales' || org.nation === 'UK-Wide')) return true;
          if (loc === 'Northern Ireland' && (org.nation === 'Northern Ireland' || org.nation === 'UK-Wide')) return true;
          return false;
        });
        if (!matchNation) return false;
      }
      if (selectedDemographics.length > 0) {
        const matchesDemo = selectedDemographics.some((demo) =>
          org.demographics.includes(demo)
        );
        if (!matchesDemo) return false;
      }
      return true;
    });

    const counts: Record<StageOption, number> = {
      'Awareness & ideation': 0,
      'Incubator': 0,
      'Accelerator': 0,
      'Investor readiness': 0,
      'Early finance & VC access': 0,
    };

    baseFiltered.forEach((org) => {
      org.stages.forEach((stg) => {
        if (counts[stg] !== undefined) {
          counts[stg]++;
        }
      });
    });

    return counts;
  }, [selectedLocations, selectedDemographics]);

  const handleSelectOrganisation = (org: Organisation) => {
    setSelectedOrganisation(org);
  };

  const handleOpenMessageModal = (org: Organisation) => {
    setModalOrg(org);
    setIsModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setIsModalOpen(false);
    setModalOrg(null);
  };

  const hasActiveFilters =
    selectedLocations.length > 0 ||
    selectedDemographics.length > 0 ||
    selectedStage !== null ||
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#26B7BD]/20 selection:text-[#166e73]">
      {/* 1. Header with OAHA Logo */}
      <Header
        totalCount={ORGANISATIONS.length}
        filteredCount={filteredOrganisations.length}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 2. Main Filters (Location, Founder Community Focus) */}
      <FilterBar
        selectedLocations={selectedLocations}
        onToggleLocation={handleToggleLocation}
        selectedDemographics={selectedDemographics}
        onToggleDemographic={handleToggleDemographic}
        selectedStage={selectedStage}
        onClearStage={() => setSelectedStage(null)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalFilteredCount={filteredOrganisations.length}
      />

      {/* 3. Horizontal Stage Scale (OAHA Solid Colors, Sized Circles with Connecting Pipeline Line) */}
      <StageScale
        stageCounts={stageCounts}
        selectedStage={selectedStage}
        onSelectStage={setSelectedStage}
        totalFiltered={filteredOrganisations.length}
      />

      {/* 4. Map (Left) and Organisation Details (Right) */}
      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Map covering all UK pins */}
          <div className="lg:col-span-7">
            <EcosystemMap
              organisations={filteredOrganisations}
              selectedOrganisation={selectedOrganisation}
              onSelectOrganisation={handleSelectOrganisation}
              onOpenMessageModal={handleOpenMessageModal}
            />
          </div>

          {/* Right: Organisation Key Detail */}
          <div className="lg:col-span-5">
            <OrganisationDetail
              organisation={selectedOrganisation}
              onOpenMessageModal={handleOpenMessageModal}
              onSelectAnother={handleSelectOrganisation}
              suggestedOrganisations={filteredOrganisations}
            />
          </div>
        </div>
      </main>

      {/* 5. Full Organisation Directory & Ledger (with Export CSV at top right) */}
      <OrganisationTable
        organisations={filteredOrganisations}
        selectedOrganisation={selectedOrganisation}
        onSelectOrganisation={handleSelectOrganisation}
        onOpenMessageModal={handleOpenMessageModal}
      />

      {/* 6. Clean Footer */}
      <footer className="bg-[#fbfbf9] border-t border-[#e1e1db] py-5 px-4 sm:px-6 lg:px-8 text-xs text-[#51615a]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} OAHA • UK Founder Ecosystem & Stage Map
          </p>
          <p className="text-[11px] text-[#8a9091]">
            Comprehensive regional and stage mapping for UK enterprise support
          </p>
        </div>
      </footer>

      {/* Direct Contact Modal */}
      <SendMessageModal
        organisation={modalOrg}
        isOpen={isModalOpen}
        onClose={handleCloseMessageModal}
      />
    </div>
  );
}
