import React from 'react';
import type { AppTheme } from '../App';

export type NavTab =
  | 'overview'
  | 'health'
  | 'gis'
  | 'thematic'
  | 'change'
  | 'priority'
  | 'scenarios'
  | 'tasks'
  | 'photo'
  | 'footprint'
  | 'vision'
  | 'subpixel'
  | 'evidence'
  | 'reliability'
  | 'interventions'
  | 'reports'
  | 'sources'
  | 'verification'
  | 'operations';

interface NavItem {
  id: NavTab;
  label: string;
  sublabel: string;
  badge?: string;
  badgeDark?: React.CSSProperties;
  badgeLight?: React.CSSProperties;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Monitor & Health',
    items: [
      { id: 'overview', label: 'Overview', sublabel: 'Watershed status at a glance', badge: 'LIVE', badgeDark: { background: 'rgba(34,197,94,0.12)', color: '#4ade80' }, badgeLight: { background: '#E7F6ED', color: '#2E9E5C' } },
      { id: 'health', label: 'Health Index', sublabel: 'Radial gauge & sub-indicators', badge: '71/100', badgeDark: { background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }, badgeLight: { background: '#E6F4F9', color: '#0E86B0' } },
      { id: 'gis', label: 'Watershed GIS', sublabel: 'Layers, boundaries & vector assets' },
      { id: 'thematic', label: 'Thematic Analysis', sublabel: 'LULC, vegetation, water, drainage' },
      { id: 'change', label: 'Change Detection', sublabel: 'Compare conditions across dates' },
    ],
  },
  {
    label: 'Planning & Simulation',
    items: [
      { id: 'priority', label: 'Priority Zones', sublabel: 'Catchment risk & recommendations', badge: 'AI', badgeDark: { background: 'rgba(239,68,68,0.15)', color: '#f87171' }, badgeLight: { background: '#FBEAE8', color: '#D2483E' } },
      { id: 'scenarios', label: 'What-If Scenarios', sublabel: 'Simulation & impact matrix' },
    ],
  },
  {
    label: 'Field Evidence & Vision',
    items: [
      { id: 'verification', label: 'Field Verification', sublabel: 'Task workflow & submissions' },
      { id: 'photo', label: 'Geo-Photo Intelligence', sublabel: 'Field photographs & metadata' },
      { id: 'footprint', label: 'Photo Footprint', sublabel: 'Terrain-aware viewing area' },
      { id: 'vision', label: 'AI Vision Assistant', sublabel: 'ML photo classifier & actions', badge: 'NEW', badgeDark: { background: 'rgba(168,85,247,0.15)', color: '#c084fc' }, badgeLight: { background: '#F3E8FF', color: '#9333EA' } },
    ],
  },
  {
    label: 'Scientific Analysis',
    items: [
      { id: 'subpixel', label: 'Sub-Pixel Calibration', sublabel: 'Photo vs mixed satellite pixel', badge: 'FLAGSHIP', badgeDark: { background: 'rgba(168,85,247,0.15)', color: '#c084fc' }, badgeLight: { background: '#F3E8FF', color: '#9333EA' } },
      { id: 'evidence', label: 'Ground–Sat Evidence', sublabel: 'Integrated field & satellite state' },
      { id: 'reliability', label: 'Reliability Map', sublabel: 'Evidence-weighted uncertainty' },
    ],
  },
  {
    label: 'Management & Ops',
    items: [
      { id: 'operations', label: 'GIS & Financial Ops', sublabel: 'Field Ops & DoLR Disbursal', badge: 'OPS', badgeDark: { background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }, badgeLight: { background: '#EEF2FF', color: '#4F46E5' } },
      { id: 'interventions', label: 'Interventions', sublabel: 'Structures & outcomes' },
      { id: 'reports', label: 'Reports', sublabel: 'Generate watershed assessment' },
      { id: 'sources', label: 'Data & Sources', sublabel: 'Datasets used in SIH26015' },
    ],
  },
];

