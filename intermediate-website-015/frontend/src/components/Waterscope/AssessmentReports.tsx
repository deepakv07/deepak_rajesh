import React from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
  onToast?: (msg: string) => void;
}

export const AssessmentReports: React.FC<Props> = ({ theme, onToast }) => {
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  const reportText = `WATERSCOPE — WATERSHED ASSESSMENT REPORT   (Demo / Simulated Data)
Watershed: Demo Watershed — Kancheepuram   Date: 26 Sep 2026
────────────────────────────────────────────────────────────────────────────
1. Overview — 2,860 ha · 8 sub-watersheds
2. LULC — Agriculture 38% · Vegetation 31% · Water 9% · Bare soil 16% · Built-up 6%
3. Vegetation — Mean NDVI 0.54, 2 zones flagged for review
4. Water — Extent 9.1%, +2.1 ha vs. baseline
5. Drainage — Density 2.4 km/km², 4 major streams
6. Interventions — 34 mapped, 24 field-verified
7. Temporal changes — 12 potential change zones
8. Geo-coded field evidence — 126 photos, avg. trust 0.86
9. Ground–satellite comparison — E_mix avg. 0.09
10. Reliability — High 62% · Moderate 25% · Needs verification 13%
11. Recommendations — 9 zones proposed for further field verification`;

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          Watershed Assessment Reports
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Generate automated geospatial and ground verification summary assessment reports.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          onClick={() => onToast && onToast('Report generated successfully.')}
          style={{ background: isDark ? '#38bdf8' : '#0e86b0', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
        >
          Generate Fresh Report
        </button>
        <button
          onClick={() => onToast && onToast('Preview window opened.')}
          style={{ background: cardBg, border: `1px solid ${borderCol}`, color: textCol, padding: '8px 16px', borderRadius: 6, fontSize: 12.5, cursor: 'pointer' }}
        >
          Preview Report
        </button>
        <button
          onClick={() => onToast && onToast('Exporting PDF document...')}
          style={{ background: cardBg, border: `1px solid ${borderCol}`, color: textCol, padding: '8px 16px', borderRadius: 6, fontSize: 12.5, cursor: 'pointer' }}
        >
          Download PDF
        </button>
        <button
          onClick={() => onToast && onToast('Exporting GeoJSON dataset...')}
          style={{ background: cardBg, border: `1px solid ${borderCol}`, color: textCol, padding: '8px 16px', borderRadius: 6, fontSize: 12.5, cursor: 'pointer' }}
        >
          Export GeoJSON Data
        </button>
      </div>

      <div
        style={{
          background: cardBg,
          border: `1px solid ${borderCol}`,
          borderRadius: 8,
          padding: 20,
          fontFamily: 'monospace',
          fontSize: 13,
          lineHeight: 1.8,
          color: textCol,
          whiteSpace: 'pre-line',
        }}
      >
        {reportText}
      </div>
    </div>
  );
};
export default AssessmentReports;
