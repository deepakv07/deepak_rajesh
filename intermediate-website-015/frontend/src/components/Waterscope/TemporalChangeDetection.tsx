import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
  onCreateTask?: (task: { id: string; loc: string; issue: string; priority: string; status: string }) => void;
}

export const TemporalChangeDetection: React.FC<Props> = ({ theme, onCreateTask }) => {
  const isDark = theme === 'dark';

  const [hasRun, setHasRun] = useState(true);
  const [viewMode, setViewMode] = useState<0 | 1 | 2>(1); // 0: side-by-side, 1: swipe, 2: difference
  const [swipePct, setSwipePct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [beforeSrc, setBeforeSrc] = useState<string>('/sat_before.jpg');
  const [afterSrc,  setAfterSrc]  = useState<string>('/sat_after.jpg');

  const containerRef  = useRef<HTMLDivElement>(null);
  const beforeFileRef = useRef<HTMLInputElement>(null);
  const afterFileRef  = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback((which: 'before' | 'after') => {
    const ref = which === 'before' ? beforeFileRef : afterFileRef;
    ref.current?.click();
  }, []);

  const onFileChange = useCallback((which: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (which === 'before') setBeforeSrc(url);
    else setAfterSrc(url);
    e.target.value = '';
  }, []);

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let pct = ((e.clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    setSwipePct(pct);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
            Temporal Change Detection
          </h1>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              background: isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9',
              color: isDark ? '#38bdf8' : '#0e86b0',
              padding: '2px 8px',
              borderRadius: 10,
            }}
          >
            SENTINEL-2 TIMELAPSE
          </span>
        </div>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Compare watershed conditions between baseline and outcome satellite observation dates.
        </p>
      </div>

      {/* Selectors */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4, fontWeight: 600 }}>
            Baseline date
          </label>
          <select
            style={{
              border: `1px solid ${borderCol}`,
              padding: '8px 12px',
              borderRadius: 6,
              background: cardBg,
              color: textCol,
              fontSize: 13,
            }}
          >
            <option>2025-02-15 (Post-Monsoon Baseline)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4, fontWeight: 600 }}>
            Outcome date
          </label>
          <select
            style={{
              border: `1px solid ${borderCol}`,
              padding: '8px 12px',
              borderRadius: 6,
              background: cardBg,
              color: textCol,
              fontSize: 13,
            }}
          >
            <option>2026-08-20 (Current Observation)</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4, fontWeight: 600 }}>
            Analysis type
          </label>
          <select
            style={{
              border: `1px solid ${borderCol}`,
              padding: '8px 12px',
              borderRadius: 6,
              background: cardBg,
              color: textCol,
              fontSize: 13,
            }}
          >
            <option>NDVI Vegetation Change</option>
            <option>NDWI Water Change</option>
            <option>LULC Class Change</option>
          </select>
        </div>
        <button
          onClick={() => setHasRun(true)}
          style={{
            background: isDark ? '#38bdf8' : '#0e86b0',
            color: '#ffffff',
            border: 'none',
            padding: '9px 18px',
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Run Comparison
        </button>
      </div>

      {hasRun && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', gap: 8, borderBottom: `1px solid ${borderCol}`, paddingBottom: 8 }}>
            {[
              { id: 0, label: 'Side-by-side' },
              { id: 1, label: 'Interactive Curtain Swipe' },
              { id: 2, label: 'Difference Blend Map' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as 0 | 1 | 2)}
                style={{
                  background: viewMode === tab.id ? (isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9') : 'none',
                  color: viewMode === tab.id ? (isDark ? '#38bdf8' : '#0b688a') : dimCol,
                  border: viewMode === tab.id ? `1px solid ${isDark ? 'rgba(56,189,248,0.3)' : '#0e86b0'}` : `1px solid ${borderCol}`,
                  padding: '6px 14px',
                  borderRadius: 6,
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Swipe Canvas */}
          {/* Hidden file inputs */}
          <input ref={beforeFileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => onFileChange('before', e)} />
          <input ref={afterFileRef}  type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => onFileChange('after', e)}  />

          {/* ── Side-by-side mode ── */}
          {viewMode === 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2,
              height: 280, borderRadius: 8, overflow: 'hidden',
              border: `1px solid ${borderCol}`,
            }}>
              {(['before', 'after'] as const).map((which) => {
                const src   = which === 'before' ? beforeSrc : afterSrc;
                const label = which === 'before' ? 'BEFORE — 2025-02-15' : 'AFTER — 2026-08-20';
                const isEmpty = !src;
                return (
                  <div key={which} style={{ position: 'relative', overflow: 'hidden', background: isDark ? '#070f1f' : '#DCE9EF' }}>
                    {isEmpty ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: dimCol, fontSize: 13 }}>
                        Upload {which === 'before' ? 'Before' : 'After'} Image
                      </div>
                    ) : (
                      <img src={src} alt={which} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    )}
                    <div style={{ position: 'absolute', top: 8, left: which === 'before' ? 10 : undefined, right: which === 'after' ? 10 : undefined,
                      fontSize: 11, fontWeight: 700, background: cardBg, color: textCol,
                      padding: '3px 10px', borderRadius: 4, border: `1px solid ${borderCol}` }}>
                      {label}
                    </div>
                    <button onClick={() => handleUpload(which)} style={{
                      position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                      background: 'rgba(0,0,0,0.55)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)',
                      padding: '4px 12px', borderRadius: 5, fontSize: 10.5, cursor: 'pointer', backdropFilter: 'blur(4px)',
                    }}>⬆ Upload</button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Swipe / Difference mode ── */}
          {(viewMode === 1 || viewMode === 2) && (
            <div
              ref={containerRef}
              style={{
                position: 'relative',
                height: 280,
                borderRadius: 8,
                overflow: 'hidden',
                border: `1px solid ${borderCol}`,
                background: isDark ? '#070f1f' : '#DCE9EF',
                userSelect: 'none',
              }}
            >
              {/* BEFORE image — full width base layer */}
              {beforeSrc ? (
                <img src={beforeSrc} alt="Before"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dimCol, fontSize: 13 }}>
                  Upload Before Image
                </div>
              )}

              {/* AFTER image — clipped or blended */}
              {afterSrc && (
                <img src={afterSrc} alt="After"
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                    clipPath: viewMode === 2 ? 'none' : `inset(0 0 0 ${swipePct}%)`,
                    mixBlendMode: viewMode === 2 ? 'difference' : 'normal',
                  }} />
              )}

              {/* Curtain handle */}
              {viewMode === 1 && (
                <div
                  onMouseDown={() => setIsDragging(true)}
                  style={{
                    position: 'absolute', top: 0, bottom: 0,
                    left: `${swipePct}%`,
                    width: 3, background: '#ffffff',
                    boxShadow: '0 0 8px rgba(0,0,0,0.6)',
                    cursor: 'ew-resize',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 30, height: 30, borderRadius: '50%',
                    background: '#ffffff', color: '#0b2942',
                    border: '1px solid #dae3ec',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 900,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                  }}>⇔</div>
                </div>
              )}

              {/* BEFORE label */}
              <div style={{
                position: 'absolute', top: 10, left: 12,
                fontSize: 11, fontWeight: 700,
                background: cardBg, color: textCol,
                padding: '3px 10px', borderRadius: 4,
                border: `1px solid ${borderCol}`,
              }}>BEFORE — 2025-02-15</div>

              {/* AFTER label */}
              <div style={{
                position: 'absolute', top: 10, right: 12,
                fontSize: 11, fontWeight: 700,
                background: cardBg, color: textCol,
                padding: '3px 10px', borderRadius: 4,
                border: `1px solid ${borderCol}`,
              }}>AFTER — 2026-08-20</div>

              {/* Upload buttons bottom-left / bottom-right */}
              <button onClick={() => handleUpload('before')} style={{
                position: 'absolute', bottom: 10, left: 12,
                background: 'rgba(0,0,0,0.55)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.28)',
                padding: '4px 11px', borderRadius: 5, fontSize: 10.5,
                cursor: 'pointer', backdropFilter: 'blur(4px)', zIndex: 12,
              }}>⬆ Before</button>
              <button onClick={() => handleUpload('after')} style={{
                position: 'absolute', bottom: 10, right: 12,
                background: 'rgba(0,0,0,0.55)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.28)',
                padding: '4px 11px', borderRadius: 5, fontSize: 10.5,
                cursor: 'pointer', backdropFilter: 'blur(4px)', zIndex: 12,
              }}>⬆ After</button>
            </div>
          )}

          {/* Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderTop: '3px solid #C98A05', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: dimCol, fontWeight: 600 }}>Mean NDVI Difference</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: textCol, fontFamily: 'monospace', marginTop: 4 }}>−0.11</div>
            </div>
            <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderTop: '3px solid #C98A05', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: dimCol, fontWeight: 600 }}>Veg Decline Area</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: textCol, fontFamily: 'monospace', marginTop: 4 }}>18.6 ha</div>
            </div>
            <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderTop: '3px solid #0E86B0', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: dimCol, fontWeight: 600 }}>Water Extent Change</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: textCol, fontFamily: 'monospace', marginTop: 4 }}>+2.1 ha</div>
            </div>
            <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderTop: '3px solid #D2483E', borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 11, color: dimCol, fontWeight: 600 }}>Potential Change Zones</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: textCol, fontFamily: 'monospace', marginTop: 4 }}>12</div>
            </div>
          </div>

          {/* Actionable Anomaly Card */}
          <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: 14, color: textCol }}>
              ANOMALY ZONE-024
            </div>
            <div style={{ fontSize: 12.5, color: dimCol, marginTop: 4 }}>
              Potential vegetation decline · Area 12.4 ha · Confidence: Moderate
            </div>
            <div
              style={{
                marginTop: 10,
                padding: '10px 14px',
                borderRadius: 6,
                background: isDark ? 'rgba(202,138,5,0.15)' : '#FBF1DC',
                color: isDark ? '#facc15' : '#C98A05',
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              ⚠️ Significant vegetation drop detected. Field verification task required to inspect cause.
            </div>
            <button
              onClick={() => {
                if (onCreateTask) {
                  onCreateTask({
                    id: '#033',
                    loc: '12.9812, 80.1247',
                    issue: 'Vegetation decline (Zone-024)',
                    priority: 'High',
                    status: 'pending',
                  });
                }
              }}
              style={{
                marginTop: 12,
                background: isDark ? '#38bdf8' : '#0e86b0',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 6,
                fontWeight: 600,
                fontSize: 12.5,
                cursor: 'pointer',
              }}
            >
              Create Field Verification Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemporalChangeDetection;