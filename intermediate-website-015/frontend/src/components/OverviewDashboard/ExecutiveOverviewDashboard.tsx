import React, { useState } from 'react';

export interface FieldCheckItem {
  id: string;
  structure: string;
  panchayat: string;
  district: string;
  basin: string;
  type: 'check_dam' | 'farm_pond' | 'percolation_pond' | 'bund';
  status: 'checked' | 'water_full' | 'minor_silt' | 'needs_fix';
  statusLabel: string;
  time: string;
  officerNote: string;
  confidence: number;
}

export interface PanchayatHealthRow {
  name: string;
  district: string;
  basin: string;
  structures: number;
  waterLevelPct: number;
  waterVolumeML: string;
  status: 'surplus' | 'high_water' | 'good_level' | 'moderate' | 'needs_watch';
  statusLabel: string;
}

const FIELD_CHECKS: FieldCheckItem[] = [
  { id: 'FC-TN-101', structure: 'Check Dam #04',       panchayat: 'Orathanadu GP',    district: 'Thanjavur',  basin: 'Cauvery Delta',          type: 'check_dam',       status: 'checked',    statusLabel: 'Checked & Active',         time: '18 mins ago', officerNote: 'Field inspector verified full water storage. Spillway and wing walls in prime condition.',                                               confidence: 96 },
  { id: 'FC-TN-102', structure: 'Farm Pond #12',       panchayat: 'Omalur GP',        district: 'Salem',      basin: 'Cauvery Upper Sub-basin', type: 'farm_pond',       status: 'water_full', statusLabel: 'Water Full',               time: '45 mins ago', officerNote: 'Silt lining complete. Rain runoff filled capacity to 1.2 Million Liters. Corroborated with Sentinel-2 NDWI.',                          confidence: 94 },
  { id: 'FC-TN-103', structure: 'Check Dam #09',       panchayat: 'Alanganallur GP',  district: 'Madurai',    basin: 'Vaigai Basin',            type: 'check_dam',       status: 'minor_silt', statusLabel: 'Minor Silt (Desilt Soon)', time: '2 hours ago', officerNote: 'Approx 15% silt deposit recorded after upstream inflow. Simple desilt recommended before monsoon peak.',                                 confidence: 89 },
  { id: 'FC-TN-104', structure: 'Percolation Pond #03',panchayat: 'Ambasamudram GP',  district: 'Tirunelveli',basin: 'Thamirabarani Basin',     type: 'percolation_pond',status: 'checked',    statusLabel: 'Checked & Active',         time: '4 hours ago', officerNote: 'Groundwater infiltration rate healthy at +1.8m water table rise across surrounding farm wells.',                                         confidence: 93 },
  { id: 'FC-TN-105', structure: 'Cement Nala Bund #02',panchayat: 'Orathanadu West',  district: 'Thanjavur',  basin: 'Cauvery Delta',           type: 'bund',            status: 'needs_fix',  statusLabel: 'Needs Fix (Spillway)',     time: '6 hours ago', officerNote: 'Minor masonry shift at right crest. Rapid repair squad assigned under MGNREGS maintenance fund.',                                       confidence: 82 },
];

const PANCHAYAT_HEALTH: PanchayatHealthRow[] = [
  { name: 'Orathanadu GP',   district: 'Thanjavur',   basin: 'Cauvery Delta',   structures: 16, waterLevelPct: 88, waterVolumeML: '6.4 ML', status: 'high_water', statusLabel: 'High Water' },
  { name: 'Alanganallur GP', district: 'Madurai',     basin: 'Vaigai Basin',    structures: 14, waterLevelPct: 76, waterVolumeML: '5.2 ML', status: 'good_level', statusLabel: 'Good Level' },
  { name: 'Omalur GP',       district: 'Salem',       basin: 'Cauvery Upper',   structures: 12, waterLevelPct: 58, waterVolumeML: '3.8 ML', status: 'moderate',   statusLabel: 'Moderate'  },
  { name: 'Ambasamudram GP', district: 'Tirunelveli', basin: 'Thamirabarani',   structures: 10, waterLevelPct: 92, waterVolumeML: '2.8 ML', status: 'surplus',    statusLabel: 'Surplus'   },
];

export interface ExecutiveOverviewDashboardProps {
  onNavigateToMap?: () => void;
  onNavigateToQueue?: () => void;
}

