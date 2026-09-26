import { useState, useEffect } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface GpHealth {
  name: string;
  district: string;
  capacityPct: number;
  volume: string;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  structures: number;
  ndvi: number;
}

interface AlertItem {
  id: string;
  type: 'mismatch' | 'sensor' | 'verified' | 'scheduled';
  title: string;
  location: string;
  time: string;
}

// ─── Static data ────────────────────────────────────────────────────────────────
const GP_HEALTH: GpHealth[] = [
  { name: 'Hivare Bazar GP',  district: 'Ahmednagar, MH', capacityPct: 87, volume: '18.4M L', status: 'excellent', structures: 4, ndvi: 0.58 },
  { name: 'Kolyari GP',       district: 'Nashik, MH',     capacityPct: 71, volume: '11.2M L', status: 'good',      structures: 3, ndvi: 0.44 },
  { name: 'Bakarol GP',       district: 'Barmer, RJ',     capacityPct: 34, volume: '4.1M L',  status: 'warning',   structures: 2, ndvi: 0.27 },
  { name: 'Malviya GP',       district: 'Morena, MP',     capacityPct: 22, volume: '2.8M L',  status: 'critical',  structures: 3, ndvi: 0.19 },
  { name: 'Mamer GP',         district: 'Kolar, KA',      capacityPct: 63, volume: '9.7M L',  status: 'good',      structures: 2, ndvi: 0.41 },
  { name: 'Sindhari GP',      district: 'Barmer, RJ',     capacityPct: 48, volume: '6.3M L',  status: 'warning',   structures: 2, ndvi: 0.31 },
];

const ALERTS: AlertItem[] = [
  { id: 'AN-GJ-0011', type: 'mismatch',  title: 'Photo Mismatch Detected',     location: 'Dhoraji GP, Rajkot, GJ',  time: '14 min ago' },
  { id: 'CD-MH-0041', type: 'mismatch',  title: 'GPS Coordinate Deviation',     location: 'Hivare Bazar GP, MH',     time: '1 hr ago'   },
  { id: 'PT-RJ-0018', type: 'sensor',    title: 'NDWI Drop — Siltation Signal', location: 'Sindhari GP, Barmer, RJ', time: '3 hr ago'   },
  { id: 'CD-MH-0012', type: 'verified',  title: 'Field Inspection Cleared',     location: 'Hivare Bazar GP, MH',     time: '5 hr ago'   },
  { id: 'CT-UP-0076', type: 'scheduled', title: 'Inspection Visit Confirmed',   location: 'Mahoba GP, UP',           time: '8 hr ago'   },
];

const THROUGHPUT = [
  { label: 'Photos Processed',  today: 2847, total: 48210, color: '#4ade80', trackColor: 'rgba(74,222,128,0.1)' },
  { label: 'AI Verifications',  today: 2391, total: 39841, color: '#22d3ee', trackColor: 'rgba(34,211,238,0.1)' },
  { label: 'Mismatches Flagged',today: 23,   total: 312,   color: '#f87171', trackColor: 'rgba(248,113,113,0.1)' },
  { label: 'Payments Released', today: 18,   total: 1284,  color: '#fbbf24', trackColor: 'rgba(251,191,36,0.1)' },
];

// ─── Status styles ──────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { bar: string; text: string; bg: string; border: string; label: string }> = {
  excellent: { bar: '#4ade80', text: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.2)',  label: 'Excellent' },
  good:      { bar: '#22c55e', text: '#22c55e', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.2)',   label: 'Good'      },
  warning:   { bar: '#fbbf24', text: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', label: 'Warning'   },
  critical:  { bar: '#f87171', text: '#f87171', bg: 'rgba(248,113,113,0.1)',border: 'rgba(248,113,113,0.2)',label: 'Critical'  },
};

