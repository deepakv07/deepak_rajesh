import { useEffect, useState } from 'react';

// ─── WII Inputs ───────────────────────────────────────────────────────────────
interface WiiInputs {
  ndviBaseline: number;
  ndviCurrent: number;
  waterBaseline: number;  // ha
  waterCurrent: number;   // ha
  degradedBaseline: number; // ha
  degradedCurrent: number;  // ha
  photoConfidence: number;  // 0-100
}

const DEFAULT_INPUTS: WiiInputs = {
  ndviBaseline: 0.29,
  ndviCurrent: 0.58,
  waterBaseline: 8.4,
  waterCurrent: 34.2,
  degradedBaseline: 142,
  degradedCurrent: 89,
  photoConfidence: 86.7,
};

// ─── WII Calculation ──────────────────────────────────────────────────────────
function computeWII(inp: WiiInputs): { score: number; components: { label: string; weight: number; value: number; contribution: number }[] } {
  const ndviMax = 0.7, ndviMin = 0.1;
  const waterMax = 50;
  const degradedMax = 200;

  const deltaNdvi      = Math.max(0, inp.ndviCurrent - inp.ndviBaseline);
  const ndviNorm       = Math.min(1, deltaNdvi / (ndviMax - ndviMin));

  const deltaWater     = Math.max(0, inp.waterCurrent - inp.waterBaseline);
  const waterNorm      = Math.min(1, deltaWater / waterMax);

  const deltaDegraded  = Math.max(0, inp.degradedBaseline - inp.degradedCurrent);
  const degradedNorm   = Math.min(1, deltaDegraded / degradedMax);

  const photoNorm      = inp.photoConfidence / 100;

  const components = [
    { label: 'ΔNDVI (Vegetation Recovery)',     weight: 0.30, value: ndviNorm,     contribution: 0.30 * ndviNorm     },
    { label: 'ΔWater Spread',                   weight: 0.30, value: waterNorm,    contribution: 0.30 * waterNorm    },
    { label: 'Land Degradation Reversal',        weight: 0.25, value: degradedNorm, contribution: 0.25 * degradedNorm },
    { label: 'Photo Validation Confidence',      weight: 0.15, value: photoNorm,    contribution: 0.15 * photoNorm    },
  ];

  const score = Math.min(100, Math.round(components.reduce((s, c) => s + c.contribution, 0) * 100));
  return { score, components };
}

// ─── Gauge SVG ────────────────────────────────────────────────────────────────
const WiiGauge = ({ score }: { score: number }) => {
  const [animScore, setAnimScore] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const duration = 1400;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimScore(Math.round(ease * score));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  const r = 72;
  const cx = 100, cy = 100;
  const strokeW = 14;
  // Semi-circle: from 180deg to 0deg (left to right)
  const circumference = Math.PI * r; // half circumference
  const progress = animScore / 100;
  const dashOffset = circumference * (1 - progress);

  const getColor = (s: number) => {
    if (s >= 75) return '#34d399'; // emerald
    if (s >= 50) return '#22c55e'; // green
    if (s >= 25) return '#f59e0b'; // amber
    return '#ef4444';              // red
  };
  const getLabel = (s: number) => {
    if (s >= 75) return 'Excellent Impact';
    if (s >= 50) return 'Good Progress';
    if (s >= 25) return 'Moderate';
    return 'Needs Attention';
  };

  const color = getColor(animScore);

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW} strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map(v => {
          const angle = Math.PI * (1 - v / 100); // 180 to 0
          const ix = cx + (r + 10) * Math.cos(Math.PI - angle);
          const iy = cy - (r + 10) * Math.sin(Math.PI - angle);
          return (
            <text key={v} x={ix} y={iy + 4} textAnchor="middle" fontSize="8" fill="#475569" fontFamily="monospace">{v}</text>
          );
        })}
        {/* Center score */}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="32" fontWeight="700" fill={color} fontFamily="monospace">{animScore}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Inter, sans-serif">WII Score</text>
      </svg>
      <div className="mt-1 px-4 py-1 rounded-full text-xs font-semibold" style={{ background: `${color}20`, color, border: `1px solid ${color}44` }}>
        {getLabel(animScore)}
      </div>
    </div>
  );
};

