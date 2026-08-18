import React, { useState } from 'react';
import { Organisation } from '../types';
import { SECTOR_CONFIG, STATUS_STYLES, DEMOGRAPHIC_LABELS } from '../data/organisations';

interface OrganisationDetailProps {
  organisation: Organisation | null;
  onOpenMessageModal: (org: Organisation) => void;
  onSelectAnother: (org: Organisation) => void;
  suggestedOrganisations: Organisation[];
}

export const OrganisationDetail: React.FC<OrganisationDetailProps> = ({
  organisation,
  onOpenMessageModal,
  onSelectAnother,
  suggestedOrganisations,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  if (!organisation) {
    return (
      <div className="bg-white border border-[#e1e1db] rounded-xl p-6 shadow-xs flex flex-col justify-between h-[540px] overflow-y-auto">
        <div className="flex flex-col items-center justify-center text-center my-auto px-4">
          <div className="w-10 h-10 rounded-full bg-[#26B7BD]/15 flex items-center justify-center text-[#166e73] mb-3 text-lg font-bold">
            •
          </div>
          <h3 className="text-base font-bold text-[#1a2521]">
            Select an organisation
          </h3>
          <p className="text-xs text-[#51615a] mt-1 max-w-sm">
            Click any pin on the map or select an entry from the directory below to review full details and contact routes.
          </p>
        </div>

        {suggestedOrganisations.length > 0 && (
          <div className="border-t border-[#e1e1db] pt-4">
            <span className="text-xs font-semibold text-[#51615a] block mb-2">
              Featured in current view:
            </span>
            <div className="space-y-1.5">
              {suggestedOrganisations.slice(0, 3).map((sug) => (
                <button
                  key={sug.id}
                  onClick={() => onSelectAnother(sug)}
                  className="w-full text-left p-2 bg-[#fbfbf9] hover:bg-[#f4f4f0] border border-[#e1e1db] rounded-lg transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-[#1a2521]">
                      {sug.name}
                    </h4>
                    <p className="text-[11px] text-[#51615a]">{sug.locationDisplay}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#26B7BD]">
                    View →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const sectorMeta = SECTOR_CONFIG[organisation.sector] || {
    hex: '#2563EB',
    bgClass: 'bg-[#2563EB]/10',
    textClass: 'text-[#2563EB]',
  };

  const statusMeta = STATUS_STYLES[organisation.status] || {
    hex: '#3EB049',
    text: 'text-[#2c8535]',
  };

  return (
    <div className="bg-white border border-[#e1e1db] rounded-xl shadow-xs flex flex-col h-[540px] overflow-hidden">
      {/* Detail Header */}
      <div className="p-4 sm:p-5 bg-white border-b border-[#e1e1db] shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1.5">
              {/* Sector indicator following legend */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1a2521]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: sectorMeta.hex }}
                />
                <span>{organisation.sector}</span>
              </div>

              {/* Status indicator (Dot + text) */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#51615a]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: statusMeta.hex }}
                ></span>
                <span>{organisation.status}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-[#1a2521] leading-snug">
              {organisation.name}
            </h3>

            <div className="flex items-center gap-2 text-xs text-[#51615a] mt-1 flex-wrap">
              <span>{organisation.locationDisplay}</span>
              {organisation.yearEstablished && (
                <>
                  <span>•</span>
                  <span>Est. {organisation.yearEstablished}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Body (Simplified layout without excessive boxes) */}
      <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
        {/* Leadership & Direct Contact Row */}
        <div className="bg-[#fbfbf9] border border-[#e5e5e0] rounded-lg p-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold text-[#51615a] block">
                Leadership
              </span>
              <h4 className="text-xs font-bold text-[#1a2521]">
                {organisation.director}
              </h4>
              <p className="text-[11px] text-[#51615a]">{organisation.directorRole}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="copy-org-email-btn"
                onClick={() => handleCopyEmail(organisation.email)}
                className="bg-white hover:bg-[#f4f4f0] border border-[#d8d8d2] text-[#1a2521] px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
              >
                {copiedEmail ? 'Copied' : 'Copy email'}
              </button>

              <a
                id="visit-org-website-btn"
                href={organisation.website}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#26B7BD] hover:bg-[#1fa0a6] text-white px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
              >
                Visit website ↗
              </a>
            </div>
          </div>
        </div>

        {/* Active Initiative */}
        <div>
          <span className="text-xs font-semibold text-[#51615a] block mb-1">
            Active initiative & venture focus
          </span>
          <p className="text-xs text-[#1a2521] leading-relaxed">
            {organisation.activeInitiative}
          </p>
        </div>

        {/* What They Are Seeking */}
        <div className="border-t border-[#e5e5e0] pt-3">
          <span className="text-xs font-semibold text-[#b86b04] block mb-1">
            What they are currently seeking
          </span>
          <p className="text-xs text-[#1a2521] leading-relaxed">
            {organisation.lookingFor}
          </p>
        </div>

        {/* Supported Stages (Clean text format, no box clutter) */}
        <div className="border-t border-[#e5e5e0] pt-3">
          <span className="text-xs font-semibold text-[#51615a] block mb-1">
            Supported stages
          </span>
          <p className="text-xs font-medium text-[#1a2521]">
            {organisation.stages.join(' • ')}
          </p>
        </div>

        {/* Continuous Support Tracks */}
        {organisation.crossCuttingPillars && organisation.crossCuttingPillars.length > 0 && (
          <div className="border-t border-[#e5e5e0] pt-3">
            <span className="text-xs font-semibold text-[#51615a] block mb-1">
              Continuous support tracks (Stages 01–05)
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {organisation.crossCuttingPillars.map((pillar) => (
                <span
                  key={pillar}
                  className="text-[11px] font-semibold text-[#1a2521] bg-[#f4f4f0] border border-[#d8d8d2] px-2 py-0.5 rounded"
                >
                  {pillar}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Demographic Focus (Clean text format) */}
        <div className="border-t border-[#e5e5e0] pt-3">
          <span className="text-xs font-semibold text-[#51615a] block mb-1">
            Founder community focus
          </span>
          <p className="text-xs text-[#1a2521]">
            {organisation.demographics
              .map((d) => DEMOGRAPHIC_LABELS[d]?.label || d)
              .join(', ')}
          </p>
        </div>

        {/* Funding Envelope & Key Partners */}
        {(organisation.fundingEnvelope || organisation.keyPartners) && (
          <div className="border-t border-[#e5e5e0] pt-3 space-y-2">
            {organisation.fundingEnvelope && (
              <div>
                <span className="text-[11px] font-semibold text-[#51615a] block">
                  Funding structure
                </span>
                <p className="text-xs font-bold text-[#1a2521]">
                  {organisation.fundingEnvelope}
                </p>
                {organisation.grantOrInvestment && (
                  <p className="text-[11px] text-[#51615a]">
                    {organisation.grantOrInvestment}
                  </p>
                )}
              </div>
            )}

            {organisation.keyPartners && (
              <div>
                <span className="text-[11px] font-semibold text-[#51615a] block">
                  Key ecosystem partners
                </span>
                <p className="text-xs text-[#1a2521]">
                  {organisation.keyPartners.join(', ')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="p-3.5 bg-[#fbfbf9] border-t border-[#e1e1db] shrink-0 flex items-center justify-between gap-3">
        <span className="text-xs text-[#51615a] truncate">
          {organisation.email}
        </span>

        <button
          id="send-direct-message-btn"
          onClick={() => onOpenMessageModal(organisation)}
          className="bg-[#F79B1C] hover:bg-[#e08912] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          Send message
        </button>
      </div>
    </div>
  );
};