const ALERT_STYLE: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  mismatch:  { icon: '🚨', color: '#f87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.15)' },
  sensor:    { icon: '📡', color: '#fbbf24', bg: 'rgba(251,191,36,0.06)',  border: 'rgba(251,191,36,0.15)'  },
  verified:  { icon: '✅', color: '#4ade80', bg: 'rgba(74,222,128,0.06)',  border: 'rgba(74,222,128,0.15)'  },
  scheduled: { icon: '📅', color: '#60a5fa', bg: 'rgba(96,165,250,0.06)',  border: 'rgba(96,165,250,0.15)'  },
};

// ─── Animated counter hook ──────────────────────────────────────────────────────
const useCounter = (target: number, duration = 1400) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
};

// ─── Animated width bar ─────────────────────────────────────────────────────────
const AnimatedBar = ({
  pct, color, index,
}: { pct: number; color: string; index: number }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120 + index * 80);
    return () => clearTimeout(t);
  }, [pct, index]);
  return (
    <div style={{
      height: 6, background: 'rgba(255,255,255,0.05)',
      borderRadius: 4, overflow: 'hidden',
    }}>
      <div style={{
        height: '100%', width: `${width}%`,
        background: color,
        borderRadius: 4,
        transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: `0 0 10px ${color}55`,
      }} />
    </div>
  );
};