// ─── Input Slider ─────────────────────────────────────────────────────────────
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}
const SliderInput = ({ label, value, min, max, step, unit, onChange }: SliderProps) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <label className="text-slate-400 text-[11px]">{label}</label>
      <span className="text-white text-xs font-mono font-semibold">{value}{unit}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
      style={{ background: `linear-gradient(to right, #22c55e ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.08) ${((value - min) / (max - min)) * 100}%)` }}
    />
  </div>
);

// ─── PDF export utility ───────────────────────────────────────────────────────
const exportPDF = (inputs: WiiInputs, wii: ReturnType<typeof computeWII>) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>DoLR Compliant Watershed Impact Report — EcoDrishti</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #1a1a2e; margin: 0; padding: 24px; }
    h1 { font-size: 18px; color: #064e3b; margin-bottom: 4px; }
    h2 { font-size: 13px; color: #065f46; margin: 20px 0 8px; border-bottom: 1px solid #d1fae5; padding-bottom: 4px; }
    .header { background: linear-gradient(135deg, #064e3b, #0e7490); color: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px; }
    .header h1 { color: white; margin: 0 0 4px; font-size: 17px; }
    .header p { color: #a7f3d0; margin: 0; font-size: 10px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: bold; background: #d1fae5; color: #065f46; margin-left: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    th { background: #f0fdf4; color: #065f46; text-align: left; padding: 6px 10px; font-size: 10px; border: 1px solid #d1fae5; }
    td { padding: 5px 10px; border: 1px solid #e5e7eb; vertical-align: top; }
    tr:nth-child(even) td { background: #f9fafb; }
    .metric { display: inline-flex; align-items: center; background: #f0fdf4; border: 1px solid #6ee7b7; padding: 8px 14px; border-radius: 8px; margin: 4px; }
    .metric-val { font-size: 20px; font-weight: bold; color: #059669; font-family: monospace; }
    .metric-label { font-size: 9px; color: #374151; margin-top: 2px; }
    .wii-score { font-size: 48px; font-weight: bold; font-family: monospace; color: #059669; }
    .section { page-break-inside: avoid; }
    .formula { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; font-family: monospace; font-size: 10px; color: #334155; margin: 8px 0; }
    .footer { margin-top: 24px; border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 9px; color: #9ca3af; }
    .comp-bar { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
    .comp-bar-track { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .comp-bar-fill { height: 100%; background: #059669; border-radius: 4px; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>Watershed Impact Report — DoLR Compliant</h1>
    <p>EcoDrishti · SARaksha Platform · Ministry of Rural Development, GoI &nbsp;|&nbsp; PMKSY-WDC AY 2024-25 &nbsp;|&nbsp; Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
  </div>

  <div class="section">
    <h2>1. Study Area Summary</h2>
    <table>
      <tr><th>Parameter</th><th>Value</th></tr>
      <tr><td>Micro-Watershed</td><td><strong>Hivare Bazar MWS</strong></td></tr>
      <tr><td>District / State</td><td>Ahmednagar, Maharashtra</td></tr>
      <tr><td>Area</td><td>1,482 hectares</td></tr>
      <tr><td>Satellite Source</td><td>Sentinel-2B · Scene ID T43PGN · 10m Resolution</td></tr>
      <tr><td>Baseline Period</td><td>Pre-Monsoon (April 2024)</td></tr>
      <tr><td>Analysis Period</td><td>Post-Monsoon (October 2024)</td></tr>
      <tr><td>Structures Surveyed</td><td>247 (214 Verified, 33 Under Review)</td></tr>
      <tr><td>GPS Tagging</td><td>100% geo-tagged via EcoDrishti Mobile App</td></tr>
      <tr><td>AI Cross-Validation Engine</td><td>WatershedNet AI v2.1</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>2. Watershed Impact Index (WII)</h2>
    <p style="margin-bottom:8px">Composite index computed as a weighted sum of normalised spectral and verification indicators:</p>
    <div class="formula">
      WII = 0.30 × ΔNDVI<sub>norm</sub> + 0.30 × ΔWaterSpread<sub>norm</sub> + 0.25 × (1 − ΔDegradedLand<sub>norm</sub>) + 0.15 × PhotoValidationConfidence
    </div>
    <div style="text-align:center; margin: 16px 0;">
      <div class="wii-score">${wii.score}<span style="font-size:24px;color:#6b7280">/100</span></div>
      <div style="font-size:12px;color:#059669;margin-top:4px;font-weight:bold;">${wii.score >= 75 ? 'Excellent Impact' : wii.score >= 50 ? 'Good Progress' : wii.score >= 25 ? 'Moderate' : 'Needs Attention'}</div>
    </div>
    <table>
      <tr><th>Component</th><th>Weight</th><th>Normalised Value</th><th>Contribution</th></tr>
      ${wii.components.map(c => `
      <tr>
        <td>${c.label}</td>
        <td style="text-align:center">${(c.weight * 100).toFixed(0)}%</td>
        <td style="text-align:center">${(c.value * 100).toFixed(1)}%</td>
        <td style="text-align:center"><strong>${(c.contribution * 100).toFixed(2)}</strong></td>
      </tr>`).join('')}
    </table>
  </div>

  <div class="section">
    <h2>3. Thematic Change Maps — Spectral Analysis</h2>
    <table>
      <tr><th>Indicator</th><th>Baseline (Pre-Monsoon)</th><th>Current (Post-Monsoon)</th><th>Delta</th><th>Status</th></tr>
      <tr><td>Vegetation Index (NDVI)</td><td>${inputs.ndviBaseline.toFixed(2)}</td><td>${inputs.ndviCurrent.toFixed(2)}</td><td style="color:#059669;font-weight:bold">+${(inputs.ndviCurrent - inputs.ndviBaseline).toFixed(2)}</td><td>IMPROVED</td></tr>
      <tr><td>Water Spread Area (ha)</td><td>${inputs.waterBaseline} ha</td><td>${inputs.waterCurrent} ha</td><td style="color:#0284c7;font-weight:bold">+${(inputs.waterCurrent - inputs.waterBaseline).toFixed(1)} ha</td><td>EXPANDED</td></tr>
      <tr><td>Degraded Land (ha)</td><td>${inputs.degradedBaseline} ha</td><td>${inputs.degradedCurrent} ha</td><td style="color:#059669;font-weight:bold">-${(inputs.degradedBaseline - inputs.degradedCurrent).toFixed(0)} ha</td><td>RESTORED</td></tr>
      <tr><td>Photo Validation Confidence</td><td>—</td><td>${inputs.photoConfidence.toFixed(1)}%</td><td>—</td><td>ACCEPTABLE</td></tr>
    </table>
    <p style="font-size:10px;color:#6b7280">Source: Sentinel-2B Multi-Spectral Imager (MSI) · Bands B4, B8 (NDVI) · B3, B8 (NDWI) · 10m Ground Resolution</p>
  </div>

  <div class="section">
    <h2>4. Cross-Validation Results — AI Field Photo Ingestion</h2>
    <table>
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Total Photos Ingested</td><td>2,847 (Today) / 48,210 (Cumulative)</td></tr>
      <tr><td>AI Verifications Completed</td><td>2,391 (Today) / 39,841 (Cumulative)</td></tr>
      <tr><td>GPS Mismatch Detections</td><td>23 (Today) / 312 (Cumulative)</td></tr>
      <tr><td>Average AI Confidence Score</td><td>86.7%</td></tr>
      <tr><td>Satellite Correlation Method</td><td>EXIF GPS → Sentinel-2 Tile Lookup → Spectral Signature Matching</td></tr>
      <tr><td>Structure Classification Accuracy</td><td>94.2% (Check Dam), 89.1% (Percolation Tank), 91.8% (Farm Pond)</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>5. Financial Utilisation Summary</h2>
    <table>
      <tr><th>Fund Parameter</th><th>Amount (₹ Lakhs)</th><th>% of Sanctioned</th></tr>
      <tr><td>Total Sanctioned</td><td>₹667.90</td><td>100%</td></tr>
      <tr><td>Total Disbursed</td><td>₹487.00</td><td>72.9%</td></tr>
      <tr><td>Total Pending</td><td>₹180.90</td><td>27.1%</td></tr>
      <tr><td>Held (Verification Pending)</td><td>₹82.50</td><td>12.4%</td></tr>
    </table>
    <p style="font-size:10px;color:#6b7280">Fund flow as per PFMS integration · Data Source: State Level Nodal Agency (SLNA) portal · As on October 2024</p>
  </div>

  <div class="footer">
    <strong>EcoDrishti · SARaksha Platform</strong> · Ministry of Rural Development, Government of India · Department of Land Resources (DoLR) ·
    PMKSY-Watershed Development Component · Report generated via WatershedNet AI v2.1 · For official use only ·
    This report is system-generated and does not require a physical signature for submission through the PFMS portal.
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => {
      setTimeout(() => win.print(), 400);
    };
  }
};

// ─── Main ReportGenerator ─────────────────────────────────────────────────────
const ReportGenerator = () => {
  const [inputs, setInputs] = useState<WiiInputs>(DEFAULT_INPUTS);
  const [exporting, setExporting] = useState(false);
  const { score, components } = computeWII(inputs);

  const set = (key: keyof WiiInputs) => (v: number) => setInputs(prev => ({ ...prev, [key]: v }));

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      exportPDF(inputs, { score, components });
      setExporting(false);
    }, 600);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-white font-bold text-xl mb-1" style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
            WII Calculator & Auto Report Generator
          </h2>
          <p className="text-slate-500 text-sm">Compute the Watershed Impact Index and export a DoLR-compliant PDF report</p>
        </div>
        <button
          id="export-pdf-btn"
          onClick={handleExport}
          disabled={exporting}
          className="btn-primary flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 disabled:opacity-70"
        >
          {exporting ? (
            <div className="w-4 h-4 rounded-full border-2 border-t-white border-white/30 animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          )}
          {exporting ? 'Generating…' : 'Export DoLR Compliant PDF Report'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* ── Left: WII Gauge + Component Breakdown ── */}
        <div className="xl:col-span-2 space-y-4">
          {/* Gauge Card */}
          <div className="glass-card p-5 text-center border border-white/8">
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-3">Watershed Impact Index (WII)</p>
            <WiiGauge score={score} />
            <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              {[
                { label: 'Excellent', range: '75–100', color: '#34d399' },
                { label: 'Good',      range: '50–74',  color: '#22c55e' },
                { label: 'Moderate', range: '25–49',  color: '#f59e0b' },
                { label: 'Needs Attn', range: '0–24', color: '#ef4444' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                  <span className="text-slate-400">{l.label}</span>
                  <span className="text-slate-600 ml-auto font-mono">{l.range}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Component Breakdown */}
          <div className="glass-card p-5 border border-white/8">
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-3">WII Component Breakdown</p>
            <div className="space-y-3">
              {components.map((c, i) => {
                const pct = Math.round(c.value * 100);
                const barColor = i === 0 ? '#22c55e' : i === 1 ? '#06b6d4' : i === 2 ? '#8b5cf6' : '#f59e0b';
                return (
                  <div key={c.label}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-300 flex-1 truncate">{c.label}</span>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className="text-slate-500">{(c.weight * 100).toFixed(0)}%</span>
                        <span className="font-mono font-semibold" style={{ color: barColor }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 6px ${barColor}88` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* WII Formula */}
            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-white/5">
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-wider mb-1.5">Formula</p>
              <p className="text-slate-300 text-[11px] font-mono leading-relaxed">
                WII = 0.30×<span style={{ color: '#22c55e' }}>ΔNDVI</span> + 0.30×<span style={{ color: '#06b6d4' }}>ΔWater</span> + 0.25×<span style={{ color: '#8b5cf6' }}>(1−ΔDeg)</span> + 0.15×<span style={{ color: '#f59e0b' }}>Conf</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Inputs + Report Preview ── */}
        <div className="xl:col-span-3 space-y-4">
          {/* Slider Inputs */}
          <div className="glass-card p-5 border border-white/8">
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-4">Input Parameters (Adjust to Recalculate)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-mono">Vegetation (NDVI)</p>
                <SliderInput label="NDVI Baseline" value={inputs.ndviBaseline} min={0.1} max={0.5} step={0.01} unit="" onChange={set('ndviBaseline')} />
                <SliderInput label="NDVI Current"  value={inputs.ndviCurrent}  min={0.1} max={0.8} step={0.01} unit="" onChange={set('ndviCurrent')}  />
                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-mono mt-2">Photo Validation</p>
                <SliderInput label="AI Confidence" value={inputs.photoConfidence} min={0} max={100} step={0.5} unit="%" onChange={set('photoConfidence')} />
              </div>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-mono">Water Spread (ha)</p>
                <SliderInput label="Water Baseline" value={inputs.waterBaseline} min={0} max={30}  step={0.5} unit=" ha" onChange={set('waterBaseline')} />
                <SliderInput label="Water Current"  value={inputs.waterCurrent}  min={0} max={80}  step={0.5} unit=" ha" onChange={set('waterCurrent')}  />
                <p className="text-[10px] uppercase tracking-widest text-slate-600 font-mono mt-2">Degraded Land (ha)</p>
                <SliderInput label="Degraded Baseline" value={inputs.degradedBaseline} min={50} max={300} step={5} unit=" ha" onChange={set('degradedBaseline')} />
                <SliderInput label="Degraded Current"  value={inputs.degradedCurrent}  min={0}  max={300} step={5} unit=" ha" onChange={set('degradedCurrent')}  />
              </div>
            </div>
          </div>

          {/* Report Sections Preview */}
          <div className="glass-card p-5 border border-white/8">
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-4">Report Structure — DoLR Compliant</p>
            <div className="space-y-2">
              {[
                { num: '1', title: 'Study Area Summary',                    sub: 'Micro-watershed, satellite scene, survey period, GP count',          icon: '📋', done: true  },
                { num: '2', title: 'Watershed Impact Index (WII)',           sub: `Computed score: ${score}/100 · Formula breakdown`,                   icon: '📊', done: true  },
                { num: '3', title: 'Thematic Change Maps — Spectral Analysis', sub: 'NDVI, NDWI, LULC change tables pre vs post-monsoon',              icon: '🛰️', done: true  },
                { num: '4', title: 'Cross-Validation Results',               sub: 'AI photo ingestion stats · GPS accuracy · confidence distribution',  icon: '🔍', done: true  },
                { num: '5', title: 'Financial Utilisation Summary',          sub: 'Fund disbursement by GP · scheme-wise expenditure',                  icon: '₹',  done: true  },
              ].map(s => (
                <div key={s.num} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                  s.done ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-slate-900/40 border-white/5'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                    s.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {s.done ? '✓' : s.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{s.icon}</span>
                      <p className={`text-xs font-semibold ${s.done ? 'text-white' : 'text-slate-400'}`}>{s.title}</p>
                    </div>
                    <p className="text-slate-500 text-[10px] mt-0.5 truncate">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Export CTA */}
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold">All 5 sections ready for export</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Generates a print-ready HTML report that opens in your browser's print dialog for PDF save</p>
              </div>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold flex-shrink-0 disabled:opacity-70"
              >
                {exporting ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-t-white border-white/30 animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                )}
                {exporting ? 'Generating…' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
