import React from 'react';

interface OahaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const OahaLogo: React.FC<OahaLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const dimensions = {
    sm: { width: 39, height: 26 },
    md: { width: 51, height: 34 },
    lg: { width: 72, height: 48 },
    xl: { width: 108, height: 72 },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 300 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 rounded-xs overflow-hidden border border-[#d8d8d2] shadow-2xs bg-white"
        aria-label="OAHA Logo"
      >
        {/* Clean White Canvas Background */}
        <rect width="300" height="200" fill="#ffffff" />

        {/* 4 Corner Color Blocks (with clear white vertical channel in center for human figure) */}
        {/* Top-Left: Cyan / Teal Block */}
        <rect x="0" y="0" width="102" height="100" fill="#25B4BE" />

        {/* Top-Right: Leaf Green Block */}
        <rect x="198" y="0" width="102" height="100" fill="#3FB049" />

        {/* Bottom-Left: Warm Orange Block */}
        <rect x="0" y="100" width="102" height="100" fill="#F79B1C" />

        {/* Bottom-Right: Slate Grey Block */}
        <rect x="198" y="100" width="102" height="100" fill="#8A9091" />

        {/* Black Linework: OAHA Emblem / Human Figure Silhouette */}
        <g stroke="#000000" strokeWidth="16" strokeLinecap="square" strokeLinejoin="miter">
          {/* Head 'O' - Sits in the white center space at the top */}
          <circle cx="150" cy="52" r="37" fill="#ffffff" stroke="#000000" strokeWidth="16" />

          {/* Left 'A' (Starts in Orange block, peaks into Teal, meets Left H bar) */}
          <line x1="14" y1="185" x2="90" y2="100" />
          <line x1="90" y1="100" x2="122" y2="185" />

          {/* Middle 'H' Vertical Bars (Torso/Legs hanging down in white center space) */}
          <line x1="122" y1="100" x2="122" y2="185" />
          <line x1="178" y1="100" x2="178" y2="185" />

          {/* Right 'A' (Starts at Right H bar, peaks into Green, lands in Grey block) */}
          <line x1="178" y1="185" x2="210" y2="100" />
          <line x1="210" y1="100" x2="286" y2="185" />

          {/* Unified Horizontal Crossbar connecting Left A, H, and Right A */}
          <line x1="14" y1="155" x2="286" y2="155" />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-lg text-[#1a2521] tracking-tight leading-none">
            OAHA
          </span>
          <span className="text-[11px] font-medium text-[#51615a] leading-none mt-1">
            Founder Ecosystem & Stage Map
          </span>
        </div>
      )}
    </div>
  );
};
