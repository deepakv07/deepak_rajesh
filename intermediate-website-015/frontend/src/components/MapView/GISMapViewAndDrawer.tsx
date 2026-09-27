import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ─── Types & Definitions ───
export type LayerType = 'ndvi' | 'ndwi' | 'lulc';
export type EpochType = 'before' | 'after';

export interface SiteLocation {
  id: string;
  name: string;
  sublabel: string;
  center: [number, number];
  zoom: number;
  boundary: GeoJSON.Polygon;
  structures: SiteStructure[];
}

export interface SiteStructure {
  id: string;
  name: string;
  type: 'Check Dam' | 'Percolation Tank' | 'Farm Pond' | 'Contour Trench' | 'Gully Plug';
  status: 'verified' | 'pending' | 'mismatch';
  lat: number;
  lng: number;
  completionDate: string;
  photoUrl: string;
  satBeforeUrl: string;
  satAfterUrl: string;
  description: string;
  // Matrix Metrics
  metrics: {
    baselineNdvi: number;
    currentNdvi: number;
    deltaNdvi: number;
    baselineNdwi: string;
    currentNdwi: string;
    baselineImpoundment: string;
    currentImpoundment: string;
    soilErosionBaseline: string;
    soilErosionCurrent: string;
    geotagMatch: string;
    disbursementStatus: string;
    disbursementEligible: boolean;
  };
}

