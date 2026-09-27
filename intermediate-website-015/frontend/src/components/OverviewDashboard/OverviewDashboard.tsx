import { useState, useEffect } from 'react';
import type { AppTheme } from '../../App';

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

interface OverviewDashboardProps {
  theme?: AppTheme;
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
  { label: 'Photos Processed',  today: 2847, total: 48210, color: '#2E9E5C', trackColor: 'rgba(46,158,92,0.1)' },
  { label: 'AI Verifications',  today: 2391, total: 39841, color: '#0E86B0', trackColor: 'rgba(14,134,176,0.1)' },
  { label: 'Mismatches Flagged',today: 23,   total: 312,   color: '#D2483E', trackColor: 'rgba(210,72,62,0.1)' },
  { label: 'Payments Released', today: 18,   total: 1284,  color: '#C98A05', trackColor: 'rgba(201,138,5,0.1)' },
];

// ─── Status styles ──────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<string, { bar: string; text: string; bg: string; border: string; label: string }> = {
  excellent: { bar: '#2E9E5C', text: '#2E9E5C', bg: 'rgba(46,158,92,0.12)',  border: 'rgba(46,158,92,0.25)',  label: 'Excellent' },
  good:      { bar: '#0E86B0', text: '#0E86B0', bg: 'rgba(14,134,176,0.12)', border: 'rgba(14,134,176,0.25)', label: 'Good'      },
  warning:   { bar: '#C98A05', text: '#C98A05', bg: 'rgba(201,138,5,0.12)',  border: 'rgba(201,138,5,0.25)',  label: 'Warning'   },
  critical:  { bar: '#D2483E', text: '#D2483E', bg: 'rgba(210,72,62,0.12)', border: 'rgba(210,72,62,0.25)', label: 'Critical'  },
};

const ALERT_STYLE: Record<string, { icon: string; color: string; bg: string; border: string }> = {
  mismatch:  { icon: '🚨', color: '#D2483E', bg: 'rgba(210,72,62,0.08)', border: 'rgba(210,72,62,0.2)' },
  sensor:    { icon: '📡', color: '#C98A05', bg: 'rgba(201,138,5,0.08)',  border: 'rgba(201,138,5,0.2)'  },
  verified:  { icon: '✅', color: '#2E9E5C', bg: 'rgba(46,158,92,0.08)',  border: 'rgba(46,158,92,0.2)'  },
  scheduled: { icon: '📅', color: '#0E86B0', bg: 'rgba(14,134,176,0.08)', border: 'rgba(14,134,176,0.2)' },
};

