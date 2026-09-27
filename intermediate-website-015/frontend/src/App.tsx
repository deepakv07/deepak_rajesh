import { useState } from 'react';
import Header from './components/Header';
import NavigationSidebar, { type NavTab } from './components/NavigationSidebar';

// Module Components
import OverviewDashboard from './components/OverviewDashboard/OverviewDashboard';
import FieldEvidenceIngestion from './components/FieldEvidenceIngestion/FieldEvidenceIngestion';
import OperationsAndFinanceModule from './components/OperationsAndFinanceModule/OperationsAndFinanceModule';

// WATERSCOPE Modules
import WatershedGISExplorer from './components/Waterscope/WatershedGISExplorer';
import ThematicAnalysisWorkspace from './components/Waterscope/ThematicAnalysisWorkspace';
import TemporalChangeDetection from './components/Waterscope/TemporalChangeDetection';
import FieldVerificationWorkspace from './components/Waterscope/FieldVerificationWorkspace';
import GeoPhotoIntelligence from './components/Waterscope/GeoPhotoIntelligence';
import PhotoFootprintAnalysis from './components/Waterscope/PhotoFootprintAnalysis';
import SubPixelCalibration from './components/Waterscope/SubPixelCalibration';
import GroundSatelliteEvidence from './components/Waterscope/GroundSatelliteEvidence';
import EvidenceReliabilityMap from './components/Waterscope/EvidenceReliabilityMap';
import InterventionMonitoring from './components/Waterscope/InterventionMonitoring';
import AssessmentReports from './components/Waterscope/AssessmentReports';
import DataAndSources from './components/Waterscope/DataAndSources';
import AICopilotDrawer from './components/Waterscope/AICopilotDrawer';
import JudgesTourModal from './components/Waterscope/JudgesTourModal';

// Master AI Prompt Modules
import WatershedHealthAnalytics from './components/Waterscope/WatershedHealthAnalytics';
import PriorityZonesClassification from './components/Waterscope/PriorityZonesClassification';
import WhatIfScenarioSimulator from './components/Waterscope/WhatIfScenarioSimulator';
import SpatialVisionAssistant from './components/Waterscope/SpatialVisionAssistant';

export type AppTheme = 'dark' | 'light';

interface Task {
  id: string;
  loc: string;
  issue: string;
  priority: string;
  status: 'pending' | 'verified' | 'conflict' | 'more';
}

const INITIAL_TASKS: Task[] = [
  { id: '#024', loc: '12.9812, 80.1247', issue: 'Vegetation decline', priority: 'High', status: 'verified' },
  { id: '#025', loc: '12.9701, 80.1390', issue: 'Water-body shrinkage', priority: 'High', status: 'conflict' },
  { id: '#026', loc: '12.9655, 80.1108', issue: 'Land-cover change', priority: 'Medium', status: 'pending' },
  { id: '#027', loc: '12.9583, 80.1502', issue: 'Drainage obstruction', priority: 'Medium', status: 'verified' },
  { id: '#028', loc: '12.9490, 80.1215', issue: 'Bare-soil expansion', priority: 'Low', status: 'more' },
  { id: '#029', loc: '12.9740, 80.1050', issue: 'Vegetation decline', priority: 'High', status: 'pending' },
];