// ─── Pilot Sites with Realistic Geospatial Data ───
export const PILOT_SITES: SiteLocation[] = [
  {
    id: 'chandur',
    name: 'Chandur Railway, Amravati',
    sublabel: 'Amravati District, Maharashtra • Catchment Area: 1,840 ha',
    center: [20.8211, 77.8782],
    zoom: 14,
    boundary: {
      type: 'Polygon',
      coordinates: [[
        [77.858, 20.835],
        [77.895, 20.838],
        [77.902, 20.815],
        [77.885, 20.805],
        [77.862, 20.810],
        [77.858, 20.835],
      ]],
    },
    structures: [
      {
        id: 'site-001',
        name: 'Chandur Check Dam #4',
        type: 'Check Dam',
        status: 'verified',
        lat: 20.8211,
        lng: 77.8782,
        completionDate: '12 Mar 2026',
        photoUrl: '/check_dam.jpg',
        satBeforeUrl: '/sat_before.jpg',
        satAfterUrl: '/sat_after.jpg',
        description: 'Engineered random rubble masonry check dam across the 3rd-order tributary of Wardha sub-basin. Designed to arrest peak runoff velocity, enhance upstream percolation into village borewells, and provide gravity-fed livestock drinking troughs during post-monsoon dry spells.',
        metrics: {
          baselineNdvi: 0.30,
          currentNdvi: 0.80,
          deltaNdvi: 0.50,
          baselineNdwi: '0.05 dry',
          currentNdwi: '0.42 active',
          baselineImpoundment: '0.0m',
          currentImpoundment: '2.4m',
          soilErosionBaseline: 'Severe scour',
          soilErosionCurrent: 'Arrested velocity',
          geotagMatch: '100% Match',
          disbursementStatus: 'Eligible for Tranche 2 release',
          disbursementEligible: true,
        },
      },
      {
        id: 'site-002',
        name: 'Amravati East Percolation Tank #2',
        type: 'Percolation Tank',
        status: 'pending',
        lat: 20.8290,
        lng: 77.8860,
        completionDate: '28 Jan 2026',
        photoUrl: '/check_dam.jpg',
        satBeforeUrl: '/sat_before.jpg',
        satAfterUrl: '/sat_after.jpg',
        description: 'Deep earthen embankment percolation pond in downstream farmland sector. Silt traps installed along contour trenches require routine desiltation inspection before final certification.',
        metrics: {
          baselineNdvi: 0.28,
          currentNdvi: 0.52,
          deltaNdvi: 0.24,
          baselineNdwi: '0.02 dry',
          currentNdwi: '0.28 moderate',
          baselineImpoundment: '0.0m',
          currentImpoundment: '1.6m',
          soilErosionBaseline: 'Moderate rills',
          soilErosionCurrent: 'Partially stabilized',
          geotagMatch: '96.4% Match',
          disbursementStatus: 'Pending Field Audit Clearance',
          disbursementEligible: false,
        },
      },
      {
        id: 'site-003',
        name: 'Pimpalgaon Nala Bund #1',
        type: 'Contour Trench',
        status: 'mismatch',
        lat: 20.8140,
        lng: 77.8690,
        completionDate: '15 Feb 2026',
        photoUrl: '/check_dam.jpg',
        satBeforeUrl: '/sat_before.jpg',
        satAfterUrl: '/sat_after.jpg',
        description: 'Continuous contour trenching and boulder bund on ridge. Ground surveyor photograph geotag diverges by 640m from satellite detected earthwork footprint.',
        metrics: {
          baselineNdvi: 0.22,
          currentNdvi: 0.26,
          deltaNdvi: 0.04,
          baselineNdwi: '-0.08 barren',
          currentNdwi: '-0.02 dry',
          baselineImpoundment: '0.0m',
          currentImpoundment: '0.2m',
          soilErosionBaseline: 'Sheet erosion',
          soilErosionCurrent: 'Unmitigated run-off',
          geotagMatch: 'Mismatch Flagged (640m offset)',
          disbursementStatus: 'Tranche Disbursal Withheld',
          disbursementEligible: false,
        },
      },
    ],
  },
  {
    id: 'hiware',
    name: 'Hiware Bazar',
    sublabel: 'Ahmednagar District, Maharashtra • Catchment Area: 1,482 ha',
    center: [19.0450, 74.6850],
    zoom: 14,
    boundary: {
      type: 'Polygon',
      coordinates: [[
        [74.665, 19.055],
        [74.705, 19.058],
        [74.712, 19.035],
        [74.685, 19.025],
        [74.662, 19.035],
        [74.665, 19.055],
      ]],
    },
    structures: [
      {
        id: 'site-101',
        name: 'Hiware Bazar Main Anicut #1',
        type: 'Check Dam',
        status: 'verified',
        lat: 19.0450,
        lng: 74.6850,
        completionDate: '10 Jan 2026',
        photoUrl: '/check_dam.jpg',
        satBeforeUrl: '/sat_before.jpg',
        satAfterUrl: '/sat_after.jpg',
        description: 'Comprehensive village watershed conservation structure impounding 4.2M litres with intensive afforestation along upstream catchment buffers.',
        metrics: {
          baselineNdvi: 0.32,
          currentNdvi: 0.78,
          deltaNdvi: 0.46,
          baselineNdwi: '0.04 dry',
          currentNdwi: '0.48 active',
          baselineImpoundment: '0.0m',
          currentImpoundment: '2.8m',
          soilErosionBaseline: 'Moderate gullying',
          soilErosionCurrent: 'Stabilized vegetative apron',
          geotagMatch: '100% Match',
          disbursementStatus: 'Tranche 2 Approved & Released',
          disbursementEligible: true,
        },
      },
    ],
  },
  {
    id: 'ralegan',
    name: 'Ralegan Siddhi',
    sublabel: 'Parner Taluka, Ahmednagar • Catchment Area: 1,620 ha',
    center: [19.0120, 74.4560],
    zoom: 14,
    boundary: {
      type: 'Polygon',
      coordinates: [[
        [74.435, 19.025],
        [74.475, 19.028],
        [74.482, 19.002],
        [74.455, 18.995],
        [74.432, 19.005],
        [74.435, 19.025],
      ]],
    },
    structures: [
      {
        id: 'site-201',
        name: 'Ralegan Ridge Trench & Percolation Dam',
        type: 'Percolation Tank',
        status: 'verified',
        lat: 19.0120,
        lng: 74.4560,
        completionDate: '05 Feb 2026',
        photoUrl: '/check_dam.jpg',
        satBeforeUrl: '/sat_before.jpg',
        satAfterUrl: '/sat_after.jpg',
        description: 'Benchmark percolation tank on basalt bedrock formation. Recharges surrounding open agricultural dugwells across three downstream wadis.',
        metrics: {
          baselineNdvi: 0.29,
          currentNdvi: 0.74,
          deltaNdvi: 0.45,
          baselineNdwi: '0.03 dry',
          currentNdwi: '0.40 active',
          baselineImpoundment: '0.0m',
          currentImpoundment: '2.2m',
          soilErosionBaseline: 'Severe rill erosion',
          soilErosionCurrent: 'Arrested by contour bunds',
          geotagMatch: '100% Match',
          disbursementStatus: 'Eligible for Tranche 2 release',
          disbursementEligible: true,
        },
      },
    ],
  },
];

