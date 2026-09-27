import { useState, useMemo } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
export type QueueStatus =
  | 'verified_active'
  | 'water_stored'
  | 'pending_review'
  | 'visit_scheduled'
  | 'desilt_required'
  | 'photo_mismatch'
  | 're_inspection';

export type Priority = 'urgent' | 'high' | 'medium' | 'normal';
export type StructureType = 'Check Dam' | 'Anicut' | 'Contour Trench' | 'Farm Pond' | 'Gully Plug' | 'Percolation Tank';

export interface QueueEntry {
  id: string;
  name: string;
  gramPanchayat: string;
  district: string;
  state: string;
  type: StructureType;
  status: QueueStatus;
  priority: Priority;
  ndviDelta: number;
  assignedTo: string | null;
  lastInspected: string;
  scheme: string;
  lat: string;
  lng: string;
  issue?: string;
}

// ─── Static data ─────────────────────────────────────────────────────────────
export const QUEUE_DATA: QueueEntry[] = [
  {
    id: 'CD-MH-0041',
    name: 'Hivare Bazar Check Dam #4',
    gramPanchayat: 'Hivare Bazar GP',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    type: 'Check Dam',
    status: 'photo_mismatch',
    priority: 'urgent',
    ndviDelta: -0.08,
    assignedTo: null,
    lastInspected: '12 Sep 2024',
    scheme: 'PMKSY-WDC',
    lat: '19.994',
    lng: '74.461',
    issue: 'Uploaded field photo geo-coordinates deviate 1.4 km from registered structure location.',
  },
  {
    id: 'PT-RJ-0018',
    name: 'Barmer Percolation Tank',
    gramPanchayat: 'Sindhari GP',
    district: 'Barmer',
    state: 'Rajasthan',
    type: 'Percolation Tank',
    status: 'desilt_required',
    priority: 'high',
    ndviDelta: -0.12,
    assignedTo: 'Shri K. Bishnoi',
    lastInspected: '05 Oct 2024',
    scheme: 'MGNREGS',
    lat: '25.363',
    lng: '71.441',
    issue: 'Satellite NDWI indicates significant siltation reducing effective storage volume.',
  },
  {
    id: 'AN-KA-0091',
    name: 'Kolar Anicut Structure',
    gramPanchayat: 'Malur GP',
    district: 'Kolar',
    state: 'Karnataka',
    type: 'Anicut',
    status: 'pending_review',
    priority: 'high',
    ndviDelta: +0.03,
    assignedTo: 'Smt. D. Reddy',
    lastInspected: '19 Oct 2024',
    scheme: 'IWMP',
    lat: '13.002',
    lng: '77.935',
  },
  {
    id: 'GP-MP-0033',
    name: 'Chambal Gully Plug Site 3',
    gramPanchayat: 'Jaura GP',
    district: 'Morena',
    state: 'Madhya Pradesh',
    type: 'Gully Plug',
    status: 're_inspection',
    priority: 'high',
    ndviDelta: +0.01,
    assignedTo: null,
    lastInspected: '28 Aug 2024',
    scheme: 'PMKSY-WDC',
    lat: '26.505',
    lng: '77.991',
    issue: 'Previous inspection flagged erosion downstream. Re-inspection overdue by 53 days.',
  },
  {
    id: 'CD-MH-0012',
    name: 'Hivare Bazar Check Dam #1',
    gramPanchayat: 'Hivare Bazar GP',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    type: 'Check Dam',
    status: 'verified_active',
    priority: 'normal',
    ndviDelta: +0.29,
    assignedTo: 'Shri A.D. Patil',
    lastInspected: '18 Oct 2024',
    scheme: 'PMKSY-WDC',
    lat: '19.991',
    lng: '74.445',
  },
  {
    id: 'FP-TS-0057',
    name: 'Nalgonda Farm Pond',
    gramPanchayat: 'Choutuppal GP',
    district: 'Nalgonda',
    state: 'Telangana',
    type: 'Farm Pond',
    status: 'water_stored',
    priority: 'normal',
    ndviDelta: +0.17,
    assignedTo: 'Shri R. Nayak',
    lastInspected: '21 Oct 2024',
    scheme: 'MGNREGS',
    lat: '17.248',
    lng: '78.882',
  },
  {
    id: 'CT-UP-0076',
    name: 'Bundelkhand Contour Trench',
    gramPanchayat: 'Mahoba GP',
    district: 'Mahoba',
    state: 'Uttar Pradesh',
    type: 'Contour Trench',
    status: 'visit_scheduled',
    priority: 'medium',
    ndviDelta: +0.05,
    assignedTo: 'Shri S. Tiwari',
    lastInspected: '01 Oct 2024',
    scheme: 'IWMP',
    lat: '25.290',
    lng: '79.870',
  },
  {
    id: 'PT-MH-0024',
    name: 'Hivare Bazar Percolation Tank',
    gramPanchayat: 'Hivare Bazar GP',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    type: 'Percolation Tank',
    status: 'pending_review',
    priority: 'medium',
    ndviDelta: +0.11,
    assignedTo: null,
    lastInspected: '15 Oct 2024',
    scheme: 'PMKSY-WDC',
    lat: '19.998',
    lng: '74.452',
    issue: 'Spillway outlet partially blocked. Water spread area 22% below design capacity.',
  },
  {
    id: 'CD-MH-0029',
    name: 'Pune Watershed Check Dam',
    gramPanchayat: 'Bhimashankar GP',
    district: 'Pune',
    state: 'Maharashtra',
    type: 'Check Dam',
    status: 'verified_active',
    priority: 'normal',
    ndviDelta: +0.22,
    assignedTo: 'Smt. P. Kulkarni',
    lastInspected: '20 Oct 2024',
    scheme: 'PMKSY-WDC',
    lat: '19.074',
    lng: '73.534',
  },
  {
    id: 'AN-GJ-0011',
    name: 'Saurashtra Anicut',
    gramPanchayat: 'Dhoraji GP',
    district: 'Rajkot',
    state: 'Gujarat',
    type: 'Anicut',
    status: 'photo_mismatch',
    priority: 'urgent',
    ndviDelta: -0.04,
    assignedTo: null,
    lastInspected: '07 Oct 2024',
    scheme: 'MGNREGS',
    lat: '21.726',
    lng: '70.447',
    issue: 'Photo timestamp metadata indicates image captured 4 months before reported inspection date.',
  },
];