// ─── NDVI Sparkline ─────────────────────────────────────────────────────────────
const Sparkline = ({ value, color }: { value: number; color: string }) => {
  const vals = [0.18, 0.21, 0.19, 0.24, 0.27, 0.30, value * 0.78, value * 0.88, value, value * 0.94];
  const min = Math.min(...vals), max = Math.max(...vals) + 0.001;
  const W = 72, H = 22;
  const toX = (i: number) => (i / (vals.length - 1)) * W;
  const toY = (v: number) => H - ((v - min) / (max - min)) * (H - 4) - 2;
  const d = vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(v).toFixed(1)}`).join(' ');
  return (
    <svg width={W} height={H} style={{ opacity: 0.85 }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────────
const OverviewDashboard = () => {
  const structCount  = useCounter(247);
  const waterVol     = useCounter(142);
  const farmPct      = useCounter(38);
  const disbursedPct = useCounter(73);

  const KPI_CARDS = [
    {
      label: 'Structures Built', value: `${structCount}`,
      unit: '', sub: '214 Verified · 33 Under Review',
      trend: '+12 this month', trendUp: true,
      icon: '🏗️', accent: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.18)',
    },
    {
      label: 'Stored Water Volume', value: `${waterVol}M`,
      unit: 'L', sub: 'vs 78M L baseline · +82% increase',
      trend: '+82% vs baseline', trendUp: true,
      icon: '💧', accent: '#22d3ee', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.18)',
    },
    {
      label: 'Farmland Greening', value: `+${farmPct}%`,
      unit: '', sub: 'NDVI improvement · 1,842 fields',
      trend: '+38% NDVI gain', trendUp: true,
      icon: '🌿', accent: '#86efac', bg: 'rgba(134,239,172,0.08)', border: 'rgba(134,239,172,0.18)',
    },
    {
      label: 'Fund Disbursals', value: `${disbursedPct}%`,
      unit: '', sub: '₹487L of ₹668L sanctioned',
      trend: '₹181L pending', trendUp: false,
      icon: '₹', accent: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.18)',
    },
  ];

  return (
    <div style={{
      flex: 1, overflowY: 'auto',
      background: 'var(--bg-base)',
      backgroundImage: `
        linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)
      `,
      backgroundSize: '48px 48px',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Section 1: Page Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Watershed Health &amp; Verification Summary
            </h2>
            <p style={{ color: '#475569', fontSize: 12, marginTop: 5, fontWeight: 400 }}>
              Executive overview across all active Micro-Watersheds · PMKSY-WDC AY 2024-25
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 14px', borderRadius: 20,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <span className="status-dot status-dot-green" style={{ width: 6, height: 6 }} />
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 500 }}>
                Live · Sentinel-2B Pass: 10:31 IST
              </span>
            </div>
            <span style={{
              padding: '5px 12px', borderRadius: 8,
              background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.18)',
              color: '#4ade80', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
            }}>
              AS ON: Oct 2024
            </span>
          </div>
        </div>

        {/* ── Section 2: KPI Cards Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {KPI_CARDS.map((k) => (
            <div key={k.label} style={{
              background: 'var(--bg-card-raised)',
              border: `1px solid ${k.border}`,
              borderRadius: 14,
              padding: '20px 22px',
              display: 'flex', flexDirection: 'column', gap: 14,
              boxShadow: `0 4px 20px rgba(0,0,0,0.35), 0 0 0 0 ${k.accent}`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px rgba(0,0,0,0.4), 0 0 20px ${k.accent}22`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)';
              }}
            >
              {/* Icon + Trend */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: k.bg, border: `1px solid ${k.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                  {k.icon}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: '3px 8px', borderRadius: 8,
                  background: k.trendUp ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                  border: k.trendUp ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(248,113,113,0.2)',
                  color: k.trendUp ? '#4ade80' : '#f87171',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {k.trendUp ? '↑' : '↓'} {k.trend}
                </span>
              </div>

              {/* Value */}
              <div>
                <div style={{
                  fontSize: 32, fontWeight: 900, lineHeight: 1,
                  color: k.accent,
                  fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '-0.02em',
                }}>
                  {k.value}
                  {k.unit && <span style={{ fontSize: 18, fontWeight: 600, marginLeft: 4, opacity: 0.7 }}>{k.unit}</span>}
                </div>
                <div style={{ marginTop: 6 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1', marginBottom: 2 }}>{k.label}</p>
                  <p style={{ fontSize: 10, color: '#334155', lineHeight: 1.5 }}>{k.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Section 3: Two-Column Vertical Split ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* LEFT COLUMN: Panchayat Storage Health */}
          <div style={{
            background: 'var(--bg-card-raised)',
            border: '1px solid var(--border-glass)',
            borderRadius: 14,
            padding: '22px 24px',
            display: 'flex', flexDirection: 'column', gap: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            {/* Card Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14 }}>
                  Panchayat Storage Health
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {Object.entries(STATUS_STYLE).map(([k, v]) => (
                    <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#475569' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: v.bar, display: 'inline-block', boxShadow: `0 0 5px ${v.bar}` }} />
                      {v.label}
                    </span>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#334155' }}>Water retention capacity vs design storage · 6 active GPs</p>
            </div>

            {/* Column labels */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ width: 148, flexShrink: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#1e293b', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                Gram Panchayat
              </span>
              <span style={{ flex: 1, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#1e293b', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                Capacity Utilisation
              </span>
              <span style={{ width: 36, textAlign: 'right', fontSize: 9, fontWeight: 700, color: '#1e293b', fontFamily: 'monospace', textTransform: 'uppercase' }}>%</span>
              <span style={{ width: 56, textAlign: 'right', fontSize: 9, fontWeight: 700, color: '#1e293b', fontFamily: 'monospace', textTransform: 'uppercase' }}>Vol</span>
              <span style={{ width: 60, textAlign: 'center', fontSize: 9, fontWeight: 700, color: '#1e293b', fontFamily: 'monospace', textTransform: 'uppercase' }}>Status</span>
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {GP_HEALTH.map((gp, i) => {
                const [w, setW] = useState(0);
                useEffect(() => {
                  const t = setTimeout(() => setW(gp.capacityPct), 120 + i * 80);
                  return () => clearTimeout(t);
                }, []);
                const s = STATUS_STYLE[gp.status];
                return (
                  <div key={gp.name} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 0',
                    borderBottom: i < GP_HEALTH.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  }}>
                    <div style={{ width: 148, flexShrink: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.3 }}>{gp.name}</p>
                      <p style={{ fontSize: 10, color: '#334155', marginTop: 1 }}>{gp.district}</p>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${w}%`,
                          background: s.bar, borderRadius: 3,
                          transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
                          boxShadow: `0 0 8px ${s.bar}66`,
                        }} />
                      </div>
                    </div>
                    <span style={{ width: 36, textAlign: 'right', fontSize: 11, fontWeight: 700, color: s.text, fontFamily: 'JetBrains Mono, monospace' }}>
                      {gp.capacityPct}%
                    </span>
                    <span style={{ width: 56, textAlign: 'right', fontSize: 10, color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>
                      {gp.volume}
                    </span>
                    <span style={{
                      width: 60, textAlign: 'center', fontSize: 9, fontWeight: 700, padding: '3px 0', borderRadius: 6,
                      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
                    }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* NDVI Mini Cards */}
            <div style={{
              paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)',
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
            }}>
              {GP_HEALTH.slice(0, 3).map(gp => {
                const s = STATUS_STYLE[gp.status];
                return (
                  <div key={gp.name} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 10, padding: '10px 12px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>
                        {gp.name.replace(' GP', '')}
                      </span>
                      <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: s.text }}>
                        {gp.ndvi.toFixed(2)}
                      </span>
                    </div>
                    <Sparkline value={gp.ndvi} color={s.bar} />
                    <p style={{ fontSize: 9, color: '#1e293b', marginTop: 4 }}>NDVI · {gp.structures} structures</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Alerts + Throughput stacked vertically */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── Alerts Panel ── */}
            <div style={{
              background: 'var(--bg-card-raised)',
              border: '1px solid var(--border-glass)',
              borderRadius: 14,
              padding: '22px 24px',
              display: 'flex', flexDirection: 'column', gap: 14,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              flex: 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14 }}>Field &amp; Sensor Alerts</h3>
                  <p style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>Real-time anomaly and status feed</p>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: 8,
                  background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)',
                  color: '#f87171', fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
                }}>
                  {ALERTS.filter(a => a.type === 'mismatch' || a.type === 'sensor').length} ACTIVE
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ALERTS.map(alert => {
                  const ac = ALERT_STYLE[alert.type];
                  return (
                    <div key={alert.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '12px 14px', borderRadius: 10,
                      background: ac.bg, border: `1px solid ${ac.border}`,
                      transition: 'opacity 0.2s',
                    }}>
                      <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{ac.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: ac.color, lineHeight: 1.3 }}>{alert.title}</p>
                        <p style={{ fontSize: 10, color: '#334155', marginTop: 3 }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}>{alert.id}</span>
                          {' · '}{alert.location}
                        </p>
                      </div>
                      <span style={{
                        fontSize: 9, fontFamily: 'JetBrains Mono, monospace',
                        color: '#334155', flexShrink: 0, whiteSpace: 'nowrap', marginTop: 2,
                      }}>
                        {alert.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Verification Throughput Panel ── */}
            <div style={{
              background: 'var(--bg-card-raised)',
              border: '1px solid var(--border-glass)',
              borderRadius: 14,
              padding: '22px 24px',
              display: 'flex', flexDirection: 'column', gap: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
              <div>
                <h3 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 14 }}>Verification Throughput</h3>
                <p style={{ fontSize: 11, color: '#334155', marginTop: 3 }}>Today's activity vs cumulative total</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {THROUGHPUT.map((m, i) => {
                  const pct = Math.min(100, (m.today / m.total) * 100);
                  return (
                    <div key={m.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{m.label}</span>
                        <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#e2e8f0' }}>
                          {m.today.toLocaleString()}
                          <span style={{ color: '#334155', fontWeight: 400 }}> / {m.total.toLocaleString()}</span>
                        </span>
                      </div>
                      <AnimatedBar pct={pct} color={m.color} index={i} />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default OverviewDashboard;
