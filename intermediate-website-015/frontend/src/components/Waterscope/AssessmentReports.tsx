import React, { useState } from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
  onToast?: (msg: string) => void;
}

const REPORT_DATE = '27 Sep 2026';
const GENERATED_AT = '27 Sep 2026 08:17 IST';

const lulcData = [
  { category: 'Agriculture', share: '38%', area: '1,086.8' },
  { category: 'Vegetation',  share: '31%', area: '886.6'   },
  { category: 'Water',       share: '9%',  area: '257.4'   },
  { category: 'Bare Soil',   share: '16%', area: '457.6'   },
  { category: 'Built-up',    share: '6%',  area: '171.6'   },
];
const interventions = [
  { type: 'Check Dams',       count: 18, disbursed: '12.2', pct: '90%' },
  { type: 'Contour Trenches', count: 14, disbursed: '6.8',  pct: '87%' },
  { type: 'Farm Ponds',       count: 12, disbursed: '5.4',  pct: '85%' },
  { type: 'Nala Bunds',       count: 8,  disbursed: '4.0',  pct: '83%' },
];
const reliability = [
  { band: 'High confidence',     share: '62%' },
  { band: 'Moderate confidence', share: '25%' },
  { band: 'Needs verification',  share: '13%' },
];
const recommendations = [
  'Prioritize field verification for the 12 flagged temporal change zones, starting with water-body shrinkage sites.',
  'Resolve the 13% of evidence marked "needs verification" to raise overall reliability above 90%.',
  'Re-inspect zones where ground vs. satellite readings conflict (E_mix > 0.15) before fund disbursement.',
  'Continue monitoring vegetation decline zones for consistency with reported land-use changes.',
  'Expedite fund disbursement review for GPs currently in "In Review" status.',
];

const months       = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
const ndviBaseline = [0.32, 0.34, 0.36, 0.37, 0.39, 0.41];
const ndviCurrent  = [0.33, 0.37, 0.43, 0.48, 0.53, 0.56];

const REPORT_CSS = `
  .wsr { font-family: 'Segoe UI', Arial, sans-serif; color: #1a2332; background: #fff; width: 595px; }
  .wsr-page { padding: 36px 40px 56px; position: relative; min-height: 842px; box-sizing: border-box; border-bottom: 1px dashed #dae3ec; }
  .wsr-hbar  { display:flex; align-items:flex-start; border-bottom: 3px solid #1a5c2a; padding-bottom:10px; margin-bottom:18px; }
  .wsr-hbar h1 { font-size:15px; font-weight:800; color:#1a5c2a; margin:0; text-transform:uppercase; }
  .wsr-hbar .sub { font-size:8.5px; color:#5b7185; margin-top:3px; }
  .wsr-meta { border:1px solid #dae3ec; border-radius:4px; overflow:hidden; margin-bottom:18px; width:100%; border-collapse:collapse; }
  .wsr-meta td { padding:5px 10px; font-size:10px; border-bottom:1px solid #eef2f7; }
  .wsr-meta td:first-child { font-weight:700; background:#f8fafc; width:120px; color:#334155; }
  .wsr-meta tr:last-child td { border-bottom:none; }
  .wsr-sh  { background:#1a5c2a; color:#fff; font-size:11px; font-weight:700; padding:6px 12px; border-radius:4px; margin:16px 0 9px; }
  .wsr-sub { color:#1a5c2a; font-size:10.5px; font-weight:700; margin:11px 0 5px; }
  .wsr-ext { font-size:9.5px; color:#334155; margin-bottom:7px; }
  .wsr-ext span { margin-right:14px; }
  .wsr-tbl { width:100%; border-collapse:collapse; font-size:9.5px; margin-bottom:11px; }
  .wsr-tbl th { background:#1a5c2a; color:#fff; padding:5px 9px; text-align:left; }
  .wsr-tbl td { padding:4px 9px; border-bottom:1px solid #eef2f7; color:#334155; }
  .wsr-tbl tr:nth-child(even) td { background:#f8faf9; }
  .wsr-body { font-size:10px; line-height:1.7; color:#334155; margin:0 0 9px; }
  .wsr-cap  { font-size:8px; color:#64748b; font-style:italic; text-align:center; margin:3px 0 12px; }
  .wsr-foot { position:absolute; bottom:18px; left:40px; right:40px; display:flex; justify-content:space-between; font-size:7.5px; color:#94a3b8; border-top:1px solid #eef2f7; padding-top:5px; }
  .wsr-img  { width:100%; border-radius:4px; margin:7px 0 2px; display:block; object-fit:cover; max-height:175px; }
  .wsr-donuts { display:flex; justify-content:space-around; align-items:center; margin:10px 0 3px; }
  .wsr-dw   { text-align:center; }
  .wsr-dl   { font-size:8.5px; font-weight:700; color:#1a5c2a; margin-bottom:3px; }
  .wsr-dp   { font-size:7.5px; color:#64748b; margin-top:3px; }
  .wsr-rec  { font-size:9.5px; color:#334155; margin:5px 0; line-height:1.65; }
`;

