import { useEffect, useRef, useState } from 'react';
import type { StructureMarker, VerificationStatus } from './mapData';
import {
  LULC_ZONES,
  NDVI_CELLS,
  NDWI_CELLS,
  STRUCTURE_MARKERS,
  WATERSHED_BOUNDARY,
} from './mapData';
import MarkerSidePanel from './MarkerSidePanel';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ─── Fix Leaflet default icon ───
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type LayerToggle = 'ndvi' | 'ndwi' | 'lulc';
type Epoch = 'before' | 'after';

// ─── Helper: NDVI value → hex color ───
const ndviToColor = (val: number): string => {
  if (val >= 0.5) return '#15803d';
  if (val >= 0.4) return '#22c55e';
  if (val >= 0.3) return '#86efac';
  if (val >= 0.2) return '#bbf7d0';
  return '#d4d4aa';
};

// ─── Helper: NDWI value → hex color ───
const ndwiToColor = (val: number): string => {
  if (val >= 0.35) return '#0369a1';
  if (val >= 0.20) return '#0ea5e9';
  if (val >= 0.05) return '#7dd3fc';
  if (val >= -0.05) return '#bae6fd';
  return 'transparent';
};

// ─── Helper: Status → icon HTML ───
const getMarkerIcon = (status: VerificationStatus, type: string): L.DivIcon => {
  const colors: Record<VerificationStatus, { bg: string; border: string; glow: string }> = {
    verified: { bg: '#22c55e', border: '#16a34a', glow: 'rgba(34,197,94,0.5)' },
    attention: { bg: '#f59e0b', border: '#d97706', glow: 'rgba(245,158,11,0.5)' },
    mismatch: { bg: '#ef4444', border: '#dc2626', glow: 'rgba(239,68,68,0.5)' },
  };
  const typeEmoji: Record<string, string> = {
    'Check Dam': '💧', 'Percolation Tank': '🏞️', 'Farm Pond': '🌊', 'Gully Plug': '🪨',
  };
  const c = colors[status];
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:36px;height:44px">
        <div style="
          width:36px;height:36px;border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          background:${c.bg};border:2px solid ${c.border};
          box-shadow:0 0 12px ${c.glow},0 2px 8px rgba(0,0,0,0.4);
          display:flex;align-items:center;justify-content:center;
        ">
          <span style="transform:rotate(45deg);font-size:14px;line-height:1">${typeEmoji[type] ?? '📍'}</span>
        </div>
        <div style="
          position:absolute;bottom:0;left:50%;transform:translateX(-50%);
          width:6px;height:8px;background:${c.border};
          clip-path:polygon(0 0,100% 0,50% 100%);
        "></div>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
};

