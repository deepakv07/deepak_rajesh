import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export type ModuleSection = 'gis_queue' | 'finance_report';
export type LayerType = 'ndvi' | 'ndwi' | 'lulc';
export type EpochType = 'before' | 'after';

interface OperationsAndFinanceModuleProps {
  theme?: 'dark' | 'light';
}

// ─── Tamil Nadu Data ───────────────────────────────────────────────────────────
const TN_PILOT_SITES = [
  {
    id: 'thanjavur_delta',
    name: 'Thanjavur Delta',
    sublabel: 'Cauvery Basin • Thanjavur District',
    center: [10.7869, 79.1378] as [number, number],
    zoom: 13,
    boundary: { type: 'Polygon' as const, coordinates: [[[79.120,10.800],[79.150,10.805],[79.155,10.775],[79.125,10.770],[79.120,10.800]]] },
    structures: [
      { id:'TN-CD-001', name:'Thanjavur Check Dam #2', type:'Check Dam', status:'verified' as const, lat:10.7869, lng:79.1378, completionDate:'12 Mar 2026', photoUrl:'/check_dam.jpg', satAfterUrl:'/sat_after.jpg', satBeforeUrl:'/sat_before.jpg',
        metrics:{ plantHealth:'+0.50 Increase', waterLevel:'+0.37 Active Storage', soilErosion:'Reduced Scour', matchResult:'100% Match', ndvi:0.80, ndwi:0.42 } },
      { id:'TN-FP-002', name:'Orathanadu Farm Pond', type:'Farm Pond', status:'pending' as const, lat:10.7910, lng:79.1450, completionDate:'28 Jan 2026', photoUrl:'/check_dam.jpg', satAfterUrl:'/sat_after.jpg', satBeforeUrl:'/sat_before.jpg',
        metrics:{ plantHealth:'+0.20 Increase', waterLevel:'+0.15 Active', soilErosion:'Stabilized', matchResult:'92% Match', ndvi:0.52, ndwi:0.28 } },
    ],
  },
  {
    id: 'madurai_vaigai',
    name: 'Madurai Vaigai Basin',
    sublabel: 'Vaigai Basin • Madurai District',
    center: [9.9252, 78.1198] as [number, number],
    zoom: 13,
    boundary: { type: 'Polygon' as const, coordinates: [[[78.100,9.940],[78.140,9.945],[78.145,9.910],[78.105,9.905],[78.100,9.940]]] },
    structures: [
      { id:'TN-NB-003', name:'Alanganallur Nala Bund', type:'Nala Bund', status:'mismatch' as const, lat:9.9252, lng:78.1198, completionDate:'15 Feb 2026', photoUrl:'/check_dam.jpg', satAfterUrl:'/sat_after.jpg', satBeforeUrl:'/sat_before.jpg',
        metrics:{ plantHealth:'+0.05 Increase', waterLevel:'0.00 No Storage', soilErosion:'Active Runoff', matchResult:'Mismatch Flagged', ndvi:0.26, ndwi:-0.02 } },
    ],
  },
  {
    id: 'tirunelveli_thamira',
    name: 'Thamirabarani Basin',
    sublabel: 'Thamirabarani Basin • Tirunelveli District',
    center: [8.7139, 77.7567] as [number, number],
    zoom: 13,
    boundary: { type: 'Polygon' as const, coordinates: [[[77.730,8.730],[77.770,8.735],[77.775,8.700],[77.735,8.695],[77.730,8.730]]] },
    structures: [
      { id:'TN-CD-004', name:'Ambasamudram Check Dam #1', type:'Check Dam', status:'verified' as const, lat:8.7139, lng:77.7567, completionDate:'20 Dec 2025', photoUrl:'/check_dam.jpg', satAfterUrl:'/sat_after.jpg', satBeforeUrl:'/sat_before.jpg',
        metrics:{ plantHealth:'+0.44 Increase', waterLevel:'+0.40 Active Storage', soilErosion:'Arrested', matchResult:'100% Match', ndvi:0.75, ndwi:0.38 } },
    ],
  },
  {
    id: 'kanchipuram_palar',
    name: 'Palar Basin',
    sublabel: 'Palar Basin • Kanchipuram District',
    center: [12.8308, 79.7036] as [number, number],
    zoom: 13,
    boundary: { type: 'Polygon' as const, coordinates: [[[79.680,12.845],[79.720,12.850],[79.725,12.815],[79.685,12.810],[79.680,12.845]]] },
    structures: [
      { id:'TN-CT-005', name:'Kanchipuram Contour Trench', type:'Contour Trench', status:'pending' as const, lat:12.8308, lng:79.7036, completionDate:'05 Mar 2026', photoUrl:'/check_dam.jpg', satAfterUrl:'/sat_after.jpg', satBeforeUrl:'/sat_before.jpg',
        metrics:{ plantHealth:'+0.18 Increase', waterLevel:'+0.12 Moderate', soilErosion:'Partial', matchResult:'87% Match', ndvi:0.48, ndwi:0.18 } },
    ],
  },
];

const QUEUE_DATA = [
  { id:'TNJ-01', name:'Thanjavur Check Dam #2',     gp:'Orathanadu GP',     type:'Check Dam',      status:'Verified',     priority:'NORMAL', assignedTo:'Inspector R. Kumar',  lat:10.7869, lng:79.1378 },
  { id:'MDU-02', name:'Alanganallur Nala Bund',     gp:'Alanganallur GP',   type:'Nala Bund',      status:'Needs Review', priority:'URGENT', assignedTo:'Unassigned',          lat:9.9252,  lng:78.1198 },
  { id:'SLM-03', name:'Omalur Contour Trench',      gp:'Omalur GP',         type:'Contour Trench', status:'Pending',      priority:'NORMAL', assignedTo:'Field Team B',        lat:11.7300, lng:78.0700 },
  { id:'TNV-04', name:'Ambasamudram Check Dam #1',  gp:'Ambasamudram GP',   type:'Check Dam',      status:'Verified',     priority:'NORMAL', assignedTo:'Inspector L. Devi',   lat:8.7139,  lng:77.7567 },
  { id:'KNP-05', name:'Kanchipuram Contour Trench', gp:'Kanchipuram GP',    type:'Contour Trench', status:'Pending',      priority:'HIGH',   assignedTo:'Unassigned',          lat:12.8308, lng:79.7036 },
];

