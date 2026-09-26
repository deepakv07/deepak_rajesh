import { useEffect, useState } from 'react';
import type { AppTheme } from '../App';

interface HeaderProps {
  theme: AppTheme;
  T: Record<string, string>;
}

const Header = ({ theme, T }: HeaderProps) => {
  const [time, setTime] = useState(new Date());
  const isDark = theme === 'dark';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString('en-IN', { hour12: false });
  const dateStr = time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header
      style={{
        background: T.chromeBg,
        borderBottom: `1px solid ${T.chromeBorder}`,
        boxShadow: isDark
          ? '0 1px 0 rgba(34,197,94,0.08), 0 4px 24px rgba(0,0,0,0.4)'
          : '0 1px 0 rgba(22,163,74,0.1), 0 2px 12px rgba(0,0,0,0.06)',
        flexShrink: 0,
        transition: 'background 0.3s ease, box-shadow 0.3s ease',
        position: 'relative',
        zIndex: 50,
      }}
    >
      {/* ── Top Ticker Bar ── */}
      <div style={{
        background: T.tickerBg,
        borderBottom: `1px solid ${T.tickerBorder}`,
        padding: '5px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'background 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span className="status-dot status-dot-green" style={{ width: 6, height: 6 }} />
            <span style={{ color: T.tickerText, fontWeight: 700, fontSize: 10, letterSpacing: '0.05em', fontFamily: 'JetBrains Mono, monospace' }}>
              Tamil Nadu Basin Watch — Cauvery Delta &amp; Vaigai Catchments
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 9, color: isDark ? '#475569' : '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'monospace' }}>NODE</span>
            <span style={{ fontSize: 10, color: isDark ? '#22d3ee' : '#0891b2', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>TN-NODE-CHNAI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="status-dot status-dot-cyan animate-blink" style={{ width: 6, height: 6 }} />
            <span style={{ fontSize: 10, color: isDark ? '#22d3ee' : '#0891b2', fontWeight: 600 }}>Sentinel-2 Live Sync</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
          <span style={{ color: isDark ? '#475569' : '#94a3b8' }}>{dateStr}</span>
          <span style={{ color: T.tickerText, fontWeight: 700, letterSpacing: '0.06em' }}>IST</span>
        </div>
      </div>

      {/* ── Main Header Row ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 20px' }}>

        {/* Left: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {/* Logo mark */}
          <div style={{ position: 'relative', width: 40, height: 40 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: isDark
                ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(6,182,212,0.1))'
                : 'linear-gradient(135deg, rgba(22,163,74,0.12), rgba(8,145,178,0.08))',
              border: isDark ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(22,163,74,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: isDark ? '0 0 20px rgba(34,197,94,0.15)' : '0 2px 8px rgba(22,163,74,0.12)',
              transition: 'background 0.3s ease, border-color 0.3s ease',
            }}>
              <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
                <path d="M16 4 C16 4 9 12 9 16 C9 19.866 12.134 23 16 23 C19.866 23 23 19.866 23 16 C23 12 16 4 16 4 Z"
                  fill="url(#hGrad)" opacity="0.95" />
                <path d="M6 18 Q16 16.5 26 18" stroke={isDark ? '#22d3ee' : '#0891b2'} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 22 C13 21 19 21 22 22" stroke={isDark ? '#4ade80' : '#16a34a'} strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
                <defs>
                  <linearGradient id="hGrad" x1="9" y1="4" x2="23" y2="23" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0284c7" />
                    <stop offset="1" stopColor={isDark ? '#22c55e' : '#16a34a'} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full animate-pulse-glow"
              style={{ background: isDark ? '#22c55e' : '#16a34a', border: `2px solid ${isDark ? '#070f1f' : '#ffffff'}` }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{
                fontWeight: 900, fontSize: 17, letterSpacing: '-0.02em', lineHeight: 1,
                color: isDark ? '#f1f5f9' : '#0f172a',
                transition: 'color 0.3s ease',
              }}>
                NeerDarpan
              </h1>
              <span style={{
                background: isDark ? 'rgba(34,197,94,0.12)' : 'rgba(22,163,74,0.1)',
                border: isDark ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(22,163,74,0.25)',
                color: isDark ? '#4ade80' : '#16a34a',
                fontSize: 9, fontWeight: 800, letterSpacing: '0.1em',
                padding: '2px 8px', borderRadius: 20,
                transition: 'all 0.3s ease',
              }}>
                Tamil Nadu
              </span>
            </div>
            <p style={{ fontSize: 10, color: isDark ? '#475569' : '#94a3b8', fontWeight: 500, marginTop: 2, transition: 'color 0.3s ease' }}>
              Tamil Nadu Geospatial Watershed Intelligence Portal
            </p>
          </div>
        </div>

        {/* Center: context pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="hidden xl:flex">
          {[
            {
              children: <>
                <span className="status-dot status-dot-green" style={{ width: 6, height: 6 }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569' }}>
                  Tamil Nadu Basin Watch — Cauvery Delta &amp; Vaigai Catchments
                </span>
              </>,
            },
            {
              children: <>
                <span style={{ fontSize: 9, fontWeight: 700, color: isDark ? '#475569' : '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>NODE</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#22d3ee' : '#0891b2', fontFamily: 'JetBrains Mono, monospace' }}>TN-NODE-CHNAI</span>
              </>,
            },
            {
              green: true,
              children: <>
                <span className="status-dot status-dot-green" style={{ width: 5, height: 5 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#4ade80' : '#16a34a' }}>Sentinel-2 Live Sync</span>
              </>,
            },
          ].map((pill, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 24,
              background: pill.green
                ? isDark ? 'rgba(34,197,94,0.07)' : 'rgba(22,163,74,0.07)'
                : isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc',
              border: pill.green
                ? isDark ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(22,163,74,0.2)'
                : isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
            }}>
              {pill.children}
            </div>
          ))}
        </div>

        {/* Right: Clock + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 700,
              color: isDark ? '#f1f5f9' : '#0f172a', letterSpacing: '0.05em', lineHeight: 1,
              transition: 'color 0.3s ease',
            }}>
              {timeStr}
            </div>
            <div style={{ fontSize: 10, color: isDark ? '#475569' : '#94a3b8', marginTop: 3, letterSpacing: '0.04em' }}>
              {dateStr} IST
            </div>
          </div>

          <div style={{
            padding: '8px 14px', borderRadius: 10,
            background: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
            border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
          }} className="hidden sm:flex flex-col items-center justify-center">
            <span style={{ fontSize: 9, fontWeight: 900, color: isDark ? '#4ade80' : '#16a34a', letterSpacing: '0.12em' }}>TN GOVT</span>
            <span style={{ fontSize: 8, fontWeight: 600, color: isDark ? '#475569' : '#94a3b8', letterSpacing: '0.06em', marginTop: 1 }}>DoLR / WDC</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
