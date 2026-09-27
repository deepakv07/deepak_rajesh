import React from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
}

export const GroundSatelliteEvidence: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';
  const barTrackBg = isDark ? '#1a2e45' : '#eef3f7';

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          Ground–Satellite Integrated Evidence
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Unifies satellite remote sensing anomalies, field task submission, photo trust verification, terrain viewing footprint and sub-pixel calibration into a singular evidence state.
        </p>
      </div>

      {/* Pipeline */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 24 }}>
        {[
          'Satellite',
          'Anomaly',
          'Field Task',
          'Photo',
          'Trust Score',
          'Footprint',
          'Pixels',
          'Comparison',
          'Reliability',
        ].map((step, i, arr) => (
          <React.Fragment key={i}>
            <div
              style={{
                border: `1px solid ${borderCol}`,
                background: cardBg,
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

      {/* 3 Column Evidence Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {/* Photo Evidence */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 18 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: textCol, marginBottom: 14 }}>
            Photo Ground Evidence
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: textCol }}>
                <span>Vegetation</span>
                <span style={{ fontWeight: 700 }}>55%</span>
              </div>
              <div style={{ height: 7, background: barTrackBg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '55%', background: '#7BBF8C' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: textCol }}>
                <span>Soil / Bare</span>
                <span style={{ fontWeight: 700 }}>25%</span>
              </div>
              <div style={{ height: 7, background: barTrackBg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '25%', background: '#C9AD82' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: textCol }}>
                <span>Water Surface</span>
                <span style={{ fontWeight: 700 }}>20%</span>
              </div>
              <div style={{ height: 7, background: barTrackBg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '20%', background: '#0E86B0' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Satellite Pixel */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 18 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: textCol, marginBottom: 14 }}>
            Intersecting Satellite Pixel (30m)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: textCol }}>
                <span>Vegetation</span>
                <span style={{ fontWeight: 700 }}>60%</span>
              </div>
              <div style={{ height: 7, background: barTrackBg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '60%', background: '#7BBF8C', opacity: 0.6 }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: textCol }}>
                <span>Soil / Bare</span>
                <span style={{ fontWeight: 700 }}>25%</span>
              </div>
              <div style={{ height: 7, background: barTrackBg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '25%', background: '#C9AD82', opacity: 0.6 }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: textCol }}>
                <span>Water Surface</span>
                <span style={{ fontWeight: 700 }}>15%</span>
              </div>
              <div style={{ height: 7, background: barTrackBg, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '15%', background: '#0E86B0', opacity: 0.6 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Metrics */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 18 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: textCol, marginBottom: 14 }}>
            Evidence Cross-Validation Results
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: `1px solid ${borderCol}` }}>
              <span style={{ color: dimCol }}>Ground–sat. consistency</span>
              <b style={{ color: '#2E9E5C' }}>High</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: `1px solid ${borderCol}` }}>
              <span style={{ color: dimCol }}>Footprint pixel overlap</span>
              <b style={{ color: textCol }}>86%</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 6, borderBottom: `1px solid ${borderCol}` }}>
              <span style={{ color: dimCol }}>Photo trust score</span>
              <b style={{ color: isDark ? '#38bdf8' : '#0E86B0' }}>91/100</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: dimCol }}>Temporal consistency</span>
              <b style={{ color: '#2E9E5C' }}>High</b>
            </div>
          </div>
        </div>
      </div>

      {/* Main Status Banner */}
      <div
        style={{
          padding: '14px 20px',
          borderRadius: 8,
          background: isDark ? 'rgba(46,158,92,0.15)' : '#E7F6ED',
          color: isDark ? '#4ade80' : '#2E9E5C',
          fontWeight: 800,
          fontSize: 14,
          textAlign: 'center',
          letterSpacing: '0.05em',
          border: `1px solid ${isDark ? 'rgba(46,158,92,0.3)' : 'rgba(46,158,92,0.2)'}`,
        }}
      >
        ✓ FIELD-SUPPORTED OBSERVATION (EVIDENCE MATCH VERIFIED)
      </div>
      <div style={{ fontSize: 11.5, color: dimCol, textAlign: 'center', marginTop: 8 }}>
        This reflects high statistical agreement between satellite observations and validated field evidence under prototype thresholds.
      </div>
    </div>
  );
};
export default GroundSatelliteEvidence;
