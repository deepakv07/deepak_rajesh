import React, { useState } from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
}

type ThemeKey = 'lulc' | 'veg' | 'water' | 'drainage' | 'soil';

const themeData: Record<ThemeKey, { rows: [string, number, string][] }> = {
  lulc: {
    rows: [
      ['Agriculture', 38, '#C9AD82'],
      ['Vegetation', 31, '#7BBF8C'],
      ['Water', 9, '#0E86B0'],
      ['Bare soil', 16, '#B79B6B'],
      ['Built-up', 6, '#8598A8'],
    ],
  },
  veg: {
    rows: [
      ['High NDVI (dense)', 22, '#2E9E5C'],
      ['Moderate NDVI', 34, '#7BBF8C'],
      ['Low / stressed', 18, '#C98A05'],
      ['Non-vegetated', 26, '#B79B6B'],
    ],
  },
  water: {
    rows: [
      ['Current extent', 9, '#0E86B0'],
      ['Previous extent', 7.6, '#7FB6CC'],
      ['Change area', 1.4, '#C98A05'],
    ],
  },
  drainage: {
    rows: [
      ['1st order streams', 60, '#0E86B0'],
      ['2nd order', 28, '#3F7D8F'],
      ['3rd order+', 12, '#2F5F6E'],
    ],
  },
  soil: {
    rows: [
      ['Stable', 58, '#2E9E5C'],
      ['Degrading', 26, '#C98A05'],
      ['Severely degraded', 16, '#D2483E'],
    ],
  },
};

export const ThematicAnalysisWorkspace: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<ThemeKey>('lulc');

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';
  const barTrackBg = isDark ? '#1a2e45' : '#eef3f7';

  const d = themeData[activeTab];

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          Thematic Analysis Workspace
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Scientific thematic workspace across Land Use / Land Cover, vegetation, water, drainage, soil stability and interventions.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, borderBottom: `1px solid ${borderCol}`, marginBottom: 20 }}>
        {[
          { key: 'lulc', label: 'LULC' },
          { key: 'veg', label: 'Vegetation (NDVI)' },
          { key: 'water', label: 'Water (NDWI)' },
          { key: 'drainage', label: 'Drainage Network' },
          { key: 'soil', label: 'Soil / Land Stability' },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as ThemeKey)}
              style={{
                background: 'none',
                border: 'none',
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? (isDark ? '#38bdf8' : '#0b688a') : dimCol,
                borderBottom: isActive ? `2px solid ${isDark ? '#38bdf8' : '#0e86b0'}` : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Breakdown and Map Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        {/* Breakdown List */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 16 }}>
            Class Distribution Percentage (%)
          </h3>
          {d.rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, fontSize: 13 }}>
              <div style={{ width: 140, color: dimCol, flexShrink: 0 }}>{r[0]}</div>
              <div style={{ flex: 1, height: 10, background: barTrackBg, borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r[1] * 1.8}%`, background: r[2], borderRadius: 5 }} />
              </div>
              <div style={{ width: 50, textAlign: 'right', fontWeight: 700, color: textCol, fontFamily: 'monospace' }}>
                {r[1]}%
              </div>
            </div>
          ))}
        </div>

        {/* Spatial Representation */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 16 }}>
            Spatial Class Clusters
          </h3>
          <svg viewBox="0 0 240 140" style={{ width: '100%', height: 160, display: 'block' }}>
            <rect width="240" height="140" fill={isDark ? '#0d1d33' : '#DCE9EF'} rx="6" />
            {d.rows.map((r, i) => (
              <circle key={i} cx={40 + i * 42} cy={70} r={16 + r[1] / 3} fill={r[2]} opacity="0.85" />
            ))}
          </svg>
        </div>
      </div>

      {activeTab === 'veg' && (
        <div
          style={{
            marginTop: 16,
            padding: '12px 16px',
            borderRadius: 6,
            background: isDark ? 'rgba(202,138,5,0.15)' : '#FBF1DC',
            color: isDark ? '#facc15' : '#C98A05',
            fontWeight: 600,
            fontSize: 13,
            border: `1px solid ${isDark ? 'rgba(202,138,5,0.3)' : 'rgba(202,138,5,0.2)'}`,
          }}
        >
          ⚠️ Potential vegetation anomaly detected between selected dates in Zone-024. Field verification recommended.
        </div>
      )}
    </div>
  );
};
export default ThematicAnalysisWorkspace;
