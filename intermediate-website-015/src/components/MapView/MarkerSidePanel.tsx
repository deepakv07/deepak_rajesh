import type { StructureMarker } from './mapData';

interface MarkerSidePanelProps {
  marker: StructureMarker | null;
  onClose: () => void;
  epoch: 'before' | 'after';
}

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const statusConfig = {
  verified: { label: 'Ground Verified & Satellite Corroborated', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-400', icon: '✅' },
  attention: { label: 'Attention Needed', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-400', icon: '⚠️' },
  mismatch: { label: 'Photo Mismatch / Anomaly Detected', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-400', icon: '🚨' },
};

const typeIcon: Record<string, string> = {
  'Check Dam': '💧', 'Percolation Tank': '🏞️', 'Farm Pond': '🌊', 'Gully Plug': '🪨',
};

// ─── Mini SVG NDVI Sparkline ───
const NdviSparkline = ({ series, baseline, current }: { series: number[]; baseline: number; current: number }) => {
  const min = 0.1;
  const max = 0.7;
  const w = 280;
  const h = 80;
  const pad = { t: 8, r: 8, b: 20, l: 32 };
  const chartW = w - pad.l - pad.r;
  const chartH = h - pad.t - pad.b;

  const toX = (i: number) => pad.l + (i / (series.length - 1)) * chartW;
  const toY = (v: number) => pad.t + chartH - ((v - min) / (max - min)) * chartH;

  const linePath = series.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(v)}`).join(' ');
  const areaPath = `${linePath} L ${toX(series.length - 1)} ${pad.t + chartH} L ${toX(0)} ${pad.t + chartH} Z`;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-slate-400 text-[10px] uppercase tracking-wider">NDVI Trend (Jan – Dec)</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-amber-400 inline-block rounded" />Baseline {baseline.toFixed(2)}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-green-400 inline-block rounded" />Current {current.toFixed(2)}</span>
        </div>
      </div>
      <svg width={w} height={h} className="w-full">
        {/* Grid lines */}
        {[0.2, 0.3, 0.4, 0.5, 0.6].map(v => (
          <g key={v}>
            <line x1={pad.l} y1={toY(v)} x2={w - pad.r} y2={toY(v)} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <text x={pad.l - 4} y={toY(v) + 4} fill="#475569" fontSize="8" textAnchor="end" fontFamily="monospace">{v.toFixed(1)}</text>
          </g>
        ))}
        {/* Month labels */}
        {series.map((_, i) => (
          <text key={i} x={toX(i)} y={h - 4} fill="#475569" fontSize="8" textAnchor="middle" fontFamily="monospace">{MONTHS[i]}</text>
        ))}
        {/* Area fill */}
        <path d={areaPath} fill="url(#ndviGrad)" opacity="0.3" />
        {/* Line */}
        <path d={linePath} fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinejoin="round" />
        {/* Baseline level */}
        <line x1={pad.l} y1={toY(baseline)} x2={w - pad.r} y2={toY(baseline)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
        {/* Dots */}
        {series.map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill="#22c55e" opacity="0.9" />
        ))}
        <defs>
          <linearGradient id="ndviGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ─── Satellite comparison thumbnails ───
const SatComparison = ({ epoch }: { epoch: 'before' | 'after' }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <span className="text-slate-400 text-[10px] uppercase tracking-wider">Sentinel-2 Comparison</span>
      <span className="text-slate-600 text-[10px] font-mono">T43PGN · 10m res</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="relative rounded-lg overflow-hidden">
        <img
          src="/sat_before.jpg"
          alt="Pre-monsoon satellite"
          className="w-full h-24 object-cover"
          style={{ filter: epoch === 'before' ? 'none' : 'brightness(0.6) saturate(0.4)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className={`absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold font-mono ${epoch === 'before' ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
          PRE · Apr 2024
        </div>
      </div>
      <div className="relative rounded-lg overflow-hidden">
        <img
          src="/sat_after.jpg"
          alt="Post-monsoon satellite"
          className="w-full h-24 object-cover"
          style={{ filter: epoch === 'after' ? 'none' : 'brightness(0.6) saturate(0.4)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className={`absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[9px] font-bold font-mono ${epoch === 'after' ? 'bg-green-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
          POST · Oct 2024
        </div>
      </div>
    </div>
  </div>
);

const MarkerSidePanel = ({ marker, onClose, epoch }: MarkerSidePanelProps) => {
  const isOpen = !!marker;

  return (
    <div
      className={`flex-shrink-0 border-l border-white/5 bg-slate-950/95 backdrop-blur-sm overflow-y-auto transition-all duration-400 ease-in-out ${
        isOpen ? 'w-full sm:w-96' : 'w-0 overflow-hidden border-transparent'
      }`}
      style={{ minWidth: isOpen ? undefined : 0 }}
    >
      {marker && (
        <div className="p-4 min-w-0 animate-slide-up">
          {/* Panel Header */}
          <div className="flex items-start justify-between gap-2 mb-4">
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/8 flex items-center justify-center flex-shrink-0 text-lg mt-0.5">
                {typeIcon[marker.type]}
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-semibold text-sm leading-tight">{marker.name}</h3>
                <p className="text-slate-500 text-xs mt-0.5 font-mono">{marker.id} · {marker.type}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-800 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all flex-shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>

          {/* Status Badge */}
          {(() => {
            const sc = statusConfig[marker.status];
            return (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${sc.bg} border ${sc.border} mb-4`}>
                <span className="text-base">{sc.icon}</span>
                <span className={`${sc.color} text-xs font-semibold`}>{sc.label}</span>
              </div>
            );
          })()}

          {/* Issue alert */}
          {marker.issue && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/8 border border-red-500/20 mb-4">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-red-400 flex-shrink-0 mt-0.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              <p className="text-red-300 text-[11px] leading-relaxed">{marker.issue}</p>
            </div>
          )}

          {/* GPS Coords */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="metric-card p-2.5">
              <p className="text-slate-600 text-[9px] uppercase tracking-wide mb-0.5">GPS Location</p>
              <p className="text-white text-xs font-mono leading-tight">{marker.gpsStr}</p>
            </div>
            <div className="metric-card p-2.5">
              <p className="text-slate-600 text-[9px] uppercase tracking-wide mb-0.5">AI Confidence</p>
              <p className={`text-sm font-bold font-mono ${marker.confidence >= 80 ? 'text-green-400' : marker.confidence >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                {marker.confidence}%
              </p>
            </div>
          </div>

          {/* Field photo + satellite thumbnails */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider">Ground Photo</span>
              <span className="text-slate-600 text-[10px] font-mono">EXIF Verified</span>
            </div>
            <div className="relative rounded-lg overflow-hidden">
              <img
                src="/check_dam.jpg"
                alt="Ground photo"
                className="w-full h-28 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 gps-overlay px-2 py-1 flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-green-400"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span className="text-green-300 text-[9px] font-mono">{marker.gpsStr}</span>
              </div>
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 text-[9px] font-mono">{marker.lastInspected}</div>
            </div>
          </div>

          {/* Satellite comparison */}
          <div className="mb-4">
            <SatComparison epoch={epoch} />
          </div>

          {/* NDVI Chart */}
          <div className="metric-card p-3 mb-4">
            <NdviSparkline
              series={marker.ndviSeries}
              baseline={marker.ndviBaseline}
              current={marker.ndviCurrent}
            />
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Capacity', value: marker.capacity, color: 'text-cyan-400' },
              { label: 'Scheme', value: marker.scheme, color: 'text-violet-400' },
              { label: 'ΔNDVI', value: `+${(marker.ndviCurrent - marker.ndviBaseline).toFixed(2)}`, color: 'text-green-400' },
            ].map(m => (
              <div key={m.label} className="metric-card p-2.5 text-center">
                <p className={`${m.color} text-sm font-bold font-mono`}>{m.value}</p>
                <p className="text-slate-600 text-[9px] mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Payment status */}
          <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-4 border ${
            marker.payment === 'cleared' ? 'bg-green-500/8 border-green-500/20' :
            marker.payment === 'pending' ? 'bg-amber-500/8 border-amber-500/20' :
            'bg-red-500/8 border-red-500/20'
          }`}>
            <span className="text-xl">{marker.payment === 'cleared' ? '✅' : marker.payment === 'pending' ? '⏳' : '🚫'}</span>
            <div>
              <p className={`text-sm font-bold ${marker.payment === 'cleared' ? 'text-green-400' : marker.payment === 'pending' ? 'text-amber-400' : 'text-red-400'}`}>
                {marker.payment === 'cleared' ? 'Payment Cleared' :
                 marker.payment === 'pending' ? 'Payment Pending Verification' :
                 'Tranche Held — Awaiting Field Check'}
              </p>
              <p className="text-slate-500 text-[10px]">Officer: {marker.officer}</p>
            </div>
          </div>

          {/* Generate Report Button */}
          <button
            className="btn-primary w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5"
            onClick={() => alert(`Generating Micro-Watershed Report for ${marker.id}...\n\nThis would generate a full PDF report with:\n• Satellite imagery comparison\n• NDVI / NDWI analysis\n• Structure verification summary\n• Payment status details\n• DoLR compliance check`)}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            Generate Micro-Watershed Report
          </button>
        </div>
      )}
    </div>
  );
};

export default MarkerSidePanel;
