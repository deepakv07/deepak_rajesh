import { useEffect, useState } from 'react';

interface AnalysisCardProps {
  photo: string;
  gps: { lat: string; lng: string };
}

type TabId = 'sensing' | 'probability' | 'comparison' | 'correlation';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'sensing', label: 'Remote Sensing', icon: '📡' },
  { id: 'probability', label: 'AI Probability', icon: '🧠' },
  { id: 'comparison', label: 'Before vs After', icon: '📊' },
  { id: 'correlation', label: 'Geo-Correlation', icon: '🛰️' },
];

const PROBABILITIES = [
  { label: 'Check Dam', value: 88.4, color: 'bg-green-500', glow: 'rgba(34,197,94,0.5)' },
  { label: 'Plantation', value: 7.1, color: 'bg-cyan-500', glow: 'rgba(6,182,212,0.5)' },
  { label: 'Pond', value: 2.8, color: 'bg-violet-500', glow: 'rgba(139,92,246,0.5)' },
  { label: 'Bund / Embankment', value: 1.6, color: 'bg-amber-500', glow: 'rgba(245,158,11,0.5)' },
];

const COMPARISON_ROWS = [
  {
    param: 'Vegetation Index (NDVI)',
    icon: '🌿',
    baseline: '0.31 (Sparse)',
    current: '0.59 (Dense)',
    delta: '+0.28',
    deltaColor: 'text-green-400',
    status: 'IMPROVED',
  },
  {
    param: 'Surface Water & Moisture (NDWI)',
    icon: '💧',
    baseline: 'Unimpounded / −0.12',
    current: 'Active Impoundment / +0.41',
    delta: '+0.53',
    deltaColor: 'text-cyan-400',
    status: 'ACTIVE',
  },
  {
    param: 'Water Column / Impoundment',
    icon: '🏞️',
    baseline: 'Seasonal Runoff',
    current: 'Optimal Storage (~2.4M L)',
    delta: '↑ 2.4M L',
    deltaColor: 'text-blue-400',
    status: 'OPTIMAL',
  },
  {
    param: 'Soil Erosion & Runoff',
    icon: '🪨',
    baseline: 'Active Rill Erosion',
    current: 'Arrested / Silt trapped',
    delta: '−78%',
    deltaColor: 'text-amber-400',
    status: 'ARRESTED',
  },
];

interface AnimatedBarProps {
  value: number;
  color: string;
  glow: string;
  delay: number;
}

const AnimatedBar = ({ value, color, glow, delay }: AnimatedBarProps) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="progress-bar">
      <div
        className={`progress-fill ${color}`}
        style={{
          width: `${width}%`,
          transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
          boxShadow: `0 0 8px ${glow}`,
        }}
      />
    </div>
  );
};

