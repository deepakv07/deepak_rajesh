import React, { useState } from 'react';
import type { AppTheme } from '../../App';

interface CellData {
  id: number;
  status: 'high' | 'moderate' | 'low';
  color: string;
  change: string;
  photo: string;
  trust: string;
  agree: string;
  overlap: string;
  reason: string;
}

interface Props {
  theme: AppTheme;
  onRequestVerification?: (areaId: string) => void;
}

const reasons = [
  'weak photo metadata',
  'low spatial overlap',
  'temporal mismatch',
  'disagreement with satellite interpretation',
];

// Generate 50 cells deterministically
const generateCells = (): CellData[] => {
  const cells: CellData[] = [];
  const seedValues = [
    0.85, 0.92, 0.45, 0.72, 0.95, 0.38, 0.88, 0.65, 0.91, 0.55,
    0.94, 0.42, 0.78, 0.89, 0.32, 0.96, 0.71, 0.84, 0.58, 0.90,
    0.62, 0.87, 0.49, 0.93, 0.75, 0.82, 0.35, 0.86, 0.68, 0.97,
    0.79, 0.91, 0.52, 0.84, 0.66, 0.89, 0.41, 0.95, 0.73, 0.88,
    0.93, 0.46, 0.81, 0.74, 0.87, 0.59, 0.92, 0.67, 0.85, 0.39,
  ];

  for (let i = 0; i < 50; i++) {
    const r = seedValues[i];
    const status = r > 0.75 ? 'high' : r > 0.55 ? 'moderate' : 'low';
    const color = status === 'high' ? '#2E9E5C' : status === 'moderate' ? '#C98A05' : '#D2483E';
    cells.push({
      id: 100 + i,
      status,
      color,
      change: status === 'high' ? 'Not detected' : 'Detected ✓',
      photo: r > 0.4 ? 'Available ✓' : 'Not yet collected',
      trust: (0.5 + (r * 0.45)).toFixed(2),
      agree: status === 'high' ? 'High' : status === 'moderate' ? 'Partial' : 'Low',
      overlap: status === 'low' ? 'Partial' : 'Full (86%)',
      reason: reasons[i % reasons.length],
    });
  }
  return cells;
};

export const EvidenceReliabilityMap: React.FC<Props> = ({ theme, onRequestVerification }) => {
  const isDark = theme === 'dark';
  const [cells] = useState<CellData[]>(generateCells());
  const [selectedCell, setSelectedCell] = useState<CellData | null>(cells[0]);

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';
  const panelAlt = isDark ? '#070f1f' : '#eef3f7';

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          Evidence Reliability Map
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Interactive spatial reliability grid. Click any cell to inspect evidence component weights, uncertainty reasons, and trigger field verification.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* 50-Cell Grid Panel */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 14 }}>
            Watershed Spatial Reliability Grid (50 Zones)
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              gap: 4,
              maxWidth: 480,
            }}
          >
            {cells.map((cell) => {
              const isSelected = selectedCell?.id === cell.id;
              return (
                <div
                  key={cell.id}
                  onClick={() => setSelectedCell(cell)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 3,
                    background: cell.color,
                    cursor: 'pointer',
                    opacity: isSelected ? 1 : 0.8,
                    border: isSelected ? `2px solid ${isDark ? '#ffffff' : '#0b2942'}` : '1px solid transparent',
                    boxShadow: isSelected ? '0 0 8px rgba(0,0,0,0.4)' : 'none',
                    transition: 'transform 0.1s ease',
                  }}
                  title={`Zone #A${cell.id} - ${cell.status.toUpperCase()}`}
                />
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 11.5, color: dimCol, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: '#2E9E5C' }} />
              High Evidence Support (≥0.80)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: '#C98A05' }} />
              Moderate / Uncertain (0.60–0.80)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: '#D2483E' }} />
              Needs Field Verification (&lt;0.60)
            </span>
          </div>
        </div>

        {/* Evidence Component Weights */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 14 }}>
            Evidence Component Weightings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: textCol, marginBottom: 4 }}>
                <span>Ground–Sat. Consistency</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>0.88</span>
              </div>
              <div style={{ height: 8, background: panelAlt, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '88%', background: isDark ? '#38bdf8' : '#0E86B0' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: textCol, marginBottom: 4 }}>
                <span>Photo Trust Score</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>0.91</span>
              </div>
              <div style={{ height: 8, background: panelAlt, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '91%', background: '#2E9E5C' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: textCol, marginBottom: 4 }}>
                <span>Viewing Footprint Overlap</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>0.86</span>
              </div>
              <div style={{ height: 8, background: panelAlt, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '86%', background: isDark ? '#38bdf8' : '#0E86B0' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: textCol, marginBottom: 4 }}>
                <span>Temporal Consistency Index</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>0.78</span>
              </div>
              <div style={{ height: 8, background: panelAlt, borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '78%', background: '#C98A05' }} />
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: dimCol, marginTop: 14 }}>
            Thresholds (≥0.80 high · 0.60–0.80 moderate · &lt;0.60 needs verification) are project-defined weights for decision support.
          </div>
        </div>
      </div>

      {/* Selected Cell Inspector */}
      {selectedCell && (
        <div style={{ background: panelAlt, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: textCol, fontFamily: 'monospace' }}>
            INSPECTING ZONE #A{selectedCell.id}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 12, fontSize: 12.5, color: textCol }}>
            <div>Satellite Change: <b style={{ fontFamily: 'monospace' }}>{selectedCell.change}</b></div>
            <div>Field Photo: <b style={{ fontFamily: 'monospace' }}>{selectedCell.photo}</b></div>
            <div>Photo Trust: <b style={{ fontFamily: 'monospace' }}>{selectedCell.trust}</b></div>
            <div>Ground/Sat Agreement: <b style={{ fontFamily: 'monospace' }}>{selectedCell.agree}</b></div>
          </div>

          {selectedCell.status !== 'high' && (
            <div style={{ marginTop: 10, fontSize: 12, color: isDark ? '#f87171' : '#D2483E', fontWeight: 600 }}>
              Why uncertain: Primary cause is {selectedCell.reason}.
            </div>
          )}

          <div style={{ marginTop: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 800,
                background: selectedCell.status === 'high' ? (isDark ? 'rgba(46,158,92,0.2)' : '#E7F6ED') : selectedCell.status === 'moderate' ? (isDark ? 'rgba(202,138,5,0.2)' : '#FBF1DC') : (isDark ? 'rgba(210,72,62,0.2)' : '#FBEAE8'),
                color: selectedCell.status === 'high' ? (isDark ? '#4ade80' : '#2E9E5C') : selectedCell.status === 'moderate' ? (isDark ? '#facc15' : '#C98A05') : (isDark ? '#f87171' : '#D2483E'),
              }}
            >
              {selectedCell.status === 'high' ? 'HIGH EVIDENCE SUPPORT' : selectedCell.status === 'moderate' ? 'MODERATE / UNCERTAIN' : 'NEEDS VERIFICATION'}
            </span>

            <button
              onClick={() => onRequestVerification && onRequestVerification(`A${selectedCell.id}`)}
              style={{
                background: isDark ? '#38bdf8' : '#0e86b0',
                color: '#ffffff',
                border: 'none',
                padding: '7px 16px',
                borderRadius: 6,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Request Additional Field Verification Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default EvidenceReliabilityMap;