function NDVIChart() {
  const W = 455, H = 140, pl = 38, pr = 20, pt = 22, pb = 30;
  const cW = W - pl - pr, cH = H - pt - pb;
  const minY = 0.20, maxY = 0.65;
  const px = (i: number) => pl + (i / (months.length - 1)) * cW;
  const py = (v: number) => pt + cH - ((v - minY) / (maxY - minY)) * cH;
  const line = (arr: number[]) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join(' ');
  const fill = `${line(ndviCurrent)} L${px(5)},${py(ndviBaseline[5])} ${ndviBaseline.slice().reverse().map((v, i) => `L${px(5 - i).toFixed(1)},${py(v).toFixed(1)}`).join(' ')} Z`;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', margin: '0 auto' }}>
      <text x={W/2} y={14} textAnchor="middle" fontSize={8.5} fontWeight="bold" fill="#1a2332">Vegetation Growth - Mean NDVI Trend (6-Month Cycle)</text>
      {[0.25,0.30,0.35,0.40,0.45,0.50,0.55,0.60].map(v => (
        <g key={v}>
          <line x1={pl} y1={py(v)} x2={pl+cW} y2={py(v)} stroke="#e2e8f0" strokeWidth={0.6}/>
          <text x={pl-4} y={py(v)+3} textAnchor="end" fontSize={6.5} fill="#64748b">{v.toFixed(2)}</text>
        </g>
      ))}
      {months.map((m,i) => <text key={m} x={px(i)} y={H-7} textAnchor="middle" fontSize={7.5} fill="#64748b">{m}</text>)}
      <path d={fill} fill="rgba(26,92,42,0.13)"/>
      <path d={line(ndviBaseline)} fill="none" stroke="#94a3b8" strokeWidth={1.4} strokeDasharray="4,3"/>
      <path d={line(ndviCurrent)}  fill="none" stroke="#1a5c2a" strokeWidth={2}/>
      {ndviCurrent.map((v,i)  => <circle key={i} cx={px(i)} cy={py(v)} r={2.8} fill="#1a5c2a"/>)}
      {ndviBaseline.map((v,i) => <circle key={i} cx={px(i)} cy={py(v)} r={2.2} fill="#94a3b8"/>)}
      <rect x={pl} y={pt} width={7} height={2} fill="#94a3b8" rx={1}/>
      <text x={pl+10} y={pt+3.5} fontSize={7} fill="#64748b">Baseline (pre-intervention)</text>
      <rect x={pl+128} y={pt} width={7} height={2} fill="#1a5c2a" rx={1}/>
      <text x={pl+138} y={pt+3.5} fontSize={7} fill="#1a5c2a">Current cycle (post-intervention)</text>
      <text x={px(5)-6} y={py(0.56)-7} textAnchor="end" fontSize={7} fill="#1a5c2a" fontWeight="bold">+38% vs baseline</text>
    </svg>
  );
}