const DISBURSEMENT_DATA = [
  { gp:'Orathanadu GP',    district:'Thanjavur',   allocated:9.2,  paidOut:9.2,  pending:0.0, structures:16, status:'Cleared'   },
  { gp:'Alanganallur GP',  district:'Madurai',     allocated:8.6,  paidOut:8.6,  pending:0.0, structures:14, status:'Cleared'   },
  { gp:'Omalur GP',        district:'Salem',       allocated:7.4,  paidOut:5.4,  pending:2.0, structures:12, status:'In Review' },
  { gp:'Ambasamudram GP',  district:'Tirunelveli', allocated:5.6,  paidOut:5.2,  pending:0.4, structures:10, status:'In Review' },
];

const TN_DISTRICTS   = ['Thanjavur','Madurai','Salem','Tirunelveli','Kanchipuram','Coimbatore','Tiruchirappalli'];
const TN_WATERSHEDS  = ['Cauvery Delta MWS','Vaigai Middle Catchment','Thamirabarani Basin MWS','Palar Ridge Catchment','Noyyal Sub-Basin MWS'];

// ─── Pin Icon ─────────────────────────────────────────────────────────────────
const createPinIcon = (status: 'verified'|'pending'|'mismatch', isSelected: boolean) => {
  const cfg = {
    verified: { bg:'#16a34a', char:'✓', glow:'rgba(22,163,74,0.35)' },
    pending:  { bg:'#f59e0b', char:'!', glow:'rgba(245,158,11,0.35)' },
    mismatch: { bg:'#ef4444', char:'✕', glow:'rgba(239,68,68,0.35)' },
  }[status];
  const sz = isSelected ? 42 : 34;
  return L.divIcon({
    className:'',
    html:`<div style="width:${sz}px;height:${sz+10}px;position:relative;cursor:pointer">
      <div style="width:${sz}px;height:${sz}px;border-radius:50% 50% 50% 0;background:${cfg.bg};
        border:3px solid #fff;box-shadow:0 6px 20px ${cfg.glow},0 2px 6px rgba(0,0,0,0.15);
        transform:rotate(-45deg);display:flex;align-items:center;justify-content:center">
        <span style="transform:rotate(45deg);color:#fff;font-weight:900;font-size:${isSelected?17:14}px">${cfg.char}</span>
      </div>
      <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);
        width:7px;height:10px;background:${cfg.bg};clip-path:polygon(0 0,100% 0,50% 100%)"></div>
    </div>`,
    iconSize:[sz,sz+10], iconAnchor:[sz/2,sz+10], popupAnchor:[0,-(sz+10)],
  });
};

