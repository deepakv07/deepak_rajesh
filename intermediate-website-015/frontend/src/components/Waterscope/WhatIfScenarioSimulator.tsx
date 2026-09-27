import React, { useState } from 'react';
import type { AppTheme } from '../../App';

interface Props {
  theme: AppTheme;
}

interface InterventionCatalogItem {
  id: string;
  name: string;
  purpose: string;
  problem: string;
  benefits: string;
}

const INTERVENTIONS_CATALOG: InterventionCatalogItem[] = [
  {
    id: 'check-dam',
    name: 'Check Dam (Masonry / Boulder)',
    purpose: 'Stream velocity reduction & artificial groundwater recharge',
    problem: 'Gully erosion, rapid flash runoff, stream bank scouring',
    benefits: '+45,000 m³ water stored/yr, 85% soil loss reduction downstream',
  },
  {
    id: 'farm-pond',
    name: 'Farm Pond / Storage Tank',
    purpose: 'Rainwater harvesting for dry-season crop irrigation',
    problem: 'Agricultural water scarcity, drought vulnerability',
    benefits: 'Provides 3 additional months of supplemental irrigation',
  },
  {
    id: 'contour-bunding',
    name: 'Contour Bunding & Trenches',
    purpose: 'In-situ soil moisture conservation on sloping catchment',
    problem: 'Sheet erosion, topsoil wash-off, low crop yields',
    benefits: 'Conserves 90% of topsoil, increases soil moisture retention by 28%',
  },
  {
    id: 'vegetation-strips',
    name: 'Riparian Vegetation Strips',
    purpose: 'Biological buffer against runoff sediment transport',
    problem: 'Siltation into reservoirs, water quality degradation',
    benefits: 'Filters 75% of suspended sediment, enhances local biodiversity',
  },
];

export const WhatIfScenarioSimulator: React.FC<Props> = ({ theme }) => {
  const isDark = theme === 'dark';

  const [selectedLocation, setSelectedLocation] = useState('ZONE-A1 (Upper Slope)');
  const [selectedIntervention, setSelectedIntervention] = useState('check-dam');
  const [scenarios, setScenarios] = useState([
    { id: 1, loc: 'ZONE-A1 (Upper Slope)', structure: 'Check Dam (Masonry)', runoffRed: '42%', rechargeGain: '+45,000 m³', cost: '₹4.2 Lakhs' },
    { id: 2, loc: 'ZONE-C2 (Plain)', structure: 'Farm Pond Excavation', runoffRed: '28%', rechargeGain: '+28,000 m³', cost: '₹2.8 Lakhs' },
  ]);

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';
  const barTrackBg = isDark ? '#1a2e45' : '#eef3f7';

  const handleAddScenario = () => {
    const item = INTERVENTIONS_CATALOG.find((i) => i.id === selectedIntervention);
    const newScen = {
      id: Date.now(),
      loc: selectedLocation,
      structure: item ? item.name : 'Custom Structure',
      runoffRed: `${30 + Math.floor(Math.random() * 25)}%`,
      rechargeGain: `+${30 + Math.floor(Math.random() * 30)},000 m³`,
      cost: `₹${(2 + Math.random() * 3).toFixed(1)} Lakhs`,
    };
    setScenarios([newScen, ...scenarios]);
  };

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          "What-If" Scenario Simulation &amp; Intervention Planning
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Simulate the hydrological and soil retention impact of proposed engineering structures before capital disbursal.
        </p>
      </div>

      {/* Catalog Grid */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: dimCol, textTransform: 'uppercase', marginBottom: 10 }}>
          Conservation Intervention Catalog
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {INTERVENTIONS_CATALOG.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedIntervention(item.id)}
              style={{
                background: cardBg,
                border: `1px solid ${selectedIntervention === item.id ? (isDark ? '#38bdf8' : '#0e86b0') : borderCol}`,
                borderRadius: 8,
                padding: 14,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 700, color: textCol, marginBottom: 4 }}>{item.name}</div>
              <div style={{ fontSize: 11, color: dimCol, marginBottom: 6 }}>{item.purpose}</div>
              <div style={{ fontSize: 10.5, color: isDark ? '#4ade80' : '#2E9E5C', fontWeight: 600 }}>{item.benefits}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Builder Form */}
      <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 10, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 14 }}>
          "What-If" Impact Calculator &amp; Scenario Generator
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4, fontWeight: 600 }}>
              Target Catchment Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              style={{
                width: '100%',
                border: `1px solid ${borderCol}`,
                padding: '8px 12px',
                borderRadius: 6,
                background: isDark ? '#070f1f' : '#f8fafc',
                color: textCol,
                fontSize: 13,
              }}
            >
              <option>ZONE-A1 (Upper Ridge Slope)</option>
              <option>ZONE-B3 (Mid-Stream Confluence)</option>
              <option>ZONE-C2 (Agricultural Plain)</option>
              <option>ZONE-D4 (Lower Basin)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4, fontWeight: 600 }}>
              Proposed Structure / Intervention
            </label>
            <select
              value={selectedIntervention}
              onChange={(e) => setSelectedIntervention(e.target.value)}
              style={{
                width: '100%',
                border: `1px solid ${borderCol}`,
                padding: '8px 12px',
                borderRadius: 6,
                background: isDark ? '#070f1f' : '#f8fafc',
                color: textCol,
                fontSize: 13,
              }}
            >
              {INTERVENTIONS_CATALOG.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddScenario}
            style={{
              background: isDark ? '#38bdf8' : '#0e86b0',
              color: '#ffffff',
              border: 'none',
              padding: '9px 20px',
              borderRadius: 6,
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            + Add Scenario to Simulation
          </button>
        </div>
      </div>

      {/* Saved Scenarios Matrix & Bar Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        {/* Table */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 10, padding: 18 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: textCol, marginBottom: 14 }}>
            Saved Simulation Scenarios Matrix
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${borderCol}`, background: isDark ? '#070f1f' : '#f8fafc' }}>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: dimCol }}>LOCATION</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: dimCol }}>STRUCTURE</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: dimCol }}>RUNOFF REDUCTION</th>
                <th style={{ padding: '8px 10px', textAlign: 'left', color: dimCol }}>RECHARGE GAIN</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', color: dimCol }}>COST EST.</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((sc) => (
                <tr key={sc.id} style={{ borderBottom: `1px solid ${borderCol}` }}>
                  <td style={{ padding: '10px', fontWeight: 600, color: textCol }}>{sc.loc}</td>
                  <td style={{ padding: '10px', color: textCol }}>{sc.structure}</td>
                  <td style={{ padding: '10px', color: '#2E9E5C', fontWeight: 700 }}>{sc.runoffRed}</td>
                  <td style={{ padding: '10px', color: isDark ? '#38bdf8' : '#0E86B0', fontWeight: 700 }}>{sc.rechargeGain}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: textCol }}>{sc.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual Bar Comparison */}
        <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 10, padding: 18 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: textCol, marginBottom: 14 }}>
            Comparative Runoff Reduction Efficiency (%)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {scenarios.map((sc, idx) => {
              const val = parseInt(sc.runoffRed);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: textCol, marginBottom: 4 }}>
                    <span>{sc.loc} — {sc.structure}</span>
                    <span style={{ fontWeight: 700, color: '#2E9E5C' }}>{sc.runoffRed}</span>
                  </div>
                  <div style={{ height: 10, background: barTrackBg, borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${val * 1.8}%`, background: '#2E9E5C', borderRadius: 5 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default WhatIfScenarioSimulator;
