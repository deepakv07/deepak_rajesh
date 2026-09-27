import React, { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type SubTab = 'financials' | 'reports';
type GpStatus = 'cleared' | 'partial' | 'on_hold';

interface CategoryCard {
  id: string;
  name: string;
  icon: string;
  structures: number;
  sanctioned: number; // lakhs
  disbursed: number;  // lakhs
  accentBg: string;
  accentBorder: string;
  accentIcon: string;
}

interface GpDisbursement {
  name: string;
  district: string;
  sanctioned: number;
  disbursed: number;
  structures: number;
  utilization: number;
  status: GpStatus;
  tranche: string;
}

// ─── Static Data ─────────────────────────────────────────────────────────────
const CATEGORY_CARDS: CategoryCard[] = [
  {
    id: 'check_dam',
    name: 'Check Dams',
    icon: '💧',
    structures: 18,
    sanctioned: 12.4,
    disbursed: 11.8,
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
    accentIcon: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'contour_trench',
    name: 'Contour Trenches',
    icon: '🌱',
    structures: 14,
    sanctioned: 7.2,
    disbursed: 6.5,
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    accentIcon: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'farm_pond',
    name: 'Farm Ponds',
    icon: '🌾',
    structures: 12,
    sanctioned: 6.8,
    disbursed: 6.1,
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    accentIcon: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'nala_bund',
    name: 'Nala Bunds',
    icon: '🪨',
    structures: 8,
    sanctioned: 4.4,
    disbursed: 4.0,
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    accentIcon: 'bg-orange-100 text-orange-700',
  },
];

const GP_DISBURSEMENTS: GpDisbursement[] = [
  { name: 'Kolyari GP',  district: 'Udaipur, RJ',    sanctioned: 9.2,  disbursed: 9.2,  structures: 16, utilization: 100, status: 'cleared',  tranche: 'T1 + T2 Released' },
  { name: 'Bakarol GP',  district: 'Anand, GJ',      sanctioned: 8.6,  disbursed: 8.0,  structures: 14, utilization: 93,  status: 'cleared',  tranche: 'T1 + T2 Released' },
  { name: 'Malviya GP',  district: 'Khargone, MP',   sanctioned: 7.4,  disbursed: 6.1,  structures: 12, utilization: 82,  status: 'partial',  tranche: 'T1 Released, T2 Pending' },
  { name: 'Mamer GP',    district: 'Dungarpur, RJ',  sanctioned: 5.6,  disbursed: 5.1,  structures: 10, utilization: 91,  status: 'partial',  tranche: 'T1 Released, T2 Review' },
];

const MICRO_WATERSHEDS = [
  'Chandur Railway Micro-Watershed (MWS-CHA-01)',
  'Kotra Tembls Ridge Watershed (MWS-KOT-02)',
  'Hivare Bazar Model Watershed (MWS-HIV-03)',
  'Ralegan Siddhi Pilot Catchment (MWS-RAL-04)',
];

// ─── Main Component ───────────────────────────────────────────────────────────
const DisbursementsReports: React.FC = () => {
  const [subTab, setSubTab] = useState<SubTab>('financials');
  const [selectedWatershed, setSelectedWatershed] = useState(MICRO_WATERSHEDS[0]);
  const [dateFrom, setDateFrom] = useState('2025-10-01');
  const [dateTo, setDateTo] = useState('2026-09-25');
  const [template, setTemplate] = useState('IWMP District Summary Watershed Report');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState('');
  const [exportToast, setExportToast] = useState<string | null>(null);

  const totalSanctioned = 30.8;
  const totalDisbursed = 28.4;
  const totalPending = 2.4;
  const utilization = 92;

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setReportGenerated(false);
    const steps = [
      'Fetching Sentinel-2 spectral time-series data…',
      'Running NDVI/NDWI spatial change detection…',
      'Compiling Ground Verification Appendix…',
      'Formatting DoLR-compliant executive narrative…',
    ];
    steps.forEach((step, i) => {
      setTimeout(() => setGeneratingStep(step), i * 700);
    });
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
      setGeneratingStep('');
    }, steps.length * 700 + 400);
  };

  const handleExport = (type: 'pdf' | 'docx') => {
    setExportToast(`${type === 'pdf' ? 'PDF' : 'DOCX'} report downloaded: IWMP_Watershed_Report_${new Date().toISOString().slice(0,10)}.${type}`);
    setTimeout(() => setExportToast(null), 3500);
  };

  return (
    <div className="min-h-full w-full bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-screen-xl mx-auto p-6 md:p-8 lg:p-10 space-y-8">

        {/* ── Page Header ── */}
        <div className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                eco_drishti Financial Wing
              </span>
              <span className="text-xs text-gray-500">PMKSY-WDC 2.0 · DoLR / MoRD</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Disbursements &amp; AI Reports
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Scheme fund utilization tracking and DoLR/IWMP compliant AI-generated watershed impact reports.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-gray-700">Financial Year: 2025-26</span>
            </div>
            <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-xs font-mono text-gray-500">
              Sync: {new Date().toLocaleDateString('en-IN')}
            </div>
          </div>
        </div>

        {/* Export Toast */}
        {exportToast && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-3.5 rounded-xl text-sm font-medium flex items-center gap-3 shadow-xs">
            <svg className="w-5 h-5 text-emerald-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{exportToast}</span>
            <button onClick={() => setExportToast(null)} className="ml-auto text-emerald-700 font-bold text-xs">Dismiss</button>
          </div>
        )}

        {/* ── 1. Header Stats Bar ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Sanctioned', value: `₹${totalSanctioned}L`, sub: 'Total scheme allocation', icon: '📋', border: 'border-gray-200', text: 'text-gray-900' },
            { label: 'Disbursed', value: `₹${totalDisbursed}L`, sub: 'Cleared to GPs', icon: '✅', border: 'border-emerald-200', text: 'text-emerald-700' },
            { label: 'Pending', value: `₹${totalPending}L`, sub: 'Escrow / Held', icon: '⏳', border: 'border-amber-200', text: 'text-amber-700' },
            { label: 'Utilization', value: `${utilization}%`, sub: 'Fund absorption rate', icon: '📈', border: 'border-blue-200', text: 'text-blue-700' },
          ].map(s => (
            <div key={s.label} className={`bg-white border ${s.border} rounded-2xl p-6 shadow-xs`}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{s.label}</span>
                <span className="text-lg">{s.icon}</span>
              </div>
              <div className={`text-2xl font-extrabold ${s.text}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── 2. Navigation Sub-Tabs ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Sub-Tab Bar */}
          <div className="flex border-b border-gray-200 bg-gray-50/60">
            {([
              { id: 'financials', label: 'Disbursements & Financials', icon: '₹' },
              { id: 'reports',    label: 'AI Reports (Gemini Powered)', icon: '🤖' },
            ] as { id: SubTab; label: string; icon: string }[]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                  subTab === tab.id
                    ? 'border-emerald-600 text-emerald-800 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-white/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ── Tab 1: Disbursements & Financials ── */}
          {subTab === 'financials' && (
            <div className="p-6 md:p-8 space-y-8">

              {/* Category-wise Expenditure Cards */}
              <div>
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                  Category-wise Expenditure
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {CATEGORY_CARDS.map(card => {
                    const pct = Math.round((card.disbursed / card.sanctioned) * 100);
                    return (
                      <div key={card.id} className={`${card.accentBg} border ${card.accentBorder} rounded-2xl p-6 space-y-4`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${card.accentIcon} flex items-center justify-center text-lg`}>
                            {card.icon}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{card.name}</span>
                            <span className="text-xs font-semibold text-gray-700">{card.structures} Structures</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold text-gray-600">
                            <span>Disbursed</span>
                            <span className="font-mono font-bold text-gray-900">₹{card.disbursed}L / ₹{card.sanctioned}L</span>
                          </div>
                          <div className="w-full bg-white/60 rounded-full h-2.5 overflow-hidden border border-white/80">
                            <div
                              className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="text-right text-xs font-mono font-bold text-emerald-700">{pct}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gram Panchayat Disbursement Table */}
              <div>
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
                  Gram Panchayat Disbursement Table
                </h2>
                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          <th className="px-6 py-4">Gram Panchayat</th>
                          <th className="px-6 py-4 text-right">Sanctioned (₹L)</th>
                          <th className="px-6 py-4 text-right">Disbursed (₹L)</th>
                          <th className="px-6 py-4 text-right">Pending (₹L)</th>
                          <th className="px-6 py-4 text-center">Structures</th>
                          <th className="px-6 py-4">Utilization %</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {GP_DISBURSEMENTS.map(gp => {
                          const pending = +(gp.sanctioned - gp.disbursed).toFixed(1);
                          const statusConfig = {
                            cleared:  { label: 'Cleared',  cls: 'bg-green-100 text-green-800 border-green-200' },
                            partial:  { label: 'Partial',  cls: 'bg-amber-100 text-amber-800 border-amber-200' },
                            on_hold:  { label: 'On Hold',  cls: 'bg-red-100 text-red-800 border-red-200' },
                          }[gp.status];
                          return (
                            <tr key={gp.name} className="hover:bg-gray-50/60 transition-colors">
                              <td className="px-6 py-5">
                                <span className="font-bold text-gray-900 block">{gp.name}</span>
                                <span className="text-xs text-gray-400 font-mono">{gp.district}</span>
                                <span className="text-[11px] text-gray-500 block mt-0.5">{gp.tranche}</span>
                              </td>
                              <td className="px-6 py-5 text-right font-mono font-bold text-gray-800">₹{gp.sanctioned}L</td>
                              <td className="px-6 py-5 text-right font-mono font-bold text-emerald-700">₹{gp.disbursed}L</td>
                              <td className="px-6 py-5 text-right font-mono font-semibold text-amber-700">
                                {pending > 0 ? `₹${pending}L` : '—'}
                              </td>
                              <td className="px-6 py-5 text-center font-mono font-semibold text-gray-700">{gp.structures}</td>
                              <td className="px-6 py-5 min-w-[160px]">
                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-xs">
                                    <span className="font-mono font-bold text-gray-900">{gp.utilization}%</span>
                                    <span className={gp.utilization >= 90 ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                                      {gp.utilization >= 90 ? 'On Track' : 'Review'}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${gp.utilization >= 90 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                                      style={{ width: `${gp.utilization}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.cls}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${gp.status === 'cleared' ? 'bg-green-600' : gp.status === 'partial' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                  {statusConfig.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50 border-t border-gray-200 text-xs font-bold text-gray-700">
                          <td className="px-6 py-4">TOTAL</td>
                          <td className="px-6 py-4 text-right font-mono">₹{totalSanctioned}L</td>
                          <td className="px-6 py-4 text-right font-mono text-emerald-700">₹{totalDisbursed}L</td>
                          <td className="px-6 py-4 text-right font-mono text-amber-700">₹{totalPending}L</td>
                          <td className="px-6 py-4 text-center font-mono">52</td>
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-emerald-700">{utilization}% Avg</span>
                          </td>
                          <td className="px-6 py-4" />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 2: AI Report Generator ── */}
          {subTab === 'reports' && (
            <div className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left: Report Configuration Panel */}
                <div className="lg:col-span-4 space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 mb-1">AI Report Generator</h2>
                    <p className="text-xs text-gray-500">DoLR / IWMP compliant watershed impact reports. Powered by Gemini for geospatial narrative synthesis.</p>
                  </div>

                  {/* Template Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Report Template</label>
                    <select
                      value={template}
                      onChange={e => setTemplate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs cursor-pointer"
                    >
                      <option>IWMP District Summary Watershed Report</option>
                      <option>PMKSY-WDC Annual Utilization Certificate</option>
                      <option>Satellite Cross-Validation Technical Report</option>
                      <option>Gram Panchayat Field Inspection Summary</option>
                    </select>
                  </div>

                  {/* Micro-Watershed Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Target Micro-Watershed</label>
                    <select
                      value={selectedWatershed}
                      onChange={e => setSelectedWatershed(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs cursor-pointer"
                    >
                      {MICRO_WATERSHEDS.map(ws => <option key={ws}>{ws}</option>)}
                    </select>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Reporting Period</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-gray-500 mb-1 block">From</label>
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 text-xs font-mono rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs" />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-500 mb-1 block">To</label>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-300 text-xs font-mono rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Generate CTA */}
                  <button
                    type="button"
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs truncate">{generatingStep || 'Initializing Gemini…'}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Generate DoLR Summary Report
                      </>
                    )}
                  </button>

                  {/* Export Options (shown after generation) */}
                  {reportGenerated && (
                    <div className="space-y-2.5 pt-2 border-t border-gray-200">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Export Report</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleExport('pdf')}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-bold transition-colors shadow-xs"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download PDF
                        </button>
                        <button
                          onClick={() => handleExport('docx')}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors shadow-xs"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Export DOCX
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: A4 Document Preview Area */}
                <div className="lg:col-span-8">
                  <div className="bg-gray-200 rounded-2xl p-6 md:p-8 min-h-[640px] flex items-start justify-center">
                    {!reportGenerated && !isGenerating ? (
                      <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400 space-y-3 w-full">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-gray-300 flex items-center justify-center shadow-sm">
                          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="font-semibold text-sm text-gray-500">No report generated yet</p>
                        <p className="text-xs text-gray-400 max-w-xs">Select a template and micro-watershed, then click "Generate DoLR Summary Report" to preview your formatted document.</p>
                      </div>
                    ) : isGenerating ? (
                      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 w-full">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                        <p className="font-semibold text-sm text-gray-700">{generatingStep}</p>
                        <p className="text-xs text-gray-500">Gemini is synthesising satellite & field data…</p>
                      </div>
                    ) : (
                      /* A4 Document Preview */
                      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg border border-gray-200 p-10 md:p-14 space-y-8 leading-relaxed text-gray-800">
                        {/* Document Header */}
                        <div className="border-b-2 border-emerald-700 pb-6 space-y-2">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg">🌿</div>
                            <div>
                              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest">
                                Ministry of Rural Development, Government of India
                              </p>
                              <p className="text-[11px] text-gray-500">
                                Department of Land Resources · PMKSY-WDC 2.0
                              </p>
                            </div>
                          </div>
                          <h1 className="text-xl font-extrabold text-gray-900">{template}</h1>
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                            <span>📍 {selectedWatershed.split('(')[0].trim()}</span>
                            <span>📅 Period: {dateFrom} to {dateTo}</span>
                            <span>🛰️ Sentinel-2 MSI Analysis</span>
                          </div>
                        </div>

                        {/* Chapter 1: Executive Summary */}
                        <div className="space-y-3">
                          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-l-4 border-emerald-600 pl-3">
                            Chapter 1 · Executive Summary
                          </h2>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            The target micro-watershed <strong>{selectedWatershed.split('(')[0].trim()}</strong> has demonstrated measurable and statistically significant improvements in hydro-vegetative indicators during the reporting period. A total of <strong>52 watershed development structures</strong> were commissioned under the Pradhan Mantri Krishi Sinchayee Yojana (PMKSY-WDC 2.0) framework, of which 48 (92.3%) have received satellite cross-validation clearance.
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Stored water impoundment reached <strong>18.2 Million Litres</strong>, representing a <strong>42% improvement</strong> compared to the pre-monsoon baseline. Fund utilization stands at <strong>₹28.4 Lakhs (92%)</strong> of the sanctioned outlay of ₹30.8 Lakhs, with ₹2.4 Lakhs pending final field audit clearance.
                          </p>
                        </div>

                        {/* Chapter 2: Satellite Data */}
                        <div className="space-y-3">
                          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-l-4 border-blue-600 pl-3">
                            Chapter 2 · Satellite Data (Sentinel-2 MSI Analysis)
                          </h2>
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs space-y-2">
                            {[
                              ['Granule ID', 'L2A_T43QHV_A038891_20260618'],
                              ['Cloud Cover', '0.02% (Pristine)'],
                              ['Spatial Resolution', '10m GSD · WGS84 EPSG:4326'],
                              ['NDVI Baseline (Pre-Monsoon)', '+0.24 ± 0.03'],
                              ['NDVI Current (Post-Monsoon)', '+0.58 ± 0.04'],
                              ['NDWI Water Spread Expansion', '+340 ha Active Impoundment'],
                            ].map(([k, v]) => (
                              <div key={k} className="flex justify-between text-xs border-b border-blue-100 last:border-0 pb-1.5 last:pb-0">
                                <span className="font-semibold text-gray-700">{k}</span>
                                <span className="font-mono text-blue-800">{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Chapter 3: Spatial Change Detection */}
                        <div className="space-y-3">
                          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-l-4 border-emerald-600 pl-3">
                            Chapter 3 · Spatial Change Detection
                          </h2>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Multi-temporal spectral analysis confirms a <strong>ΔNDVI of +0.34</strong> across the active watershed perimeter. Water body area expanded from <strong>8.4 ha (dry baseline) to 34.2 ha (post-monsoon)</strong>, corroborating ground inspector records for all check dam and percolation pond structures. Gully erosion index declined by <strong>41%</strong> in the upper ridge zones as measured via DEM differencing analysis.
                          </p>
                        </div>

                        {/* Chapter 4: Ground Verification Appendix */}
                        <div className="space-y-3">
                          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-l-4 border-amber-600 pl-3">
                            Chapter 4 · Ground Verification Appendix
                          </h2>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Field surveyors from <strong>4 Gram Panchayats</strong> (Kolyari, Bakarol, Malviya, Mamer) submitted geo-tagged photographs with EXIF metadata for all 52 structures. AI classification confidence averaged <strong>88.7%</strong>. One structure (Cement Nala Bund #14, Kolyari West) exhibited a GPS offset anomaly of 780m — flagged for re-inspection under the MoRD anomaly resolution protocol.
                          </p>

                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900">
                            <strong className="font-bold">Certification Note:</strong> This report was auto-generated by the eco_drishti WatershedNet AI v2.1 system and requires countersignature by the District Watershed Development Officer (DWDO) prior to submission to the DoLR State Directorate.
                          </div>
                        </div>

                        {/* Document Footer */}
                        <div className="border-t border-gray-200 pt-6 flex justify-between items-center text-[11px] text-gray-400">
                          <span>eco_drishti / SARaksha · WatershedNet AI v2.1 · NRSC</span>
                          <span className="font-mono">Generated: {new Date().toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DisbursementsReports;
