import React from 'react';
import type { AppTheme } from '../../App';
import type { NavTab } from '../NavigationSidebar';

interface Props {
  theme: AppTheme;
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

const tourSteps: { tab: NavTab; title: string; text: string }[] = [
  { tab: 'overview', title: '01. Watershed Intelligence Overview', text: 'Officers start here — total watershed area (2,860 ha), active sub-watersheds, field photos, potential change anomalies and reliability coverage.' },
  { tab: 'gis', title: '02. Watershed GIS Explorer', text: 'Interactive GIS canvas layering watershed boundary, drainage stream networks, water bodies, LULC, NDVI vegetation, and mapped physical interventions.' },
  { tab: 'thematic', title: '03. Scientific Thematic Analysis', text: 'Run multi-class Land Use / Land Cover (LULC), NDVI vegetation vigour, NDWI surface water extent, drainage stream orders, and soil degradation analysis.' },
  { tab: 'change', title: '04. Temporal Change Detection', text: 'Compare baseline 2025 vs outcome 2026 satellite imagery using an interactive curtain swipe slider and difference blending mode.' },
  { tab: 'change', title: '05. Automated Anomaly Flagging', text: 'One click converts a detected vegetation anomaly (e.g. Zone-024) into a targeted field verification task.' },
  { tab: 'tasks', title: '06. Field Verification Task Queue', text: 'Tracks verification jobs through a 7-stage cryptographic pipeline from creation to final human officer acceptance.' },
  { tab: 'photo', title: '07. Geo-Photo Intelligence', text: 'Field photos are automatically audited for GPS bounding accuracy (±4m), timestamp integrity, EXIF completeness, and duplicate detection.' },
  { tab: 'photo', title: '08. Photo Trust Score (91/100)', text: 'Computes an empirical evidence quality score based on metadata integrity and spatial consistency checks.' },
  { tab: 'footprint', title: '09. Terrain-Aware Viewing Footprint', text: 'GPS coordinates + camera compass bearing (72°) + lens angular cone (65°) + DEM terrain slope calculate a directional viewing cone.' },
  { tab: 'subpixel', title: '10. Sub-Pixel Photo Calibration', text: 'Compares field photo land-cover fractions against mixed 30m × 30m satellite pixel spectral unmixing to derive composition error index E_mix (0.071).' },
  { tab: 'evidence', title: '11. Ground–Satellite Evidence Integration', text: 'Combines satellite indices, field photo trust, viewing footprint and sub-pixel calibration into a singular verified evidence state.' },
  { tab: 'reliability', title: '12. Reliability Map & Assessment Reports', text: 'Generates a watershed-wide 50-cell evidence reliability map and automated decision-support assessment reports.' },
];

export const JudgesTourModal: React.FC<Props> = ({ theme, isOpen, onClose, onNavigateTab }) => {
  const isDark = theme === 'dark';
  const [currentStep, setCurrentStep] = React.useState(0);

  if (!isOpen) return null;

  const step = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextIdx = currentStep + 1;
      setCurrentStep(nextIdx);
      onNavigateTab(tourSteps[nextIdx].tab);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevIdx = currentStep - 1;
      setCurrentStep(prevIdx);
      onNavigateTab(tourSteps[prevIdx].tab);
    }
  };

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.1)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11, 41, 66, 0.65)',
        backdropFilter: 'blur(3px)',
        zIndex: 120,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 30,
      }}
    >
      <div
        style={{
          background: cardBg,
          border: `1px solid ${borderCol}`,
          borderRadius: 12,
          padding: '24px 28px',
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 800, color: isDark ? '#38bdf8' : '#0e86b0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          JUDGE'S GUIDED TOUR · STEP {currentStep + 1} OF {tourSteps.length}
        </div>
        <h3 style={{ margin: '8px 0 10px', fontSize: 16, fontWeight: 700, color: textCol }}>
          {step.title}
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: dimCol, lineHeight: 1.6 }}>
          {step.text}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: `1px solid ${borderCol}`,
              color: dimCol,
              padding: '7px 14px',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Exit Tour
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                style={{
                  background: 'none',
                  border: `1px solid ${borderCol}`,
                  color: textCol,
                  padding: '7px 14px',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              style={{
                background: isDark ? '#38bdf8' : '#0e86b0',
                color: '#ffffff',
                border: 'none',
                padding: '7px 18px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {currentStep === tourSteps.length - 1 ? 'Finish Tour' : 'Next Step →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default JudgesTourModal;
