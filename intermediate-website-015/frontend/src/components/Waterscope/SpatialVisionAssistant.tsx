import React, { useState } from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
}

export const SpatialVisionAssistant: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark';

  const [, setSelectedPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    classification: string;
    confidence: string;
    severity: string;
    locationTag: string;
    actionItems: string[];
  } | null>(null);

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  const handleSimulateUpload = (photoType: 'gully' | 'waterlog' | 'degraded') => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      if (photoType === 'gully') {
        setSelectedPhoto('/gully_sample.jpg');
        setAnalysisResult({
          classification: 'Gully Erosion & Surface Scouring Detected',
          confidence: '94.8% Match',
          severity: 'High Severity',
          locationTag: 'Upper Catchment (12.9812°N, 80.1247°E)',
          actionItems: [
            'Construct loose boulder check dams along channel bed',
            'Plant vetiver grass riparian buffer strips along edges',
            'Divert surface runoff through contour trenches',
          ],
        });
      } else if (photoType === 'waterlog') {
        setSelectedPhoto('/waterlog_sample.jpg');
        setAnalysisResult({
          classification: 'Standing Water accumulation & Waterlogging',
          confidence: '92.1% Match',
          severity: 'Moderate Severity',
          locationTag: 'Agricultural Plain (12.9701°N, 80.1390°E)',
          actionItems: [
            'Excavate farm pond storage reservoir (2,000 m³ capacity)',
            'Adopt Broad Bed Furrow (BBF) tillage system',
            'Clear secondary drainage outlet obstructions',
          ],
        });
      } else {
        setSelectedPhoto('/soil_sample.jpg');
        setAnalysisResult({
          classification: 'Degraded Topsoil & Vegetation Deficit',
          confidence: '89.4% Match',
          severity: 'Medium Severity',
          locationTag: 'Ridge Slope (12.9655°N, 80.1108°E)',
          actionItems: [
            'Execute contour bunding at 15m slope intervals',
            'Seed drought-hardy legumes for cover cropping',
            'Restrict unmanaged cattle grazing on slope',
          ],
        });
      }
    }, 1800);
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          Spatial AI Vision Assistant &amp; Photo Classifier
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Upload or select field photographs for automatic ML computer vision classification and targeted action items.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Upload & Sample Selector */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 14 }}>
            Field Image Analysis Input
          </h3>

          <div
            style={{
              border: `2px dashed ${borderCol}`,
              borderRadius: 8,
              padding: '30px 20px',
              textAlign: 'center',
              background: isDark ? '#070f1f' : '#f8fafc',
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 32 }}>📷</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: textCol, marginTop: 8 }}>
              Drag &amp; drop field photo here or select sample below
            </div>
            <div style={{ fontSize: 11, color: dimCol, marginTop: 4 }}>
              Supports JPG, PNG with automatic EXIF GPS extraction
            </div>
          </div>

          <div style={{ fontSize: 11.5, fontWeight: 700, color: dimCol, textTransform: 'uppercase', marginBottom: 8 }}>
            Simulate Sample Field Photo Upload
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => handleSimulateUpload('gully')}
              style={{
                background: isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9',
                color: isDark ? '#38bdf8' : '#0e86b0',
                border: `1px solid ${borderCol}`,
                padding: '8px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sample 1: Gully Erosion
            </button>
            <button
              onClick={() => handleSimulateUpload('waterlog')}
              style={{
                background: isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9',
                color: isDark ? '#38bdf8' : '#0e86b0',
                border: `1px solid ${borderCol}`,
                padding: '8px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sample 2: Standing Water
            </button>
            <button
              onClick={() => handleSimulateUpload('degraded')}
              style={{
                background: isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9',
                color: isDark ? '#38bdf8' : '#0e86b0',
                border: `1px solid ${borderCol}`,
                padding: '8px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sample 3: Degraded Soil
            </button>
          </div>
        </div>

        {/* AI Vision Classification Output */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 14 }}>
            Computer Vision Diagnostic Results
          </h3>

          {isAnalyzing ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: dimCol, fontSize: 13 }}>
              <div className="animate-spin" style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #0e86b0', borderTopColor: 'transparent', margin: '0 auto 12px' }} />
              Running ResNet-50 computer vision feature segmentation on field image...
            </div>
          ) : analysisResult ? (
            <div>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: isDark ? 'rgba(46,158,92,0.15)' : '#E7F6ED',
                  border: '1px solid #2E9E5C',
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 800, color: isDark ? '#4ade80' : '#2E9E5C' }}>
                  {analysisResult.classification}
                </div>
                <div style={{ fontSize: 11.5, color: dimCol, marginTop: 4, display: 'flex', gap: 12 }}>
                  <span>Confidence: <b>{analysisResult.confidence}</b></span>
                  <span>Severity: <b>{analysisResult.severity}</b></span>
                </div>
              </div>

              <div style={{ fontSize: 12, color: dimCol, marginBottom: 10 }}>
                Location: <span style={{ fontFamily: 'monospace', color: textCol, fontWeight: 600 }}>{analysisResult.locationTag}</span>
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: textCol, textTransform: 'uppercase', marginBottom: 6 }}>
                Recommended Engineering Actions
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {analysisResult.actionItems.map((act, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: textCol, background: isDark ? '#070f1f' : '#f8fafc', padding: '8px 12px', borderRadius: 6, border: `1px solid ${borderCol}` }}>
                    • {act}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: dimCol, fontSize: 12.5 }}>
              Select a sample photo on the left to view instant ML computer vision classification and recommended conservation actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SpatialVisionAssistant;