function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [theme, setTheme] = useState<AppTheme>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Overlays & Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Dynamic Tasks State
  const [tasksList, setTasksList] = useState<Task[]>(INITIAL_TASKS);

  const isDark = theme === 'dark';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCreateTask = (newTask: { id: string; loc: string; issue: string; priority: string; status: string }) => {
    setTasksList((prev) => [newTask as Task, ...prev]);
    showToast(`Field verification task ${newTask.id} created and assigned.`);
    setActiveTab('verification');
  };

  const handleRequestVerification = (areaId: string) => {
    const taskId = `#0${30 + tasksList.length}`;
    setTasksList((prev) => [
      { id: taskId, loc: `Area ${areaId}`, issue: 'Reliability follow-up', priority: 'Medium', status: 'pending' },
      ...prev,
    ]);
    showToast(`Field verification task ${taskId} created for Area ${areaId}.`);
    setActiveTab('verification');
  };

  /* ── Derived theme tokens ── */
  const T = isDark
    ? {
        chromeBg: 'linear-gradient(180deg, #070f1f 0%, #0a1628 100%)',
        chromeBorder: 'rgba(34,197,94,0.15)',
        tickerBg: 'rgba(34,197,94,0.06)',
        tickerBorder: 'rgba(34,197,94,0.1)',
        tickerText: '#4ade80',
        contentBg: '#040b18',
        modeBg: 'rgba(7,15,31,0.9)',
        modeBorder: 'rgba(255,255,255,0.05)',
        modeLabel: '#94a3b8',
      }
    : {
        chromeBg: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        chromeBorder: 'rgba(22,163,74,0.2)',
        tickerBg: 'rgba(22,163,74,0.06)',
        tickerBorder: 'rgba(22,163,74,0.12)',
        tickerText: '#15803d',
        contentBg: '#f0f4f8',
        modeBg: '#ffffff',
        modeBorder: 'rgba(0,0,0,0.07)',
        modeLabel: '#64748b',
      };

  return (
    <div
      data-theme={theme}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: T.contentBg,
        transition: 'background 0.3s ease',
      }}
    >
      {/* Global Header */}
      <Header
        theme={theme}
        T={T}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onStartTour={() => setIsTourOpen(true)}
        onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        onToast={showToast}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: 70,
            right: 24,
            background: isDark ? '#0a1628' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(34,197,94,0.3)' : '#2e9e5c'}`,
            borderLeft: '4px solid #2e9e5c',
            padding: '12px 20px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            color: isDark ? '#f1f5f9' : '#0b2942',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 150,
          }}
        >
          ✓ {toastMessage}
        </div>
      )}

      {/* Main App Body Layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Navigation Sidebar */}
        <NavigationSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          queueAlertCount={tasksList.filter((t) => t.status === 'pending').length}
          theme={theme}
          T={T}
        />

        {/* Main Content Workspace */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: T.contentBg }}>
          {/* Mode Switcher Bar */}
          <div
            style={{
              background: T.modeBg,
              borderBottom: `1px solid ${T.modeBorder}`,
              padding: '8px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: T.modeLabel, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Theme Mode:
              </span>
              <div style={{ display: 'flex', gap: 6, background: isDark ? 'rgba(0,0,0,0.3)' : '#eef3f7', padding: 3, borderRadius: 6 }}>
                <button
                  onClick={() => setTheme('dark')}
                  style={{
                    background: isDark ? '#38bdf8' : 'transparent',
                    color: isDark ? '#070f1f' : '#5b7185',
                    border: 'none',
                    padding: '4px 12px',
                    borderRadius: 4,
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🛰️ Dark Telemetry Mode
                </button>
                <button
                  onClick={() => setTheme('light')}
                  style={{
                    background: !isDark ? '#ffffff' : 'transparent',
                    color: !isDark ? '#0b2942' : '#94a3b8',
                    border: 'none',
                    padding: '4px 12px',
                    borderRadius: 4,
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: !isDark ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  🌿 NeerDarpan Light Mode
                </button>
              </div>
            </div>

            <div style={{ fontSize: 11, color: T.modeLabel, fontFamily: 'monospace' }} className="hidden sm:block">
              WATERSCOPE SIH26015 · Ground–Satellite Evidence Integration Node
            </div>
          </div>

          {/* Tab Views Router */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {activeTab === 'overview' && <OverviewDashboard theme={theme} />}

            {activeTab === 'health' && <WatershedHealthAnalytics theme={theme} />}

            {activeTab === 'gis' && <WatershedGISExplorer theme={theme} />}

            {activeTab === 'thematic' && <ThematicAnalysisWorkspace theme={theme} />}

            {activeTab === 'change' && (
              <TemporalChangeDetection theme={theme} onCreateTask={handleCreateTask} />
            )}

            {activeTab === 'priority' && (
              <PriorityZonesClassification
                theme={theme}
                onRequestAction={() => setActiveTab('scenarios')}
              />
            )}

            {activeTab === 'scenarios' && <WhatIfScenarioSimulator theme={theme} />}

            {activeTab === 'verification' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
                <FieldVerificationWorkspace
                  theme={theme}
                  tasksList={tasksList}
                  onOpenPhoto={() => setActiveTab('photo')}
                  onSubmitEvidence={() => showToast('Field evidence submitted successfully (demo).')}
                />
                <FieldEvidenceIngestion
                  theme={theme}
                  onNavigateToMap={() => setActiveTab('gis')}
                />
              </div>
            )}

            {activeTab === 'photo' && <GeoPhotoIntelligence theme={theme} />}

            {activeTab === 'footprint' && <PhotoFootprintAnalysis theme={theme} />}

            {activeTab === 'vision' && <SpatialVisionAssistant theme={theme} />}

            {activeTab === 'subpixel' && <SubPixelCalibration theme={theme} />}

            {activeTab === 'evidence' && <GroundSatelliteEvidence theme={theme} />}

            {activeTab === 'reliability' && (
              <EvidenceReliabilityMap theme={theme} onRequestVerification={handleRequestVerification} />
            )}

            {activeTab === 'operations' && <OperationsAndFinanceModule theme={theme} />}

            {activeTab === 'interventions' && <InterventionMonitoring theme={theme} />}

            {activeTab === 'reports' && <AssessmentReports theme={theme} onToast={showToast} />}

            {activeTab === 'sources' && <DataAndSources theme={theme} />}
          </div>
        </div>
      </div>

      {/* Grounded AI Copilot Slide-out Drawer */}
      <AICopilotDrawer
        theme={theme}
        isOpen={isCopilotOpen}
        onToggle={() => setIsCopilotOpen(!isCopilotOpen)}
      />

      {/* Judge's Guided Tour Overlay Modal */}
      <JudgesTourModal
        theme={theme}
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={(t) => setActiveTab(t)}
      />
    </div>
  );
}

export default App;
