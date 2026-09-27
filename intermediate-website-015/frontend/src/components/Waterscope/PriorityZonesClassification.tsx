import React, { useState } from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
  onRequestAction?: (zoneName: string) => void;
}

interface PriorityZone {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  area: string;
  issues: string[];
  interventions: string[];
  reasons: string[];
}

const ZONES: PriorityZone[] = [
  {
    id: 'ZONE-A1',
    name: 'Upper Ridge Catchment Slope',
    priority: 'high',
    area: '340 ha',
    issues: ['Rapid surface runoff velocity (>1.8 m/s)', 'Severe active gully erosion channels', 'Low vegetation canopy cover (<20%)'],
    interventions: ['Contour Bunding along 15m intervals', 'Loose Boulder Check Dams (3 units)', 'Vetiver Grass Riparian Buffers'],
    reasons: ['High slope angle (>12°)', 'Unprotected degraded soil layer', 'Satellite NDVI decline of -0.28'],
  },
  {
    id: 'ZONE-B3',
    name: 'Mid-Stream Drainage Confluence',
    priority: 'high',
    area: '210 ha',
    issues: ['Stream bank scouring & erosion', 'Heavy siltation into downstream storage tank', 'Uncontrolled flash runoff'],
    interventions: ['Concrete Masonry Check Dam (WD-021)', 'Mechanical De-siltation of Storage Tank', 'Afforestation on Slopes'],
    reasons: ['Critical stream junction node', 'High silt transport index', 'Field evidence verified'],
  },
  {
    id: 'ZONE-C2',
    name: 'Agricultural Flat Plain',
    priority: 'medium',
    area: '520 ha',
    issues: ['Monsoon waterlogging in low patches', 'Soil nutrient leaching', 'Inadequate field drainage'],
    interventions: ['Excavated Farm Pond (WD-014)', 'Broad Bed Furrow (BBF) Tillage System'],
    reasons: ['Clay loam soil with low infiltration', 'Moderate runoff accumulation'],
  },
  {
    id: 'ZONE-D4',
    name: 'Lower Basin Outflow Region',
    priority: 'low',
    area: '890 ha',
    issues: ['Minor weed growth in main channel'],
    interventions: ['Seasonal Channel Clearing', 'Regular Water Flow Monitoring'],
    reasons: ['Flat terrain (<2° slope)', 'Stable vegetation cover'],
  },
];

export const PriorityZonesClassification: React.FC<Props> = ({ theme, onRequestAction }) => {
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  const badgeStyles = {
    high: { background: isDark ? 'rgba(210,72,62,0.2)' : '#FBEAE8', color: isDark ? '#f87171' : '#D2483E', border: '1px solid #D2483E' },
    medium: { background: isDark ? 'rgba(202,138,5,0.2)' : '#FBF1DC', color: isDark ? '#facc15' : '#C98A05', border: '1px solid #C98A05' },
    low: { background: isDark ? 'rgba(46,158,92,0.2)' : '#E7F6ED', color: isDark ? '#4ade80' : '#2E9E5C', border: '1px solid #2E9E5C' },
  };

  const filteredZones = ZONES.filter((z) => filter === 'all' || z.priority === filter);

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          Priority Zone Classification &amp; AI Recommendations
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Categorized catchment risk zones detailing environmental degradation causes and targeted engineering interventions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { id: 'all', label: 'All Priority Zones' },
          { id: 'high', label: '🔴 High Risk / Urgent' },
          { id: 'medium', label: '🟡 Medium Priority' },
          { id: 'low', label: '🟢 Low Risk / Stable' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id as 'all' | 'high' | 'medium' | 'low')}
            style={{
              background: filter === btn.id ? (isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9') : cardBg,
              color: filter === btn.id ? (isDark ? '#38bdf8' : '#0b688a') : dimCol,
              border: `1px solid ${filter === btn.id ? (isDark ? '#38bdf8' : '#0e86b0') : borderCol}`,
              padding: '6px 14px',
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Zone Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {filteredZones.map((zone) => (
          <div
            key={zone.id}
            style={{
              background: cardBg,
              border: `1px solid ${borderCol}`,
              borderRadius: 10,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 900, fontFamily: 'monospace', color: textCol }}>
                  {zone.id} — {zone.name}
                </span>
                <span
                  style={{
                    ...badgeStyles[zone.priority],
                    padding: '3px 10px',
                    borderRadius: 12,
                    fontSize: 10.5,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  {zone.priority} Priority ({zone.area})
                </span>
              </div>

              {/* Environmental Issues */}
              <div style={{ margin: '12px 0' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: dimCol, textTransform: 'uppercase', marginBottom: 4 }}>
                  Main Environmental Issues
                </div>
                {zone.issues.map((iss, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: textCol, marginBottom: 2 }}>
                    ⚠️ {iss}
                  </div>
                ))}
              </div>

              {/* AI Recommended Interventions */}
              <div style={{ margin: '12px 0' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#2E9E5C', textTransform: 'uppercase', marginBottom: 4 }}>
                  AI Recommended Engineering Interventions
                </div>
                {zone.interventions.map((inte, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: isDark ? '#4ade80' : '#2E9E5C', fontWeight: 600, marginBottom: 2 }}>
                    ✓ {inte}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onRequestAction && onRequestAction(zone.name)}
              style={{
                marginTop: 14,
                background: isDark ? '#38bdf8' : '#0e86b0',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              Simulate Intervention Scenarios for {zone.id} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PriorityZonesClassification;
