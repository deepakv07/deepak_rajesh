import React from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
}

export const PhotoFootprintAnalysis: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          Directional Photo Footprint Analysis
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          GPS coordinates + camera bearing + lens field-of-view + DEM elevation define a directional, terrain-aware viewing footprint — not a crude circular buffer.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        {/* Footprint SVG Canvas */}
        <div style={{ background: isDark ? '#070f1f' : '#EAF1F6', border: `1px solid ${borderCol}`, borderRadius: 8, padding: 16, position: 'relative' }}>
          <svg viewBox="0 0 300 220" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <rect width="300" height="220" fill={isDark ? '#09182b' : '#EAF1F6'} rx="6" />

            {/* Satellite Grid Lines */}
            <g stroke={isDark ? '#1e2d42' : '#C7D6DF'} strokeWidth="1">
              <line x1="0" y1="55" x2="300" y2="55" />
              <line x1="0" y1="110" x2="300" y2="110" />
              <line x1="0" y1="165" x2="300" y2="165" />
              <line x1="75" y1="0" x2="75" y2="220" />
              <line x1="150" y1="0" x2="150" y2="220" />
              <line x1="225" y1="0" x2="225" y2="220" />
            </g>

            {/* Viewing Sector Cone */}
            <path
              d="M40,190 L150,55 L235,80 Z"
              fill={isDark ? '#38bdf8' : '#0E86B0'}
              opacity="0.3"
              stroke={isDark ? '#38bdf8' : '#0E86B0'}
              strokeWidth="2"
            />

            {/* Camera Position Point */}
            <circle cx="40" cy="190" r="6" fill={isDark ? '#f87171' : '#0B2942'} />
            <line
              x1="40"
              y1="190"
              x2="70"
              y2="150"
              stroke={isDark ? '#ffffff' : '#0B2942'}
              strokeWidth="2"
              markerEnd="url(#arr)"
            />

            <defs>
              <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill={isDark ? '#ffffff' : '#0B2942'} />
              </marker>
            </defs>
          </svg>
          <div style={{ fontSize: 11, color: dimCol, textAlign: 'center', marginTop: 8 }}>
            Satellite Pixel Grid (30m × 30m) with Directional Viewing Footprint Cone
          </div>
        </div>

        {/* Viewing Parameters Panel */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 16 }}>
            Camera Viewing Parameters
          </h3>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4, fontWeight: 600 }}>
              Camera Bearing (Compass Azimuth)
            </label>
            <input
              readOnly
              value="72° (East-Northeast)"
              style={{
                width: '100%',
                border: `1px solid ${borderCol}`,
                padding: '8px 12px',
                borderRadius: 6,
                background: isDark ? '#070f1f' : '#f8fafc',
                color: textCol,
                fontSize: 13,
                fontWeight: 600,
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4, fontWeight: 600 }}>
              Lens Field of View (FOV)
            </label>
            <input
              readOnly
              value="65° Angular Cone"
              style={{
                width: '100%',
                border: `1px solid ${borderCol}`,
                padding: '8px 12px',
                borderRadius: 6,
                background: isDark ? '#070f1f' : '#f8fafc',
                color: textCol,
                fontSize: 13,
                fontWeight: 600,
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4, fontWeight: 600 }}>
              Maximum Effective Distance
            </label>
            <input
              readOnly
              value="120 meters (DEM Slope Shadow Clipped)"
              style={{
                width: '100%',
                border: `1px solid ${borderCol}`,
                padding: '8px 12px',
                borderRadius: 6,
                background: isDark ? '#070f1f' : '#f8fafc',
                color: textCol,
                fontSize: 13,
                fontWeight: 600,
              }}
            />
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 6,
              background: isDark ? 'rgba(46,158,92,0.15)' : '#E7F6ED',
              color: isDark ? '#4ade80' : '#2E9E5C',
              fontWeight: 700,
              fontSize: 13,
              border: `1px solid ${isDark ? 'rgba(46,158,92,0.3)' : 'rgba(46,158,92,0.2)'}`,
            }}
          >
            ✓ 12 satellite pixels intersect the calculated directional viewing footprint.
          </div>
        </div>
      </div>
    </div>
  );
};
export default PhotoFootprintAnalysis;
