import React, { useState } from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
  isOpen: boolean;
  onToggle: () => void;
}

const cpAnswers = [
  {
    q: 'What changed in vegetation between the selected dates?',
    a: 'Between the selected dates, the NDVI layer shows a decline in 2 zones within the watershed, most notably ZONE-024 (−0.28 NDVI change).',
    ev: ['NDVI layer', 'Change Detection results'],
    lim: 'Based on available prototype demo data only.',
  },
  {
    q: 'Show areas requiring field verification.',
    a: '3 areas are currently flagged as "Needs verification" on the Reliability Map, based on low ground–satellite agreement or weak photo metadata.',
    ev: ['Reliability Map grid', 'Evidence components'],
    lim: 'Prototype thresholds, not official accuracy standards.',
  },
  {
    q: 'Which geo-coded photos support this observation?',
    a: 'Geo-coded Photo #024 (Trust Score 0.91) is the primary supporting evidence, cross-referenced against 3 intersecting satellite pixels.',
    ev: ['Photo #024 metadata', 'Photo footprint', 'Sub-pixel comparison'],
    lim: 'Single-photo evidence; not exhaustive.',
  },
  {
    q: 'Why is this zone marked uncertain?',
    a: 'Insufficient evidence in the current dataset to explain a specific zone — open Reliability Map and click a cell to see its component scores.',
    ev: ['Reliability Map'],
    lim: 'Answer is generic without a selected cell.',
  },
  {
    q: 'What satellite layers are available?',
    a: 'Available demo layers: watershed boundary, sub-watersheds, drainage, water bodies, LULC, NDVI, interventions, change areas, geo-photos and reliability zones.',
    ev: ['Watershed GIS layer panel'],
    lim: 'Demo/simulated layers only.',
  },
];

export const AICopilotDrawer: React.FC<Props> = ({ theme, isOpen, onToggle }) => {
  const isDark = theme === 'dark';
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={onToggle}
        style={{
          position: 'fixed',
          bottom: 22,
          right: 22,
          background: isDark ? '#38bdf8' : '#0e86b0',
          color: '#ffffff',
          border: 'none',
          borderRadius: 24,
          padding: '12px 20px',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(14,134,176,0.4)',
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>🛰️</span> Grounded AI Copilot
      </button>

      {/* Slide-Out Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : -400,
          width: 380,
          height: '100vh',
          background: cardBg,
          borderLeft: `1px solid ${borderCol}`,
          boxShadow: '-8px 0 30px rgba(0,0,0,0.2)',
          zIndex: 100,
          transition: 'right 0.3s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '18px 20px', borderBottom: `1px solid ${borderCol}` }}>
          <button
            onClick={onToggle}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: dimCol,
            }}
          >
            ×
          </button>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: textCol }}>
            Grounded Watershed AI Copilot
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: dimCol }}>
            Ask grounded questions about selected watershed spatial evidence.
          </p>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: dimCol, textTransform: 'uppercase', marginBottom: 10 }}>
            Suggested Grounded Queries
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cpAnswers.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : '#eef3f7',
                  border: `1px solid ${selectedIdx === idx ? (isDark ? '#38bdf8' : '#0e86b0') : borderCol}`,
                  borderRadius: 12,
                  padding: '9px 14px',
                  fontSize: 12,
                  color: textCol,
                  cursor: 'pointer',
                  fontWeight: selectedIdx === idx ? 600 : 400,
                }}
              >
                {item.q}
              </div>
            ))}
          </div>

          {/* Answer Display */}
          {selectedIdx !== null && (
            <div
              style={{
                background: isDark ? 'rgba(56,189,248,0.1)' : '#E6F4F9',
                border: `1px solid ${isDark ? 'rgba(56,189,248,0.25)' : 'rgba(14,134,176,0.2)'}`,
                borderRadius: 8,
                padding: 14,
                marginTop: 18,
                fontSize: 12.5,
                lineHeight: 1.6,
                color: textCol,
              }}
            >
              <div>{cpAnswers[selectedIdx].a}</div>

              <div style={{ fontSize: 10.5, color: dimCol, textTransform: 'uppercase', fontWeight: 700, marginTop: 10 }}>
                Evidence Used
              </div>
              <div style={{ fontSize: 11.5, color: isDark ? '#38bdf8' : '#0E86B0', fontWeight: 600 }}>
                {cpAnswers[selectedIdx].ev.join(' · ')}
              </div>

              <div style={{ fontSize: 10.5, color: dimCol, textTransform: 'uppercase', fontWeight: 700, marginTop: 8 }}>
                Limitations Callout
              </div>
              <div style={{ fontSize: 11.5, color: dimCol }}>{cpAnswers[selectedIdx].lim}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default AICopilotDrawer;
