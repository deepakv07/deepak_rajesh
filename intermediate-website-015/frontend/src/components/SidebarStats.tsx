const SidebarStats = () => {
  return (
    <aside className="w-full xl:w-72 flex-shrink-0 space-y-4">
      {/* India Map Card */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Coverage Map — India</span>
          <span className="satellite-badge">LIVE</span>
        </div>
        <IndiaMapSVG />
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Watersheds', value: '5,342', color: 'text-green-400' },
            { label: 'States', value: '28', color: 'text-cyan-400' },
            { label: 'Projects', value: '1,284', color: 'text-amber-400' },
          ].map(s => (
            <div key={s.label}>
              <p className={`${s.color} font-bold text-sm font-mono`}>{s.value}</p>
              <p className="text-slate-600 text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live Metrics */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="status-dot status-dot-green" />
          <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Platform Metrics</span>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Photos Ingested Today', value: '2,847', delta: '+142', color: 'text-green-400' },
            { label: 'AI Verifications', value: '2,391', delta: '+98', color: 'text-cyan-400' },
            { label: 'Mismatches Flagged', value: '23', delta: '+3', color: 'text-red-400' },
            { label: 'Payments Cleared', value: '₹48.3Cr', delta: '+₹2.1Cr', color: 'text-amber-400' },
            { label: 'Avg. Confidence', value: '86.7%', delta: '+0.4%', color: 'text-violet-400' },
          ].map(m => (
            <div key={m.label} className="flex items-center justify-between py-1.5 border-b border-white/4">
              <span className="text-slate-400 text-xs">{m.label}</span>
              <div className="text-right">
                <span className={`${m.color} text-sm font-bold font-mono`}>{m.value}</span>
                <span className="text-slate-600 text-[10px] font-mono ml-1.5">{m.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Satellite Passes */}
      <div className="glass-card p-4">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-3">Upcoming Passes</span>
        <div className="space-y-2">
          {[
            { sat: 'Sentinel-2B', time: '10:31 IST', region: 'Deccan Plateau', status: 'Scheduled' },
            { sat: 'Landsat-9', time: '11:04 IST', region: 'Gangetic Plain', status: 'Scheduled' },
            { sat: 'Sentinel-1A', time: '06:22 IST', region: 'Western Ghats', status: 'Completed' },
          ].map(p => (
            <div key={p.sat} className="flex items-center gap-3 py-2 border-b border-white/4">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.status === 'Completed' ? 'bg-green-400 status-dot-green' : 'bg-amber-400 status-dot-amber'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold">{p.sat}</p>
                <p className="text-slate-500 text-[10px]">{p.region}</p>
              </div>
              <span className={`text-[10px] font-mono ${p.status === 'Completed' ? 'text-green-400' : 'text-amber-400'}`}>{p.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-4">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-3">Recent Field Reports</span>
        <div className="space-y-2.5">
          {[
            { type: 'Check Dam', loc: 'Nashik, MH', conf: '91.2%', status: 'Cleared', statusColor: 'text-green-400' },
            { type: 'Plantation', loc: 'Kolar, KA', conf: '78.9%', status: 'Pending', statusColor: 'text-amber-400' },
            { type: 'Bund', loc: 'Nalgonda, TS', conf: '83.4%', status: 'Flagged', statusColor: 'text-red-400' },
            { type: 'Pond', loc: 'Barmer, RJ', conf: '89.1%', status: 'Cleared', statusColor: 'text-green-400' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center flex-shrink-0 text-xs">
                {r.type === 'Check Dam' ? '💧' : r.type === 'Plantation' ? '🌿' : r.type === 'Bund' ? '🪨' : '🏞️'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{r.type} · {r.loc}</p>
                <p className="text-slate-600 text-[10px]">Conf: {r.conf}</p>
              </div>
              <span className={`${r.statusColor} text-[10px] font-bold`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

/* Simple stylized India SVG map */
const IndiaMapSVG = () => (
  <div className="relative w-full aspect-square max-h-44 flex items-center justify-center">
    <svg viewBox="0 0 200 220" className="w-full h-full" fill="none">
      {/* Simplified India outline */}
      <path
        d="M80 10 L95 8 L115 12 L130 20 L140 32 L148 45 L155 60 L160 78 L162 95 L158 112 L150 128 L138 142 L125 155 L115 168 L108 180 L104 195 L100 210 L96 195 L92 182 L85 168 L76 155 L65 142 L52 128 L42 112 L36 95 L34 78 L36 62 L42 46 L50 33 L62 22 L75 14 Z"
        fill="rgba(34,197,94,0.06)"
        stroke="rgba(34,197,94,0.25)"
        strokeWidth="1.5"
      />
      {/* State boundaries suggestion */}
      <path d="M80 80 L120 80 M100 40 L100 160 M70 110 L130 110" stroke="rgba(34,197,94,0.08)" strokeWidth="0.5" />
      
      {/* Hot dots for active watershed regions */}
      {[
        { x: 100, y: 140, label: 'Pune', color: '#22c55e' },
        { x: 78, y: 105, label: 'Chambal', color: '#06b6d4' },
        { x: 115, y: 85, label: 'Patna', color: '#f59e0b' },
        { x: 100, y: 155, label: 'Bangalore', color: '#8b5cf6' },
      ].map(dot => (
        <g key={dot.label}>
          <circle cx={dot.x} cy={dot.y} r="4" fill={dot.color} opacity="0.8" />
          <circle cx={dot.x} cy={dot.y} r="8" fill={dot.color} opacity="0.15">
            <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={dot.x + 6} y={dot.y + 4} fill={dot.color} fontSize="6" fontFamily="monospace" opacity="0.8">{dot.label}</text>
        </g>
      ))}

      {/* Grid overlay */}
      <line x1="0" y1="55" x2="200" y2="55" stroke="rgba(34,197,94,0.05)" strokeWidth="0.5" />
      <line x1="0" y1="110" x2="200" y2="110" stroke="rgba(34,197,94,0.05)" strokeWidth="0.5" />
      <line x1="0" y1="165" x2="200" y2="165" stroke="rgba(34,197,94,0.05)" strokeWidth="0.5" />
      <line x1="50" y1="0" x2="50" y2="220" stroke="rgba(34,197,94,0.05)" strokeWidth="0.5" />
      <line x1="100" y1="0" x2="100" y2="220" stroke="rgba(34,197,94,0.05)" strokeWidth="0.5" />
      <line x1="150" y1="0" x2="150" y2="220" stroke="rgba(34,197,94,0.05)" strokeWidth="0.5" />
    </svg>
  </div>
);

export default SidebarStats;