/* ─── Status config maps ──────────────────────────────── */
const CHECK_STATUS = {
  checked:    { color: '#4ade80', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)',  dot: '#22c55e' },
  water_full: { color: '#22d3ee', bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.25)',  dot: '#06b6d4' },
  minor_silt: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', dot: '#f59e0b' },
  needs_fix:  { color: '#fb7185', bg: 'rgba(244,63,94,0.1)',  border: 'rgba(244,63,94,0.25)',  dot: '#ef4444' },
};

const HEALTH_STATUS = {
  high_water:  { color: '#4ade80', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)',  barColor: '#22c55e' },
  good_level:  { color: '#22d3ee', bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.25)',  barColor: '#06b6d4' },
  moderate:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', barColor: '#f59e0b' },
  surplus:     { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)', barColor: '#10b981' },
  needs_watch: { color: '#fb7185', bg: 'rgba(244,63,94,0.1)',  border: 'rgba(244,63,94,0.25)',  barColor: '#ef4444' },
};

const TYPE_ICON: Record<string, string> = {
  check_dam: '💧', farm_pond: '🌾', percolation_pond: '🌊', bund: '🧱',
};

export const ExecutiveOverviewDashboard: React.FC<ExecutiveOverviewDashboardProps> = ({
  onNavigateToMap,
  onNavigateToQueue,
}) => {
  const [selectedBasin, setSelectedBasin] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleActionClick = (structureName: string, district: string) => {
    setToastMessage(`Inspection report generated for ${structureName} (${district}, Tamil Nadu)`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredChecks = selectedBasin === 'all' ? FIELD_CHECKS
    : selectedBasin === 'thanjavur' ? FIELD_CHECKS.filter(c => c.district === 'Thanjavur')
    : selectedBasin === 'salem'     ? FIELD_CHECKS.filter(c => c.district === 'Salem')
    : selectedBasin === 'madurai'   ? FIELD_CHECKS.filter(c => c.district === 'Madurai')
    : FIELD_CHECKS.filter(c => c.district === 'Tirunelveli');

  /* ─── Render ──── */
  return (
    <div style={{ minHeight: '100%', background: '#fff', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* ── 1. Hero Context Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: 20,
          padding: '28px 32px',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 20,
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                color: '#15803d', fontSize: 11, fontWeight: 700,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                Tamil Nadu Basin Watch
              </span>
              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                Cauvery Delta &amp; Vaigai Catchments
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Watershed Overview Dashboard
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, maxWidth: 540 }}>
              Simple, transparent tracking of rainwater structures, stored lake volume, green fields, and
              panchayat fund releases across Tamil Nadu.
            </p>
          </div>

          {/* Right: Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
            {/* Basin dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Target River Basin
              </label>
              <select
                value={selectedBasin}
                onChange={(e) => setSelectedBasin(e.target.value)}
                style={{
                  background: '#fff', border: '1px solid #e2e8f0',
                  borderRadius: 12, color: '#0f172a',
                  fontWeight: 600, fontSize: 12, padding: '9px 14px',
                  cursor: 'pointer', outline: 'none',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                <option value="all">All TN Basins — Cauvery, Vaigai &amp; Thamirabarani</option>
                <option value="thanjavur">Cauvery Delta (Thanjavur District)</option>
                <option value="salem">Cauvery Sub-basin (Salem District)</option>
                <option value="madurai">Vaigai Basin (Madurai District)</option>
                <option value="tirunelveli">Thamirabarani Basin (Tirunelveli District)</option>
              </select>
            </div>

            {/* Telemetry Node */}
            <div style={{
              background: '#fff', border: '1px solid #e2e8f0',
              borderRadius: 12, padding: '10px 16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>
                Telemetry Node
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#15803d', fontSize: 12 }}>TN-NODE-CHNAI</span>
                <span style={{ width: 1, height: 14, background: '#e2e8f0' }} />
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#2563eb', fontWeight: 600 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
                  Sentinel-2 Live Sync
                </span>
              </div>
            </div>

            {/* Officer Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 12, borderLeft: '1px solid #e2e8f0' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 13, color: '#15803d',
              }}>TN</div>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'block' }}>State Monitoring Cell</span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>DoLR • Chennai Hub</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Toast ── */}
        {toastMessage && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            borderRadius: 16, padding: '14px 20px', fontSize: 13, fontWeight: 500, color: '#14532d',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
              {toastMessage}
            </div>
            <button onClick={() => setToastMessage(null)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 700, color: '#16a34a', padding: '4px 8px',
            }}>Dismiss</button>
          </div>
        )}

        {/* ── 2. KPI Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            {
              label: 'Water Structures', icon: '💧', accent: '#2563eb',
              accentBg: '#eff6ff', accentBorder: '#bfdbfe',
              value: '52 Built',
              sub: 'Check dams, farm ponds & bunds completed across basin sites.',
              footer: (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[['48 Checked','#f0fdf4','#bbf7d0','#15803d'],['3 Pending','#fffbeb','#fde68a','#92400e'],['1 Needs Fix','#fff1f2','#fecdd3','#9f1239']].map(([t,bg,bd,c])=>(
                    <span key={t} style={{ padding: '3px 9px', borderRadius: 20, background: bg, border: `1px solid ${bd}`, color: c, fontSize: 10, fontWeight: 700 }}>{t}</span>
                  ))}
                </div>
              ),
            },
            {
              label: 'Water Stored', icon: '🌊', accent: '#0891b2',
              accentBg: '#ecfeff', accentBorder: '#a5f3fc',
              value: '18.2 Million Liters',
              valueNote: '↑ +42% increase post-monsoon',
              noteColor: '#16a34a',
              sub: '',
              footer: (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                  <span>Catchment Inflow</span>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>Healthy Storage</span>
                </div>
              ),
            },
            {
              label: 'Greenery Index', icon: '🌱', accent: '#16a34a',
              accentBg: '#f0fdf4', accentBorder: '#bbf7d0',
              value: '+34% Plant Growth',
              valueColor: '#16a34a',
              sub: 'Vegetation index measured by satellite.',
              footer: (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: '#64748b' }}>Land Revitalized:</span>
                  <span style={{ fontWeight: 700, color: '#15803d' }}>340 hectares revived</span>
                </div>
              ),
            },
            {
              label: 'Fund Clearances', icon: '₹', accent: '#d97706',
              accentBg: '#fffbeb', accentBorder: '#fde68a',
              value: '92% Disbursed',
              valueNote: '₹28.4 Lakhs released',
              noteColor: '#16a34a',
              sub: '',
              footer: (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b' }}>
                  <span>Sanctioned Total: ₹30.8L</span>
                  <span style={{ fontWeight: 500 }}>₹2.4L in Escrow</span>
                </div>
              ),
            },
          ].map((kpi) => (
            <div key={kpi.label} style={{
              background: '#fff',
              border: '1px solid #f1f5f9',
              borderRadius: 18,
              padding: '24px',
              display: 'flex', flexDirection: 'column', gap: 14,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)';
                (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)';
                (e.currentTarget as HTMLDivElement).style.borderColor = '#f1f5f9';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {kpi.label}
                </span>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: kpi.accentBg, border: `1px solid ${kpi.accentBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16,
                }}>
                  {kpi.icon}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: (kpi as any).valueColor ?? '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {kpi.value}
                </div>
                {(kpi as any).valueNote && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: (kpi as any).noteColor, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {(kpi as any).valueNote}
                  </div>
                )}
                {kpi.sub && <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5, lineHeight: 1.5 }}>{kpi.sub}</p>}
              </div>
              <div style={{ borderTop: '1px solid #f8fafc', paddingTop: 10 }}>
                {kpi.footer}
              </div>
            </div>
          ))}
        </div>

        {/* ── 3. Two Column Content ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* Left: Field Checks */}
          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 20, padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>Recent Field Checks</h2>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 3, lineHeight: 1.5 }}>
                  Verified check dams and farm ponds in Thanjavur, Salem, Madurai, and Tirunelveli.
                </p>
              </div>
              {onNavigateToQueue && (
                <button onClick={onNavigateToQueue} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700, color: '#16a34a',
                  flexShrink: 0, padding: '4px 0',
                }}>
                  View Field Queue →
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredChecks.map((check) => {
                const s = CHECK_STATUS[check.status];
                return (
                  <div key={check.id} style={{
                    background: '#fff', border: '1px solid #f1f5f9',
                    borderRadius: 14, padding: '14px 16px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = '#f1f5f9';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                    }}
                  >
                    {/* Top Row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                          background: '#f8fafc', border: '1px solid #f1f5f9',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 16,
                        }}>
                          {TYPE_ICON[check.type]}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 800, fontSize: 13, color: '#0f172a' }}>{check.structure}</span>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>• {check.panchayat}, {check.district}</span>
                          </div>
                          <span style={{ fontSize: 10, color: '#cbd5e1', fontWeight: 500 }}>{check.basin}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, flexShrink: 0 }}>{check.time}</span>
                    </div>

                    {/* Note */}
                    <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, paddingLeft: 44 }}>
                      {check.officerNote}
                    </p>

                    {/* Bottom */}
                    <div style={{
                      paddingTop: 10, borderTop: '1px solid #f8fafc',
                      paddingLeft: 44,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 10px', borderRadius: 20,
                        background: s.bg, border: `1px solid ${s.border}`,
                        color: s.color, fontSize: 10, fontWeight: 700,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
                        {check.statusLabel}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>
                          Confidence: <strong style={{ color: '#0f172a' }}>{check.confidence}%</strong>
                        </span>
                        <button onClick={() => handleActionClick(check.structure, check.district)} style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: 11, fontWeight: 700, color: '#475569',
                          transition: 'color 0.2s',
                        }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#16a34a')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Panchayat Water Health */}
          <div style={{
            background: '#f8fafc', border: '1px solid #e2e8f0',
            borderRadius: 20, padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>Panchayat Water Health Table</h2>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 3, lineHeight: 1.5 }}>
                  Water storage progress across key Gram Panchayats in Tamil Nadu.
                </p>
              </div>
              {onNavigateToMap && (
                <button onClick={onNavigateToMap} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700, color: '#16a34a',
                  flexShrink: 0, padding: '4px 0',
                }}>
                  View on GIS Map →
                </button>
              )}
            </div>

            {/* Table */}
            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                      {['Panchayat Name','District','Structures','Water Level %','Status'].map(h => (
                        <th key={h} style={{
                          padding: '12px 16px', textAlign: 'left',
                          fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
                          textTransform: 'uppercase', color: '#94a3b8',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PANCHAYAT_HEALTH.map((row, i) => {
                      const s = HEALTH_STATUS[row.status];
                      return (
                        <tr key={row.name} style={{
                          borderBottom: i < PANCHAYAT_HEALTH.length - 1 ? '1px solid #f8fafc' : 'none',
                          transition: 'background 0.15s',
                        }}
                          onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc'}
                          onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = ''}
                        >
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: 13, display: 'block' }}>{row.name}</span>
                            <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>{row.basin}</span>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#475569', fontWeight: 500 }}>{row.district}</td>
                          <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', textAlign: 'center' }}>
                            {row.structures}
                          </td>
                          <td style={{ padding: '14px 16px', minWidth: 140 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>{row.waterLevelPct}%</span>
                              <span style={{ color: '#94a3b8' }}>{row.waterVolumeML}</span>
                            </div>
                            <div style={{ background: '#f1f5f9', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                              <div style={{
                                height: '100%', borderRadius: 4,
                                background: s.barColor,
                                width: `${row.waterLevelPct}%`,
                                transition: 'width 1s ease',
                              }} />
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '4px 10px', borderRadius: 20,
                              background: s.bg, border: `1px solid ${s.border}`,
                              color: s.color, fontSize: 10, fontWeight: 700,
                            }}>
                              <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.barColor, display: 'inline-block' }} />
                              {row.statusLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Benchmark Card */}
            <div style={{
              background: '#fff', border: '1px solid #f1f5f9',
              borderRadius: 14, padding: '14px 18px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: '#f0fdf4', border: '1px solid #bbf7d0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#16a34a', fontWeight: 800, fontSize: 14,
                }}>✓</div>
                <div>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 13, display: 'block' }}>Tamil Nadu State Storage Benchmark</span>
                  <span style={{ fontSize: 11, color: '#64748b' }}>Average Panchayat Water Fill: <strong>78.5%</strong> (Target: 75%)</span>
                </div>
              </div>
              <span style={{
                padding: '4px 10px', borderRadius: 20,
                background: '#f1f5f9', border: '1px solid #e2e8f0',
                color: '#64748b', fontSize: 10, fontWeight: 600, flexShrink: 0,
              }}>
                Updated Today
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ExecutiveOverviewDashboard;
