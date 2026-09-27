import React from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
}

export const InterventionMonitoring: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          Watershed Intervention Monitoring
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Physical watershed structures mapped with before/after satellite observations and verified ground evidence.
        </p>
      </div>

      <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20, marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: 15, color: textCol }}>
          INTERVENTION #WD-021
        </div>
        <div style={{ fontSize: 13, color: dimCol, margin: '4px 0 14px' }}>
          Check Dam · Sub-Watershed B · Status: <b>Field Verified</b>
        </div>

        {/* Pipeline */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          {['Before (2025 Baseline)', 'Intervention Constructed', 'Post-Intervention Observation', 'Field Verification'].map((step, i, arr) => (
            <React.Fragment key={i}>
              <div
                style={{
                  border: `1px solid ${borderCol}`,
                  background: isDark ? '#070f1f' : '#f8fafc',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: textCol,
                }}
              >
                {step}
              </div>
              {i < arr.length - 1 && <span style={{ color: dimCol, fontSize: 12 }}>→</span>}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: dimCol, fontWeight: 600 }}>Observed Vegetation Impact</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: textCol, marginTop: 4 }}>+0.22 NDVI Increase Nearby</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: dimCol, fontWeight: 600 }}>Associated Spatial Evidence</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: textCol, marginTop: 4 }}>2 Geo-Coded Photos + Sentinel-2 Index</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: dimCol, fontWeight: 600 }}>Evidence Reliability Score</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#2E9E5C', marginTop: 4 }}>High (0.91)</div>
          </div>
        </div>

        <div
          style={{
            fontSize: 11.5,
            color: dimCol,
            background: isDark ? '#070f1f' : '#eef3f7',
            padding: '9px 12px',
            borderRadius: 6,
            marginTop: 16,
          }}
        >
          ℹ Shows observed satellite changes and ground evidence — does not claim absolute single-cause attribution without hydrological modelling.
        </div>
      </div>
    </div>
  );
};
export default InterventionMonitoring;