// ─── Config maps ─────────────────────────────────────────────────────────────
export const STATUS_CONFIG: Record<QueueStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
  filterLabel: string;
}> = {
  verified_active:  { label: 'Verified Active',     color: 'text-emerald-300', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', dot: 'bg-emerald-400', filterLabel: 'Verified'  },
  water_stored:     { label: 'Water Stored Normal',  color: 'text-green-300',   bg: 'bg-green-500/15',   border: 'border-green-500/30',   dot: 'bg-green-400',   filterLabel: 'Verified'  },
  pending_review:   { label: 'Pending Review',       color: 'text-yellow-300',  bg: 'bg-yellow-500/15',  border: 'border-yellow-500/30',  dot: 'bg-yellow-400',  filterLabel: 'Pending'   },
  visit_scheduled:  { label: 'Visit Scheduled',      color: 'text-blue-300',    bg: 'bg-blue-500/15',    border: 'border-blue-500/30',    dot: 'bg-blue-400',    filterLabel: 'Scheduled' },
  desilt_required:  { label: 'Desilt Required',      color: 'text-red-300',     bg: 'bg-red-500/15',     border: 'border-red-500/30',     dot: 'bg-red-400',     filterLabel: 'Alerts'    },
  photo_mismatch:   { label: 'Photo Mismatch',       color: 'text-orange-300',  bg: 'bg-orange-500/15',  border: 'border-orange-500/30',  dot: 'bg-orange-400',  filterLabel: 'Alerts'    },
  're_inspection':  { label: 'Re-Inspection Due',    color: 'text-purple-300',  bg: 'bg-purple-500/15',  border: 'border-purple-500/30',  dot: 'bg-purple-400',  filterLabel: 'Alerts'    },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  urgent: { label: 'URGENT', color: 'text-red-300',    bg: 'bg-red-500/20',    border: 'border-red-500/40'    },
  high:   { label: 'HIGH',   color: 'text-orange-300', bg: 'bg-orange-500/20', border: 'border-orange-500/40' },
  medium: { label: 'MEDIUM', color: 'text-yellow-300', bg: 'bg-yellow-500/20', border: 'border-yellow-500/40' },
  normal: { label: 'NORMAL', color: 'text-slate-300',  bg: 'bg-slate-500/20',  border: 'border-slate-500/30'  },
};

export const TYPE_ICON: Record<StructureType, string> = {
  'Check Dam':       '💧',
  'Anicut':          '🌊',
  'Contour Trench':  '🪨',
  'Farm Pond':       '🏞️',
  'Gully Plug':      '⛏️',
  'Percolation Tank':'🌿',
};

// ─── KPI Summary Bar ─────────────────────────────────────────────────────────
const KpiBar = ({ entries }: { entries: QueueEntry[] }) => {
  const stats = useMemo(() => {
    const alerts     = entries.filter(e => ['photo_mismatch','desilt_required','re_inspection'].includes(e.status)).length;
    const pending    = entries.filter(e => e.status === 'pending_review').length;
    const scheduled  = entries.filter(e => e.status === 'visit_scheduled').length;
    const cleared    = entries.filter(e => ['verified_active','water_stored'].includes(e.status)).length;
    return { alerts, pending, scheduled, cleared, total: entries.length };
  }, [entries]);

  const kpis = [
    { label: 'Total Alerts',           value: stats.alerts,    icon: '🚨', color: 'text-red-400',     bg: 'bg-red-500/8',     border: 'border-red-500/20',     glow: 'shadow-red-900/30' },
    { label: 'Pending Verification',   value: stats.pending,   icon: '⏳', color: 'text-yellow-400',  bg: 'bg-yellow-500/8',  border: 'border-yellow-500/20',  glow: 'shadow-yellow-900/30' },
    { label: 'Scheduled Inspections',  value: stats.scheduled, icon: '📅', color: 'text-blue-400',    bg: 'bg-blue-500/8',    border: 'border-blue-500/20',    glow: 'shadow-blue-900/30' },
    { label: 'Cleared Items',          value: stats.cleared,   icon: '✅', color: 'text-emerald-400', bg: 'bg-emerald-500/8', border: 'border-emerald-500/20', glow: 'shadow-emerald-900/30' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {kpis.map(k => (
        <div
          key={k.label}
          className={`flex items-center gap-3.5 p-4 rounded-xl border ${k.bg} ${k.border} shadow-lg ${k.glow} backdrop-blur-sm`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${k.bg} border ${k.border}`}>
            {k.icon}
          </div>
          <div>
            <p className={`${k.color} text-2xl font-bold font-mono leading-none`}>{k.value}</p>
            <p className="text-slate-500 text-[11px] mt-0.5 leading-tight">{k.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Assign Team Modal ────────────────────────────────────────────────────────
interface AssignModalProps {
  entry: QueueEntry;
  onClose: () => void;
  onAssign: (id: string, officer: string) => void;
}

const FIELD_OFFICERS = [
  'Shri A.D. Patil', 'Smt. R. Jadhav', 'Shri K. Bishnoi', 'Smt. D. Reddy',
  'Shri S. Tiwari', 'Shri R. Nayak', 'Smt. P. Kulkarni', 'Shri M. Sharma',
  'Smt. L. Devi', 'Shri V. Kumar',
];

const AssignModal = ({ entry, onClose, onAssign }: AssignModalProps) => {
  const [selected, setSelected] = useState(entry.assignedTo ?? '');
  const [custom, setCustom] = useState('');
  const [tab, setTab] = useState<'list' | 'custom'>('list');

  const finalOfficer = tab === 'custom' ? custom.trim() : selected;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md glass-card p-6 rounded-2xl border border-white/10 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-white font-bold text-base">Assign Field Team</h3>
            <p className="text-slate-500 text-xs mt-0.5">{entry.id} · {entry.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        {/* Structure Info */}
        <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg mb-4 border ${STATUS_CONFIG[entry.status].bg} ${STATUS_CONFIG[entry.status].border}`}>
          <span className="text-base">{TYPE_ICON[entry.type]}</span>
          <div>
            <p className="text-white text-xs font-semibold">{entry.type} · {entry.gramPanchayat}</p>
            <p className={`text-[11px] ${STATUS_CONFIG[entry.status].color}`}>{STATUS_CONFIG[entry.status].label}</p>
          </div>
          <div className={`ml-auto px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${PRIORITY_CONFIG[entry.priority].bg} ${PRIORITY_CONFIG[entry.priority].border} ${PRIORITY_CONFIG[entry.priority].color}`}>
            {PRIORITY_CONFIG[entry.priority].label}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-3 p-1 bg-slate-900/60 rounded-lg border border-white/5">
          {(['list', 'custom'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                tab === t ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t === 'list' ? '👥 Field Officers' : '✏️ Custom Name'}
            </button>
          ))}
        </div>

        {tab === 'list' ? (
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 mb-4">
            {FIELD_OFFICERS.map(officer => (
              <button
                key={officer}
                onClick={() => setSelected(officer)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all text-sm ${
                  selected === officer
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  selected === officer ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-700 text-slate-400'
                }`}>
                  {officer.split(' ').slice(-1)[0][0]}
                </div>
                <span className="font-medium truncate">{officer}</span>
                {selected === officer && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-emerald-400 ml-auto flex-shrink-0"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="mb-4">
            <input
              type="text"
              value={custom}
              onChange={e => setCustom(e.target.value)}
              placeholder="Enter officer name (e.g. Shri R. Sharma)"
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 border border-white/8 text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (finalOfficer) { onAssign(entry.id, finalOfficer); onClose(); } }}
            disabled={!finalOfficer}
            className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              finalOfficer
                ? 'btn-primary'
                : 'bg-slate-800 border border-white/8 text-slate-600 cursor-not-allowed'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            Assign Officer
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Filter Tabs ──────────────────────────────────────────────────────────────
const FILTER_TABS = ['All', 'Alerts', 'Pending', 'Scheduled', 'Verified'] as const;
type FilterTab = typeof FILTER_TABS[number];

const filterMatch = (entry: QueueEntry, tab: FilterTab): boolean => {
  if (tab === 'All') return true;
  const cfg = STATUS_CONFIG[entry.status];
  if (tab === 'Alerts')    return cfg.filterLabel === 'Alerts';
  if (tab === 'Pending')   return cfg.filterLabel === 'Pending';
  if (tab === 'Scheduled') return cfg.filterLabel === 'Scheduled';
  if (tab === 'Verified')  return cfg.filterLabel === 'Verified';
  return true;
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: QueueStatus }) => {
  const c = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap ${c.color} ${c.bg} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
};

// ─── Priority Badge ───────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const c = PRIORITY_CONFIG[priority];
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${c.color} ${c.bg} ${c.border}`}>
      {c.label}
    </span>
  );
};

// ─── Main VerificationQueue Component ────────────────────────────────────────
interface VerificationQueueProps {
  onInspectEvidence: (entry: QueueEntry) => void;
}

const VerificationQueue = ({ onInspectEvidence }: VerificationQueueProps) => {
  const [entries, setEntries] = useState<QueueEntry[]>(QUEUE_DATA);
  const [filterTab, setFilterTab] = useState<FilterTab>('All');
  const [search, setSearch] = useState('');
  const [assignTarget, setAssignTarget] = useState<QueueEntry | null>(null);
  const [sortKey, setSortKey] = useState<'priority' | 'ndvi' | 'id'>('priority');
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const PRIORITY_ORDER: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, normal: 3 };

  const filteredEntries = useMemo(() => {
    let list = entries.filter(e => filterMatch(e, filterTab));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.gramPanchayat.toLowerCase().includes(q) ||
        e.district.toLowerCase().includes(q)
      );
    }
    if (sortKey === 'priority') list = [...list].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    if (sortKey === 'ndvi')     list = [...list].sort((a, b) => a.ndviDelta - b.ndviDelta);
    if (sortKey === 'id')       list = [...list].sort((a, b) => a.id.localeCompare(b.id));
    return list;
  }, [entries, filterTab, search, sortKey]);

  const handleAssign = (id: string, officer: string) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, assignedTo: officer } : e));
  };

  const alertCount = entries.filter(e => ['photo_mismatch','desilt_required','re_inspection'].includes(e.status)).length;

  return (
    <div className="p-4 sm:p-6 space-y-5 h-full overflow-y-auto">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-white font-bold text-xl" style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
              Verification Queue
            </h2>
            {alertCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold font-mono animate-pulse">
                {alertCount} ACTIVE ALERTS
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">Monitor field inspections, anomalies, and structure verification status across all watershed sub-basins.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono flex-shrink-0">
          <span className="px-2 py-1 rounded bg-slate-900/60 border border-white/5">PMKSY-WDC · MGNREGS · IWMP</span>
        </div>
      </div>

      {/* KPI Bar */}
      <KpiBar entries={entries} />

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/60 border border-white/5 rounded-xl flex-shrink-0">
          {FILTER_TABS.map(tab => {
            const count = tab === 'All'
              ? entries.length
              : entries.filter(e => filterMatch(e, tab)).length;
            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  filterTab === tab
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
                <span className={`text-[10px] font-mono px-1 py-0.5 rounded ${
                  filterTab === tab ? 'bg-slate-600 text-slate-200' : 'bg-slate-800 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + Sort */}
        <div className="flex gap-2 flex-1 min-w-0">
          <div className="relative flex-1 min-w-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by structure name, ID, or Gram Panchayat…"
              className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-white/8 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            )}
          </div>
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as typeof sortKey)}
            className="bg-slate-900/60 border border-white/8 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/40 transition-colors"
          >
            <option value="priority">Sort: Priority</option>
            <option value="ndvi">Sort: NDVI Δ</option>
            <option value="id">Sort: ID</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Showing <strong className="text-slate-300 mx-1">{filteredEntries.length}</strong> of {entries.length} structures
        {search && <span>· filtered by "<span className="text-emerald-400">{search}</span>"</span>}
      </div>

      {/* Table Container */}
      <div className="glass-card rounded-2xl border border-white/6 overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-[1.8fr_1.1fr_1.4fr_0.9fr_0.6fr_1fr_auto] gap-4 px-5 py-3 bg-slate-900/60 border-b border-white/5 text-[10px] font-mono uppercase tracking-widest text-slate-500">
          <span>Structure / Location</span>
          <span>Type</span>
          <span>Status</span>
          <span>Priority</span>
          <span>NDVI Δ</span>
          <span>Assigned To</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/4">
          {filteredEntries.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center mx-auto mb-3 text-xl">🔍</div>
              <p className="text-slate-400 text-sm">No structures match your filters</p>
              <p className="text-slate-600 text-xs mt-1">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredEntries.map(entry => {
              const isSelected = selectedRow === entry.id;
              const sc = STATUS_CONFIG[entry.status];
              return (
                <div key={entry.id}>
                  {/* Main Row */}
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-[1.8fr_1.1fr_1.4fr_0.9fr_0.6fr_1fr_auto] gap-4 px-5 py-4 transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? 'bg-emerald-500/5 border-l-2 border-l-emerald-400'
                        : 'hover:bg-slate-800/30 border-l-2 border-l-transparent'
                    }`}
                    onClick={() => setSelectedRow(isSelected ? null : entry.id)}
                  >
                    {/* Structure ID + Name */}
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/8 flex items-center justify-center flex-shrink-0 text-base mt-0.5">
                        {TYPE_ICON[entry.type]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold leading-tight truncate">{entry.name}</p>
                        <p className="text-slate-500 text-[10px] font-mono mt-0.5">{entry.id}</p>
                        <p className="text-slate-600 text-[10px] truncate">{entry.gramPanchayat} · {entry.district}, {entry.state}</p>
                      </div>
                    </div>

                    {/* Type */}
                    <div className="flex items-center">
                      <span className="text-slate-300 text-xs">{entry.type}</span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      <StatusBadge status={entry.status} />
                    </div>

                    {/* Priority */}
                    <div className="flex items-center">
                      <PriorityBadge priority={entry.priority} />
                    </div>

                    {/* NDVI Delta */}
                    <div className="flex items-center">
                      <span className={`text-sm font-bold font-mono ${
                        entry.ndviDelta > 0.1 ? 'text-emerald-400' :
                        entry.ndviDelta > 0   ? 'text-green-400' :
                        entry.ndviDelta > -0.05 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {entry.ndviDelta > 0 ? '+' : ''}{entry.ndviDelta.toFixed(2)}
                      </span>
                    </div>

                    {/* Assigned To */}
                    <div className="flex items-center min-w-0">
                      {entry.assignedTo ? (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400 flex-shrink-0">
                            {entry.assignedTo.split(' ').slice(-1)[0][0]}
                          </div>
                          <span className="text-slate-400 text-[11px] truncate">{entry.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[11px] italic">Unassigned</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      <button
                        id={`assign-${entry.id}`}
                        onClick={() => setAssignTarget(entry)}
                        title="Assign Field Team"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-white/8 text-slate-400 hover:text-white hover:bg-slate-700 text-[11px] font-medium transition-all duration-150 whitespace-nowrap"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                        </svg>
                        Assign
                      </button>
                      <button
                        id={`inspect-${entry.id}`}
                        onClick={() => onInspectEvidence(entry)}
                        title="Inspect Evidence in Cross-Validation Panel"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-medium transition-all duration-150 whitespace-nowrap"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        Inspect
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detail Row */}
                  {isSelected && (
                    <div className={`px-5 py-4 ${sc.bg} border-t border-white/4 animate-fade-in`}>
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* Issue / Detail */}
                        <div className="flex-1 min-w-0">
                          {entry.issue ? (
                            <div className="flex items-start gap-2">
                              <svg viewBox="0 0 24 24" className={`w-4 h-4 flex-shrink-0 mt-0.5 fill-current ${sc.color}`}>
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                              </svg>
                              <p className={`text-sm leading-relaxed ${sc.color}`}>{entry.issue}</p>
                            </div>
                          ) : (
                            <p className="text-slate-400 text-sm italic">No anomalies detected. Structure operating within normal parameters.</p>
                          )}
                        </div>
                        {/* Metadata pills */}
                        <div className="flex flex-wrap gap-2 flex-shrink-0">
                          {[
                            { label: 'Scheme', val: entry.scheme },
                            { label: 'Last Inspected', val: entry.lastInspected },
                            { label: 'GPS', val: `${entry.lat}°N, ${entry.lng}°E` },
                          ].map(m => (
                            <div key={m.label} className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-center">
                              <p className="text-slate-500 text-[9px] uppercase tracking-wide">{m.label}</p>
                              <p className="text-slate-200 text-[11px] font-mono mt-0.5">{m.val}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {assignTarget && (
        <AssignModal
          entry={assignTarget}
          onClose={() => setAssignTarget(null)}
          onAssign={handleAssign}
        />
      )}
    </div>
  );
};

export default VerificationQueue;
