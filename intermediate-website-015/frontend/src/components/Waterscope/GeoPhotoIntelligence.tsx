import React from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
}

export const GeoPhotoIntelligence: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          Geo-Coded Photo Intelligence
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Converts field photographs from simple documentation into mathematically weighted spatial evidence.
        </p>
      </div>

      {/* Main Photo Card */}
      <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Photo Thumbnail */}
          <div
            style={{
              width: 180,
              height: 130,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #a8c9a8, #8fb8c4 55%, #c9ad82)',
              border: `1px solid ${borderCol}`,
              position: 'relative',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 6,
                left: 6,
                fontSize: 10,
                color: '#ffffff',
                background: 'rgba(11,41,66,0.75)',
                padding: '2px 6px',
                borderRadius: 3,
                fontFamily: 'monospace',
              }}
            >
              12.9812, 80.1247 · N-E
            </div>
          </div>

          {/* Metadata checklist */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 12, fontFamily: 'monospace', color: dimCol, fontWeight: 700, marginBottom: 8 }}>
              TASK #024 · 2026-08-14 07:42 IST
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <li style={{ color: textCol }}>
                <b style={{ color: '#2E9E5C', marginRight: 6 }}>✓</b> GPS Valid (±4m)
              </li>
              <li style={{ color: textCol }}>
                <b style={{ color: '#2E9E5C', marginRight: 6 }}>✓</b> Timestamp Intact
              </li>
              <li style={{ color: textCol }}>
                <b style={{ color: '#2E9E5C', marginRight: 6 }}>✓</b> Inside Watershed Boundary
              </li>
              <li style={{ color: textCol }}>
                <b style={{ color: '#2E9E5C', marginRight: 6 }}>✓</b> EXIF Sensor Tagged
              </li>
              <li style={{ color: textCol }}>
                <b style={{ color: '#2E9E5C', marginRight: 6 }}>✓</b> Duplicate Check Passed
              </li>
              <li style={{ color: textCol }}>
                <b style={{ color: '#2E9E5C', marginRight: 6 }}>✓</b> Temporal Consistency High
              </li>
            </ul>
          </div>

          {/* Trust Score badge */}
          <div style={{ textAlign: 'center', background: isDark ? '#070f1f' : '#f8fafc', padding: '16px 24px', borderRadius: 8, border: `1px solid ${borderCol}` }}>
            <div style={{ fontSize: 11, color: dimCol, textTransform: 'uppercase', fontWeight: 700 }}>
              Photo Trust Score
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: isDark ? '#38bdf8' : '#0B688A', fontFamily: 'monospace', marginTop: 2 }}>
              91<span style={{ fontSize: 16, color: dimCol }}>/100</span>
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 11.5,
            color: dimCol,
            background: isDark ? '#070f1f' : '#eef3f7',
            padding: '9px 14px',
            borderRadius: 6,
            marginTop: 16,
          }}
        >
          ℹ Photo Trust Score represents evidence quality based on metadata integrity and spatial consistency checks. It is an empirical weighting score, not a probability that the observation is true.
        </div>
      </div>

      {/* Component Scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: dimCol, fontWeight: 600 }}>GPS Positional Accuracy</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: textCol, fontFamily: 'monospace', marginTop: 4 }}>0.94</div>
        </div>
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: dimCol, fontWeight: 600 }}>EXIF Completeness Score</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: textCol, fontFamily: 'monospace', marginTop: 4 }}>0.90</div>
        </div>
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 12, color: dimCol, fontWeight: 600 }}>Temporal Consistency Index</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: textCol, fontFamily: 'monospace', marginTop: 4 }}>0.88</div>
        </div>
      </div>

      {/* Evidence Audit Trail */}
      <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 14 }}>
          Cryptographic Evidence Audit Log
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontFamily: 'monospace', fontSize: 12 }}>
          {[
            { time: '07:40 IST', text: 'CAPTURED — Field photograph captured on mobile client', dot: '#2E9E5C' },
            { time: '07:44 IST', text: 'UPLOADED — Image binary and telemetry sent to node', dot: '#2E9E5C' },
            { time: '07:45 IST', text: 'METADATA CHECKED — GPS coordinate bounding and EXIF tags validated', dot: '#2E9E5C' },
            { time: '07:47 IST', text: 'PHOTO ANALYZED — ML land-cover fraction segmentation computed', dot: '#2E9E5C' },
            { time: '07:48 IST', text: 'SATELLITE CROSS-REF — 3 intersecting Sentinel-2 30m pixels identified', dot: '#2E9E5C' },
            { time: '09:10 IST', text: 'HUMAN VERIFIED — Watershed Officer reviewed field submission', dot: '#C98A05' },
            { time: '09:11 IST', text: 'ACCEPTED — Integrated into Watershed Evidence Layer', dot: '#2E9E5C' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 8, borderBottom: `1px solid ${borderCol}` }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
              <span style={{ color: dimCol, width: 80, flexShrink: 0 }}>{item.time}</span>
              <span style={{ color: textCol }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default GeoPhotoIntelligence;
