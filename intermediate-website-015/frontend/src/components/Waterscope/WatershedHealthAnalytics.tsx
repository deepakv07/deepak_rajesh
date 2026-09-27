import React from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
}

export const WatershedHealthAnalytics: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';
  const barTrackBg = isDark ? '#1a2e45' : '#eef3f7';

  const categories = [
    { name: 'Water Condition & Storage', score: 74, color: '#0E86B0' },
    { name: 'Soil Quality & Retention', score: 62, color: '#C98A05' },
    { name: 'Vegetation Cover (NDVI)', score: 78, color: '#2E9E5C' },
    { name: 'Drainage Flow Efficiency', score: 85, color: '#38bdf8' },
    { name: 'Land Use Balance', score: 69, color: '#8b5cf6' },
    { name: 'Risk Factor (Erosion/Runoff)', score: 58, color: '#D2483E' },
  ];

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
            Watershed Health Index Analytics
          </h1>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              background: isDark ? 'rgba(46,158,92,0.15)' : '#e7f6ed',
              color: isDark ? '#4ade80' : '#2E9E5C',
              padding: '2px 8px',
              borderRadius: 10,
            }}
          >
            SCORE: 71 / 100 · MODERATE-HEALTHY
          </span>
        </div>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Quantitative sub-category breakdown of recharge potential, erosion rates, and dry-season ecological vulnerability.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, marginBottom: 20 }}>
        {/* Radial Health Gauge Widget */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderCol}`,
            borderRadius: 12,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: dimCol, textTransform: 'uppercase', marginBottom: 12 }}>
            Overall Health Score Index
          </div>

          <div style={{ position: 'relative', width: 140, height: 140 }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="40" fill="none" stroke={barTrackBg} strokeWidth="10" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#2E9E5C"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - 0.71)}
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 32, fontWeight: 900, color: textCol, fontFamily: 'monospace' }}>71</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#2E9E5C', textTransform: 'uppercase' }}>MODERATE</span>
            </div>
          </div>

          <p style={{ fontSize: 11.5, color: dimCol, marginTop: 14, margin: '14px 0 0', lineHeight: 1.5 }}>
            Based on 6 sub-indicators aggregated across Sentinel-2 satellite telemetry &amp; field evidence.
          </p>
        </div>

        {/* Sub-Category Indicators */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 16 }}>
            Sub-Category Health Indicators
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {categories.map((cat, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: textCol, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{cat.name}</span>
                  <span style={{ fontWeight: 800, fontFamily: 'monospace', color: cat.color }}>{cat.score} / 100</span>
                </div>
                <div style={{ height: 9, background: barTrackBg, borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${cat.score}%`, background: cat.color, borderRadius: 5 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insight Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderTop: '3px solid #0E86B0', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11.5, color: dimCol, fontWeight: 700, textTransform: 'uppercase' }}>Groundwater Recharge Potential</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: textCol, fontFamily: 'monospace', marginTop: 4 }}>420,000 m³/yr</div>
          <div style={{ fontSize: 12, color: dimCol, marginTop: 4 }}>+12% increase expected after planned check dams</div>
        </div>

        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderTop: '3px solid #D2483E', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11.5, color: dimCol, fontWeight: 700, textTransform: 'uppercase' }}>Estimated Soil Erosion Rate</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: textCol, fontFamily: 'monospace', marginTop: 4 }}>14.2 tons/ha/yr</div>
          <div style={{ fontSize: 12, color: dimCol, marginTop: 4 }}>Concentrated along 3 unprotected gully channels</div>
        </div>

        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderTop: '3px solid #C98A05', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11.5, color: dimCol, fontWeight: 700, textTransform: 'uppercase' }}>Dry-Season Vulnerability Index</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: textCol, fontFamily: 'monospace', marginTop: 4 }}>Moderate (0.54)</div>
          <div style={{ fontSize: 12, color: dimCol, marginTop: 4 }}>2 sub-watersheds require priority moisture retention</div>
        </div>
      </div>
    </div>
  );
};
export default WatershedHealthAnalytics;
