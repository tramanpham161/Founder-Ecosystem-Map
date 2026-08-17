import React, { useState, useMemo } from 'react';
import { Organisation } from '../types';
import { SECTOR_CONFIG, STATUS_STYLES } from '../data/organisations';

interface OrganisationTableProps {
  organisations: Organisation[];
  selectedOrganisation: Organisation | null;
  onSelectOrganisation: (org: Organisation) => void;
  onOpenMessageModal: (org: Organisation) => void;
}

type SortField = 'number' | 'name' | 'location' | 'stages';
type SortOrder = 'asc' | 'desc';

export const OrganisationTable: React.FC<OrganisationTableProps> = ({
  organisations,
  selectedOrganisation,
  onSelectOrganisation,
}) => {
  const [tableSearch, setTableSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('number');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(5);

  const handleCopyEmail = (e: React.MouseEvent, orgId: string, email: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmailId(orgId);
    setTimeout(() => setCopiedEmailId(null), 2000);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedOrganisations = useMemo(() => {
    let list = [...organisations];

    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      list = list.filter(
        (org) =>
          org.name.toLowerCase().includes(q) ||
          org.director.toLowerCase().includes(q) ||
          org.city.toLowerCase().includes(q) ||
          org.lookingFor.toLowerCase().includes(q) ||
          org.stages.some((s) => s.toLowerCase().includes(q)) ||
          org.demographics.some((d) => d.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter((org) => org.status === statusFilter);
    }

    list.sort((a, b) => {
      let comp = 0;
      if (sortField === 'name') {
        comp = a.name.localeCompare(b.name);
      } else if (sortField === 'location') {
        comp = a.city.localeCompare(b.city);
      } else if (sortField === 'stages') {
        comp = a.stages.length - b.stages.length;
      }
      return sortOrder === 'asc' ? comp : -comp;
    });

    return list;
  }, [organisations, tableSearch, statusFilter, sortField, sortOrder]);

  const displayedOrganisations = useMemo(() => {
    return filteredAndSortedOrganisations.slice(0, visibleCount);
  }, [filteredAndSortedOrganisations, visibleCount]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleShowAll = () => {
    setVisibleCount(filteredAndSortedOrganisations.length);
  };

  const handleShowLess = () => {
    setVisibleCount(5);
  };

  const handleExportCSV = () => {
    const headers = [
      'Number',
      'Organisation Name',
      'Sector',
      'Nation',
      'City',
      'Director',
      'Role',
      'Email',
      'Website',
      'Supported Stages',
      'Continuous Support Tracks',
      'Founder Demographics',
      'Looking For',
      'Status',
      'Funding Structure'
    ];

    const rows = filteredAndSortedOrganisations.map((org, idx) => [
      idx + 1,
      `"${org.name.replace(/"/g, '""')}"`,
      `"${org.sector}"`,
      `"${org.nation}"`,
      `"${org.city}"`,
      `"${org.director}"`,
      `"${org.directorRole}"`,
      `"${org.email}"`,
      `"${org.website}"`,
      `"${org.stages.join('; ')}"`,
      `"${(org.crossCuttingPillars || []).join('; ')}"`,
      `"${org.demographics.join('; ')}"`,
      `"${org.lookingFor.replace(/"/g, '""')}"`,
      `"${org.status}"`,
      `"${org.fundingEnvelope || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `oaha_uk_founder_ecosystem_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="bg-white border-t border-[#e1e1db] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Table Section Header with Search, Filter & Moved Export CSV Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-[#1a2521]">
                Full ecosystem directory & ledger
              </h2>
              <span className="text-[11px] font-semibold text-[#51615a] bg-[#fbfbf9] px-2 py-0.5 border border-[#e1e1db] rounded-md">
                {filteredAndSortedOrganisations.length > 5
                  ? `Showing ${displayedOrganisations.length} of ${filteredAndSortedOrganisations.length} listed`
                  : `${filteredAndSortedOrganisations.length} listed`}
              </span>
            </div>
            <p className="text-xs text-[#51615a] mt-0.5">
              Comprehensive list of support organisations matching your active filter criteria
            </p>
          </div>

          {/* Quick Table Filtering Controls & Export CSV Button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search ledger..."
              className="bg-[#fbfbf9] border border-[#d8d8d2] focus:border-[#26B7BD] text-xs text-[#1a2521] placeholder-[#8A9091] rounded-lg px-3 py-1.5 outline-none w-44 sm:w-52"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#fbfbf9] border border-[#d8d8d2] text-xs font-semibold text-[#1a2521] rounded-lg px-2.5 py-1.5 outline-none"
            >
              <option value="all">All statuses</option>
              <option value="Active / Delivering now">Active / Delivering now</option>
              <option value="Planned / Co-funding needed">Planned / Co-funding needed</option>
              <option value="Past / Searchable ledger">Past / Searchable ledger</option>
              <option value="At risk / Ending cycle">At risk / Ending cycle</option>
            </select>

            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              className="bg-[#26B7BD] hover:bg-[#1fa0a6] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs"
              title="Download CSV spreadsheet of current list"
            >
              <span>Export CSV</span>
              <span className="text-[10px] opacity-80">↓</span>
            </button>
          </div>
        </div>

        {/* Directory Table Frame */}
        <div className="border border-[#e1e1db] rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[920px]">
              <thead>
                <tr className="bg-[#25B4BE] text-[11px] font-bold text-white uppercase tracking-wider border-b border-[#1fa0a6]">
                  <th className="py-3 px-3 w-10 text-center text-white/90">#</th>
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3 px-4 cursor-pointer text-white hover:text-[#1a2521] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Organisation name & sector</span>
                      {sortField === 'name' && (
                        <span className="text-[#1a2521] text-[10px] font-black">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('location')}
                    className="py-3 px-4 cursor-pointer text-white hover:text-[#1a2521] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Location</span>
                      {sortField === 'location' && (
                        <span className="text-[#1a2521] text-[10px] font-black">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-white">Leadership</th>
                  <th className="py-3 px-3 text-white">Contact</th>
                  <th
                    onClick={() => handleSort('stages')}
                    className="py-3 px-4 cursor-pointer text-white hover:text-[#1a2521] transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Supported stages</span>
                      {sortField === 'stages' && (
                        <span className="text-[#1a2521] text-[10px] font-black">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-4 min-w-[200px] text-white">What they are seeking</th>
                  <th className="py-3 px-4 text-center text-white">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e0] text-xs">
                {displayedOrganisations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-xs text-[#51615a]">
                      No organisations match the specified ledger query.
                    </td>
                  </tr>
                ) : (
                  displayedOrganisations.map((org, index) => {
                    const isSelected = selectedOrganisation?.id === org.id;
                    const sectorMeta = SECTOR_CONFIG[org.sector] || {
                      hex: '#2563EB',
                      bgClass: 'bg-[#2563EB]/10',
                      textClass: 'text-[#2563EB]',
                    };
                    const statusMeta = STATUS_STYLES[org.status] || {
                      hex: '#3EB049',
                      text: 'text-[#2c8535]',
                    };

                    return (
                      <tr
                        key={org.id}
                        id={`org-table-row-${org.id}`}
                        onClick={() => onSelectOrganisation(org)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#26B7BD]/10 border-l-3 border-l-[#26B7BD]'
                            : 'hover:bg-[#fbfbf9]'
                        }`}
                      >
                        {/* Number # */}
                        <td className="py-3 px-3 text-center text-[11px] text-[#8A9091]">
                          {index + 1}
                        </td>

                        {/* Organisation Name & Sector */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#1a2521] leading-tight">
                            {org.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-[#51615a]">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: sectorMeta.hex }}
                            />
                            <span>{org.sector}</span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3 px-4">
                          <div className="text-[#1a2521] font-medium">
                            {org.city}
                          </div>
                          <div className="text-[11px] text-[#51615a]">
                            {org.nation}
                          </div>
                        </td>

                        {/* Leadership */}
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#1a2521]">
                            {org.director}
                          </div>
                          <div className="text-[11px] text-[#51615a]">
                            {org.directorRole}
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleCopyEmail(e, org.id, org.email)}
                              className="px-2 py-1 bg-white hover:bg-[#f4f4f0] border border-[#d8d8d2] rounded text-[11px] font-semibold text-[#1a2521] transition-colors"
                              title={`Copy: ${org.email}`}
                            >
                              {copiedEmailId === org.id ? 'Copied' : 'Email'}
                            </button>

                            <a
                              href={org.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-white hover:bg-[#f4f4f0] border border-[#d8d8d2] rounded text-[11px] font-semibold text-[#1a2521] transition-colors"
                              title={`Visit: ${org.website}`}
                            >
                              ↗
                            </a>
                          </div>
                        </td>

                        {/* Supported Stages */}
                        <td className="py-3 px-4">
                          <div className="text-[11px] text-[#1a2521] font-medium leading-relaxed max-w-[240px]">
                            {org.stages.join(' • ')}
                          </div>
                        </td>

                        {/* What They Are Seeking */}
                        <td className="py-3 px-4">
                          <p className="text-[11px] text-[#51615a] line-clamp-2 leading-relaxed">
                            {org.lookingFor}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1a2521]">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: statusMeta.hex }}
                            ></span>
                            <span>{org.status.split('/')[0].trim()}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Show More / Show Less Controls */}
        {filteredAndSortedOrganisations.length > 5 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-[#51615a]">
              Showing <span className="font-bold text-[#1a2521]">{displayedOrganisations.length}</span> of{' '}
              <span className="font-bold text-[#1a2521]">{filteredAndSortedOrganisations.length}</span> organisations
            </p>

            <div className="flex items-center gap-2">
              {visibleCount < filteredAndSortedOrganisations.length ? (
                <>
                  <button
                    id="show-more-btn"
                    onClick={handleShowMore}
                    className="bg-[#26B7BD] hover:bg-[#1fa0a6] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>Show more</span>
                    <span className="text-[10px] opacity-90">↓</span>
                  </button>

                  <button
                    id="show-all-btn"
                    onClick={handleShowAll}
                    className="bg-white hover:bg-[#f8f8f6] border border-[#d8d8d2] text-[#1a2521] px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Show all ({filteredAndSortedOrganisations.length})
                  </button>
                </>
              ) : (
                <button
                  id="show-less-btn"
                  onClick={handleShowLess}
                  className="bg-white hover:bg-[#f8f8f6] border border-[#d8d8d2] text-[#1a2521] px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Show less (show 5)</span>
                  <span className="text-[10px]">↑</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