function NDVIHeatmap() {
  const W = 320, H = 145;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display:'block', margin:'0 auto', borderRadius:3 }}>
      <defs>
        <linearGradient id="ng-x" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#082d0f"/>
          <stop offset="30%"  stopColor="#1a5c2a"/>
          <stop offset="55%"  stopColor="#d4c820"/>
          <stop offset="78%"  stopColor="#c8a020"/>
          <stop offset="100%" stopColor="#3a8ab0"/>
        </linearGradient>
        <linearGradient id="ng-y" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(255,255,255,0)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)"/>
        </linearGradient>
        <linearGradient id="ng-cb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#082d0f"/>
          <stop offset="50%"  stopColor="#d4c820"/>
          <stop offset="100%" stopColor="#3a8ab0"/>
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#ng-x)"/>
      <rect width={W} height={H} fill="url(#ng-y)"/>
      <path d={`M${W*0.41},0 Q${W*0.34},${H*0.5} ${W*0.44},${H}`} stroke="#1e6a80" strokeWidth={13} fill="none" opacity={0.85}/>
      <path d={`M${W*0.54},0 Q${W*0.61},${H*0.5} ${W*0.51},${H}`} stroke="#1e6a80" strokeWidth={7}  fill="none" opacity={0.72}/>
      <text x={W/2} y={11} textAnchor="middle" fontSize={6.5} fill="rgba(255,255,255,0.88)">Illustrative NDVI Index Map</text>
      <text x={W/2} y={20} textAnchor="middle" fontSize={5.5} fill="rgba(255,255,255,0.68)">(synthetic representation, not raw satellite imagery)</text>
      <rect x={W-16} y={28} width={7} height={82} fill="url(#ng-cb)" rx={2}/>
      {[['0.8',28],['0.4',69],['0.0',110]].map(([l,y]) => (
        <text key={l as string} x={W-20} y={(y as number)+4} textAnchor="end" fontSize={5.5} fill="rgba(255,255,255,0.85)">{l}</text>
      ))}
    </svg>
  );
}

function Donut({ pct, label, title }: { pct: number; label: string; title: string }) {
  const R = 34, cx = 45, cy = 45, C = 2 * Math.PI * R;
  return (
    <div className="wsr-dw">
      <div className="wsr-dl">{title}</div>
      <div className="wsr-dp">{label}</div>
      <svg width={90} height={90} viewBox="0 0 90 90">
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#e2e8f0" strokeWidth={9}/>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="#3b82f6" strokeWidth={9}
          strokeDasharray={`${C*(pct/100)} ${C}`} strokeDashoffset={C/4} strokeLinecap="round"/>
        <text x={cx} y={cy+4} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#1a2332">{pct}%</text>
      </svg>
    </div>
  );
}

function Page1() {
  return (
    <div className="wsr-page">
      <div className="wsr-hbar"><div><h1>WATERSCOPE - WATERSHED ASSESSMENT REPORT</h1><div className="sub">NeerDarpan Nature Theme &nbsp;. Ground-Satellite Evidence Integration Node</div></div></div>
      <table className="wsr-meta"><tbody>
        {[['Watershed','Demo Watershed - Kancheepuram, Tamil Nadu'],['Assessment Date',REPORT_DATE],['Node ID','TN-NODE-CHENNAI'],['Project Code','WATERSCOPE SIH26015'],['Data Source','Sentinel-2B (Satellite) + Field Verification App (Ground Evidence)']].map(([k,v]) => (
          <tr key={k}><td>{k}</td><td style={{fontSize:'10px',color:'#1a2332',padding:'5px 10px'}}>{v}</td></tr>
        ))}
      </tbody></table>
      <div className="wsr-sh">1. GIS Analysis</div>
      <div className="wsr-sub">Watershed Extent</div>
      <div className="wsr-ext"><span>Total Area: <strong>2,860 ha</strong></span><span>Sub-watersheds: <strong>8</strong></span><span>Drainage Density: <strong>2.4 km/km2</strong></span><span>Major Streams: <strong>4</strong></span></div>
      <div className="wsr-sub">Land Use / Land Cover (LULC) Breakdown</div>
      <table className="wsr-tbl"><thead><tr><th>Category</th><th>Share (%)</th><th>Approx. Area (ha)</th></tr></thead>
        <tbody>{lulcData.map(r => <tr key={r.category}><td>{r.category}</td><td>{r.share}</td><td>{r.area}</td></tr>)}</tbody>
      </table>
      <div className="wsr-sub">Physical Interventions Mapped</div>
      <table className="wsr-tbl"><thead><tr><th>Structure Type</th><th>Count</th><th>Disbursed (Rs.L)</th><th>% Disbursed</th></tr></thead>
        <tbody>{interventions.map(r => <tr key={r.type}><td>{r.type}</td><td>{r.count}</td><td>{r.disbursed}</td><td>{r.pct}</td></tr>)}</tbody>
      </table>
      <div className="wsr-sh">2. Field Evidence</div>
      <p className="wsr-body">126 geo-coded field photographs were collected across active task zones, of which 24 field-verified interventions passed full validation. The average computed Trust Score across all submissions is <strong>0.86</strong>.</p>
      <div className="wsr-foot"><span>WATERSCOPE SIH26015</span><span>Generated {GENERATED_AT}</span><span>Page 1</span></div>
    </div>
  );
}