const AnalysisCard = ({ photo, gps }: AnalysisCardProps) => {
  const [activeTab, setActiveTab] = useState<TabId>('sensing');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`animate-slide-up ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Top Classification Badge */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30"
          style={{ boxShadow: '0 0 20px rgba(34,197,94,0.15)' }}>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" style={{ boxShadow: '0 0 8px #22c55e' }} />
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-green-400">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
          <span className="text-green-300 font-semibold text-sm">AI Classification:</span>
          <span className="text-green-400 font-bold text-sm">Check Dam — High Confidence (88.4%)</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 border border-white/5">
          <span className="text-slate-400 text-xs">Granule:</span>
          <span className="text-cyan-400 text-xs font-mono">T43PGN_20241018</span>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/8 border border-amber-500/15">
          <span className="text-amber-400 text-xs font-mono">PMKSY-WDC</span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="text-slate-400 text-xs">Scheme</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Left: Photo Panel */}
        <div className="xl:col-span-2 glass-card p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Field Evidence</span>
            <span className="satellite-badge">VERIFIED</span>
          </div>
          
          {/* Photo with overlay */}
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={photo}
              alt="Field verification photograph"
              className="w-full aspect-video object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = '/check_dam.jpg'; }}
            />
            {/* Scan overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            
            {/* Corner brackets */}
            {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-5 h-5`}>
                <svg viewBox="0 0 20 20" className="w-5 h-5">
                  <path d={
                    i === 0 ? 'M0 8 L0 0 L8 0' :
                    i === 1 ? 'M12 0 L20 0 L20 8' :
                    i === 2 ? 'M0 12 L0 20 L8 20' :
                    'M12 20 L20 20 L20 12'
                  } stroke="#22c55e" strokeWidth="2" fill="none" />
                </svg>
              </div>
            ))}

            {/* GPS Tag */}
            <div className="absolute bottom-3 left-3 gps-overlay px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-green-400"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  <div className="absolute inset-0 animate-ping opacity-30">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-green-400"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                  </div>
                </div>
                <div>
                  <p className="text-green-300 text-[10px] font-mono leading-none">{parseFloat(gps.lat).toFixed(4)}°N, {parseFloat(gps.lng).toFixed(4)}°E</p>
                  <p className="text-slate-400 text-[9px] font-mono leading-tight">WGS84 · EXIF Verified</p>
                </div>
              </div>
            </div>

            {/* Confidence badge */}
            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/40 backdrop-blur-sm">
              <span className="text-green-300 text-[10px] font-mono font-bold">88.4% CONF.</span>
            </div>
          </div>

          {/* Quick satellite stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Cloud Cover', value: '4.2%', icon: '☁️', ok: true },
              { label: 'Temporal Gap', value: '12 days', icon: '📅', ok: true },
              { label: 'Resolution', value: '10m / px', icon: '🔭', ok: true },
              { label: 'Pass Time', value: '10:31 IST', icon: '🛰️', ok: true },
            ].map(stat => (
              <div key={stat.label} className="metric-card px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{stat.icon}</span>
                  <div>
                    <p className="text-slate-500 text-[9px] uppercase tracking-wide">{stat.label}</p>
                    <p className="text-white text-xs font-semibold">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Analysis Tabs */}
        <div className="xl:col-span-3 glass-card flex flex-col overflow-hidden">
          {/* Tab Bar */}
          <div className="flex border-b border-white/5 px-2 pt-2 gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id ? 'tab-active' : 'tab-inactive'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-5 overflow-auto">
            {activeTab === 'sensing' && <RemoteSensingTab />}
            {activeTab === 'probability' && <ProbabilityTab />}
            {activeTab === 'comparison' && <ComparisonTab />}
            {activeTab === 'correlation' && <CorrelationTab />}
          </div>
        </div>
      </div>

      {/* Scheme Disbursement Status */}
      <DisbursementStatus />
    </div>
  );
};

