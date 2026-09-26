import React from 'react';
import type { AppTheme } from '../App';

export type NavTab = 'overview' | 'verification' | 'operations';

interface NavItem {
  id: NavTab;
  label: string;
  sublabel: string;
  badge: string;
  badgeDark: React.CSSProperties;
  badgeLight: React.CSSProperties;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview Dashboard',
    sublabel: 'Watershed Health',
    badge: 'LIVE',
    badgeDark:  { background: 'rgba(34,197,94,0.12)',  color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' },
    badgeLight: { background: 'rgba(22,163,74,0.1)',   color: '#16a34a', border: '1px solid rgba(22,163,74,0.25)' },
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'verification',
    label: 'Field Photo Check',
    sublabel: 'Photo Verification',
    badge: 'AI',
    badgeDark:  { background: 'rgba(6,182,212,0.12)',  color: '#22d3ee', border: '1px solid rgba(6,182,212,0.25)' },
    badgeLight: { background: 'rgba(8,145,178,0.1)',   color: '#0891b2', border: '1px solid rgba(8,145,178,0.25)' },
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: 'operations',
    label: 'GIS & Finance Ops',
    sublabel: 'Unified Field Module',
    badge: 'OPS',
    badgeDark:  { background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' },
    badgeLight: { background: 'rgba(99,102,241,0.1)',  color: '#6366f1', border: '1px solid rgba(99,102,241,0.2)' },
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon strokeLinecap="round" strokeLinejoin="round" points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line strokeLinecap="round" strokeLinejoin="round" x1="8" y1="2" x2="8" y2="18" />
        <line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
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
  activeTab, onTabChange, collapsed = false, onToggleCollapse,
  queueAlertCount = 0, theme, T,
}) => {
  const isDark = theme === 'dark';

  const sidebarBg     = isDark ? 'linear-gradient(180deg, #070f1f 0%, #0a1628 100%)' : '#ffffff';
  const sidebarBorder = isDark ? 'rgba(34,197,94,0.12)' : 'rgba(0,0,0,0.08)';
  const dividerColor  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.07)';
  const labelColor    = isDark ? '#1e293b'  : '#cbd5e1';
  const subTextColor  = isDark ? '#1e293b'  : '#94a3b8';
  const textActive    = isDark ? '#f1f5f9'  : '#0f172a';
  const textInactive  = isDark ? '#64748b'  : '#64748b';
  const iconActive    = isDark ? '#4ade80'  : '#16a34a';
  const iconInactive  = isDark ? '#334155'  : '#94a3b8';
  const toggleColor   = isDark ? '#334155'  : '#94a3b8';
  const footerBg      = isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)';
  const footerText    = isDark ? '#1e293b'  : '#94a3b8';
  const footerAccent  = isDark ? '#16a34a'  : '#16a34a';
  const footerMono    = isDark ? '#22d3ee'  : '#0891b2';

  return (
    <aside style={{
      width: collapsed ? 64 : 220,
      flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      background: sidebarBg,
      borderRight: `1px solid ${sidebarBorder}`,
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s ease, border-color 0.3s ease',
      zIndex: 30,
      boxShadow: isDark ? 'none' : '2px 0 12px rgba(0,0,0,0.06)',
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '14px 12px',
        borderBottom: `1px solid ${dividerColor}`,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 10, flexShrink: 0,
        transition: 'border-color 0.3s ease',
      }}>
        {!collapsed ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(6,182,212,0.1))'
                  : 'linear-gradient(135deg, rgba(22,163,74,0.12), rgba(8,145,178,0.08))',
                border: isDark ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(22,163,74,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}>
                <svg viewBox="0 0 32 32" width="18" height="18" fill="none">
                  <path d="M16 4 C16 4 9 12 9 16 C9 19.866 12.134 23 16 23 C19.866 23 23 19.866 23 16 C23 12 16 4 16 4 Z"
                    fill="url(#sbGrad)" opacity="0.9" />
                  <path d="M6 18 Q16 16.5 26 18" stroke={isDark ? '#22d3ee' : '#0891b2'} strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 22 C13 21 19 21 22 22" stroke={isDark ? '#4ade80' : '#16a34a'} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                  <defs>
                    <linearGradient id="sbGrad" x1="9" y1="4" x2="23" y2="23" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#0284c7" /><stop offset="1" stopColor={isDark ? '#22c55e' : '#16a34a'} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: 13, color: isDark ? '#f1f5f9' : '#0f172a', letterSpacing: '-0.01em', transition: 'color 0.3s ease' }}>
                    NeerDarpan
                  </span>
                  <span style={{
                    fontSize: 8, fontWeight: 800, letterSpacing: '0.08em',
                    background: isDark ? 'rgba(6,182,212,0.12)' : 'rgba(8,145,178,0.1)',
                    color: isDark ? '#22d3ee' : '#0891b2',
                    border: isDark ? '1px solid rgba(6,182,212,0.25)' : '1px solid rgba(8,145,178,0.2)',
                    padding: '2px 6px', borderRadius: 10,
                    transition: 'all 0.3s ease',
                  }}>TN</span>
                </div>
                <p style={{ fontSize: 10, color: subTextColor, fontWeight: 500, marginTop: 1, transition: 'color 0.3s ease' }}>
                  Tamil Nadu Watershed
                </p>
              </div>
            </div>

            {onToggleCollapse && (
              <button onClick={onToggleCollapse} title="Collapse"
                style={{
                  padding: 5, borderRadius: 7, cursor: 'pointer',
                  color: toggleColor, background: 'transparent', border: 'none',
                  flexShrink: 0, transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = isDark ? '#94a3b8' : '#475569')}
                onMouseLeave={e => (e.currentTarget.style.color = toggleColor)}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <button onClick={onToggleCollapse} title="Expand" style={{
            width: 34, height: 34, borderRadius: 10, cursor: 'pointer',
            background: isDark
              ? 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(6,182,212,0.08))'
              : 'linear-gradient(135deg, rgba(22,163,74,0.1), rgba(8,145,178,0.06))',
            border: isDark ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(22,163,74,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isDark ? '#4ade80' : '#16a34a',
            transition: 'all 0.3s ease',
          }}>
            <span style={{ fontWeight: 900, fontSize: 10, letterSpacing: '0.06em', fontFamily: 'monospace' }}>ND</span>
          </button>
        )}
      </div>

      {/* Nav List */}
      <div style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {!collapsed && (
          <div style={{
            padding: '4px 6px 8px',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: labelColor,
            transition: 'color 0.3s ease',
          }}>
            Main Menu
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const badgeStyle = isDark ? item.badgeDark : item.badgeLight;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={isActive ? 'nav-item nav-item-active' : 'nav-item'}
                style={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '10px' : '10px 12px',
                }}
              >
                {/* Icon */}
                <div style={{
                  flexShrink: 0, position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 20, height: 20,
                  color: isActive ? iconActive : iconInactive,
                  transition: 'color 0.2s',
                }}>
                  {item.icon}
                  {queueAlertCount > 0 && item.id === 'verification' && (
                    <span style={{
                      position: 'absolute', top: -5, right: -6,
                      width: 14, height: 14, borderRadius: '50%',
                      background: '#ef4444', border: `2px solid ${isDark ? '#070f1f' : '#ffffff'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 7, fontWeight: 900, color: '#fff',
                    }}>
                      {queueAlertCount > 9 ? '9+' : queueAlertCount}
                    </span>
                  )}
                </div>

                {/* Label */}
                {!collapsed && (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                      <span style={{
                        fontSize: 12, fontWeight: isActive ? 700 : 500,
                        color: isActive ? textActive : textInactive,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        transition: 'color 0.2s',
                      }}>
                        {item.label}
                      </span>
                      <span style={{
                        ...badgeStyle,
                        fontSize: 8, fontWeight: 800, letterSpacing: '0.08em',
                        padding: '2px 6px', borderRadius: 10, flexShrink: 0,
                        transition: 'all 0.3s ease',
                      }}>
                        {item.badge}
                      </span>
                    </div>
                    <p style={{
                      fontSize: 10, color: subTextColor,
                      marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      transition: 'color 0.3s ease',
                    }}>
                      {item.sublabel}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 8px',
        borderTop: `1px solid ${dividerColor}`,
        flexShrink: 0,
        background: footerBg,
        transition: 'all 0.3s ease',
      }}>
        {!collapsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '4px 6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: footerText, fontWeight: 500 }}>Basin Grid</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: footerAccent }}>Cauvery &amp; Vaigai</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 9, color: footerText }}>Sentinel-2 MSI</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: footerMono, fontFamily: 'JetBrains Mono, monospace' }}>10m Res</span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="status-dot status-dot-green animate-pulse-glow" style={{ width: 8, height: 8 }} />
          </div>
        )}
      </div>
    </aside>
  );
};

export default NavigationSidebar;
