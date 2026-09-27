import React from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
}

export const DataAndSources: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark';

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  const datasets = [
    { title: 'Satellite Data', sub: '30 m Sentinel-2 MSI resolution, SRISHTI-DRISHTI context' },
    { title: 'GIS Vector Layers', sub: 'Boundaries, drainage networks, land-use zoning' },
    { title: 'Digital Elevation Model (DEM)', sub: '30 m SRTM terrain elevation for footprint ray-tracing' },
    { title: 'Geo-Coded Photos', sub: '126 sample field photographs with EXIF metadata' },
    { title: 'Field Survey Data', sub: 'Verification task submissions and ground truth tags' },
    { title: 'NDVI / NDWI Indices', sub: 'Derived vegetation vigour & surface water extent' },
  ];

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          Data &amp; Geospatial Sources
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Geospatial datasets, satellite imagery sources and field data pipelines powering the prototype.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {datasets.map((d, i) => (
          <div key={i} style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 18 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: textCol, margin: '0 0 4px' }}>{d.title}</h3>
            <div style={{ fontSize: 11.5, color: dimCol, marginBottom: 10 }}>{d.sub}</div>
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 800,
                background: isDark ? 'rgba(234,179,8,0.15)' : '#fbf1dc',
                color: isDark ? '#facc15' : '#c98a05',
                padding: '2px 8px',
                borderRadius: 10,
                letterSpacing: '0.05em',
              }}
            >
              PROTOTYPE DATASET
            </span>
          </div>
        ))}
      </div>

      <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 14 }}>
          End-to-End Geospatial Processing Pipeline
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {[
            'Satellite Imagery Feed',
            'Preprocessing & Cloud Masking',
            'Watershed Boundary Clipping',
            'NDVI / NDWI Computation',
            'LULC ML Classification',
            'Temporal Anomaly Detection',
            'Field Task Verification',
          ].map((step, i, arr) => (
            <React.Fragment key={i}>
              <div
                style={{
                  border: `1px solid ${borderCol}`,
                  background: isDark ? '#070f1f' : '#f8fafc',
                  borderRadius: 6,
                  padding: '7px 12px',
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
      </div>
    </div>
  );
};
export default DataAndSources;