// ─── Status / Priority badge helpers ──────────────────────────────────────────
const STATUS_STYLE = (isDark: boolean): Record<string, { bg: string; color: string; border: string; dot: string }> => {
  if (isDark) {
    return {
      'Verified':     { bg: 'rgba(34,197,94,0.1)',  color: '#4ade80', border: 'rgba(34,197,94,0.25)',  dot: '#22c55e' },
      'Needs Review': { bg: 'rgba(239,68,68,0.1)',  color: '#f87171', border: 'rgba(239,68,68,0.25)',  dot: '#ef4444' },
      'Pending':      { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: 'rgba(251,191,36,0.25)', dot: '#f59e0b' },
    };
  }
  return {
    'Verified':     { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0', dot: '#16a34a' },
    'Needs Review': { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', dot: '#dc2626' },
    'Pending':      { bg: '#fef3c7', color: '#b45309', border: '#fde68a', dot: '#d97706' },
  };
};

const PRIORITY_STYLE = (isDark: boolean): Record<string, { bg: string; color: string }> => {
  if (isDark) {
    return {
      'URGENT': { bg: 'rgba(239,68,68,0.15)',  color: '#f87171' },
      'HIGH':   { bg: 'rgba(249,115,22,0.15)', color: '#fb923c' },
      'NORMAL': { bg: 'rgba(100,116,139,0.1)', color: '#64748b' },
    };
  }
  return {
    'URGENT': { bg: '#fee2e2', color: '#b91c1c' },
    'HIGH':   { bg: '#ffedd5', color: '#c2410c' },
    'NORMAL': { bg: '#f1f5f9', color: '#475569' },
  };
};

// ─── Main Component ───────────────────────────────────────────────────────────
const OperationsAndFinanceModule: React.FC<OperationsAndFinanceModuleProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [activeSection, setActiveSection] = useState<ModuleSection>('gis_queue');
  const [selectedSite, setSelectedSite]     = useState(TN_PILOT_SITES[0]);
  const [selectedStructure, setSelectedStructure] = useState<typeof TN_PILOT_SITES[0]['structures'][0] | null>(null);
  const [activeLayers, setActiveLayers]     = useState<Set<LayerType>>(new Set(['ndvi']));
  const [epoch, setEpoch]                   = useState<EpochType>('after');
  const [drawerImageView, setDrawerImageView] = useState<'field'|'sat'>('field');

  const [selectedDistrict,  setSelectedDistrict]  = useState(TN_DISTRICTS[0]);
  const [selectedWatershed, setSelectedWatershed] = useState(TN_WATERSHEDS[0]);
  const [isGenerating, setIsGenerating]           = useState(false);
  const [reportGenerated, setReportGenerated]     = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef          = useRef<L.Map | null>(null);
  const layerGroupRef   = useRef<L.LayerGroup | null>(null);

  // Dynamic tokens based on theme
  const T = isDark ? {
    bg:               '#040b18',
    tabBarBg:         'linear-gradient(180deg, #070f1f 0%, #0a1628 100%)',
    tabBarBorder:     'rgba(34,197,94,0.15)',
    tabActiveText:    '#f1f5f9',
    tabActiveSub:     '#4ade80',
    tabInactiveText:  '#64748b',
    tabInactiveSub:   '#334155',
    tabActiveBorder:  '#4ade80',
    tabActiveBg:      'rgba(34,197,94,0.06)',

    ctrlBg:           'rgba(7,15,31,0.95)',
    ctrlBorder:       'rgba(255,255,255,0.05)',
    selectBg:         '#0b1628',
    selectBorder:     'rgba(255,255,255,0.1)',
    selectText:       '#e2e8f0',
    labelColor:       '#475569',

    cardBg:           '#070f1f',
    cardBorder:       'rgba(255,255,255,0.08)',
    titleText:        '#f1f5f9',
    subText:          '#94a3b8',
    mutedText:        '#64748b',

    tableBg:          'rgba(7,15,31,0.98)',
    tableHeaderBg:    'rgba(0,0,0,0.3)',
    tableHeaderColor: '#475569',
    tableBorder:      'rgba(255,255,255,0.05)',
    tableText:        '#e2e8f0',

    finHeading:       '#f8fafc',
    finSubheading:    '#94a3b8',
    finCardBg:        'rgba(7,15,31,0.95)',
    finCardBorder:    'rgba(255,255,255,0.08)',
    inputBg:          '#0b1628',
    inputBorder:      'rgba(255,255,255,0.12)',
    inputText:        '#f8fafc',
    previewBoxBg:     '#020617',
  } : {
    bg:               '#f8fafc',
    tabBarBg:         '#ffffff',
    tabBarBorder:     '#e2e8f0',
    tabActiveText:    '#0f172a',
    tabActiveSub:     '#16a34a',
    tabInactiveText:  '#64748b',
    tabInactiveSub:   '#94a3b8',
    tabActiveBorder:  '#16a34a',
    tabActiveBg:      'rgba(22,163,74,0.06)',

    ctrlBg:           '#ffffff',
    ctrlBorder:       '#e2e8f0',
    selectBg:         '#f1f5f9',
    selectBorder:     '#cbd5e1',
    selectText:       '#0f172a',
    labelColor:       '#64748b',

    cardBg:           '#ffffff',
    cardBorder:       '#e2e8f0',
    titleText:        '#0f172a',
    subText:          '#475569',
    mutedText:        '#94a3b8',

    tableBg:          '#ffffff',
    tableHeaderBg:    '#f8fafc',
    tableHeaderColor: '#64748b',
    tableBorder:      '#e2e8f0',
    tableText:        '#0f172a',

    finHeading:       '#0f172a',
    finSubheading:    '#64748b',
    finCardBg:        '#ffffff',
    finCardBorder:    '#e2e8f0',
    inputBg:          '#f8fafc',
    inputBorder:      '#cbd5e1',
    inputText:        '#0f172a',
    previewBoxBg:     '#e2e8f0',
  };

  const statusStyles = STATUS_STYLE(isDark);
  const priorityStyles = PRIORITY_STYLE(isDark);

  // ── Init Map (OpenStreetMap — no API key required) ──
  useEffect(() => {
    if (activeSection !== 'gis_queue') return;
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: selectedSite.center, zoom: selectedSite.zoom,
      zoomControl: false, attributionControl: true,
    });

    // ✅ Free OpenStreetMap tiles — no API key needed
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position:'topright' }).addTo(map);

    const lg = L.layerGroup().addTo(map);
    layerGroupRef.current = lg;
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 200);

    return () => { map.remove(); mapRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  // ── Update overlays / markers ──
  useEffect(() => {
    if (activeSection !== 'gis_queue' || !mapRef.current || !layerGroupRef.current) return;
    const map = mapRef.current;
    const lg  = layerGroupRef.current;
    lg.clearLayers();
    map.flyTo(selectedSite.center, selectedSite.zoom, { duration: 0.8 });

    // Watershed boundary
    L.geoJSON(selectedSite.boundary, {
      style:{ color:'#059669', weight:2.5, fillColor:'#10b981', fillOpacity:0.10, dashArray:'6 4' },
    }).addTo(lg);

    // NDVI overlay
    if (activeLayers.has('ndvi')) {
      const c = selectedSite.center;
      L.circle(c, { radius:900, color: epoch==='after'?'#16a34a':'#d97706',
        fillColor: epoch==='after'?'#16a34a':'#d97706', fillOpacity:0.25, weight:0 })
        .bindTooltip(`Plant Cover (NDVI): ${epoch==='after'?'Dense — Post-Monsoon':'Dry — Pre-Monsoon'}`, { sticky:true })
        .addTo(lg);
    }
    // NDWI overlay
    if (activeLayers.has('ndwi')) {
      const c = selectedSite.center;
      L.circle([c[0]-0.004, c[1]+0.003], { radius: epoch==='after'?600:200,
        color:'#0284c7', fillColor:'#0284c7', fillOpacity: epoch==='after'?0.40:0.15, weight:0 })
        .bindTooltip(`Water Spread (NDWI): ${epoch==='after'?'High Impoundment':'Dry Baseline'}`, { sticky:true })
        .addTo(lg);
    }
    // Land Use
    if (activeLayers.has('lulc')) {
      const c = selectedSite.center;
      L.polygon([[c[0]+0.005,c[1]-0.008],[c[0]+0.008,c[1]+0.005],[c[0]+0.002,c[1]+0.006],[c[0]-0.002,c[1]-0.005]], {
        color:'#65a30d', fillColor:'#84cc16', fillOpacity:0.22, weight:1 })
        .bindTooltip('Land Use: Agriculture / Cropped', { sticky:true }).addTo(lg);
    }

    // Pins
    selectedSite.structures.forEach(st => {
      const isSelected = selectedStructure?.id === st.id;
      const m = L.marker([st.lat, st.lng], { icon: createPinIcon(st.status, isSelected), zIndexOffset: isSelected?1000:0 });
      m.on('click', () => setSelectedStructure(st));
      m.bindTooltip(`<b style="font-size:12px">${st.name}</b><br/><span style="font-size:10px;color:#64748b">${st.type}</span>`, { sticky:true });
      m.addTo(lg);
    });
  }, [selectedSite, selectedStructure, activeLayers, epoch, activeSection]);

  const toggleLayer = (l: LayerType) =>
    setActiveLayers(prev => { const n=new Set(prev); n.has(l)?n.delete(l):n.add(l); return n; });

  const generateReport = () => {
    setIsGenerating(true); setReportGenerated(false);
    setTimeout(() => { setIsGenerating(false); setReportGenerated(true); }, 1800);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: T.bg, fontFamily: 'Inter, sans-serif', overflow: 'hidden', transition: 'background 0.3s ease' }}>

      {/* ── Top Section Tabs ─────────────────────────────────────────────────── */}
      <div style={{
        background: T.tabBarBg,
        borderBottom: `1px solid ${T.tabBarBorder}`,
        padding: '0 24px',
        display: 'flex', gap: 0, flexShrink: 0,
        boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
      }}>
        {([
          { id:'gis_queue',      icon:'🗺️', label:'GIS Map & Verification Queue',  sub:'Interactive map · site inspection · field queue' },
          { id:'finance_report', icon:'₹',  label:'Disbursements & AI Reports',     sub:'Fund tracking · GP payments · DoLR report generator' },
        ] as { id: ModuleSection; icon: string; label: string; sub: string }[]).map(tab => {
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 28px',
                borderBottom: isActive ? `2px solid ${T.tabActiveBorder}` : '2px solid transparent',
                background: isActive ? T.tabActiveBg : 'transparent',
                color: isActive ? T.tabActiveText : T.tabInactiveText,
                fontWeight: isActive ? 700 : 500,
                fontSize: 13, cursor: 'pointer', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: isActive ? T.tabActiveText : T.tabInactiveText }}>{tab.label}</div>
                <div style={{ fontSize: 10, color: isActive ? T.tabActiveSub : T.tabInactiveSub, fontWeight: 500, marginTop: 2 }}>{tab.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION A : GIS MAP & ANOMALY QUEUE
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'gis_queue' && (
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Map Controls Bar */}
          <div style={{
            background: T.ctrlBg,
            borderBottom: `1px solid ${T.ctrlBorder}`,
            padding: '10px 20px',
            display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
            flexShrink: 0, transition: 'background 0.3s ease',
          }}>
            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: T.labelColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Location</span>
              <select
                value={selectedSite.id}
                onChange={e => { const s=TN_PILOT_SITES.find(x=>x.id===e.target.value)||TN_PILOT_SITES[0]; setSelectedSite(s); setSelectedStructure(null); }}
                style={{
                  background: T.selectBg, border: `1px solid ${T.selectBorder}`,
                  borderRadius: 8, padding: '6px 12px', color: T.selectText,
                  fontWeight: 600, fontSize: 12, cursor: 'pointer', outline: 'none',
                }}
              >
                {TN_PILOT_SITES.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div style={{ width: 1, height: 20, background: T.ctrlBorder }} />

            {/* Layer Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: T.labelColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Layers</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {([
                  { id:'ndvi', label:'Plants & Crop Cover', activeColor: isDark?'#4ade80':'#16a34a', activeBg: isDark?'rgba(74,222,128,0.15)':'rgba(22,163,74,0.1)', activeBorder: isDark?'rgba(74,222,128,0.3)':'rgba(22,163,74,0.3)' },
                  { id:'ndwi', label:'Water Spread',        activeColor: isDark?'#22d3ee':'#0891b2', activeBg: isDark?'rgba(34,211,238,0.15)':'rgba(8,145,178,0.1)', activeBorder: isDark?'rgba(34,211,238,0.3)':'rgba(8,145,178,0.3)' },
                  { id:'lulc', label:'Land Use',            activeColor: isDark?'#fbbf24':'#d97706', activeBg: isDark?'rgba(251,191,36,0.15)':'rgba(217,119,6,0.1)', activeBorder: isDark?'rgba(251,191,36,0.3)':'rgba(217,119,6,0.3)'  },
                ] as { id:LayerType; label:string; activeColor:string; activeBg:string; activeBorder:string }[]).map(l => {
                  const on = activeLayers.has(l.id);
                  return (
                    <button
                      key={l.id}
                      onClick={() => toggleLayer(l.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 8,
                        background: on ? l.activeBg : (isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9'),
                        border: on ? `1px solid ${l.activeBorder}` : `1px solid ${T.ctrlBorder}`,
                        color: on ? l.activeColor : (isDark ? '#475569' : '#64748b'),
                        fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: on ? l.activeColor : '#94a3b8' }} />
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ width: 1, height: 20, background: T.ctrlBorder }} />

            {/* Season Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: T.labelColor, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Season</span>
              <div style={{ background: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9', border: `1px solid ${T.ctrlBorder}`, borderRadius: 8, padding: 2, display: 'flex' }}>
                <button onClick={()=>setEpoch('before')} style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none',
                  background: epoch==='before' ? (isDark ? 'rgba(251,191,36,0.15)' : '#fef3c7') : 'transparent',
                  color: epoch==='before' ? (isDark ? '#fbbf24' : '#b45309') : T.subText,
                  transition: 'all 0.2s',
                }}>☀️ Before Monsoon</button>
                <button onClick={()=>setEpoch('after')} style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: 'none',
                  background: epoch==='after' ? (isDark ? 'rgba(34,197,94,0.15)' : '#dcfce7') : 'transparent',
                  color: epoch==='after' ? (isDark ? '#4ade80' : '#15803d') : T.subText,
                  transition: 'all 0.2s',
                }}>🌧️ After Monsoon</button>
              </div>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7 }}>
              <span className="status-dot status-dot-green" style={{ width: 7, height: 7 }} />
              <span style={{ fontSize: 10, color: T.labelColor, fontWeight: 500 }}>OpenStreetMap • Free & Live</span>
            </div>
          </div>

          {/* Map Area */}
          <div style={{ flex: 1, position: 'relative', minHeight: 280 }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

            {/* Status Legend Overlay */}
            <div style={{
              position: 'absolute', top: 16, left: 16, zIndex: 999,
              background: T.cardBg, border: `1px solid ${T.cardBorder}`,
              borderRadius: 12, padding: '10px 14px', backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', width: 140,
            }}>
              <p style={{ fontSize: 9, fontWeight: 800, color: T.mutedText, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Status Legend</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  { label:'Verified',     dot:'#16a34a' },
                  { label:'Pending',      dot:'#f59e0b' },
                  { label:'Needs Review', dot:'#ef4444' },
                ].map(l=>(
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.dot }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: T.titleText }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plant Health Legend Overlay */}
            {activeLayers.has('ndvi') && (
              <div style={{
                position: 'absolute', bottom: 16, right: 16, zIndex: 999,
                background: T.cardBg, border: `1px solid ${T.cardBorder}`,
                borderRadius: 12, padding: '10px 14px', backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)', width: 220,
              }}>
                <p style={{ fontSize: 9, fontWeight: 800, color: T.mutedText, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Plant Health Index (NDVI)</p>
                <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #d97706 0%, #eab308 40%, #16a34a 100%)', marginBottom: 4 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: T.mutedText, fontFamily: 'monospace' }}>
                  <span>-0.2 Barren</span><span>0 Soil</span><span>+0.8 Dense</span>
                </div>
              </div>
            )}

            {/* Instruction tooltip when no site is selected */}
            {!selectedStructure && (
              <div style={{
                position: 'absolute', top: 16, right: 60, zIndex: 999,
                background: isDark ? 'rgba(7,15,31,0.92)' : 'rgba(255,255,255,0.92)',
                border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: '6px 16px',
                fontSize: 11, color: T.titleText, fontWeight: 600, boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                pointerEvents: 'none',
              }}>
                Click a pin to open the Site Inspection Panel →
              </div>
            )}

            {/* Site Inspection Drawer */}
            {selectedStructure && (
              <aside style={{
                position: 'absolute', top: 0, right: 0, bottom: 0, width: 380, zIndex: 1000,
                background: T.cardBg, borderLeft: `1px solid ${T.cardBorder}`,
                display: 'flex', flexDirection: 'column', overflowY: 'auto',
                boxShadow: '-8px 0 30px rgba(0,0,0,0.2)', transition: 'background 0.3s ease',
              }}>
                {/* Drawer Header */}
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${T.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#22c55e', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Site Inspection Drawer</span>
                    <h3 style={{ fontWeight: 800, color: T.titleText, fontSize: 15, marginTop: 2 }}>{selectedStructure.name}</h3>
                  </div>
                  <button onClick={() => setSelectedStructure(null)} style={{ background: 'none', border: 'none', color: T.mutedText, cursor: 'pointer', padding: 4 }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
                </div>

                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>

                  {/* Image Viewer Toggle */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: T.subText }}>Visual Proof View</span>
                      <div style={{ background: isDark?'rgba(255,255,255,0.05)':'#f1f5f9', borderRadius: 8, padding: 2, display: 'flex', gap: 2 }}>
                        <button onClick={()=>setDrawerImageView('field')} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, border: 'none', cursor: 'pointer', background: drawerImageView==='field' ? (isDark?'#22c55e':'#16a34a') : 'transparent', color: drawerImageView==='field' ? '#fff' : T.mutedText }}>Field Photo</button>
                        <button onClick={()=>setDrawerImageView('sat')}   style={{ padding: '3px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, border: 'none', cursor: 'pointer', background: drawerImageView==='sat'   ? (isDark?'#22c55e':'#16a34a') : 'transparent', color: drawerImageView==='sat'   ? '#fff' : T.mutedText }}>Sentinel-2</button>
                      </div>
                    </div>
                    <div style={{ height: 160, borderRadius: 12, overflow: 'hidden', border: `1px solid ${T.cardBorder}`, position: 'relative' }}>
                      <img
                        src={drawerImageView==='field' ? selectedStructure.photoUrl : (epoch==='after'?selectedStructure.satAfterUrl:selectedStructure.satBeforeUrl)}
                        alt="Site visual" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.7)', borderRadius: 6, padding: '3px 8px', color: '#fff', fontSize: 10, fontWeight: 600 }}>
                        {drawerImageView==='field' ? `Surveyor Upload • ${selectedStructure.completionDate}` : `Sentinel-2 MSI • ${epoch==='after'?'Post-Monsoon Scene':'Pre-Monsoon Scene'}`}
                      </div>
                    </div>
                  </div>

                  {/* Metrics Table */}
                  <div style={{ background: isDark?'rgba(255,255,255,0.02)':'#f8fafc', border: `1px solid ${T.cardBorder}`, borderRadius: 12, padding: 14 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: T.mutedText, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Satellite Validation Metrics</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        ['Plant Health (NDVI)', selectedStructure.metrics.plantHealth, '#4ade80'],
                        ['Water Impoundment (NDWI)', selectedStructure.metrics.waterLevel, '#22d3ee'],
                        ['Soil Erosion Index', selectedStructure.metrics.soilErosion, '#fbbf24'],
                        ['AI Match Confidence', selectedStructure.metrics.matchResult, '#38bdf8'],
                      ].map(([k,v,c]) => (
                        <div key={k as string} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                          <span style={{ color: T.subText }}>{k}</span>
                          <span style={{ fontWeight: 700, color: isDark? (c as string) : '#0f172a', fontFamily: 'JetBrains Mono, monospace' }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div style={{ background: isDark?'rgba(255,255,255,0.03)':'#f1f5f9', border: `1px solid ${T.cardBorder}`, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: T.mutedText, fontWeight: 500 }}>WGS84 Coordinates</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: T.titleText, fontSize: 11 }}>{selectedStructure.lat.toFixed(4)}°N, {selectedStructure.lng.toFixed(4)}°E</span>
                  </div>
                </div>
              </aside>
            )}
          </div>

          {/* Field Verification Queue Table */}
          <div style={{ flexShrink: 0, borderTop: `1px solid ${T.tableBorder}`, background: T.tableBg, transition: 'background 0.3s ease' }}>
            <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${T.tableBorder}` }}>
              <div>
                <h3 style={{ fontWeight: 800, color: T.titleText, fontSize: 13 }}>Field Verification Queue</h3>
                <p style={{ fontSize: 10, color: T.mutedText, marginTop: 1 }}>Tamil Nadu — Pending &amp; active site assignments</p>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 20, background: isDark?'rgba(251,191,36,0.1)':'#fef3c7', border: isDark?'1px solid rgba(251,191,36,0.25)':'1px solid #fde68a', color: isDark?'#fbbf24':'#b45309', fontSize: 10, fontWeight: 800 }}>
                {QUEUE_DATA.filter(q=>q.status!=='Verified').length} Pending Actions
              </span>
            </div>
            <div style={{ overflowX: 'auto', maxHeight: 200, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead style={{ background: T.tableHeaderBg, position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    {['Site Name','Type','Status','Priority','Assigned To','Actions'].map(h=>(
                      <th key={h} style={{ padding: '8px 16px', textAlign: 'left', fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.tableHeaderColor, borderBottom: `1px solid ${T.tableBorder}`, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {QUEUE_DATA.map((item, idx) => {
                    const ss = statusStyles[item.status] || statusStyles['Pending'];
                    const ps = priorityStyles[item.priority] || priorityStyles['NORMAL'];
                    return (
                      <tr key={item.id} style={{ borderBottom: idx < QUEUE_DATA.length-1 ? `1px solid ${T.tableBorder}` : 'none' }}
                        onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = isDark?'rgba(255,255,255,0.025)':'#f8fafc'}
                        onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                      >
                        <td style={{ padding: '10px 16px' }}>
                          <p style={{ fontWeight: 700, color: T.titleText, fontSize: 12 }}>{item.name}</p>
                          <p style={{ color: T.mutedText, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, marginTop: 1 }}>{item.gp}</p>
                        </td>
                        <td style={{ padding: '10px 16px', color: T.subText, whiteSpace: 'nowrap' }}>{item.type}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: ss.bg, border: `1px solid ${ss.border}`, color: ss.color, fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: ss.dot, display: 'inline-block' }} />
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ padding: '3px 8px', borderRadius: 6, background: ps.bg, color: ps.color, fontSize: 9, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.priority}</span>
                        </td>
                        <td style={{ padding: '10px 16px', color: T.subText, whiteSpace: 'nowrap' }}>{item.assignedTo}</td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'nowrap' }}>
                            <button style={{ padding: '4px 10px', borderRadius: 7, background: isDark?'rgba(255,255,255,0.05)':'#f1f5f9', border: `1px solid ${T.cardBorder}`, color: T.subText, fontWeight: 600, fontSize: 10, cursor: 'pointer', whiteSpace: 'nowrap' }}>Assign Officer</button>
                            <button style={{ padding: '4px 10px', borderRadius: 7, background: isDark?'rgba(34,211,238,0.08)':'#e0f2fe', border: isDark?'1px solid rgba(34,211,238,0.2)':'1px solid #7dd3fc', color: isDark?'#22d3ee':'#0284c7', fontWeight: 600, fontSize: 10, cursor: 'pointer', whiteSpace: 'nowrap' }}>View Photo</button>
                            {item.status==='Verified' && (
                              <button style={{ padding: '4px 10px', borderRadius: 7, background: isDark?'rgba(34,197,94,0.15)':'#dcfce7', border: isDark?'1px solid rgba(34,197,94,0.3)':'1px solid #86efac', color: isDark?'#4ade80':'#15803d', fontWeight: 700, fontSize: 10, cursor: 'pointer', whiteSpace: 'nowrap' }}>Approve Payment</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION B : DISBURSEMENTS & AI REPORTS
      ═══════════════════════════════════════════════════════════════════════ */}
      {activeSection === 'finance_report' && (
        <div className="flex-1 overflow-y-auto" style={{ background: T.bg }}>
          <div className="max-w-screen-xl mx-auto p-6 space-y-8">

            {/* ── 1. Hero Financial Metrics ── */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: T.finHeading, marginBottom: 16 }}>Financial Overview — NeerDarpan Tamil Nadu</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label:'Total Sanctioned',  value:'₹30.8L', sub:'Total Scheme Allocated',   icon:'📋', val_color: isDark ? '#f8fafc' : '#0f172a' },
                  { label:'Total Paid Out',     value:'₹28.4L', sub:'Paid to Gram Panchayats',  icon:'✅', val_color: isDark ? '#4ade80' : '#15803d' },
                  { label:'Pending Sign-off',   value:'₹2.4L',  sub:'Awaiting Final Clearance', icon:'⏳', val_color: isDark ? '#fbbf24' : '#b45309' },
                  { label:'Funds Utilised',     value:'92%',    sub:'Overall Usage Rate',       icon:'📈', val_color: isDark ? '#38bdf8' : '#1d4ed8' },
                ].map(c=>(
                  <div key={c.label} style={{ background: T.finCardBg, border: `1px solid ${T.finCardBorder}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: isDark?'0 4px 20px rgba(0,0,0,0.2)':'0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: T.mutedText, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c.label}</span>
                      <span style={{ fontSize: 20 }}>{c.icon}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: 32, fontWeight: 800, color: c.val_color, lineHeight: 1 }}>{c.value}</p>
                      <p style={{ fontSize: 11, color: T.finSubheading, marginTop: 6 }}>{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 2. Category Breakdown ── */}
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: T.finHeading, marginBottom: 14 }}>Category Breakdown</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { name:'Check Dams',       icon:'💧', amount:'₹12.2L', structures:18, pct:90 },
                  { name:'Contour Trenches', icon:'🌱', amount:'₹6.8L',  structures:14, pct:87 },
                  { name:'Farm Ponds',       icon:'🌾', amount:'₹5.4L',  structures:12, pct:85 },
                  { name:'Nala Bunds',       icon:'🪨', amount:'₹4.0L',  structures:8,  pct:83 },
                ].map(c=>(
                  <div key={c.name} style={{ background: T.finCardBg, border: `1px solid ${T.finCardBorder}`, borderRadius: 16, padding: 18, boxShadow: isDark?'0 4px 20px rgba(0,0,0,0.2)':'0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, background: isDark?'rgba(255,255,255,0.05)':'#f1f5f9' }}>{c.icon}</div>
                      <div>
                        <p style={{ fontWeight: 700, color: T.finHeading, fontSize: 13 }}>{c.name}</p>
                        <p style={{ fontSize: 11, color: T.finSubheading }}>{c.structures} structures</p>
                      </div>
                    </div>
                    <p style={{ fontSize: 24, fontWeight: 800, color: T.finHeading, marginBottom: 10 }}>{c.amount}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: T.finSubheading }}>
                        <span>Disbursed</span>
                        <span style={{ fontWeight: 700, color: isDark?'#4ade80':'#16a34a' }}>{c.pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: 6, background: isDark?'rgba(255,255,255,0.08)':'#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${c.pct}%`, height: '100%', background: isDark?'#22c55e':'#16a34a', borderRadius: 3 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 3. GP Disbursement Table + AI Generator (2-col) ── */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-7 items-start">

              {/* GP Table — 3 col */}
              <div className="xl:col-span-3">
                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.finHeading, marginBottom: 14 }}>Gram Panchayat Disbursements</h3>
                <div style={{ background: T.finCardBg, border: `1px solid ${T.finCardBorder}`, borderRadius: 16, overflow: 'hidden', boxShadow: isDark?'0 4px 20px rgba(0,0,0,0.2)':'0 2px 8px rgba(0,0,0,0.04)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                    <thead style={{ background: T.tableHeaderBg, borderBottom: `1px solid ${T.tableBorder}` }}>
                      <tr style={{ fontSize: 9, fontWeight: 800, color: T.mutedText, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {['Gram Panchayat','Allocated','Paid Out','Pending','Structures','Status'].map(h=>(
                          <th key={h} style={{ padding: '12px 16px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DISBURSEMENT_DATA.map((gp, idx)=>{
                        const pct = Math.round((gp.paidOut/gp.allocated)*100);
                        return(
                          <tr key={gp.gp} style={{ borderBottom: idx < DISBURSEMENT_DATA.length-1 ? `1px solid ${T.tableBorder}` : 'none' }}>
                            <td style={{ padding: '12px 16px' }}>
                              <p style={{ fontWeight: 700, color: T.finHeading, fontSize: 12 }}>{gp.gp}</p>
                              <p style={{ fontSize: 10, color: T.finSubheading }}>{gp.district}</p>
                            </td>
                            <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: T.finHeading }}>₹{gp.allocated}L</td>
                            <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: isDark?'#4ade80':'#15803d' }}>₹{gp.paidOut}L</td>
                            <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: isDark?'#fbbf24':'#b45309' }}>{gp.pending>0?`₹${gp.pending}L`:'—'}</td>
                            <td style={{ padding: '12px 16px', fontFamily: 'JetBrains Mono, monospace', color: T.finHeading, textAlign: 'center' }}>{gp.structures}</td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 700, width: 'fit-content',
                                  background: gp.status==='Cleared' ? (isDark?'rgba(34,197,94,0.12)':'#dcfce7') : (isDark?'rgba(251,191,36,0.12)':'#fef3c7'),
                                  color: gp.status==='Cleared' ? (isDark?'#4ade80':'#15803d') : (isDark?'#fbbf24':'#b45309'),
                                  border: gp.status==='Cleared' ? (isDark?'1px solid rgba(34,197,94,0.25)':'1px solid #bbf7d0') : (isDark?'1px solid rgba(251,191,36,0.25)':'1px solid #fde68a'),
                                }}>
                                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: gp.status==='Cleared'?'#22c55e':'#f59e0b' }} />
                                  {gp.status}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <div style={{ flex: 1, height: 4, background: isDark?'rgba(255,255,255,0.08)':'#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', background: gp.status==='Cleared'?'#22c55e':'#f59e0b', borderRadius: 2 }} />
                                  </div>
                                  <span style={{ fontSize: 9, fontFamily: 'monospace', color: T.finSubheading }}>{pct}%</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot style={{ background: T.tableHeaderBg, borderTop: `2px solid ${T.tableBorder}` }}>
                      <tr style={{ fontSize: 11, fontWeight: 800, color: T.finHeading }}>
                        <td style={{ padding: '12px 16px' }}>TOTAL</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>₹30.8L</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: isDark?'#4ade80':'#15803d' }}>₹28.4L</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: isDark?'#fbbf24':'#b45309' }}>₹2.4L</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', textAlign: 'center' }}>52</td>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: isDark?'#4ade80':'#15803d' }}>92%</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* AI Report Generator — 2 col */}
              <div className="xl:col-span-2 space-y-5">
                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.finHeading }}>AI Report Generator</h3>

                <div style={{ background: T.finCardBg, border: `1px solid ${T.finCardBorder}`, borderRadius: 16, padding: 20, boxShadow: isDark?'0 4px 20px rgba(0,0,0,0.2)':'0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <p style={{ fontSize: 11, color: T.finSubheading, lineHeight: 1.5 }}>Generate DoLR / IWMP compliant watershed impact reports, powered by satellite &amp; ground data synthesis.</p>

                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: T.mutedText, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Tamil Nadu District</label>
                    <select value={selectedDistrict} onChange={e=>setSelectedDistrict(e.target.value)}
                      style={{
                        width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                        borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 600,
                        color: T.inputText, outline: 'none', cursor: 'pointer',
                      }}>
                      {TN_DISTRICTS.map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: T.mutedText, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Micro-Watershed</label>
                    <select value={selectedWatershed} onChange={e=>setSelectedWatershed(e.target.value)}
                      style={{
                        width: '100%', background: T.inputBg, border: `1px solid ${T.inputBorder}`,
                        borderRadius: 10, padding: '10px 14px', fontSize: 12, fontWeight: 600,
                        color: T.inputText, outline: 'none', cursor: 'pointer',
                      }}>
                      {TN_WATERSHEDS.map(w=><option key={w}>{w}</option>)}
                    </select>
                  </div>

                  <button onClick={generateReport} disabled={isGenerating}
                    style={{
                      width: '100%', padding: '12px 18px',
                      background: 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)',
                      color: '#ffffff', fontWeight: 700, fontSize: 12,
                      borderRadius: 10, border: 'none', cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(22,163,74,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      opacity: isGenerating ? 0.7 : 1, transition: 'all 0.2s',
                    }}>
                    {isGenerating
                      ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Generating Report…</span></>
                      : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg><span>Create DoLR Watershed Impact Report</span></>
                    }
                  </button>
                </div>

                {/* A4 Document Preview */}
                <div style={{ background: T.previewBoxBg, borderRadius: 16, padding: 16, minHeight: 460, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', transition: 'background 0.3s' }}>
                  {!reportGenerated && !isGenerating && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', textAlign: 'center', width: '100%', gap: 12 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: isDark?'#0f172a':'#ffffff', border: `1px solid ${T.finCardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <svg width="24" height="24" style={{ color: T.mutedText }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </div>
                      <p style={{ fontWeight: 700, color: T.finHeading, fontSize: 13 }}>Report preview will appear here</p>
                      <p style={{ fontSize: 11, color: T.finSubheading, maxWidth: 220 }}>Select a district &amp; watershed, then click the Generate button above.</p>
                    </div>
                  )}
                  {isGenerating && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 14, width: '100%' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid #86efac', borderTopColor: '#16a34a' }} className="animate-spin" />
                      <p style={{ fontSize: 12, fontWeight: 700, color: T.finHeading }}>Synthesising satellite &amp; field data…</p>
                    </div>
                  )}
                  {reportGenerated && (
                    <div style={{ background: '#ffffff', color: '#0f172a', width: '100%', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.25)', border: '1px solid #e2e8f0', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ borderBottom: '2px solid #15803d', paddingBottom: 14 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#15803d', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>🌿</div>
                          <div>
                            <p style={{ fontSize: 9, fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Ministry of Rural Development, Govt. of India</p>
                            <p style={{ fontSize: 9, color: '#64748b' }}>Dept. of Land Resources · PMKSY-WDC 2.0</p>
                          </div>
                        </div>
                        <h1 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>DoLR Watershed Impact Report</h1>
                        <p style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>📍 {selectedDistrict} · {selectedWatershed} · 🛰️ Sentinel-2 Analysis</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <h2 style={{ fontSize: 10, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', borderLeft: '3px solid #16a34a', paddingLeft: 8 }}>Executive Summary</h2>
                        <p style={{ fontSize: 11, color: '#334155', lineHeight: 1.5 }}>The <strong>{selectedWatershed}</strong> in <strong>{selectedDistrict}</strong> district has shown measurable hydro-vegetative improvements. 52 structures commissioned; 48 (92.3%) received satellite clearance. Water storage reached 18.2 ML (+42% vs baseline). Fund utilisation: ₹28.4L / ₹30.8L (92%).</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <h2 style={{ fontSize: 10, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', borderLeft: '3px solid #0284c7', paddingLeft: 8 }}>Satellite Change Metrics</h2>
                        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 10, fontSize: 11, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {[
                            ['NDVI Delta','+0.34 (Pre→Post Monsoon)'],
                            ['NDWI Expansion','+340 ha Active Impoundment'],
                            ['Cloud Cover','0.02% (Pristine Scene)'],
                            ['Gully Erosion Index','−41% Reduction'],
                          ].map(([k,v])=>(
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e0f2fe', paddingBottom: 2 }}>
                              <span style={{ fontWeight: 600, color: '#334155' }}>{k}</span>
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0369a1' }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <h2 style={{ fontSize: 10, fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em', borderLeft: '3px solid #d97706', paddingLeft: 8 }}>Ground Photo Proof Log</h2>
                        <p style={{ fontSize: 11, color: '#334155', lineHeight: 1.5 }}>52 geo-tagged photographs submitted by surveyors. AI classification confidence: 88.7%. 1 GPS offset anomaly flagged for re-inspection.</p>
                      </div>
                      <div style={{ fontSize: 9, color: '#94a3b8', paddingTop: 8, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                        <span>NeerDarpan · NRSC · TN-WDC 2.0</span>
                        <span style={{ fontFamily: 'monospace' }}>Generated: {new Date().toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationsAndFinanceModule;