// ─── Animated counter hook ──────────────────────────────────────────────────────
const useCounter = (target: number, duration = 1200) => {
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
  pct, color, index, trackBg,
}: { pct: number; color: string; index: number; trackBg: string }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120 + index * 80);
    return () => clearTimeout(t);
  }, [pct, index]);
  return (
    <div style={{
      height: 6, background: trackBg,
      borderRadius: 4, overflow: 'hidden',
    }}>
      <div style={{
        height: '100%', width: `${width}%`,
        background: color,
        borderRadius: 4,
        transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
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
const OverviewDashboard = ({ theme = 'dark' }: OverviewDashboardProps) => {
  const isDark = theme === 'dark';

  const structCount  = useCounter(247);
  const waterVol     = useCounter(142);
  const farmPct      = useCounter(38);
  const disbursedPct = useCounter(73);

  // Theme token mapping
  const bgBase     = isDark ? '#040b18' : '#f0f4f8';
  const cardBg     = isDark ? '#0a1628' : '#ffffff';
  const borderCol  = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const titleCol   = isDark ? '#f1f5f9' : '#0b2942';
  const subCol     = isDark ? '#94a3b8' : '#5b7185';
  const mutedCol   = isDark ? '#64748b' : '#8598a8';
  const rowBorder  = isDark ? 'rgba(255,255,255,0.04)' : '#eef3f7';
  const trackBg    = isDark ? 'rgba(255,255,255,0.05)' : '#eef3f7';

  const KPI_CARDS = [
    {
      label: 'Structures Built', value: `${structCount}`,
      unit: '', sub: '214 Verified · 33 Under Review',
      trend: '+12 this month', trendUp: true,
      icon: '🏗️', accent: isDark ? '#4ade80' : '#2E9E5C', bg: isDark ? 'rgba(74,222,128,0.08)' : '#e7f6ed', border: isDark ? 'rgba(74,222,128,0.18)' : 'rgba(46,158,92,0.2)',
    },
    {
      label: 'Stored Water Volume', value: `${waterVol}M`,
      unit: 'L', sub: 'vs 78M L baseline · +82% increase',
      trend: '+82% vs baseline', trendUp: true,
      icon: '💧', accent: isDark ? '#38bdf8' : '#0E86B0', bg: isDark ? 'rgba(56,189,248,0.08)' : '#e6f4f9', border: isDark ? 'rgba(56,189,248,0.18)' : 'rgba(14,134,176,0.2)',
    },
    {
      label: 'Farmland Greening', value: `+${farmPct}%`,
      unit: '', sub: 'NDVI improvement · 1,842 fields',
      trend: '+38% NDVI gain', trendUp: true,
      icon: '🌿', accent: isDark ? '#4ade80' : '#2E9E5C', bg: isDark ? 'rgba(74,222,128,0.08)' : '#e7f6ed', border: isDark ? 'rgba(74,222,128,0.18)' : 'rgba(46,158,92,0.2)',
    },
    {
      label: 'Fund Disbursals', value: `${disbursedPct}%`,
      unit: '', sub: '₹487L of ₹668L sanctioned',
      trend: '₹181L pending', trendUp: false,
      icon: '₹', accent: isDark ? '#facc15' : '#C98A05', bg: isDark ? 'rgba(250,204,21,0.08)' : '#fbf1dc', border: isDark ? 'rgba(250,204,21,0.18)' : 'rgba(201,138,5,0.2)',
    },
  ];

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      background: bgBase,
      transition: 'background 0.3s ease',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Section 1: Page Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ color: titleCol, fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
              Watershed Health &amp; Verification Summary
            </h2>
            <p style={{ color: subCol, fontSize: 12, marginTop: 5, fontWeight: 400 }}>
              Executive overview across all active Micro-Watersheds · PMKSY-WDC AY 2024-25
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 14px', borderRadius: 20,
              background: cardBg,
              border: `1px solid ${borderCol}`,
            }}>
              <span className="status-dot status-dot-green" style={{ width: 6, height: 6 }} />
              <span style={{ fontSize: 11, color: subCol, fontWeight: 500 }}>
                Live · Sentinel-2B Pass: 10:31 IST
              </span>
            </div>
            <span style={{
              padding: '5px 12px', borderRadius: 8,
              background: isDark ? 'rgba(74,222,128,0.1)' : '#e7f6ed',
              border: `1px solid ${isDark ? 'rgba(74,222,128,0.2)' : 'rgba(46,158,92,0.3)'}`,
              color: isDark ? '#4ade80' : '#2E9E5C',
              fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
            }}>
              AS ON: Oct 2024
            </span>
          </div>
        </div>

        {/* ── Section 2: KPI Cards Row ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {KPI_CARDS.map((k) => (
            <div key={k.label} style={{
              background: cardBg,
              border: `1px solid ${borderCol}`,
              borderRadius: 12,
              padding: '20px 22px',
              display: 'flex', flexDirection: 'column', gap: 14,
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}>
              {/* Icon + Trend */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: k.bg, border: `1px solid ${k.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18,
                }}>
                  {k.icon}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: '3px 8px', borderRadius: 8,
                  background: k.trendUp ? (isDark ? 'rgba(74,222,128,0.1)' : '#e7f6ed') : (isDark ? 'rgba(248,113,113,0.1)' : '#fbeae8'),
                  color: k.trendUp ? (isDark ? '#4ade80' : '#2E9E5C') : (isDark ? '#f87171' : '#D2483E'),
                  fontFamily: 'monospace',
                }}>
                  {k.trendUp ? '↑' : '↓'} {k.trend}
                </span>
              </div>

              {/* Value */}
              <div>
                <div style={{
                  fontSize: 32, fontWeight: 900, lineHeight: 1,
                  color: k.accent,
                  fontFamily: 'monospace',
                  letterSpacing: '-0.02em',
                }}>
                  {k.value}
                  {k.unit && <span style={{ fontSize: 18, fontWeight: 600, marginLeft: 4, opacity: 0.7 }}>{k.unit}</span>}
                </div>
                <div style={{ marginTop: 6 }}>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: titleCol, margin: '0 0 2px' }}>{k.label}</p>
                  <p style={{ fontSize: 10.5, color: subCol, margin: 0 }}>{k.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Section 3: Two-Column Vertical Split ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* LEFT COLUMN: Panchayat Storage Health */}
          <div style={{
            background: cardBg,
            border: `1px solid ${borderCol}`,
            borderRadius: 12,
            padding: '22px 24px',
            display: 'flex', flexDirection: 'column', gap: 16,
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            {/* Card Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <h3 style={{ color: titleCol, fontWeight: 700, fontSize: 14, margin: 0 }}>
                  Panchayat Storage Health
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {Object.entries(STATUS_STYLE).map(([k, v]) => (
                    <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: subCol }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: v.bar, display: 'inline-block' }} />
                      {v.label}
                    </span>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 11, color: subCol, margin: 0 }}>Water retention capacity vs design storage · 6 active GPs</p>
            </div>

            {/* Column labels */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              paddingBottom: 8, borderBottom: `1px solid ${rowBorder}`,
            }}>
              <span style={{ width: 148, flexShrink: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: mutedCol, textTransform: 'uppercase', fontFamily: 'monospace' }}>
                Gram Panchayat
              </span>
              <span style={{ flex: 1, fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: mutedCol, textTransform: 'uppercase', fontFamily: 'monospace' }}>
                Capacity Utilisation
              </span>
              <span style={{ width: 36, textAlign: 'right', fontSize: 9, fontWeight: 700, color: mutedCol, fontFamily: 'monospace', textTransform: 'uppercase' }}>%</span>
              <span style={{ width: 56, textAlign: 'right', fontSize: 9, fontWeight: 700, color: mutedCol, fontFamily: 'monospace', textTransform: 'uppercase' }}>Vol</span>
              <span style={{ width: 64, textAlign: 'center', fontSize: 9, fontWeight: 700, color: mutedCol, fontFamily: 'monospace', textTransform: 'uppercase' }}>Status</span>
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
                    padding: '10px 0',
                    borderBottom: i < GP_HEALTH.length - 1 ? `1px solid ${rowBorder}` : 'none',
                  }}>
                    <div style={{ width: 148, flexShrink: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: titleCol, margin: 0, lineHeight: 1.3 }}>{gp.name}</p>
                      <p style={{ fontSize: 10, color: subCol, margin: '1px 0 0' }}>{gp.district}</p>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ height: 6, background: trackBg, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${w}%`,
                          background: s.bar, borderRadius: 3,
                          transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)',
                        }} />
                      </div>
                    </div>
                    <span style={{ width: 36, textAlign: 'right', fontSize: 11, fontWeight: 700, color: s.text, fontFamily: 'monospace' }}>
                      {gp.capacityPct}%
                    </span>
                    <span style={{ width: 56, textAlign: 'right', fontSize: 10.5, color: subCol, fontFamily: 'monospace' }}>
                      {gp.volume}
                    </span>
                    <span style={{
                      width: 64, textAlign: 'center', fontSize: 9.5, fontWeight: 700, padding: '3px 0', borderRadius: 6,
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
              paddingTop: 14, borderTop: `1px solid ${rowBorder}`,
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
            }}>
              {GP_HEALTH.slice(0, 3).map(gp => {
                const s = STATUS_STYLE[gp.status];
                return (
                  <div key={gp.name} style={{
                    background: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                    border: `1px solid ${borderCol}`,
                    borderRadius: 8, padding: '10px 12px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 10.5, color: subCol, fontWeight: 500 }}>
                        {gp.name.replace(' GP', '')}
                      </span>
                      <span style={{ fontSize: 10.5, fontFamily: 'monospace', fontWeight: 700, color: s.text }}>
                        {gp.ndvi.toFixed(2)}
                      </span>
                    </div>
                    <Sparkline value={gp.ndvi} color={s.bar} />
                    <p style={{ fontSize: 9.5, color: mutedCol, margin: '4px 0 0' }}>NDVI · {gp.structures} structures</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Alerts + Throughput stacked vertically */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* ── Alerts Panel ── */}
            <div style={{
              background: cardBg,
              border: `1px solid ${borderCol}`,
              borderRadius: 12,
              padding: '22px 24px',
              display: 'flex', flexDirection: 'column', gap: 14,
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
              flex: 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: titleCol, fontWeight: 700, fontSize: 14, margin: 0 }}>Field &amp; Sensor Alerts</h3>
                  <p style={{ fontSize: 11, color: subCol, margin: '3px 0 0' }}>Real-time anomaly and status feed</p>
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: 8,
                  background: isDark ? 'rgba(248,113,113,0.1)' : '#fbeae8',
                  border: `1px solid ${isDark ? 'rgba(248,113,113,0.25)' : 'rgba(210,72,62,0.3)'}`,
                  color: isDark ? '#f87171' : '#D2483E',
                  fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
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
                      padding: '10px 12px', borderRadius: 8,
                      background: ac.bg, border: `1px solid ${ac.border}`,
                    }}>
                      <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{ac.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: ac.color, margin: 0, lineHeight: 1.3 }}>{alert.title}</p>
                        <p style={{ fontSize: 10.5, color: subCol, margin: '3px 0 0' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{alert.id}</span>
                          {' · '}{alert.location}
                        </p>
                      </div>
                      <span style={{
                        fontSize: 9.5, fontFamily: 'monospace',
                        color: mutedCol, flexShrink: 0, whiteSpace: 'nowrap', marginTop: 2,
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
              background: cardBg,
              border: `1px solid ${borderCol}`,
              borderRadius: 12,
              padding: '22px 24px',
              display: 'flex', flexDirection: 'column', gap: 16,
              boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div>
                <h3 style={{ color: titleCol, fontWeight: 700, fontSize: 14, margin: 0 }}>Verification Throughput</h3>
                <p style={{ fontSize: 11, color: subCol, margin: '3px 0 0' }}>Today's activity vs cumulative total</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {THROUGHPUT.map((m, i) => {
                  const pct = Math.min(100, (m.today / m.total) * 100);
                  return (
                    <div key={m.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: titleCol, fontWeight: 500 }}>{m.label}</span>
                        <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: titleCol }}>
                          {m.today.toLocaleString()}
                          <span style={{ color: subCol, fontWeight: 400 }}> / {m.total.toLocaleString()}</span>
                        </span>
                      </div>
                      <AnimatedBar pct={pct} color={m.color} index={i} trackBg={trackBg} />
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
