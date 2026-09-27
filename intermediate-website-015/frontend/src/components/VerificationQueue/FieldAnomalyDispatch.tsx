import React, { useMemo, useState } from 'react';

export type QueueStatus = 'verified_active' | 'pending_review' | 'desilt_required' | 'photo_mismatch' | 'scheduled';
export type PriorityLevel = 'URGENT' | 'HIGH' | 'NORMAL';
export type StructureCategory = 'Check Dam' | 'Contour Trench' | 'Gully Plug' | 'Nala Bund' | 'Farm Pond' | 'Percolation Tank';

export interface QueueItem {
  id: string;
  name: string;
  village: string;
  gramPanchayat: string;
  district: string;
  state: string;
  type: StructureCategory;
  status: QueueStatus;
  statusLabel: string;
  priority: PriorityLevel;
  ndviDelta: number;
  assignedTo: string;
  updatedDate: string;
  lat: string;
  lng: string;
  anomalyDetails?: string;
}

export const INITIAL_QUEUE_ITEMS: QueueItem[] = [
  {
    id: 'CD-KOL-07A',
    name: 'Check Dam #07A',
    village: 'Kolyari Village',
    gramPanchayat: 'Kolyari GP',
    district: 'Udaipur',
    state: 'Rajasthan',
    type: 'Check Dam',
    status: 'verified_active',
    statusLabel: 'Verified Active',
    priority: 'NORMAL',
    ndviDelta: 0.18,
    assignedTo: 'Field Team Alpha',
    updatedDate: 'Completed',
    lat: '24.2891',
    lng: '73.4120',
  },
  {
    id: 'CT-BAK-04',
    name: 'Contour Trench - Sector A',
    village: 'Bakarol',
    gramPanchayat: 'Bakarol GP',
    district: 'Anand',
    state: 'Gujarat',
    type: 'Contour Trench',
    status: 'pending_review',
    statusLabel: 'Pending Review',
    priority: 'NORMAL',
    ndviDelta: 0.14,
    assignedTo: 'Unassigned',
    updatedDate: 'Sep 5, 2026',
    lat: '22.5645',
    lng: '72.9289',
    anomalyDetails: 'Initial earthwork completed; drone/field photographic evidence awaiting final ground surveyor verification.',
  },
  {
    id: 'GP-MAL-09',
    name: 'Gully Plug Block #09',
    village: 'Malviya',
    gramPanchayat: 'Malviya GP',
    district: 'Khargone',
    state: 'Madhya Pradesh',
    type: 'Gully Plug',
    status: 'desilt_required',
    statusLabel: 'Desilt Required',
    priority: 'URGENT',
    ndviDelta: -0.05,
    assignedTo: 'Unassigned',
    updatedDate: 'Urgent',
    lat: '21.8214',
    lng: '75.6120',
    anomalyDetails: 'Heavy siltation accumulation (>40% volume capacity) detected following cloudburst event. Upstream scour observed.',
  },
  {
    id: 'NB-KOL-14',
    name: 'Cement Nala Bund #14',
    village: 'Kolyari West',
    gramPanchayat: 'Kolyari GP',
    district: 'Udaipur',
    state: 'Rajasthan',
    type: 'Nala Bund',
    status: 'photo_mismatch',
    statusLabel: 'Photo Mismatch',
    priority: 'HIGH',
    ndviDelta: 0.03,
    assignedTo: 'Unassigned',
    updatedDate: 'Sep 5, 2026',
    lat: '24.2980',
    lng: '73.3980',
    anomalyDetails: 'Uploaded inspector photograph coordinates deviate by 780m from satellite detected concrete spillway location.',
  },
  {
    id: 'FP-MAM-02',
    name: 'Community Farm Pond #02',
    village: 'Mamer',
    gramPanchayat: 'Mamer GP',
    district: 'Dungarpur',
    state: 'Rajasthan',
    type: 'Farm Pond',
    status: 'scheduled',
    statusLabel: 'Scheduled Inspection',
    priority: 'NORMAL',
    ndviDelta: 0.22,
    assignedTo: 'Surveyor R. Sharma',
    updatedDate: 'Sep 8, 2026',
    lat: '23.8412',
    lng: '73.7145',
  },
  {
    id: 'PT-BAK-01',
    name: 'Percolation Tank - North Ridge',
    village: 'Bakarol',
    gramPanchayat: 'Bakarol GP',
    district: 'Anand',
    state: 'Gujarat',
    type: 'Percolation Tank',
    status: 'scheduled',
    statusLabel: 'Scheduled Inspection',
    priority: 'NORMAL',
    ndviDelta: 0.16,
    assignedTo: 'Field Team Beta',
    updatedDate: 'Sep 9, 2026',
    lat: '22.5710',
    lng: '72.9340',
  },
  {
    id: 'CD-MAL-03',
    name: 'Masonry Anicut #03',
    village: 'Malviya East',
    gramPanchayat: 'Malviya GP',
    district: 'Khargone',
    state: 'Madhya Pradesh',
    type: 'Check Dam',
    status: 'pending_review',
    statusLabel: 'Pending Review',
    priority: 'NORMAL',
    ndviDelta: 0.11,
    assignedTo: 'Unassigned',
    updatedDate: 'Sep 6, 2026',
    lat: '21.8350',
    lng: '75.6280',
  },
];