// ─── Main MapView ───
const MapView = () => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Record<string, L.Layer>>({});

  const [activeLayers, setActiveLayers] = useState<Set<LayerToggle>>(new Set(['ndvi']));
  const [epoch, setEpoch] = useState<Epoch>('after');
  const [selectedMarker, setSelectedMarker] = useState<StructureMarker | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // ─── Init Leaflet map ───
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [19.995, 74.455],
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    });

    // Dark-themed CartoDB base tiles
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    // Zoom control (top-right)
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    // Small delay so tiles load and sizes sync
    const timer = setTimeout(() => {
      setMapReady(true);
      map.invalidateSize();
    }, 250);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ─── Draw watershed boundary ───
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    const watershedLayer = L.geoJSON(WATERSHED_BOUNDARY as GeoJSON.Feature, {
      style: {
        color: '#22c55e',
        weight: 2.5,
        opacity: 0.9,
        fillColor: '#22c55e',
        fillOpacity: 0.04,
        dashArray: '6 4',
      },
    }).addTo(map);

    // Boundary label
    const center = watershedLayer.getBounds().getCenter();
    L.marker(center, {
      icon: L.divIcon({
        className: '',
        html: `<div style="
          background:rgba(15,23,42,0.85);border:1px solid rgba(34,197,94,0.4);
          border-radius:6px;padding:4px 10px;
          color:#22c55e;font-size:11px;font-weight:700;
          font-family:'JetBrains Mono',monospace;white-space:nowrap;
          box-shadow:0 0 12px rgba(34,197,94,0.2);
        ">🌿 Hivare Bazar MWS · 1,482 ha</div>`,
        iconAnchor: [75, 12],
      }),
    }).addTo(map);

    layerRefs.current['boundary'] = watershedLayer;
  }, [mapReady]);

  // ─── Draw structure markers ───
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    // Remove existing markers
    Object.keys(layerRefs.current).filter(k => k.startsWith('marker-')).forEach(k => {
      map.removeLayer(layerRefs.current[k]);
      delete layerRefs.current[k];
    });

    STRUCTURE_MARKERS.forEach(s => {
      const marker = L.marker([s.lat, s.lng], { icon: getMarkerIcon(s.status, s.type) });
      marker.on('click', () => setSelectedMarker(s));

      // Brief tooltip
      marker.bindTooltip(`
        <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.1);padding:6px 10px;border-radius:6px;font-family:Inter,sans-serif">
          <div style="color:white;font-size:12px;font-weight:600;margin-bottom:2px">${s.name}</div>
          <div style="color:#64748b;font-size:10px">${s.id} · ${s.type}</div>
        </div>
      `, { className: 'custom-tooltip', sticky: true, opacity: 1 });

      marker.addTo(map);
      layerRefs.current[`marker-${s.id}`] = marker;
    });
  }, [mapReady]);

  // ─── Draw NDVI overlay ───
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    // Remove old
    Object.keys(layerRefs.current).filter(k => k.startsWith('ndvi-')).forEach(k => {
      map.removeLayer(layerRefs.current[k]);
      delete layerRefs.current[k];
    });

    if (!activeLayers.has('ndvi')) return;

    NDVI_CELLS.forEach(cell => {
      const val = epoch === 'after' ? cell.after : cell.before;
      const color = ndviToColor(val);
      const rect = L.rectangle(cell.bounds as L.LatLngBoundsExpression, {
        color,
        weight: 0,
        fillColor: color,
        fillOpacity: 0.42,
      }).addTo(map);

      rect.bindTooltip(`
        <div style="background:#0f172a;border:1px solid rgba(34,197,94,0.3);padding:4px 8px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#22c55e">
          NDVI: ${val.toFixed(2)}
        </div>
      `, { className: 'custom-tooltip', sticky: true, opacity: 1 });

      layerRefs.current[`ndvi-${cell.id}`] = rect;
    });
  }, [mapReady, activeLayers, epoch]);

  // ─── Draw NDWI overlay ───
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    Object.keys(layerRefs.current).filter(k => k.startsWith('ndwi-')).forEach(k => {
      map.removeLayer(layerRefs.current[k]);
      delete layerRefs.current[k];
    });

    if (!activeLayers.has('ndwi')) return;

    NDWI_CELLS.forEach(cell => {
      const val = epoch === 'after' ? cell.after : cell.before;
      const color = ndwiToColor(val);
      if (color === 'transparent') return;

      const rect = L.rectangle(cell.bounds as L.LatLngBoundsExpression, {
        color,
        weight: 0,
        fillColor: color,
        fillOpacity: 0.55,
      }).addTo(map);

      rect.bindTooltip(`
        <div style="background:#0f172a;border:1px solid rgba(6,182,212,0.3);padding:4px 8px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:11px;color:#06b6d4">
          NDWI: ${val.toFixed(2)}
        </div>
      `, { className: 'custom-tooltip', sticky: true, opacity: 1 });

      layerRefs.current[`ndwi-${cell.id}`] = rect;
    });
  }, [mapReady, activeLayers, epoch]);

  // ─── Draw LULC overlay ───
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    Object.keys(layerRefs.current).filter(k => k.startsWith('lulc-')).forEach(k => {
      map.removeLayer(layerRefs.current[k]);
      delete layerRefs.current[k];
    });

    if (!activeLayers.has('lulc')) return;

    LULC_ZONES.forEach(zone => {
      const rect = L.rectangle(zone.bounds as L.LatLngBoundsExpression, {
        color: zone.color,
        weight: 1,
        fillColor: zone.color,
        fillOpacity: 0.45,
        opacity: 0.6,
      }).addTo(map);

      rect.bindTooltip(`
        <div style="background:#0f172a;border:1px solid rgba(255,255,255,0.1);padding:4px 8px;border-radius:4px;font-family:Inter,sans-serif;font-size:11px;color:white">
          ${zone.class}
        </div>
      `, { className: 'custom-tooltip', sticky: true, opacity: 1 });

      layerRefs.current[`lulc-${zone.id}`] = rect;
    });
  }, [mapReady, activeLayers]);

  // ─── Layer toggle ───
  const toggleLayer = (layer: LayerToggle) => {
    setActiveLayers(prev => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };

  // ─── Epoch switch with transition ───
  const switchEpoch = (e: Epoch) => {
    if (e === epoch) return;
    setTransitioning(true);
    setTimeout(() => {
      setEpoch(e);
      setTransitioning(false);
    }, 350);
  };

  const verifiedCount = STRUCTURE_MARKERS.filter(m => m.status === 'verified').length;
  const attentionCount = STRUCTURE_MARKERS.filter(m => m.status !== 'verified').length;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* ─── Map Controls Bar ─── */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/5 bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
        {/* Layer toggles */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[10px] uppercase tracking-widest mr-1">Layers</span>
          <LayerButton
            active={activeLayers.has('ndvi')}
            onClick={() => toggleLayer('ndvi')}
            color="green"
            icon="🌿"
            label="NDVI Vegetation"
          />
          <LayerButton
            active={activeLayers.has('ndwi')}
            onClick={() => toggleLayer('ndwi')}
            color="cyan"
            icon="💧"
            label="NDWI Water"
          />
          <LayerButton
            active={activeLayers.has('lulc')}
            onClick={() => toggleLayer('lulc')}
            color="amber"
            icon="🗺️"
            label="LULC Land Use"
          />
        </div>

        <div className="h-5 w-px bg-white/8 mx-1" />

        {/* Epoch toggle */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[10px] uppercase tracking-widest mr-1">Epoch</span>
          <div className="flex items-center rounded-lg overflow-hidden border border-white/8">
            <button
              onClick={() => switchEpoch('before')}
              className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                epoch === 'before'
                  ? 'bg-amber-500/20 text-amber-300 border-r border-amber-500/20'
                  : 'text-slate-500 hover:text-slate-300 bg-slate-900/60 border-r border-white/5'
              }`}
            >
              <span>☀️</span>
              <span>Before (Pre-Monsoon)</span>
            </button>
            <button
              onClick={() => switchEpoch('after')}
              className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                epoch === 'after'
                  ? 'bg-green-500/20 text-green-300'
                  : 'text-slate-500 hover:text-slate-300 bg-slate-900/60'
              }`}
            >
              <span>🌧️</span>
              <span>After (Post-Monsoon)</span>
            </button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* Legend pills */}
          <div className="hidden md:flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Verified ({verifiedCount})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Attention ({attentionCount})</span>
          </div>
          {/* Granule info */}
          <div className="px-2 py-1 rounded bg-slate-800/80 border border-white/5 text-[10px] font-mono text-slate-400 hidden lg:block">
            Sentinel-2B · T43PGN · 18-Oct-2024
          </div>
        </div>
      </div>

      {/* ─── Map + Side Panel Row ─── */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Map Container */}
        <div
          className="flex-1 relative"
          style={{ transition: 'filter 0.35s ease', filter: transitioning ? 'brightness(0.3) blur(4px)' : 'none' }}
        >
          <div ref={mapContainerRef} className="absolute inset-0" />

          {/* Epoch watermark overlay */}
          <div className="absolute bottom-4 left-4 z-[500] pointer-events-none">
            <div className={`px-3 py-1.5 rounded-lg backdrop-blur-md border text-xs font-mono font-bold transition-all duration-300 ${
              epoch === 'after'
                ? 'bg-green-900/60 border-green-500/40 text-green-300'
                : 'bg-amber-900/60 border-amber-500/40 text-amber-300'
            }`}>
              {epoch === 'after' ? '🌧️ POST-MONSOON (Oct 2024)' : '☀️ PRE-MONSOON (Apr 2024)'}
            </div>
          </div>

          {/* Scale / attribution strip */}
          <div className="absolute bottom-4 right-16 z-[500] pointer-events-none">
            <div className="px-2 py-1 rounded bg-slate-950/80 border border-white/5 text-[9px] font-mono text-slate-500">
              WGS84 · EPSG:4326 · 1:25,000
            </div>
          </div>
        </div>

        {/* ─── Side Panel ─── */}
        <MarkerSidePanel
          marker={selectedMarker}
          onClose={() => setSelectedMarker(null)}
          epoch={epoch}
        />
      </div>

      {/* ─── LULC Legend (shown when LULC active) ─── */}
      {activeLayers.has('lulc') && (
        <div className="absolute bottom-20 left-4 z-[500] glass-card p-3 pointer-events-none" style={{ zIndex: 500 }}>
          <p className="text-slate-400 text-[9px] uppercase tracking-widest mb-2">LULC Classes</p>
          {[
            { color: '#166534', label: 'Forest' },
            { color: '#a3e635', label: 'Agriculture' },
            { color: '#d97706', label: 'Fallow Land' },
            { color: '#92400e', label: 'Barren' },
            { color: '#0284c7', label: 'Water Body' },
            { color: '#6b7280', label: 'Settlement' },
            { color: '#65a30d', label: 'Scrubland' },
          ].map(c => (
            <div key={c.label} className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: c.color, opacity: 0.8 }} />
              <span className="text-slate-300 text-[10px]">{c.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Layer Toggle Button ───
interface LayerButtonProps {
  active: boolean;
  onClick: () => void;
  color: 'green' | 'cyan' | 'amber';
  icon: string;
  label: string;
}
const colorMap = {
  green: { on: 'bg-green-500/20 border-green-500/40 text-green-300', off: 'bg-slate-800/60 border-white/8 text-slate-500 hover:text-slate-300' },
  cyan: { on: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300', off: 'bg-slate-800/60 border-white/8 text-slate-500 hover:text-slate-300' },
  amber: { on: 'bg-amber-500/20 border-amber-500/40 text-amber-300', off: 'bg-slate-800/60 border-white/8 text-slate-500 hover:text-slate-300' },
};
const LayerButton = ({ active, onClick, color, icon, label }: LayerButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 ${colorMap[color][active ? 'on' : 'off']}`}
  >
    <span>{icon}</span>
    <span>{label}</span>
    <div className={`w-1.5 h-1.5 rounded-full ml-0.5 transition-all ${active ? 'opacity-100 bg-current' : 'opacity-0'}`} />
  </button>
);

export default MapView;
