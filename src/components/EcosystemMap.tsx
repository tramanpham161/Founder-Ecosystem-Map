import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Organisation } from '../types';
import { SECTOR_COLORS, STATUS_STYLES } from '../data/organisations';

interface EcosystemMapProps {
  organisations: Organisation[];
  selectedOrganisation: Organisation | null;
  onSelectOrganisation: (org: Organisation) => void;
  onOpenMessageModal: (org: Organisation) => void;
}

export const EcosystemMap: React.FC<EcosystemMapProps> = ({
  organisations,
  selectedOrganisation,
  onSelectOrganisation,
  onOpenMessageModal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const prevFilterLengthRef = useRef<number>(-1);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default view: entire UK [lat 54.5, lng -3.0]
      const map = L.map(mapContainerRef.current, {
        center: [54.5, -3.0],
        zoom: 5.5,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Positron clean light tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Attribution
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://carto.com/" target="_blank">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OSM</a>')
        .addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Auto-fit UK bounds on filter change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    if (organisations.length === 0) return;

    const bounds = L.latLngBounds([]);

    organisations.forEach((org) => {
      const isSelected = selectedOrganisation?.id === org.id;
      const sectorStyle = SECTOR_COLORS[org.sector] || { hex: '#26B7BD' };
      const statusStyle = STATUS_STYLES[org.status] || {
        hex: '#3EB049',
        text: 'text-[#2c8535]',
      };

      const markerSize = isSelected ? 24 : 16;
      const customIcon = L.divIcon({
        className: 'custom-ecosystem-pin',
        html: `
          <div style="
            width: ${markerSize}px;
            height: ${markerSize}px;
            background-color: ${sectorStyle.hex};
            border: 2px solid #ffffff;
            border-radius: 9999px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
            transition: transform 0.2s ease;
            cursor: pointer;
            ${isSelected ? 'box-shadow: 0 0 0 4px rgba(38, 183, 189, 0.5); transform: scale(1.15);' : ''}
          "></div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2],
        popupAnchor: [0, -(markerSize / 2 + 6)],
      });

      const marker = L.marker(org.coordinates, {
        icon: customIcon,
        zIndexOffset: isSelected ? 10000 : 100,
      });

      // Simplified popup without nested boxes
      const popupHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; width: 230px; padding: 12px; background: #ffffff; border-radius: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 600; color: #51615a;">
              ${org.locationDisplay}
            </span>
            <div style="display: flex; align-items: center; gap: 4px; font-size: 10px; color: ${statusStyle.hex}; font-weight: 600;">
              <span style="width: 6px; height: 6px; border-radius: 9999px; background-color: ${statusStyle.hex}; display: inline-block;"></span>
              <span>${org.status.split('/')[0].trim()}</span>
            </div>
          </div>

          <h4 style="font-size: 13px; font-weight: 700; color: #1a2521; line-height: 1.25; margin: 0 0 6px 0;">
            ${org.name}
          </h4>

          <p style="font-size: 11px; color: #51615a; line-height: 1.35; margin: 0 0 10px 0;">
            ${org.activeInitiative}
          </p>

          <div style="display: flex; gap: 6px;">
            <button id="map-popup-detail-btn-${org.id}" style="flex: 1; background: #26B7BD; color: #ffffff; border: none; padding: 6px 0; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; text-align: center;">
              View details
            </button>
            <button id="map-popup-msg-btn-${org.id}" style="background: #f4f4f0; color: #1a2521; border: 1px solid #d8d8d2; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
              Message
            </button>
          </div>
        </div>
      `;

      const popup = L.popup({
        closeButton: false,
        offset: [0, -6],
        className: 'custom-oaha-popup',
      }).setContent(popupHtml);

      marker.bindPopup(popup);

      marker.on('click', () => {
        onSelectOrganisation(org);
      });

      marker.on('popupopen', () => {
        const detailBtn = document.getElementById(`map-popup-detail-btn-${org.id}`);
        const msgBtn = document.getElementById(`map-popup-msg-btn-${org.id}`);

        if (detailBtn) {
          detailBtn.onclick = (e) => {
            e.stopPropagation();
            onSelectOrganisation(org);
          };
        }
        if (msgBtn) {
          msgBtn.onclick = (e) => {
            e.stopPropagation();
            onOpenMessageModal(org);
          };
        }
      });

      marker.addTo(map);
      markersRef.current.set(org.id, marker);
      bounds.extend(org.coordinates);
    });

    // Whenever filtered list changes or initializes, automatically fit bounds so all dots across UK are visible!
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [35, 35],
        maxZoom: 7,
        animate: true,
      });
    }

    prevFilterLengthRef.current = organisations.length;
  }, [organisations, onSelectOrganisation, onOpenMessageModal]);

  // When selectedOrganisation changes, pan to that specific marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedOrganisation) return;

    const marker = markersRef.current.get(selectedOrganisation.id);
    if (marker) {
      marker.setZIndexOffset(10000);
      map.flyTo(selectedOrganisation.coordinates, Math.max(map.getZoom(), 8), {
        animate: true,
        duration: 1.0,
      });
      setTimeout(() => {
        marker.openPopup();
      }, 350);
    }
  }, [selectedOrganisation]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleFitAllMarkers = () => {
    const map = mapInstanceRef.current;
    if (!map || organisations.length === 0) return;
    const bounds = L.latLngBounds(organisations.map((o) => o.coordinates));
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [35, 35], maxZoom: 7 });
    }
  };

  return (
    <div className="bg-white border border-[#e1e1db] rounded-xl overflow-hidden shadow-xs flex flex-col h-[540px] relative">
      {/* Map Header Bar */}
      <div className="px-4 py-2.5 bg-white border-b border-[#e1e1db] flex items-center justify-between z-10">
        <div>
          <h3 className="text-xs font-bold text-[#1a2521]">
            Geographical ecosystem distribution
          </h3>
          <p className="text-[11px] text-[#51615a]">
            {organisations.length} mapped organisations across UK regions
          </p>
        </div>

        {/* Map Control Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="map-fit-bounds-btn"
            onClick={handleFitAllMarkers}
            title="View all filtered UK pins"
            className="px-2.5 py-1 bg-white hover:bg-[#f4f4f0] border border-[#d8d8d2] text-[#1a2521] rounded-md text-xs font-semibold transition-colors"
          >
            Fit all UK pins
          </button>
          <button
            id="map-zoom-in-btn"
            onClick={handleZoomIn}
            title="Zoom in"
            className="w-7 h-7 bg-white hover:bg-[#f4f4f0] border border-[#d8d8d2] text-[#1a2521] rounded-md text-xs font-bold transition-colors flex items-center justify-center"
          >
            +
          </button>
          <button
            id="map-zoom-out-btn"
            onClick={handleZoomOut}
            title="Zoom out"
            className="w-7 h-7 bg-white hover:bg-[#f4f4f0] border border-[#d8d8d2] text-[#1a2521] rounded-md text-xs font-bold transition-colors flex items-center justify-center"
          >
            −
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Sector Legend (OAHA Palette) */}
        <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-xs border border-[#e1e1db] rounded-lg p-2.5 shadow-xs max-w-[220px]">
          <div className="text-[10px] font-bold text-[#51615a] mb-1.5">
            Sector legend
          </div>
          <div className="space-y-1 text-[11px] text-[#1a2521]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#26B7BD] shrink-0"></span>
              <span className="truncate">Education / HE / FE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3EB049] shrink-0"></span>
              <span className="truncate">VCSE / Community / Youth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8A9091] shrink-0"></span>
              <span className="truncate">Local authority / Public body</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F69C1A] shrink-0"></span>
              <span className="truncate">Employer / Private / Industry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