/* ─── Remote Sensing Tab ─── */
const RemoteSensingTab = () => (
  <div className="space-y-4 animate-fade-in">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-green-400 to-cyan-500" />
      <h3 className="text-white font-semibold text-sm">Remote Sensing Evidence Interpretation</h3>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        {
          icon: '🌿',
          label: 'Vegetation Increase (ΔNDVI)',
          value: '+0.28',
          valueColor: 'text-green-400',
          desc: 'Significant vegetation recovery detected post-impoundment. Dense canopy established over 4.2 ha riparian corridor.',
          band: 'B04/B08',
        },
        {
          icon: '💧',
          label: 'Water Column Change',
          value: '+2.4M L',
          valueColor: 'text-cyan-400',
          desc: 'Impoundment volume increased from near-zero runoff to optimal storage capacity. NDWI shift: −0.12 → +0.41.',
          band: 'B03/B08',
        },
        {
          icon: '☁️',
          label: 'Cloud Cover %',
          value: '4.2%',
          valueColor: 'text-slate-300',
          desc: 'Near-cloud-free acquisition. Scene usable for high-confidence classification. Masking applied to residual pixels.',
          band: 'SCL-L2A',
        },
        {
          icon: '🛰️',
          label: 'Satellite Granule ID',
          value: 'T43PGN',
          valueColor: 'text-violet-400',
          desc: 'Sentinel-2B L2A tile. Acquisition: 18-Oct-2024 10:31 IST. Cross-validated with Landsat-9 OLI pass (Oct 22).',
          band: 'UTM-43N',
        },
      ].map(item => (
        <div key={item.label} className="metric-card p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="text-slate-300 text-xs font-medium leading-tight">{item.label}</span>
            </div>
            <span className={`${item.valueColor} text-sm font-bold font-mono flex-shrink-0`}>{item.value}</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed mb-2">{item.desc}</p>
          <span className="inline-block px-2 py-0.5 rounded bg-slate-700/80 text-slate-400 text-[10px] font-mono">Band: {item.band}</span>
        </div>
      ))}
    </div>

    {/* Spectral signature visualization */}
    <div className="metric-card p-4">
      <p className="text-slate-400 text-xs font-medium mb-3 uppercase tracking-wider">Spectral Signature Comparison</p>
      <div className="flex items-end gap-1 h-16">
        {[0.12, 0.18, 0.09, 0.31, 0.55, 0.59, 0.48, 0.42].map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-gradient-to-t from-green-600 to-green-400"
              style={{ height: `${v * 100}%`, opacity: 0.7 + i * 0.04 }}
            />
            <span className="text-slate-600 text-[8px] font-mono">{['B02','B03','B04','B05','B07','B08','B11','B12'][i]}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Probability Tab ─── */
const ProbabilityTab = () => (
  <div className="space-y-5 animate-fade-in">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-400 to-cyan-500" />
      <h3 className="text-white font-semibold text-sm">AI Probability Distribution</h3>
      <span className="ml-auto text-slate-500 text-xs font-mono">Model: WatershedNet v2.1</span>
    </div>

    <div className="space-y-4">
      {PROBABILITIES.map((item, idx) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} style={{ boxShadow: `0 0 6px ${item.glow}` }} />
              <span className="text-slate-200 text-sm font-medium">{item.label}</span>
              {idx === 0 && (
                <span className="px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 text-[10px] font-bold">TOP MATCH</span>
              )}
            </div>
            <span className={`font-bold text-sm font-mono ${idx === 0 ? 'text-green-400' : 'text-slate-400'}`}>
              {item.value}%
            </span>
          </div>
          <AnimatedBar value={item.value} color={item.color} glow={item.glow} delay={idx * 150} />
        </div>
      ))}
    </div>

    {/* Confidence breakdown */}
    <div className="grid grid-cols-3 gap-3 mt-4">
      {[
        { label: 'Spectral Match', value: '91.2%', color: 'text-green-400' },
        { label: 'Morphology', value: '86.7%', color: 'text-cyan-400' },
        { label: 'Context Score', value: '88.1%', color: 'text-violet-400' },
      ].map(m => (
        <div key={m.label} className="metric-card p-3 text-center">
          <p className={`${m.color} text-lg font-bold font-mono`}>{m.value}</p>
          <p className="text-slate-500 text-[10px] mt-0.5">{m.label}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ─── Comparison Tab ─── */
const ComparisonTab = () => (
  <div className="animate-fade-in">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-400 to-green-500" />
      <h3 className="text-white font-semibold text-sm">Before vs After Parameter Comparison</h3>
    </div>
    <div className="overflow-x-auto rounded-xl border border-white/5">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-800/80">
            <th className="text-left px-4 py-3 text-slate-400 font-medium uppercase tracking-wider w-40">Parameter</th>
            <th className="text-left px-4 py-3 text-slate-400 font-medium uppercase tracking-wider">Baseline (Pre)</th>
            <th className="text-left px-4 py-3 text-slate-400 font-medium uppercase tracking-wider">Current (Post)</th>
            <th className="text-center px-4 py-3 text-slate-400 font-medium uppercase tracking-wider w-24">Delta</th>
            <th className="text-center px-4 py-3 text-slate-400 font-medium uppercase tracking-wider w-24">Status</th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row, i) => (
            <tr key={row.param} className={`border-t border-white/5 hover:bg-white/2 transition-colors ${i % 2 === 0 ? 'bg-slate-900/20' : ''}`}>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{row.icon}</span>
                  <span className="text-slate-200 font-medium leading-tight">{row.param}</span>
                </div>
              </td>
              <td className="px-4 py-3.5 text-slate-500 font-mono">{row.baseline}</td>
              <td className="px-4 py-3.5 text-slate-200 font-mono">{row.current}</td>
              <td className="px-4 py-3.5 text-center">
                <span className={`${row.deltaColor} font-bold font-mono text-sm`}>{row.delta}</span>
              </td>
              <td className="px-4 py-3.5 text-center">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  row.status === 'IMPROVED' ? 'bg-green-500/15 border border-green-500/25 text-green-400' :
                  row.status === 'ACTIVE' ? 'bg-cyan-500/15 border border-cyan-500/25 text-cyan-400' :
                  row.status === 'OPTIMAL' ? 'bg-blue-500/15 border border-blue-500/25 text-blue-400' :
                  'bg-amber-500/15 border border-amber-500/25 text-amber-400'
                }`}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ─── Correlation Tab ─── */
const CorrelationTab = () => (
  <div className="space-y-4 animate-fade-in">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-violet-500" />
      <h3 className="text-white font-semibold text-sm">Geotag vs Satellite Correlation</h3>
    </div>

    {/* Main match badge */}
    <div className="rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-900/5 p-5 flex items-center gap-4"
      style={{ boxShadow: '0 0 30px rgba(34,197,94,0.1)' }}>
      <div className="relative w-14 h-14 flex-shrink-0">
        <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-8 h-8 fill-green-400">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-green-400 opacity-40 ripple-ring" />
        <div className="absolute inset-0 rounded-full border-2 border-green-400 opacity-20 ripple-ring-2" />
      </div>
      <div>
        <p className="text-green-300 text-xl font-bold">100% Match</p>
        <p className="text-green-400 text-sm font-medium">Geo-spatial alignment confirmed</p>
        <p className="text-slate-400 text-xs mt-1">Photo GPS coordinates match satellite-detected structure centroid within 8.3m error radius</p>
      </div>
    </div>

    {/* Correlation metrics */}
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Spatial Offset', value: '8.3m', icon: '📍', color: 'text-green-400', status: 'Within tolerance' },
        { label: 'Temporal Match', value: '±12d', icon: '📅', color: 'text-cyan-400', status: 'Seasonal valid' },
        { label: 'Structure Type', value: 'MATCH', icon: '🏗️', color: 'text-green-400', status: 'Check dam confirmed' },
        { label: 'Anomaly Flag', value: 'NONE', icon: '✅', color: 'text-green-400', status: 'No mismatch' },
      ].map(m => (
        <div key={m.label} className="metric-card p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{m.icon}</span>
            <span className="text-slate-400 text-[10px] uppercase tracking-wide">{m.label}</span>
          </div>
          <p className={`${m.color} text-base font-bold font-mono`}>{m.value}</p>
          <p className="text-slate-600 text-[10px]">{m.status}</p>
        </div>
      ))}
    </div>

    {/* Anomaly section - shown as clear */}
    <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 flex items-center gap-3">
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-400 flex-shrink-0">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <div>
        <p className="text-slate-200 text-sm font-medium">No Photo Mismatch / Anomaly Detected</p>
        <p className="text-slate-500 text-xs">EXIF metadata, GPS coords and satellite-derived centroid are consistent. Fraud risk: LOW.</p>
      </div>
    </div>
  </div>
);

/* ─── Disbursement Status ─── */
const DisbursementStatus = () => (
  <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
    {/* Payment Status */}
    <div className="glass-card p-4 flex items-center gap-4 border-green-500/20"
      style={{ boxShadow: '0 0 16px rgba(34,197,94,0.08)' }}>
      <div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/25 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-400">
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
        </svg>
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Scheme Disbursement</p>
        <p className="text-green-400 font-bold text-base">Payment Cleared ✓</p>
        <p className="text-slate-500 text-xs">Tranche 2 · ₹3.8L · 22-Oct-2024</p>
      </div>
    </div>

    {/* DoLR Reference */}
    <div className="glass-card p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-amber-400">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">DoLR Reference</p>
        <p className="text-white font-semibold text-sm">WDC-MH-2024-11782</p>
        <p className="text-slate-500 text-xs">PMKSY · Watershed Dev. Component</p>
      </div>
    </div>

    {/* Inspector */}
    <div className="glass-card p-4 flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-cyan-400">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Field Officer</p>
        <p className="text-white font-semibold text-sm">Shri R.K. Sharma</p>
        <p className="text-slate-500 text-xs">Verified · Pune District · AI-Endorsed</p>
      </div>
    </div>
  </div>
);

export default AnalysisCard;