function Page2() {
  return (
    <div className="wsr-page">
      <div className="wsr-sub" style={{marginTop:0}}>Geo-Tagged Field Photo - Check Dam Site</div>
      <img src="/check_dam.jpg" alt="Check Dam" className="wsr-img"/>
      <div className="wsr-cap">Fig. 1 - Field-submitted photo of the rivercheck-dam evidence site, used for Trust Score and boundary-compliance validation.</div>
      <div className="wsr-sub">Validation Reliability Distribution</div>
      <table className="wsr-tbl"><thead><tr><th>Confidence Band</th><th>Share of Evidence</th></tr></thead>
        <tbody>{reliability.map(r => <tr key={r.band}><td>{r.band}</td><td>{r.share}</td></tr>)}</tbody>
      </table>
      <div className="wsr-sh">3. Satellite Analysis</div>
      <p className="wsr-body">Mean NDVI across the watershed is <strong>0.54</strong>, with farmland greening up <strong>+38%</strong> against baseline. Surface water extent is <strong>9.1%</strong> of total area, a gain of <strong>+2.1 ha</strong> versus the pre-monsoon baseline. Ground-satellite cross-validation shows a mean mixed-pixel error of <strong>E_mix = 0.09</strong>, within calibration tolerance for Sentinel-2 10m resolution.</p>
      <div className="wsr-sub">Vegetation Growth Trend</div>
      <NDVIChart/>
      <div className="wsr-cap">Fig. 2 - Mean NDVI trend over the current 6-month monitoring cycle vs. baseline.</div>
      <div className="wsr-foot"><span>WATERSCOPE SIH26015</span><span>Generated {GENERATED_AT}</span><span>Page 2</span></div>
    </div>
  );
}

function Page3() {
  return (
    <div className="wsr-page">
      <div className="wsr-sub" style={{marginTop:0}}>Illustrative NDVI Index Map</div>
      <NDVIHeatmap/>
      <div className="wsr-cap">Fig. 3 - Illustrative NDVI index visualization (synthetic representation). Deep green = dense vegetation, tan = bare soil, blue = water/river channel.</div>
      <div className="wsr-sub">Water Extent - Before vs. After</div>
      <div className="wsr-donuts">
        <Donut pct={7} label="Water extent: 7.0%" title="Baseline"/>
        <Donut pct={9} label="Water extent: 9.1%" title="Current"/>
      </div>
      <div className="wsr-cap">Fig. 4 - Surface water extent share, baseline vs. current monitoring cycle.</div>
      <div className="wsr-sh">4. Methodology</div>
      <div className="wsr-sub">Geo-Photo Intelligence</div>
      <p className="wsr-body">Field photographs are converted into mathematically weighted spatial evidence. Each submission is assigned a Trust Score by validating GPS accuracy, timestamp integrity, EXIF sensor tags, and watershed boundary compliance.</p>
      <div className="wsr-sub">Ground-Satellite Evidence Integration</div>
      <p className="wsr-body">On-the-ground reports are cross-referenced with multi-spectral Sentinel-2 satellite imagery. Before/after states are compared to verify whether a reported intervention produced a measurable increase in soil moisture, water extent, or vegetation health (NDVI).</p>
      <div className="wsr-foot"><span>WATERSCOPE SIH26015</span><span>Generated {GENERATED_AT}</span><span>Page 3</span></div>
    </div>
  );
}