// Helper: Custom Pin Icon generator
const createPinIcon = (status: 'verified' | 'pending' | 'mismatch', isSelected: boolean) => {
  const config = {
    verified: {
      bg: '#16a34a',
      border: '#15803d',
      ring: 'rgba(22, 163, 74, 0.4)',
      label: 'Verified',
      pinChar: '✓',
    },
    pending: {
      bg: '#eab308',
      border: '#ca8a04',
      ring: 'rgba(234, 179, 8, 0.4)',
      label: 'Pending',
      pinChar: '!',
    },
    mismatch: {
      bg: '#ef4444',
      border: '#dc2626',
      ring: 'rgba(239, 68, 68, 0.4)',
      label: 'Mismatch',
      pinChar: '✕',
    },
  }[status];

  const size = isSelected ? 40 : 32;

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative; width:${size}px; height:${size + 10}px; cursor:pointer; transition:transform 0.2s;">
        <div style="
          width:${size}px; height:${size}px;
          border-radius:50% 50% 50% 0;
          background:${config.bg};
          border:2px solid #ffffff;
          box-shadow: 0 4px 12px ${config.ring}, 0 2px 6px rgba(0,0,0,0.15);
          transform: rotate(-45deg);
          display:flex; align-items:center; justify-content:center;
        ">
          <span style="transform: rotate(45deg); color:#ffffff; font-weight:800; font-size:${isSelected ? 16 : 13}px;">
            ${config.pinChar}
          </span>
        </div>
        <div style="
          position:absolute; bottom:0; left:50%; transform:translateX(-50%);
          width:6px; height:8px; background:${config.border};
          clip-path:polygon(0 0, 100% 0, 50% 100%);
        "></div>
      </div>
    `,
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 10],
    popupAnchor: [0, -(size + 10)],
  });
};

export const GISMapViewAndDrawer: React.FC = () => {
  // Pilot Site & Map state
  const [selectedSite, setSelectedSite] = useState<SiteLocation>(PILOT_SITES[0]);
  const [selectedStructure, setSelectedStructure] = useState<SiteStructure | null>(PILOT_SITES[0].structures[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  // Layer Toggles
  const [activeLayers, setActiveLayers] = useState<Set<LayerType>>(new Set(['ndvi']));
  const [epoch, setEpoch] = useState<EpochType>('after');
  const [legendNdviValue, setLegendNdviValue] = useState<number>(0.65);

  // Drawer Image Toggle
  const [drawerImageView, setDrawerImageView] = useState<'field' | 'sat_after' | 'sat_before'>('field');

  // Leaflet references
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Light-themed basemap (CartoDB Positron / OSM)
    const map = L.map(mapContainerRef.current, {
      center: selectedSite.center,
      zoom: selectedSite.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Map layers when site, layers, or epoch changes
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;
    const map = mapRef.current;
    const lg = layerGroupRef.current;

    lg.clearLayers();
    map.flyTo(selectedSite.center, selectedSite.zoom, { duration: 0.8 });

    // 1. Draw Micro-Watershed Boundary Polygon
    const boundaryLayer = L.geoJSON(selectedSite.boundary, {
      style: {
        color: '#15803d',
        weight: 2.5,
        opacity: 0.85,
        fillColor: '#22c55e',
        fillOpacity: 0.08,
        dashArray: '6 4',
      },
    }).addTo(lg);

    // Add Boundary Tag
    const bounds = boundaryLayer.getBounds();
    L.marker(bounds.getNorthEast(), {
      icon: L.divIcon({
        className: '',
        html: `
          <div style="
            background:#ffffff; border:1px solid #cbd5e1; border-radius:6px;
            padding:3px 8px; font-size:10px; font-weight:700; color:#15803d;
            box-shadow:0 2px 6px rgba(0,0,0,0.08); white-space:nowrap;
          ">
            🌿 ${selectedSite.name} Boundary
          </div>
        `,
        iconAnchor: [50, 10],
      }),
    }).addTo(lg);

    // 2. Draw Simulated Multispectral Grids (NDVI / NDWI / Land Use)
    if (activeLayers.has('ndvi')) {
      const center = selectedSite.center;
      const ndviColor = epoch === 'after' ? '#16a34a' : '#d97706';
      const ndviOpacity = epoch === 'after' ? 0.35 : 0.22;

      L.circle(center, {
        radius: 1200,
        color: ndviColor,
        fillColor: ndviColor,
        fillOpacity: ndviOpacity,
        weight: 0,
      }).bindTooltip(`NDVI Overlay: ${epoch === 'after' ? 'Post-Monsoon (Dense)' : 'Pre-Monsoon (Dry)'}`, {
        sticky: true,
      }).addTo(lg);
    }

    if (activeLayers.has('ndwi')) {
      const center = selectedSite.center;
      const ndwiRadius = epoch === 'after' ? 650 : 250;
      L.circle([center[0] - 0.003, center[1] + 0.002], {
        radius: ndwiRadius,
        color: '#0284c7',
        fillColor: '#0284c7',
        fillOpacity: epoch === 'after' ? 0.45 : 0.20,
        weight: 0,
      }).bindTooltip(`Water Spread Area (NDWI): ${epoch === 'after' ? '2.4m High Impoundment' : 'Dry baseline'}`, {
        sticky: true,
      }).addTo(lg);
    }

    if (activeLayers.has('lulc')) {
      const center = selectedSite.center;
      // Agricultural zone
      L.polygon([
        [center[0] + 0.005, center[1] - 0.008],
        [center[0] + 0.008, center[1] + 0.004],
        [center[0] + 0.002, center[1] + 0.006],
        [center[0] - 0.001, center[1] - 0.006],
      ], {
        color: '#65a30d',
        fillColor: '#84cc16',
        fillOpacity: 0.25,
        weight: 1,
      }).bindTooltip('LULC Class: Double Cropped Agriculture', { sticky: true }).addTo(lg);
    }

    // 3. Draw Color-Coded Status Pins
    selectedSite.structures.forEach((st) => {
      const isSelected = selectedStructure?.id === st.id;
      const marker = L.marker([st.lat, st.lng], {
        icon: createPinIcon(st.status, isSelected),
        zIndexOffset: isSelected ? 1000 : 0,
      });

      marker.on('click', () => {
        setSelectedStructure(st);
        setIsDrawerOpen(true);
      });

      marker.bindTooltip(`
        <div style="font-family:Inter,sans-serif; padding:2px 4px;">
          <div style="font-weight:700; font-size:12px; color:#0f172a;">${st.name}</div>
          <div style="font-size:10px; color:#64748b;">${st.type} • Status: ${st.status.toUpperCase()}</div>
        </div>
      `, { sticky: true });

      marker.addTo(lg);
    });
  }, [selectedSite, selectedStructure, activeLayers, epoch]);

  // Toggle active layers
  const toggleLayer = (layer: LayerType) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      {/* ─── 1. Top Controls Bar ─── */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 z-10 shadow-xs flex-shrink-0">
        
        {/* Left: Location Search Dropdown */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Pilot Watershed Site
            </label>
            <select
              value={selectedSite.id}
              onChange={(e) => {
                const site = PILOT_SITES.find((s) => s.id === e.target.value) || PILOT_SITES[0];
                setSelectedSite(site);
                setSelectedStructure(site.structures[0] || null);
              }}
              className="bg-gray-50 border border-gray-300 text-gray-900 font-semibold text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-xs"
            >
              {PILOT_SITES.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Middle: Layer Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1 hidden md:inline">
            Layers:
          </span>

          <button
            type="button"
            onClick={() => toggleLayer('ndvi')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              activeLayers.has('ndvi')
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-500/15'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Vegetation Layer (NDVI)
          </button>

          <button
            type="button"
            onClick={() => toggleLayer('ndwi')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              activeLayers.has('ndwi')
                ? 'bg-blue-50 border-blue-300 text-blue-800 ring-2 ring-blue-500/15'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Water Layer (NDWI)
          </button>

          <button
            type="button"
            onClick={() => toggleLayer('lulc')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              activeLayers.has('lulc')
                ? 'bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-500/15'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Land Use Layer
          </button>
        </div>

        {/* Right: Temporal Comparison Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1 hidden lg:inline">
            Temporal Epoch:
          </span>
          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-0.5 shadow-xs">
            <button
              type="button"
              onClick={() => setEpoch('before')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                epoch === 'before'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              ☀️ Before (Dec 2025)
            </button>
            <button
              type="button"
              onClick={() => setEpoch('after')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                epoch === 'after'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              🌧️ After (Jun 2026)
            </button>
          </div>
        </div>

      </header>

      {/* ─── 2. Interactive Map View + Site Drawer Container ─── */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Leaflet Map Canvas */}
        <div className="flex-1 relative h-full">
          <div ref={mapContainerRef} className="absolute inset-0 z-0" />

          {/* Map Status Floating Legend */}
          <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-3 shadow-md text-xs space-y-2 pointer-events-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Structure Verification Status
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block" />
                <span className="font-semibold text-gray-700">Verified Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="font-semibold text-gray-700">Pending Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span className="font-semibold text-gray-700">Mismatch / Alert</span>
              </div>
            </div>
          </div>

          {/* Bottom-Right NDVI Index Legend Slider */}
          <div className="absolute bottom-6 right-6 z-[400] bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-4 shadow-lg w-80 pointer-events-auto space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                NDVI Index Gradient Legend
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {legendNdviValue >= 0 ? `+${legendNdviValue.toFixed(2)}` : legendNdviValue.toFixed(2)}
              </span>
            </div>

            {/* Continuous Color Gradient Bar (-0.2 to +0.8) */}
            <div
              className="h-3 w-full rounded-full border border-gray-200 shadow-inner"
              style={{
                background: 'linear-gradient(to right, #78350f 0%, #d97706 25%, #fde047 50%, #4ade80 75%, #15803d 100%)',
              }}
            />

            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>-0.2 (Barren/Water)</span>
              <span>0.3 (Soil/Scrub)</span>
              <span>+0.8 (Dense Biomass)</span>
            </div>

            {/* Interactive Slider */}
            <div className="pt-1">
              <input
                type="range"
                min="-0.2"
                max="0.8"
                step="0.05"
                value={legendNdviValue}
                onChange={(e) => setLegendNdviValue(parseFloat(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
              />
            </div>
          </div>

        </div>

        {/* ─── 3. Right-Side Site Inspection Drawer ─── */}
        {isDrawerOpen && selectedStructure && (
          <aside className="w-full md:w-[480px] lg:w-[520px] bg-white border-l border-gray-200 h-full overflow-y-auto z-20 shadow-xl flex flex-col flex-shrink-0 animate-in slide-in-from-right duration-300">
            
            {/* Drawer Top Navigation & Close */}
            <div className="p-6 pb-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  selectedStructure.status === 'verified'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : selectedStructure.status === 'pending'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedStructure.status === 'verified' ? 'bg-emerald-600' : selectedStructure.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  {selectedStructure.status === 'verified' ? 'Verified Active' : selectedStructure.status === 'pending' ? 'Pending Review' : 'Anomaly Flagged'}
                </span>
                <span className="text-xs font-mono text-gray-400">ID: {selectedStructure.id}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Close Drawer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Content Body with Generous Padding */}
            <div className="p-6 md:p-8 space-y-6 flex-1">
              
              {/* Site Header */}
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  Structure Asset Inspection
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 leading-snug">
                  {selectedStructure.name}
                </h2>
                
                {/* Header Metadata Chips */}
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <span className="text-gray-500 block text-[11px]">WGS84 Coordinates</span>
                    <strong className="font-mono text-gray-800">{selectedStructure.lat.toFixed(4)}, {selectedStructure.lng.toFixed(4)}</strong>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <span className="text-gray-500 block text-[11px]">Completion Date</span>
                    <strong className="text-gray-800">{selectedStructure.completionDate}</strong>
                  </div>
                </div>
              </div>

              {/* Image Comparison Widget */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Visual Evidence Inspection
                  </span>
                  <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-0.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setDrawerImageView('field')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                        drawerImageView === 'field'
                          ? 'bg-white text-gray-900 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      SAVED FIELD PHOTO
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerImageView('sat_after')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                        drawerImageView === 'sat_after'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      SENTINEL-2 AFTER
                    </button>
                    <button
                      type="button"
                      onClick={() => setDrawerImageView('sat_before')}
                      className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                        drawerImageView === 'sat_before'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      BEFORE
                    </button>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900 aspect-16/10 shadow-inner group">
                  <img
                    src={
                      drawerImageView === 'field'
                        ? selectedStructure.photoUrl
                        : drawerImageView === 'sat_after'
                        ? selectedStructure.satAfterUrl
                        : selectedStructure.satBeforeUrl
                    }
                    alt={selectedStructure.name}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />

                  {/* Overlay Badge */}
                  <div className="absolute bottom-3 left-3 bg-gray-900/85 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1.5 rounded-lg border border-white/20 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>
                      {drawerImageView === 'field'
                        ? 'Ground Camera (EXIF Corroborated)'
                        : drawerImageView === 'sat_after'
                        ? 'Copernicus Sentinel-2B • Post-Monsoon (10m px)'
                        : 'Copernicus Sentinel-2A • Pre-Monsoon Baseline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Text Block */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4.5">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                  Structural Specification &amp; Hydrology
                </span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {selectedStructure.description}
                </p>
              </div>

              {/* ─── 4. Satellite-vs-Field Cross-Validation Matrix Card ─── */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Comparison Report
                  </h3>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    selectedStructure.metrics.disbursementEligible
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${selectedStructure.metrics.disbursementEligible ? 'bg-emerald-600' : 'bg-red-500'}`} />
                    {selectedStructure.metrics.disbursementEligible ? 'Confirmed — Matches Satellite' : 'Mismatch Flagged'}
                  </span>
                </div>

                {/* Metrics Table with Light Divider Lines & Ample Spacing */}
                <div className="divide-y divide-gray-100 text-xs">
                  
                  {/* Metric 1: NDVI Delta */}
                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold text-gray-900 block">NDVI Vegetation Gain</span>
                      <span className="text-[11px] text-gray-500">
                        Baseline (+{selectedStructure.metrics.baselineNdvi.toFixed(2)}) vs Current (+{selectedStructure.metrics.currentNdvi.toFixed(2)})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700 block text-sm">
                        Δ +{selectedStructure.metrics.deltaNdvi.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Veg Vigor Increased
                      </span>
                    </div>
                  </div>

                  {/* Metric 2: NDWI Water & Moisture */}
                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold text-gray-900 block">Surface Water &amp; Moisture (NDWI)</span>
                      <span className="text-[11px] text-gray-500">Multi-band absorption index</span>
                    </div>
                    <div className="text-right font-mono text-gray-800">
                      <span className="text-gray-400">Baseline ({selectedStructure.metrics.baselineNdwi})</span>
                      <span className="mx-1 text-gray-300">→</span>
                      <strong className="text-blue-700">Current ({selectedStructure.metrics.currentNdwi})</strong>
                    </div>
                  </div>

                  {/* Metric 3: Water Column Impoundment */}
                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold text-gray-900 block">Water Column / Impoundment</span>
                      <span className="text-[11px] text-gray-500">Upstream storage depth</span>
                    </div>
                    <div className="text-right font-mono text-gray-800">
                      <span className="text-gray-400">Baseline ({selectedStructure.metrics.baselineImpoundment})</span>
                      <span className="mx-1 text-gray-300">→</span>
                      <strong className="text-emerald-700">Current ({selectedStructure.metrics.currentImpoundment})</strong>
                    </div>
                  </div>

                  {/* Metric 4: Soil Erosion & Runoff Velocity */}
                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold text-gray-900 block">Soil Erosion &amp; Runoff Velocity</span>
                      <span className="text-[11px] text-gray-500">RUSLE catchment calculation</span>
                    </div>
                    <div className="text-right font-medium">
                      <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] mr-1">
                        {selectedStructure.metrics.soilErosionBaseline}
                      </span>
                      <span className="text-gray-300">→</span>
                      <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] ml-1">
                        {selectedStructure.metrics.soilErosionCurrent}
                      </span>
                    </div>
                  </div>

                  {/* Metric 5: Geotag vs Satellite Correlation */}
                  <div className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold text-gray-900 block">Geotag vs Satellite Correlation</span>
                      <span className="text-[11px] text-gray-500">Spatial radius offset checking</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-md border ${
                        selectedStructure.metrics.geotagMatch.includes('100%')
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}>
                        {selectedStructure.metrics.geotagMatch}
                      </span>
                    </div>
                  </div>

                  {/* Metric 6: Scheme Disbursement Status */}
                  <div className="pt-3.5 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold text-gray-900 block">Scheme Disbursement Status</span>
                      <span className="text-[11px] text-gray-500">DoLR PMKSY-WDC financial tranche</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${
                        selectedStructure.metrics.disbursementEligible
                          ? 'bg-emerald-100/70 text-emerald-900 border-emerald-300'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {selectedStructure.metrics.disbursementStatus}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons: "Generate Report" Secondary Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => alert(`Report successfully compiled for ${selectedStructure.name} (DoLR ID: ${selectedStructure.id})`)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </button>

                <button
                  type="button"
                  onClick={() => alert(`Tranche release action queued for ${selectedStructure.name}`)}
                  disabled={!selectedStructure.metrics.disbursementEligible}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve Disbursal
                </button>
              </div>

            </div>
          </aside>
        )}

      </div>
    </div>
  );
};

export default GISMapViewAndDrawer;
