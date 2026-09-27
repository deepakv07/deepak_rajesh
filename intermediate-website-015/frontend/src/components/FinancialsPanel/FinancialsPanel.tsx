import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type VerifStatus = 'cleared' | 'partial' | 'held';

interface GpDisbursement {
  gp: string;
  district: string;
  state: string;
  sanctioned: number;
  disbursed: number;
  structures: number;
  verifStatus: VerifStatus;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const GP_DISBURSEMENTS: GpDisbursement[] = [
  { gp: 'Hivare Bazar GP',  district: 'Ahmednagar', state: 'MH', sanctioned: 82.40, disbursed: 78.60, structures: 4, verifStatus: 'cleared'  },
  { gp: 'Kolyari GP',       district: 'Nashik',     state: 'MH', sanctioned: 54.20, disbursed: 42.80, structures: 3, verifStatus: 'partial'   },
  { gp: 'Sindhari GP',      district: 'Barmer',     state: 'RJ', sanctioned: 48.70, disbursed: 22.30, structures: 2, verifStatus: 'held'      },
  { gp: 'Malur GP',         district: 'Kolar',      state: 'KA', sanctioned: 67.50, disbursed: 51.40, structures: 2, verifStatus: 'partial'   },
  { gp: 'Jaura GP',         district: 'Morena',     state: 'MP', sanctioned: 41.80, disbursed: 41.80, structures: 2, verifStatus: 'cleared'   },
  { gp: 'Mahoba GP',        district: 'Mahoba',     state: 'UP', sanctioned: 38.60, disbursed: 19.40, structures: 1, verifStatus: 'partial'   },
  { gp: 'Choutuppal GP',    district: 'Nalgonda',   state: 'TS', sanctioned: 59.30, disbursed: 59.30, structures: 2, verifStatus: 'cleared'   },
  { gp: 'Bhimashankar GP',  district: 'Pune',       state: 'MH', sanctioned: 73.10, disbursed: 68.20, structures: 3, verifStatus: 'cleared'   },
  { gp: 'Dhoraji GP',       district: 'Rajkot',     state: 'GJ', sanctioned: 45.60, disbursed: 0,     structures: 1, verifStatus: 'held'      },
  { gp: 'Malviya GP',       district: 'Morena',     state: 'MP', sanctioned: 36.90, disbursed: 14.20, structures: 2, verifStatus: 'held'      },
];

const CATEGORY_EXPENDITURE = [
  { name: 'Check Dams',      budget: 248.4, spent: 196.3, count: 87,  icon: '💧', color: 'cyan'    },
  { name: 'Contour Trenches',budget: 112.8, spent: 84.1,  count: 64,  icon: '🪨', color: 'amber'   },
  { name: 'Farm Ponds',      budget: 98.6,  spent: 79.2,  count: 51,  icon: '🏞️', color: 'green'   },
  { name: 'Nala Bunds',      budget: 67.4,  spent: 51.8,  count: 29,  icon: '🌊', color: 'violet'  },
  { name: 'Gully Plugs',     budget: 54.2,  spent: 48.6,  count: 16,  icon: '⛏️', color: 'emerald' },
];

// ─── Color config ─────────────────────────────────────────────────────────────
const CAT_COLORS: Record<string, { text: string; bar: string; bg: string; border: string }> = {
  cyan:    { text: 'text-cyan-400',    bar: 'bg-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20'    },
  amber:   { text: 'text-amber-400',   bar: 'bg-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20'   },
  green:   { text: 'text-green-400',   bar: 'bg-green-400',   bg: 'bg-green-500/10',   border: 'border-green-500/20'   },
  violet:  { text: 'text-violet-400',  bar: 'bg-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20'  },
  emerald: { text: 'text-emerald-400', bar: 'bg-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
};

const VERIF_CONFIG: Record<VerifStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  cleared: { label: 'Cleared',  color: 'text-emerald-400', bg: 'bg-emerald-500/12', border: 'border-emerald-500/25', dot: 'bg-emerald-400' },
  partial: { label: 'Partial',  color: 'text-amber-400',   bg: 'bg-amber-500/12',   border: 'border-amber-500/25',   dot: 'bg-amber-400'   },
  held:    { label: 'Held',     color: 'text-red-400',      bg: 'bg-red-500/12',     border: 'border-red-500/25',     dot: 'bg-red-400'     },
};

// ─── Summary Totals ──────────────────────────────────────────────────────────
const totalSanctioned = GP_DISBURSEMENTS.reduce((s, g) => s + g.sanctioned, 0);
const totalDisbursed  = GP_DISBURSEMENTS.reduce((s, g) => s + g.disbursed, 0);
const totalPending    = totalSanctioned - totalDisbursed;

// ─── Category Expenditure Card ────────────────────────────────────────────────
const CategoryCard = ({ cat }: { cat: typeof CATEGORY_EXPENDITURE[0] }) => {
  const c = CAT_COLORS[cat.color];
  const pct = Math.round((cat.spent / cat.budget) * 100);
  return (
    <div className={`glass-card p-4 border ${c.border} group hover:scale-[1.01] transition-transform duration-200`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${c.bg} border ${c.border}`}>
          {cat.icon}
        </div>
        <span className={`${c.text} text-xs font-mono font-bold`}>{pct}%</span>
      </div>
      <p className="text-white text-xs font-semibold mb-0.5">{cat.name}</p>
      <p className="text-slate-500 text-[10px] mb-2">{cat.count} structures · ₹{cat.spent.toFixed(1)}L / ₹{cat.budget.toFixed(1)}L</p>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// ─── Main FinancialsPanel ──────────────────────────────────────────────────────
const FinancialsPanel = () => {
  const [sortKey, setSortKey] = useState<'gp' | 'sanctioned' | 'disbursed' | 'pct' | 'status'>('status');
  const [filterStatus, setFilterStatus] = useState<VerifStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const sorted = [...GP_DISBURSEMENTS]
    .filter(g => filterStatus === 'all' || g.verifStatus === filterStatus)
    .filter(g => !search || g.gp.toLowerCase().includes(search.toLowerCase()) || g.district.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === 'gp')          return a.gp.localeCompare(b.gp);
      if (sortKey === 'sanctioned')  return b.sanctioned - a.sanctioned;
      if (sortKey === 'disbursed')   return b.disbursed - a.disbursed;
      if (sortKey === 'pct')         return (b.disbursed / b.sanctioned) - (a.disbursed / a.sanctioned);
      // status sort: held first, then partial, then cleared
      const order = { held: 0, partial: 1, cleared: 2 };
      return order[a.verifStatus] - order[b.verifStatus];
    });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-white font-bold text-xl mb-1" style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
            Financial & Disbursement Tracker
          </h2>
          <p className="text-slate-500 text-sm">Fund flow monitoring · PMKSY-WDC & MGNREGS AY 2024-25</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-emerald-400 text-base font-bold font-mono">₹{totalDisbursed.toFixed(1)}L</p>
            <p className="text-emerald-600 text-[9px] uppercase tracking-wide">Disbursed</p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
            <p className="text-amber-400 text-base font-bold font-mono">₹{totalPending.toFixed(1)}L</p>
            <p className="text-amber-600 text-[9px] uppercase tracking-wide">Pending</p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/8 text-center">
            <p className="text-white text-base font-bold font-mono">₹{totalSanctioned.toFixed(1)}L</p>
            <p className="text-slate-500 text-[9px] uppercase tracking-wide">Sanctioned</p>
          </div>
        </div>
      </div>

      {/* ── Category Expenditure Cards ── */}
      <section>
        <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-3">Category-wise Expenditure</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORY_EXPENDITURE.map(cat => <CategoryCard key={cat.name} cat={cat} />)}
        </div>
      </section>

      {/* ── Total Progress Bar ── */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-semibold">Overall Fund Utilisation</span>
          <span className="text-emerald-400 text-sm font-mono font-bold">{Math.round((totalDisbursed / totalSanctioned) * 100)}%</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400"
            style={{ width: `${(totalDisbursed / totalSanctioned) * 100}%`, boxShadow: '0 0 12px rgba(52,211,153,0.4)' }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>₹{totalDisbursed.toFixed(1)}L disbursed</span>
          <span className="text-amber-400">₹{totalPending.toFixed(1)}L remaining</span>
          <span>₹{totalSanctioned.toFixed(1)}L total sanctioned</span>
        </div>
      </div>

      {/* ── GP Disbursement Table ── */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest">
            Gram Panchayat-wise Disbursement
          </h3>
          <div className="flex gap-2 flex-wrap">
            {/* Filter */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-900/60 border border-white/5 rounded-lg text-xs">
              {(['all', 'cleared', 'partial', 'held'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 rounded-md font-medium capitalize transition-all ${
                    filterStatus === s ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {/* Search */}
            <div className="relative">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search GP…"
                className="pl-7 pr-3 py-1.5 bg-slate-900/60 border border-white/8 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40 w-36 transition-colors"
              />
            </div>
            {/* Sort */}
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value as typeof sortKey)}
              className="bg-slate-900/60 border border-white/8 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none"
            >
              <option value="status">Sort: Status</option>
              <option value="sanctioned">Sort: Sanctioned</option>
              <option value="disbursed">Sort: Disbursed</option>
              <option value="pct">Sort: Utilisation</option>
              <option value="gp">Sort: GP Name</option>
            </select>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/6 overflow-hidden">
          {/* Table Head */}
          <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_0.7fr_2fr_1fr] gap-4 px-5 py-3 bg-slate-900/60 border-b border-white/5 text-[10px] font-mono uppercase tracking-widest text-slate-500">
            <span>Gram Panchayat</span>
            <span className="text-right">Sanctioned (₹L)</span>
            <span className="text-right">Disbursed (₹L)</span>
            <span className="text-right">Pending (₹L)</span>
            <span className="text-center">Structs.</span>
            <span>Utilisation</span>
            <span className="text-center">Status</span>
          </div>

          <div className="divide-y divide-white/4">
            {sorted.map(g => {
              const pending = g.sanctioned - g.disbursed;
              const pct = g.sanctioned > 0 ? Math.round((g.disbursed / g.sanctioned) * 100) : 0;
              const vc = VERIF_CONFIG[g.verifStatus];
              return (
                <div
                  key={g.gp}
                  className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_0.7fr_2fr_1fr] gap-4 px-5 py-3.5 hover:bg-slate-800/20 transition-colors duration-150 items-center"
                >
                  {/* GP Name */}
                  <div>
                    <p className="text-white text-xs font-semibold">{g.gp}</p>
                    <p className="text-slate-500 text-[10px] font-mono">{g.district}, {g.state}</p>
                  </div>
                  {/* Sanctioned */}
                  <div className="text-right">
                    <span className="text-white text-xs font-mono font-semibold">₹{g.sanctioned.toFixed(2)}</span>
                  </div>
                  {/* Disbursed */}
                  <div className="text-right">
                    <span className={`text-xs font-mono font-semibold ${g.disbursed > 0 ? 'text-emerald-400' : 'text-slate-600'}`}>
                      ₹{g.disbursed.toFixed(2)}
                    </span>
                  </div>
                  {/* Pending */}
                  <div className="text-right">
                    <span className={`text-xs font-mono ${pending > 0 ? 'text-amber-400' : 'text-slate-600'}`}>
                      ₹{pending.toFixed(2)}
                    </span>
                  </div>
                  {/* Structures */}
                  <div className="text-center">
                    <span className="text-slate-300 text-xs font-mono">{g.structures}</span>
                  </div>
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            pct >= 90 ? 'bg-emerald-400' : pct >= 60 ? 'bg-green-400' : pct >= 30 ? 'bg-amber-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 w-8 flex-shrink-0">{pct}%</span>
                    </div>
                  </div>
                  {/* Status */}
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${vc.color} ${vc.bg} ${vc.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${vc.dot}`} />
                      {vc.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr_0.7fr_2fr_1fr] gap-4 px-5 py-3 bg-slate-900/40 border-t border-white/8">
            <span className="text-slate-400 text-[11px] font-semibold">TOTAL ({GP_DISBURSEMENTS.length} GPs)</span>
            <span className="text-white text-xs font-mono font-bold text-right">₹{totalSanctioned.toFixed(2)}</span>
            <span className="text-emerald-400 text-xs font-mono font-bold text-right">₹{totalDisbursed.toFixed(2)}</span>
            <span className="text-amber-400 text-xs font-mono font-bold text-right">₹{totalPending.toFixed(2)}</span>
            <span className="text-slate-400 text-xs font-mono text-center">{GP_DISBURSEMENTS.reduce((s, g) => s + g.structures, 0)}</span>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
                  style={{ width: `${Math.round((totalDisbursed / totalSanctioned) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 w-8 flex-shrink-0">{Math.round((totalDisbursed / totalSanctioned) * 100)}%</span>
            </div>
            <div></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinancialsPanel;
