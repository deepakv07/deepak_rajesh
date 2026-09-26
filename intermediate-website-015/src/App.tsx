import { useRef, useState } from 'react';
import AnalysisCard from './components/AnalysisCard';
import EvidenceIngestionPanel from './components/EvidenceIngestionPanel';
import Header from './components/Header';
import SidebarStats from './components/SidebarStats';
import NavigationSidebar, { type NavTab } from './components/NavigationSidebar';
import OverviewDashboard from './components/OverviewDashboard/OverviewDashboard';
import FieldEvidenceIngestion from './components/FieldEvidenceIngestion/FieldEvidenceIngestion';
import ExecutiveOverviewDashboard from './components/OverviewDashboard/ExecutiveOverviewDashboard';
import OperationsAndFinanceModule from './components/OperationsAndFinanceModule/OperationsAndFinanceModule';

export type AppTheme = 'dark' | 'light';

interface SubmittedData {
  photo: string;
  gps: { lat: string; lng: string };
}

const ALERT_COUNT = 1;

const BREADCRUMB: Record<NavTab, string> = {
  overview:     'Overview Dashboard — Tamil Nadu Basin Watch',
  verification: 'Field Photo Check & Cross-Validation',
  operations:   'GIS Operations & Financial Reports',
};

function App() {
  const [activeTab, setActiveTab]         = useState<NavTab>('overview');
  const [theme, setTheme]                 = useState<AppTheme>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [submitted, setSubmitted]         = useState<SubmittedData | null>(null);
  const [isLoading, setIsLoading]         = useState(false);
  const [prefillGps, setPrefillGps]       = useState<{ lat: string; lng: string } | null>(null);
  const verificationScrollRef             = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  const handleSubmit = (photo: string | null, gps: { lat: string; lng: string }) => {
    setIsLoading(true);
    setSubmitted(null);
    setTimeout(() => {
      setSubmitted({ photo: photo || '/check_dam.jpg', gps });
      setIsLoading(false);
      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 2800);
  };

  /* ─── Derived theme tokens (for inline-styled chrome) ── */
  const T = isDark ? {
    chromeBg:       'linear-gradient(180deg, #070f1f 0%, #0a1628 100%)',
    chromeBorder:   'rgba(34,197,94,0.15)',
    tickerBg:       'rgba(34,197,94,0.06)',
    tickerBorder:   'rgba(34,197,94,0.1)',
    tickerText:     '#4ade80',
    breadBg:        'rgba(7,15,31,0.95)',
    breadBorder:    'rgba(255,255,255,0.05)',
    breadLabel:     '#334155',
    breadAccent:    '#22c55e',
    pillBg:         'rgba(255,255,255,0.03)',
    pillBorder:     'rgba(255,255,255,0.06)',
    pillText:       '#475569',
    modeBg:         'rgba(7,15,31,0.9)',
    modeBorder:     'rgba(255,255,255,0.05)',
    modeLabel:      '#334155',
    modeRight:      '#334155',
    contentBg:      '#040b18',
  } : {
    chromeBg:       'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    chromeBorder:   'rgba(22,163,74,0.2)',
    tickerBg:       'rgba(22,163,74,0.06)',
    tickerBorder:   'rgba(22,163,74,0.12)',
    tickerText:     '#15803d',
    breadBg:        '#ffffff',
    breadBorder:    'rgba(0,0,0,0.07)',
    breadLabel:     '#94a3b8',
    breadAccent:    '#16a34a',
    pillBg:         '#f8fafc',
    pillBorder:     'rgba(0,0,0,0.08)',
    pillText:       '#64748b',
    modeBg:         '#f8fafc',
    modeBorder:     'rgba(0,0,0,0.07)',
    modeLabel:      '#94a3b8',
    modeRight:      '#94a3b8',
    contentBg:      '#f0f4f8',
  };

  return (
    <div
      data-theme={theme}
      style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: T.contentBg, transition: 'background 0.3s ease' }}
    >
      <Header theme={theme} T={T} />

      {/* Breadcrumb Bar */}
      <div style={{
        background: T.breadBg,
        borderBottom: `1px solid ${T.breadBorder}`,
        padding: '6px 20px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.breadLabel }}>NeerDarpan</span>
          <span style={{ color: T.breadLabel, fontSize: 11 }}>›</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: T.breadAccent }}>{BREADCRUMB[activeTab]}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: T.pillBg, border: `1px solid ${T.pillBorder}`,
            borderRadius: 16, padding: '4px 10px',
          }}>
            <span className="status-dot status-dot-green" style={{ width: 5, height: 5 }} />
            <span style={{ fontSize: 10, color: T.pillText, fontWeight: 500 }}>
              Cauvery Delta &amp; Vaigai · Thanjavur &amp; Madurai, TN
            </span>
          </div>
          <span style={{
            fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', padding: '3px 9px',
            borderRadius: 10, fontFamily: 'JetBrains Mono, monospace',
            background: isDark ? 'rgba(6,182,212,0.1)' : 'rgba(8,145,178,0.1)',
            border: isDark ? '1px solid rgba(6,182,212,0.2)' : '1px solid rgba(8,145,178,0.2)',
            color: isDark ? '#22d3ee' : '#0891b2',
          }}>
            TN-WDC 2.0
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <NavigationSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          queueAlertCount={ALERT_COUNT}
          theme={theme}
          T={T}
        />

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: T.contentBg, transition: 'background 0.3s ease' }}>

          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Mode Bar */}
              <div style={{
                background: T.modeBg, borderBottom: `1px solid ${T.modeBorder}`,
                padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0, transition: 'background 0.3s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.modeLabel, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Dashboard View:
                  </span>
                  <div className="tab-bar">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`tab-btn ${isDark ? 'tab-btn-active' : ''}`}
                    >
                      🛰️ Dark Telemetry Mode
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`tab-btn ${!isDark ? 'tab-btn-active' : ''}`}
                    >
                      🌿 NeerDarpan Pure White
                    </button>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: T.modeRight }} className="hidden sm:block">
                  Tamil Nadu Geospatial Node · Cauvery &amp; Vaigai Basins
                </span>
              </div>

              {isDark ? (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <OverviewDashboard />
                </div>
              ) : (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <ExecutiveOverviewDashboard
                    onNavigateToMap={() => setActiveTab('operations')}
                    onNavigateToQueue={() => setActiveTab('operations')}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── Field Verification ── */}
          {activeTab === 'verification' && (
            <div ref={verificationScrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {/* Mode Bar */}
              <div style={{
                background: T.modeBg, borderBottom: `1px solid ${T.modeBorder}`,
                padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0, transition: 'background 0.3s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.modeLabel, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Interface View:
                  </span>
                  <div className="tab-bar">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`tab-btn ${isDark ? 'tab-btn-active' : ''}`}
                    >
                      🛰️ Dark GIS Mode
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`tab-btn ${!isDark ? 'tab-btn-active' : ''}`}
                    >
                      🌱 NeerDarpan Light Mode
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: T.modeLabel, fontFamily: 'JetBrains Mono, monospace' }} className="hidden sm:block">
                  Step 01 / AI Classification &amp; WRIS Delineation
                </div>
              </div>

              <div className="flex-1 overflow-y-auto" style={{ background: T.contentBg, transition: 'background 0.3s ease' }}>
                <FieldEvidenceIngestion
                  theme={theme}
                  initialGps={prefillGps ?? undefined}
                  onNavigateToMap={() => setActiveTab('operations')}
                />
              </div>
            </div>
          )}

          {/* ── Operations & Finance ── */}
          {activeTab === 'operations' && (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Mode Bar */}
              <div style={{
                background: T.modeBg, borderBottom: `1px solid ${T.modeBorder}`,
                padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0, transition: 'background 0.3s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: T.modeLabel, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Interface View:
                  </span>
                  <div className="tab-bar">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`tab-btn ${isDark ? 'tab-btn-active' : ''}`}
                    >
                      🛰️ Dark Operations Mode
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`tab-btn ${!isDark ? 'tab-btn-active' : ''}`}
                    >
                      🌱 NeerDarpan Light Mode
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: T.modeLabel, fontFamily: 'JetBrains Mono, monospace' }} className="hidden sm:block">
                  Step 03 / GIS Operations &amp; DoLR Financial Disbursal
                </div>
              </div>

              <OperationsAndFinanceModule theme={theme} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

interface ProcessingStepProps { label: string; delay: number; isDark: boolean; }
const ProcessingStep = ({ label, delay, isDark }: ProcessingStepProps) => {
  const [done, setDone] = useState(false);
  useState(() => {
    const t = setTimeout(() => setDone(true), delay + 400);
    return () => clearTimeout(t);
  });
  const green = isDark ? '#4ade80' : '#16a34a';
  const cyan  = isDark ? '#22d3ee' : '#0891b2';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {done
        ? <svg viewBox="0 0 24 24" width="13" height="13" style={{ fill: green }}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        : <div style={{ width: 13, height: 13, borderRadius: '50%', border: `1.5px solid var(--border-glass)`, borderTopColor: cyan }} className="animate-spin" />
      }
      <span style={{ fontSize: 11, color: done ? green : 'var(--text-muted)' }}>{label}</span>
    </div>
  );
};

export default App;