function Page4() {
  return (
    <div className="wsr-page">
      <div className="wsr-sh" style={{marginTop:0}}>5. Recommendations &amp; Next Steps</div>
      {recommendations.map((r,i) => <p key={i} className="wsr-rec">{i+1}. {r}</p>)}
      <p style={{fontSize:'9px',color:'#94a3b8',marginTop:28,borderTop:'1px solid #eef2f7',paddingTop:10}}>End of Report - WATERSCOPE SIH26015</p>
      <div className="wsr-foot"><span>WATERSCOPE SIH26015</span><span>Generated {GENERATED_AT}</span><span>Page 4</span></div>
    </div>
  );
}

function PreviewModal({ onClose, onDownload, isDark }: { onClose:()=>void; onDownload:()=>void; isDark:boolean }) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.78)',display:'flex',flexDirection:'column',alignItems:'center',backdropFilter:'blur(6px)'}}>
      <div style={{width:'100%',background:isDark?'#0f1e30':'#1a2332',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 24px',flexShrink:0,boxShadow:'0 2px 12px rgba(0,0,0,0.4)'}}>
        <div style={{color:'#fff',fontWeight:700,fontSize:14}}>
          Report Preview - WATERSCOPE SIH26015
          <span style={{marginLeft:12,fontSize:10,fontWeight:400,color:'rgba(255,255,255,0.55)'}}>4 pages</span>
        </div>
        <div style={{display:'flex',gap:10}}>
          <button onClick={onDownload} style={{background:'#1a5c2a',color:'#fff',border:'none',padding:'7px 18px',borderRadius:6,fontSize:12.5,fontWeight:700,cursor:'pointer'}}>Download PDF</button>
          <button onClick={onClose}   style={{background:'rgba(255,255,255,0.1)',color:'#fff',border:'1px solid rgba(255,255,255,0.2)',padding:'7px 16px',borderRadius:6,fontSize:12.5,cursor:'pointer'}}>Close</button>
        </div>
      </div>
      <div style={{flex:1,overflow:'auto',padding:'28px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:18}}>
        <style>{REPORT_CSS}</style>
        {([<Page1/>,<Page2/>,<Page3/>,<Page4/>] as React.ReactNode[]).map((pg,i) => (
          <div key={i} style={{background:'#fff',boxShadow:'0 8px 40px rgba(0,0,0,0.45)',borderRadius:4,overflow:'hidden',width:595,position:'relative'}}>
            <div style={{position:'absolute',top:9,right:13,background:'rgba(26,92,42,0.85)',color:'#fff',fontSize:8.5,padding:'2px 8px',borderRadius:10,fontWeight:600}}>Page {i+1} / 4</div>
            <div className="wsr">{pg}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const AssessmentReports: React.FC<Props> = ({ theme, onToast }) => {
  const isDark = theme === 'dark';
  const cardBg    = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol   = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol    = isDark ? '#94a3b8' : '#5b7185';

  const [showPreview, setShowPreview] = useState(false);
  const [generating,  setGenerating]  = useState(false);
  const [generated,   setGenerated]   = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); onToast?.('Fresh report generated.'); }, 2400);
  };

  const handleDownload = async () => {
    setDownloading(true);
    onToast?.('Building PDF...');
    try {
      const [{ default: jsPDF }, { default: html2canvas }, { createRoot }] = await Promise.all([
        import('jspdf'), import('html2canvas'), import('react-dom/client'),
      ]);
      const pageComponents = [Page1, Page2, Page3, Page4];
      const pdf = new jsPDF({ unit:'pt', format:'a4', orientation:'portrait' });
      const A4W = 595.28, A4H = 841.89;
      for (let idx = 0; idx < pageComponents.length; idx++) {
        const PageComp = pageComponents[idx];
        const wrap = document.createElement('div');
        wrap.style.cssText = 'position:fixed;left:-9999px;top:0;width:595px;background:#fff;';
        document.body.appendChild(wrap);
        const root = createRoot(wrap);
        await new Promise<void>(res => { root.render(<div><style>{REPORT_CSS}</style><div className="wsr"><PageComp/></div></div>); setTimeout(res, 700); });
        const canvas = await html2canvas(wrap.firstElementChild as HTMLElement, { scale:2, useCORS:true, allowTaint:true, width:595, windowWidth:595 });
        if (idx > 0) pdf.addPage();
        const imgH = (canvas.height / canvas.width) * A4W;
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, A4W, Math.min(imgH, A4H));
        root.unmount(); document.body.removeChild(wrap);
      }
      pdf.save(`WATERSCOPE_Assessment_${REPORT_DATE.replace(/ /g,'_')}.pdf`);
      onToast?.('PDF downloaded!');
    } catch(e) { console.error(e); onToast?.('PDF generation failed.'); }
    setDownloading(false);
  };

  const btn: React.CSSProperties = { background:cardBg, border:`1px solid ${borderCol}`, color:textCol, padding:'8px 16px', borderRadius:6, fontSize:12.5, cursor:'pointer' };

  const summaryLines = [
    '1. Overview - 2,860 ha . 8 sub-watersheds',
    '2. LULC - Agriculture 38% . Vegetation 31% . Water 9% . Bare soil 16% . Built-up 6%',
    '3. Vegetation - Mean NDVI 0.54, 2 zones flagged for review',
    '4. Water - Extent 9.1%, +2.1 ha vs. baseline',
    '5. Drainage - Density 2.4 km/km2, 4 major streams',
    '6. Interventions - 34 mapped, 24 field-verified',
    '7. Temporal changes - 12 potential change zones',
    '8. Geo-coded field evidence - 126 photos, avg. trust 0.86',
    '9. Ground-satellite comparison - E_mix avg. 0.09',
    '10. Reliability - High 62% . Moderate 25% . Needs verification 13%',
    '11. Recommendations - 9 zones proposed for further field verification',
  ];

  const pageCards = [
    { icon:'Map',  label:'Page 1', sub:'Cover + GIS Analysis'        },
    { icon:'Cam',  label:'Page 2', sub:'Field Evidence + Satellite'   },
    { icon:'Leaf', label:'Page 3', sub:'NDVI Map + Water Extent'      },
    { icon:'Doc',  label:'Page 4', sub:'Methodology + Recommendations'},
  ];

  return (
    <>
      {showPreview && <PreviewModal isDark={isDark} onClose={() => setShowPreview(false)} onDownload={() => { setShowPreview(false); handleDownload(); }}/>}
      <style>{`@keyframes ws-spin{to{transform:rotate(360deg)}} @keyframes ws-prog{0%{width:0%}65%{width:72%}100%{width:100%}}`}</style>
      <div style={{padding:'24px 28px',maxWidth:'1400px',width:'100%',margin:'0 auto'}}>
        <div style={{marginBottom:20}}>
          <h1 style={{fontSize:22,fontWeight:700,margin:0,color:textCol}}>Watershed Assessment Reports</h1>
          <p style={{color:dimCol,fontSize:13,margin:'4px 0 0'}}>Generate automated geospatial and ground verification summary assessment reports.</p>
        </div>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:18}}>
          <button onClick={handleGenerate} disabled={generating} style={{background:isDark?'#38bdf8':'#0e86b0',color:'#fff',border:'none',padding:'8px 18px',borderRadius:6,fontSize:12.5,fontWeight:700,cursor:generating?'wait':'pointer',display:'flex',alignItems:'center',gap:7,opacity:generating?0.82:1}}>
            {generating ? (<><svg width={14} height={14} viewBox="0 0 24 24" style={{animation:'ws-spin 1s linear infinite'}}><circle cx={12} cy={12} r={10} stroke="rgba(255,255,255,0.35)" strokeWidth={3} fill="none"/><path d="M12 2 A10 10 0 0 1 22 12" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round"/></svg>Generating...</>) : 'Generate Fresh Report'}
          </button>
          <button onClick={() => setShowPreview(true)} style={btn}>Preview Report</button>
          <button onClick={handleDownload} disabled={downloading} style={{...btn,opacity:downloading?0.7:1,cursor:downloading?'wait':'pointer'}}>{downloading?'Building PDF...':'Download PDF'}</button>
          <button onClick={() => onToast?.('Exporting GeoJSON dataset...')} style={btn}>Export GeoJSON Data</button>
        </div>
        {generating && (
          <div style={{marginBottom:14,background:isDark?'#0f2540':'#f0f7ff',border:`1px solid ${borderCol}`,borderRadius:8,padding:'12px 16px'}}>
            <div style={{fontSize:11.5,color:dimCol,marginBottom:8}}>Compiling geospatial layers, field evidence and satellite analysis...</div>
            <div style={{background:isDark?'#1e3a5f':'#dbeafe',borderRadius:20,height:6,overflow:'hidden'}}>
              <div style={{height:'100%',background:isDark?'#38bdf8':'#0e86b0',borderRadius:20,animation:'ws-prog 2.4s ease-out forwards',width:'0%'}}/>
            </div>
          </div>
        )}
        {generated && !generating && (
          <div style={{marginBottom:14,display:'flex',alignItems:'center',gap:8,background:isDark?'#052e16':'#f0fdf4',border:`1px solid ${isDark?'#166534':'#86efac'}`,borderRadius:8,padding:'9px 16px'}}>
            <span style={{fontSize:15}}>OK</span>
            <span style={{fontSize:12,color:isDark?'#4ade80':'#166534',fontWeight:600}}>Fresh report generated - {new Date().toLocaleTimeString('en-IN')} IST</span>
          </div>
        )}
        <div style={{background:cardBg,border:`1px solid ${borderCol}`,borderRadius:10,padding:20,fontFamily:'monospace',fontSize:12.5,lineHeight:1.9,color:textCol}}>
          <div style={{fontWeight:700,fontSize:13,marginBottom:6,color:isDark?'#38bdf8':'#1a5c2a'}}>
            WATERSCOPE - WATERSHED ASSESSMENT REPORT &nbsp;&nbsp;
            {generated ? <span style={{color:'#22c55e',fontSize:11}}>FRESH</span> : <span style={{color:dimCol,fontSize:11}}>DEMO / Simulated Data</span>}
          </div>
          <div style={{color:dimCol,fontSize:11,marginBottom:11}}>Watershed: Demo Watershed - Kancheepuram &nbsp;|&nbsp; Date: {REPORT_DATE}</div>
          <div style={{borderTop:`1px solid ${borderCol}`,paddingTop:10}}>
            {summaryLines.map((l,i) => <div key={i} style={{padding:'1px 0'}}>{l}</div>)}
          </div>
        </div>
        <div style={{marginTop:20}}>
          <div style={{fontSize:11.5,fontWeight:600,color:dimCol,marginBottom:10}}>REPORT PAGES - <span style={{fontWeight:400}}>click any card or "Preview Report" to see full view</span></div>
          <div style={{display:'flex',gap:12,overflowX:'auto',paddingBottom:6}}>
            {pageCards.map((p,i) => (
              <button key={i} onClick={() => setShowPreview(true)} style={{background:cardBg,border:`1px solid ${borderCol}`,borderRadius:10,padding:'12px 18px',cursor:'pointer',minWidth:155,textAlign:'left',flexShrink:0}}>
                <div style={{fontSize:22,marginBottom:6}}>{p.icon === 'Map' ? '🗺' : p.icon === 'Cam' ? '📷' : p.icon === 'Leaf' ? '🌿' : '📋'}</div>
                <div style={{fontSize:12,fontWeight:700,color:textCol}}>{p.label}</div>
                <div style={{fontSize:10.5,color:dimCol,marginTop:2}}>{p.sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AssessmentReports;