interface NavigationSidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  queueAlertCount?: number;
  theme: AppTheme;
  T: Record<string, string>;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  onTabChange,
  collapsed = false,
  onToggleCollapse,
  queueAlertCount = 0,
  theme,
}) => {
  const isDark = theme === 'dark';

  const sidebarBg = isDark ? 'linear-gradient(180deg, #070f1f 0%, #0a1628 100%)' : '#ffffff';
  const sidebarBorder = isDark ? 'rgba(34,197,94,0.12)' : 'rgba(0,0,0,0.08)';
  const dividerColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)';
  const labelColor = isDark ? '#475569' : '#94a3b8';
  const subTextColor = isDark ? '#64748b' : '#64748b';
  const textActive = isDark ? '#38bdf8' : '#0b688a';
  const textInactive = isDark ? '#cbd5e1' : '#0b2942';

  return (
    <aside
      style={{
        width: collapsed ? 64 : 240,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: sidebarBg,
        borderRight: `1px solid ${sidebarBorder}`,
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s ease',
        zIndex: 30,
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: `1px solid ${dividerColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 10,
          flexShrink: 0,
        }}
      >
        {!collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9',
                  border: `1px solid ${isDark ? 'rgba(56,189,248,0.3)' : 'rgba(14,134,176,0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 14 }}>🛰️</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 900, fontSize: 14, color: isDark ? '#f1f5f9' : '#0f172a' }}>
                    WATERSCOPE
                  </span>
                  <span
                    style={{
                      fontSize: 8.5,
                      fontWeight: 800,
                      background: isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9',
                      color: isDark ? '#38bdf8' : '#0e86b0',
                      padding: '1px 5px',
                      borderRadius: 6,
                    }}
                  >
                    SIH26015
                  </span>
                </div>
                <p style={{ fontSize: 9.5, color: subTextColor, margin: 0 }}>
                  GIS &amp; Geo-Evidence Portal
                </p>
              </div>
            </div>

            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                title="Collapse"
                style={{ background: 'none', border: 'none', color: labelColor, cursor: 'pointer', fontSize: 12 }}
              >
                ◀
              </button>
            )}
          </>
        ) : (
          <button
            onClick={onToggleCollapse}
            title="Expand"
            style={{ background: 'none', border: 'none', color: isDark ? '#38bdf8' : '#0e86b0', cursor: 'pointer', fontSize: 14, fontWeight: 900 }}
          >
            ▶
          </button>
        )}
      </div>

      {/* Nav List */}
      <div style={{ flex: 1, padding: '10px 8px' }}>
        {NAV_GROUPS.map((group, gIdx) => (
          <div key={gIdx} style={{ marginBottom: 12 }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: labelColor,
                  padding: '8px 10px 4px',
                }}
              >
                {group.label}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {group.items.map((item) => {
                const isActive = activeTab === item.id;
                const badgeStyle = isDark ? item.badgeDark : item.badgeLight;

                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    title={collapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      textAlign: 'left',
                      padding: collapsed ? '10px' : '8px 10px',
                      borderRadius: 6,
                      background: isActive ? (isDark ? 'rgba(56,189,248,0.12)' : '#e6f4f9') : 'transparent',
                      borderLeft: isActive ? `3px solid ${isDark ? '#38bdf8' : '#0e86b0'}` : '3px solid transparent',
                      borderTop: 'none',
                      borderRight: 'none',
                      borderBottom: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                    }}
                  >
                    {!collapsed ? (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                          <span
                            style={{
                              fontSize: 12.5,
                              fontWeight: isActive ? 700 : 500,
                              color: isActive ? textActive : textInactive,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.label}
                          </span>

                          {item.badge && (
                            <span
                              style={{
                                ...badgeStyle,
                                fontSize: 8,
                                fontWeight: 800,
                                padding: '1px 5px',
                                borderRadius: 8,
                                flexShrink: 0,
                              }}
                            >
                              {item.badge}
                            </span>
                          )}

                          {queueAlertCount > 0 && item.id === 'verification' && (
                            <span
                              style={{
                                background: '#ef4444',
                                color: '#fff',
                                borderRadius: '50%',
                                width: 14,
                                height: 14,
                                fontSize: 8,
                                fontWeight: 900,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {queueAlertCount}
                            </span>
                          )}
                        </div>
                        <p
                          style={{
                            fontSize: 10,
                            color: subTextColor,
                            margin: '1px 0 0',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.sublabel}
                        </p>
                      </div>
                    ) : (
                      <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? textActive : textInactive }}>
                        {item.label.substring(0, 2)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Status */}
      <div
        style={{
          padding: '10px 14px',
          borderTop: `1px solid ${dividerColor}`,
          fontSize: 10,
          color: labelColor,
        }}
      >
        {!collapsed ? (
          <div>
            <div style={{ fontWeight: 700, color: isDark ? '#4ade80' : '#2e9e5c', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2e9e5c' }} />
              WATERSCOPE READY
            </div>
            <div style={{ marginTop: 2 }}>Tamil Nadu Node · SIH26015</div>
          </div>
        ) : (
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2e9e5c', display: 'block', margin: '0 auto' }} />
        )}
      </div>
    </aside>
  );
};

export default NavigationSidebar;
