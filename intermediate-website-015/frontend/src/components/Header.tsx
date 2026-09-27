import { useEffect, useState } from 'react';
import type { AppTheme } from '../App';
import type { NavTab } from './NavigationSidebar';

interface HeaderProps {
  theme: AppTheme;
  T: Record<string, string>;
  onNavigateTab?: (tab: NavTab) => void;
  onStartTour?: () => void;
  onToggleCopilot?: () => void;
  onToast?: (msg: string) => void;
}

const searchIndex = [
  { t: 'Geo-Coded Photo #024', s: 'Trust Score 0.91 · Task #024', tab: 'photo' as NavTab },
  { t: 'Task #025 — Water-body shrinkage', s: 'Conflicting evidence', tab: 'verification' as NavTab },
  { t: 'Intervention WD-021 — Check Dam', s: 'Field Verified', tab: 'interventions' as NavTab },
  { t: 'Zone-024 — Vegetation decline', s: 'Requires field verification', tab: 'change' as NavTab },
  { t: 'Demo Watershed — Kancheepuram', s: '2,860 ha · 8 sub-watersheds', tab: 'overview' as NavTab },
];

const Header = ({
  theme,
  T,
  onNavigateTab,
  onStartTour,
  onToggleCopilot,
  onToast,
}: HeaderProps) => {
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedWatershed, setSelectedWatershed] = useState('Demo Watershed — Kancheepuram, Tamil Nadu');
  const [selectedRole, setSelectedRole] = useState('Watershed Officer');

  const isDark = theme === 'dark';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString('en-IN', { hour12: false });
  const dateStr = time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const filteredSearch = searchQuery.trim()
    ? searchIndex.filter((r) => r.t.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  return (
    <header
      style={{
        background: T.chromeBg,
        borderBottom: `1px solid ${T.chromeBorder}`,
        boxShadow: isDark
          ? '0 1px 0 rgba(34,197,94,0.08), 0 4px 24px rgba(0,0,0,0.4)'
          : '0 1px 0 rgba(22,163,74,0.1), 0 2px 12px rgba(0,0,0,0.06)',
        flexShrink: 0,
        transition: 'background 0.3s ease',
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* Top Ticker Bar */}
      <div
        style={{
          background: T.tickerBg,
          borderBottom: `1px solid ${T.tickerBorder}`,
          padding: '4px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 10.5,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ color: T.tickerText, fontWeight: 700, fontFamily: 'monospace' }}>
              WATERSCOPE SIH26015 · Tamil Nadu Watershed Geo-Evidence Platform
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span style={{ color: dimCol }}>NODE: TN-NODE-CHNAI</span>
            <span style={{ color: isDark ? '#38bdf8' : '#0e86b0', fontWeight: 600 }}>Sentinel-2 Sync Active</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'monospace' }}>
          <span style={{ color: dimCol }}>{dateStr}</span>
          <span style={{ color: T.tickerText, fontWeight: 700 }}>{timeStr} IST</span>
        </div>
      </div>

      {/* Main Header Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px', gap: 12 }}>
        {/* Brand & Watershed Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🛰️</span>
            <b style={{ fontSize: 16, fontWeight: 900, color: textCol }}>WATERSCOPE</b>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                background: isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9',
                color: isDark ? '#38bdf8' : '#0e86b0',
                padding: '2px 6px',
                borderRadius: 10,
              }}
            >
              SIH26015
            </span>
          </div>

          <div className="hidden lg:block">
            <select
              value={selectedWatershed}
              onChange={(e) => {
                setSelectedWatershed(e.target.value);
                if (onToast) onToast('Watershed switched (demo data reloaded).');
              }}
              style={{
                border: `1px solid ${borderCol}`,
                background: cardBg,
                color: textCol,
                padding: '6px 10px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <option>Demo Watershed — Kancheepuram, Tamil Nadu</option>
              <option>Sub-watershed A (Vandalur Catchment)</option>
              <option>Sub-watershed B (Chembarambakkam Grid)</option>
              <option>Test Watershed — Madurai North</option>
            </select>
          </div>
        </div>

        {/* Global Search & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input
              placeholder="Search features, photos, tasks…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              style={{
                width: 200,
                border: `1px solid ${borderCol}`,
                background: cardBg,
                color: textCol,
                padding: '6px 10px',
                borderRadius: 6,
                fontSize: 12,
              }}
            />

            {isSearchOpen && searchQuery.trim() && (
              <div
                style={{
                  position: 'absolute',
                  top: 36,
                  left: 0,
                  width: 280,
                  background: cardBg,
                  border: `1px solid ${borderCol}`,
                  borderRadius: 6,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  zIndex: 100,
                  overflow: 'hidden',
                }}
              >
                {filteredSearch.length > 0 ? (
                  filteredSearch.map((r, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (onNavigateTab) onNavigateTab(r.tab);
                        setIsSearchOpen(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        borderBottom: `1px solid ${borderCol}`,
                        cursor: 'pointer',
                        fontSize: 12,
                        color: textCol,
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{r.t}</div>
                      <div style={{ fontSize: 10.5, color: dimCol }}>{r.s}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '10px 12px', fontSize: 11.5, color: dimCol }}>
                    No matching demo features found.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Icon Quick Buttons */}
          <button
            title="Reports"
            onClick={() => onNavigateTab && onNavigateTab('reports')}
            style={{
              background: cardBg,
              border: `1px solid ${borderCol}`,
              color: textCol,
              padding: '6px 10px',
              borderRadius: 6,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            🧾 Reports
          </button>

          <button
            title="Judge's Tour"
            onClick={() => onStartTour && onStartTour()}
            style={{
              background: isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9',
              border: `1px solid ${isDark ? 'rgba(56,189,248,0.3)' : 'rgba(14,134,176,0.2)'}`,
              color: isDark ? '#38bdf8' : '#0e86b0',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🎯 Judge's Tour
          </button>

          <button
            title="AI Copilot"
            onClick={() => onToggleCopilot && onToggleCopilot()}
            style={{
              background: isDark ? '#38bdf8' : '#0e86b0',
              border: 'none',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🛰️ Copilot
          </button>

          {/* Role selector */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{
              border: `1px solid ${borderCol}`,
              background: cardBg,
              color: textCol,
              padding: '6px 10px',
              borderRadius: 6,
              fontSize: 12,
            }}
          >
            <option>Watershed Officer</option>
            <option>Field Officer</option>
            <option>GIS / Analyst</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
