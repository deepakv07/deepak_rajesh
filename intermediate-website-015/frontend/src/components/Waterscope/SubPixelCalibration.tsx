import React from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
}

export const SubPixelCalibration: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';
  const barTrackBg = isDark ? '#1a2e45' : '#eef3f7';

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
            Sub-Pixel Photo Calibration
          </h1>
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              background: isDark ? 'rgba(46,158,92,0.15)' : '#e7f6ed',
              color: isDark ? '#4ade80' : '#2e9e5c',
              padding: '2px 8px',
              borderRadius: 10,
              letterSpacing: '0.05em',
            }}
          >
            FLAGSHIP SCIENTIFIC FEATURE
          </span>
        </div>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Comparing ground-observed photo land-cover fractions with mixed 30m × 30m satellite pixel spectral unmixing.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Satellite Mixed Pixel */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 14 }}>
            30m Satellite Pixel — Mixed Composition
          </h3>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <svg viewBox="0 0 200 200" style={{ width: 140, height: 140, borderRadius: 6, flexShrink: 0 }}>
              <rect x="0" y="0" width="100" height="120" fill="#7BBF8C" />
              <rect x="100" y="0" width="100" height="120" fill="#7BBF8C" opacity="0.8" />
              <rect x="0" y="120" width="100" height="80" fill="#C9AD82" />
              <rect x="100" y="120" width="100" height="80" fill="#0E86B0" />
              <g stroke="#ffffff" strokeWidth="2">
                <line x1="0" y1="120" x2="200" y2="120" />
                <line x1="100" y1="0" x2="100" y2="200" />
              </g>
            </svg>
            <div style={{ fontSize: 12.5, color: textCol, lineHeight: 1.8 }}>
              <div><b>Satellite Pixel Fractions:</b></div>
              <div style={{ color: '#7BBF8C', fontWeight: 700 }}>• Vegetation: 60%</div>
              <div style={{ color: '#C9AD82', fontWeight: 700 }}>• Soil / Bare Ground: 25%</div>
              <div style={{ color: '#0E86B0', fontWeight: 700 }}>• Water Extent: 15%</div>
            </div>
          </div>
        </div>

        {/* Photo Interpretation */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 14 }}>
            Field Photo Land-Cover Interpretation
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: textCol }}>
                <span>Vegetation</span>
                <span style={{ fontWeight: 700 }}>55%</span>
              </div>
              <div style={{ height: 8, background: barTrackBg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '55%', background: '#7BBF8C' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: textCol }}>
                <span>Soil / Bare Ground</span>
                <span style={{ fontWeight: 700 }}>25%</span>
              </div>
              <div style={{ height: 8, background: barTrackBg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '25%', background: '#C9AD82' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: textCol }}>
                <span>Water Surface</span>
                <span style={{ fontWeight: 700 }}>20%</span>
              </div>
              <div style={{ height: 8, background: barTrackBg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '20%', background: '#0E86B0' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${borderCol}`, background: isDark ? '#070f1f' : '#f8fafc' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: dimCol, fontSize: 11 }}>CLASS</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: dimCol, fontSize: 11 }}>SATELLITE SPECTRAL UNMIXING</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: dimCol, fontSize: 11 }}>PHOTO DERIVED FRACTION</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: dimCol, fontSize: 11 }}>ABS DIFFERENCE</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${borderCol}` }}>
              <td style={{ padding: '12px 16px', fontWeight: 600, color: textCol }}>Vegetation</td>
              <td style={{ padding: '12px 16px', color: textCol }}>60%</td>
              <td style={{ padding: '12px 16px', color: textCol }}>55%</td>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#D2483E', fontWeight: 700 }}>−5%</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${borderCol}` }}>
              <td style={{ padding: '12px 16px', fontWeight: 600, color: textCol }}>Soil</td>
              <td style={{ padding: '12px 16px', color: textCol }}>25%</td>
              <td style={{ padding: '12px 16px', color: textCol }}>25%</td>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: textCol, fontWeight: 700 }}>0%</td>
            </tr>
            <tr>
              <td style={{ padding: '12px 16px', fontWeight: 600, color: textCol }}>Water</td>
              <td style={{ padding: '12px 16px', color: textCol }}>15%</td>
              <td style={{ padding: '12px 16px', color: textCol }}>20%</td>
              <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#2E9E5C', fontWeight: 700 }}>+5%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Composition Difference Score */}
      <div
        style={{
          background: cardBg,
          border: `1px solid ${borderCol}`,
          borderTop: '3px solid #2E9E5C',
          borderRadius: 8,
          padding: 20,
        }}
      >
        <div style={{ fontSize: 12, color: dimCol, fontWeight: 700 }}>Composition Error Metric (Root Mean Square Deviation)</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: isDark ? '#4ade80' : '#2E9E5C', fontFamily: 'monospace', marginTop: 4 }}>
          E_mix = 0.071
        </div>
        <div style={{ fontSize: 12.5, color: dimCol, marginTop: 4 }}>
          Lower values indicate higher mathematical agreement between photo-derived land cover and satellite-derived sub-pixel composition under the prototype methodology.
        </div>
      </div>
    </div>
  );
};
export default SubPixelCalibration;