export interface FieldAnomalyDispatchProps {
  onInspectSite?: (lat: string, lng: string) => void;
}

export const FieldAnomalyDispatch: React.FC<FieldAnomalyDispatchProps> = ({ onInspectSite }) => {
  const [items, setItems] = useState<QueueItem[]>(INITIAL_QUEUE_ITEMS);
  const [activeTab, setActiveTab] = useState<'All' | 'Alerts' | 'Pending' | 'Scheduled' | 'Verified'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Dispatch Modal State
  const [dispatchItem, setDispatchItem] = useState<QueueItem | null>(null);
  const [selectedTeam, setSelectedTeam] = useState('Field Team Alpha');
  const [targetDate, setTargetDate] = useState('2026-09-12');
  const [instructions, setInstructions] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccessToast, setDispatchSuccessToast] = useState<string | null>(null);

  // Detail Drawer State
  const [detailItem, setDetailItem] = useState<QueueItem | null>(null);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = items.length;
    const alerts = items.filter(i => i.status === 'desilt_required' || i.status === 'photo_mismatch').length;
    const pending = items.filter(i => i.status === 'pending_review').length;
    const scheduled = items.filter(i => i.status === 'scheduled').length;
    const cleared = items.filter(i => i.status === 'verified_active').length;
    return { total, alerts, pending, scheduled, cleared };
  }, [items]);

  // Filtering
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Tab filter
      if (activeTab === 'Alerts' && !(item.status === 'desilt_required' || item.status === 'photo_mismatch')) return false;
      if (activeTab === 'Pending' && item.status !== 'pending_review') return false;
      if (activeTab === 'Scheduled' && item.status !== 'scheduled') return false;
      if (activeTab === 'Verified' && item.status !== 'verified_active') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesVillage = item.village.toLowerCase().includes(q);
        const matchesGP = item.gramPanchayat.toLowerCase().includes(q);
        const matchesType = item.type.toLowerCase().includes(q);
        return matchesName || matchesVillage || matchesGP || matchesType;
      }
      return true;
    });
  }, [items, activeTab, searchQuery]);

  // Dispatch Action Handler
  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchItem) return;

    setIsDispatching(true);
    setTimeout(() => {
      setItems(prev =>
        prev.map(i =>
          i.id === dispatchItem.id
            ? {
                ...i,
                status: 'scheduled',
                statusLabel: 'Visit Scheduled',
                assignedTo: selectedTeam,
                updatedDate: targetDate,
              }
            : i
        )
      );
      setIsDispatching(false);
      setDispatchSuccessToast(`Dispatched ${dispatchItem.name} to ${selectedTeam} via DRISHTI mobile notification!`);
      setDispatchItem(null);
      setInstructions('');
      setTimeout(() => setDispatchSuccessToast(null), 4000);
    }, 1000);
  };

  return (
    <div className="min-h-full w-full bg-gray-50 text-gray-900 font-sans p-6 md:p-8 lg:p-10 space-y-8">
      
      {/* ── Page Header & Subtitle ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              eco_drishti Field Dispatch
            </span>
            <span className="text-xs text-gray-500 font-medium">PMKSY-WDC 2.0 • DoLR Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Verification Queue &amp; Field Anomaly Dispatch
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 max-w-2xl">
            Monitor satellite-flagged anomalies, siltation risks, and field inspector assignments. Fast-dispatch inspection teams directly via DRISHTI mobile sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>DRISHTI Sync: Active (24 Field Units Online)</span>
          </div>
        </div>
      </div>

      {/* ── Toast Notification ── */}
      {dispatchSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-3.5 rounded-xl text-sm font-medium flex items-center justify-between shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{dispatchSuccessToast}</span>
          </div>
          <button onClick={() => setDispatchSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* ── 1. Header Stat Summary Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Queue */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Total Queue Items</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-1 block">{stats.total}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold">
            📋
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-red-50/30">
          <div>
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider block">Alerts</span>
            <span className="text-2xl font-extrabold text-red-700 mt-1 block">{stats.alerts}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
            🚨
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-amber-50/30">
          <div>
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">Pending</span>
            <span className="text-2xl font-extrabold text-amber-800 mt-1 block">{stats.pending}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            ⏳
          </div>
        </div>

        {/* Scheduled */}
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-blue-50/30">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">Scheduled</span>
            <span className="text-2xl font-extrabold text-blue-700 mt-1 block">{stats.scheduled}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            📅
          </div>
        </div>

        {/* Cleared */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-emerald-50/30">
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Cleared</span>
            <span className="text-2xl font-extrabold text-emerald-800 mt-1 block">{stats.cleared}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            ✅
          </div>
        </div>
      </div>

      {/* ── 2. Filter & Search Bar ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Tabs: [All], [Alerts], [Pending], [Scheduled], [Verified] */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1 border border-gray-200 text-xs font-semibold self-start md:self-auto flex-wrap">
          {(['All', 'Alerts', 'Pending', 'Scheduled', 'Verified'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
              {tab === 'Alerts' && stats.alerts > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-red-100 text-red-700 rounded-full text-[10px]">
                  {stats.alerts}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative flex-1 md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search structure name, village, or Gram Panchayat..."
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── 3. Verification Queue Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Structure Name &amp; Location</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">NDVI Delta</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Updated Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No matching records found in verification queue.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  // Badge styling using soft, pastel tones
                  const statusBadgeStyle = {
                    verified_active: 'bg-green-100 text-green-800 border-green-200',
                    pending_review: 'bg-amber-100 text-amber-800 border-amber-200',
                    desilt_required: 'bg-red-100 text-red-800 border-red-200',
                    photo_mismatch: 'bg-orange-100 text-orange-800 border-orange-200',
                    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
                  }[item.status];

                  const priorityBadgeStyle = {
                    URGENT: 'bg-red-100 text-red-800 border-red-300 font-extrabold',
                    HIGH: 'bg-orange-100 text-orange-800 border-orange-200 font-bold',
                    NORMAL: 'bg-gray-100 text-gray-700 border-gray-200 font-medium',
                  }[item.priority];

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Structure Name & Location */}
                      <td className="px-6 py-4.5">
                        <div className="font-bold text-gray-900 text-sm">{item.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">
                          {item.village} • <span className="font-mono text-gray-400">{item.gramPanchayat}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          {item.lat}°N, {item.lng}°E
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4.5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                          {item.type}
                        </span>
                      </td>

                      {/* Status with Soft Pastel Badge */}
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadgeStyle}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'verified_active' ? 'bg-green-600' :
                            item.status === 'desilt_required' ? 'bg-red-600' :
                            item.status === 'photo_mismatch' ? 'bg-orange-600' :
                            item.status === 'scheduled' ? 'bg-blue-600' : 'bg-amber-600'
                          }`} />
                          {item.statusLabel}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider border ${priorityBadgeStyle}`}>
                          {item.priority}
                        </span>
                      </td>

                      {/* NDVI Delta */}
                      <td className="px-6 py-4.5">
                        <span className={`font-mono font-bold text-xs ${
                          item.ndviDelta > 0 ? 'text-emerald-700' : 'text-red-600'
                        }`}>
                          {item.ndviDelta > 0 ? `+${item.ndviDelta.toFixed(2)}` : item.ndviDelta.toFixed(2)}
                        </span>
                      </td>

                      {/* Assigned To */}
                      <td className="px-6 py-4.5">
                        <span className={`font-medium ${item.assignedTo === 'Unassigned' ? 'text-gray-400 italic' : 'text-gray-800'}`}>
                          {item.assignedTo}
                        </span>
                      </td>

                      {/* Updated Date */}
                      <td className="px-6 py-4.5">
                        <span className={`text-xs ${item.updatedDate === 'Urgent' ? 'text-red-700 font-bold' : 'text-gray-600'}`}>
                          {item.updatedDate}
                        </span>
                      </td>

                      {/* Row Actions */}
                      <td className="px-6 py-4.5 text-right space-x-2">
                        {item.status === 'verified_active' ? (
                          <button
                            type="button"
                            onClick={() => setDetailItem(item)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-xs transition-colors"
                          >
                            View
                          </button>
                        ) : item.status === 'photo_mismatch' ? (
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setDispatchItem(item);
                                setInstructions('Verify physical ground footprint against registered GPS polygon. Re-photograph downstream crest.');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors"
                            >
                              Resolve
                            </button>
                            <button
                              type="button"
                              onClick={() => setDetailItem(item)}
                              className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-600"
                            >
                              Details
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex gap-2">
                            <button
                              type="button"
                              onClick={() => setDispatchItem(item)}
                              className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-xs transition-colors ${
                                item.priority === 'URGENT'
                                  ? 'bg-red-700 hover:bg-red-800'
                                  : 'bg-emerald-700 hover:bg-emerald-800'
                              }`}
                            >
                              {item.priority === 'URGENT' ? 'Assign Team' : item.assignedTo === 'Unassigned' ? 'Assign' : 'Reassign'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDetailItem(item)}
                              className="px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs text-gray-600"
                            >
                              Details
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. Fast Dispatch Action Modal ── */}
      {dispatchItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                  DRISHTI Mobile Sync Dispatch
                </span>
                <h3 className="text-xl font-extrabold text-gray-900">
                  Assign Field Team
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Site: <strong className="text-gray-800">{dispatchItem.name}</strong> ({dispatchItem.village})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDispatchItem(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Anomaly Callout if present */}
            {dispatchItem.anomalyDetails && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
                <strong className="block text-amber-950 font-bold mb-0.5">Flagged Anomaly:</strong>
                {dispatchItem.anomalyDetails}
              </div>
            )}

            {/* Dispatch Form */}
            <form onSubmit={handleConfirmDispatch} className="space-y-4">
              
              {/* Inspection Team Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Select Inspection Team
                </label>
                <select
                  value={selectedTeam}
                  onChange={e => setSelectedTeam(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer shadow-xs"
                >
                  <option value="Field Team Alpha">Field Team Alpha (Lead: Eng. Manoj S.)</option>
                  <option value="Field Team Beta">Field Team Beta (Lead: Smt. Sunita Rao)</option>
                  <option value="Rapid Response Unit 04">Rapid Response Unit 04 (Specialist: Siltation / Scour)</option>
                  <option value="District Hydrologist Wing">District Hydrologist Wing (DoLR State Directorate)</option>
                </select>
              </div>

              {/* Target Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Target Inspection Date
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Field Surveyor Instructions
                </label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="E.g., Conduct physical silt depth probe and take 4-point cardinal geo-tagged photos of crest..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-inner"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDispatchItem(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDispatching}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDispatching ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Syncing Mobile Push…</span>
                    </>
                  ) : (
                    <>
                      <span>Dispatch via DRISHTI App</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ── Detail Drawer ── */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 md:p-8 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
                Asset #{detailItem.id}
              </span>
              <button onClick={() => setDetailItem(null)} className="text-gray-400 hover:text-gray-600 text-sm">
                ✕
              </button>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{detailItem.name}</h2>
              <p className="text-xs text-gray-500 mt-1">
                {detailItem.village}, {detailItem.gramPanchayat}, {detailItem.district}, {detailItem.state}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex justify-between">
                <span className="text-gray-500">Structure Type</span>
                <strong className="text-gray-900">{detailItem.type}</strong>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex justify-between">
                <span className="text-gray-500">Assigned Team</span>
                <strong className="text-gray-900">{detailItem.assignedTo}</strong>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex justify-between">
                <span className="text-gray-500">Current Status</span>
                <strong className="text-emerald-700">{detailItem.statusLabel}</strong>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex justify-between">
                <span className="text-gray-500">Vegetation Delta (NDVI)</span>
                <strong className="font-mono text-emerald-700">+{detailItem.ndviDelta.toFixed(2)}</strong>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex justify-between">
                <span className="text-gray-500">GPS Coordinates</span>
                <strong className="font-mono text-gray-900">{detailItem.lat}°N, {detailItem.lng}°E</strong>
              </div>
            </div>

            {detailItem.anomalyDetails && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-950">
                <strong className="block text-red-900 font-bold mb-1">Anomaly &amp; Ground Notes:</strong>
                {detailItem.anomalyDetails}
              </div>
            )}

            <div className="pt-4 flex flex-col gap-3">
              {onInspectSite && (
                <button
                  type="button"
                  onClick={() => {
                    onInspectSite(detailItem.lat, detailItem.lng);
                    setDetailItem(null);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-colors text-center"
                >
                  Locate in Web-GIS Map
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setDispatchItem(detailItem);
                  setDetailItem(null);
                }}
                className="w-full py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold transition-colors text-center"
              >
                Fast Dispatch Team
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FieldAnomalyDispatch;
