import React, { useState } from 'react';
import type { AppTheme } from '../../App';

interface Task {
  id: string;
  loc: string;
  issue: string;
  priority: string;
  status: 'pending' | 'verified' | 'conflict' | 'more';
}

interface Props {
  theme: AppTheme;
  tasksList: Task[];
  onOpenPhoto?: (taskId: string) => void;
  onSubmitEvidence?: () => void;
}

export const FieldVerificationWorkspace: React.FC<Props> = ({
  theme,
  tasksList,
  onOpenPhoto,
  onSubmitEvidence,
}) => {
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState<string>('all');

  const cardBg = isDark ? '#0a1628' : '#ffffff';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : '#dae3ec';
  const textCol = isDark ? '#f1f5f9' : '#0b2942';
  const dimCol = isDark ? '#94a3b8' : '#5b7185';

  const badgeStyles: Record<string, React.CSSProperties> = {
    pending: { background: isDark ? 'rgba(202,138,5,0.2)' : '#FBF1DC', color: isDark ? '#facc15' : '#C98A05' },
    verified: { background: isDark ? 'rgba(46,158,92,0.2)' : '#E7F6ED', color: isDark ? '#4ade80' : '#2E9E5C' },
    conflict: { background: isDark ? 'rgba(210,72,62,0.2)' : '#FBEAE8', color: isDark ? '#f87171' : '#D2483E' },
    more: { background: isDark ? 'rgba(14,134,176,0.2)' : '#E6F4F9', color: isDark ? '#38bdf8' : '#0E86B0' },
  };

  const badgeLabels: Record<string, string> = {
    pending: 'Pending',
    verified: 'Verified',
    conflict: 'Conflicting',
    more: 'Needs more data',
  };

  const filteredTasks = tasksList.filter((t) => filter === 'all' || t.status === filter);

  return (
    <div style={{ padding: '24px 28px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: textCol }}>
          Field Verification Workspace
        </h1>
        <p style={{ color: dimCol, fontSize: 13, margin: '4px 0 0' }}>
          Convert satellite anomalies into targeted ground evidence collection tasks.
        </p>
      </div>

      {/* Workflow Pipeline */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: dimCol, textTransform: 'uppercase', marginBottom: 10 }}>
          Verification Workflow Pipeline
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          {[
            { label: 'Task created', dot: '#2E9E5C' },
            { label: 'Assigned', dot: '#2E9E5C' },
            { label: 'Field captured', dot: '#C98A05' },
            { label: 'Uploaded', dot: dimCol },
            { label: 'Metadata checked', dot: dimCol },
            { label: 'Photo interpreted', dot: dimCol },
            { label: 'Human verified', dot: dimCol },
            { label: 'Accepted', dot: dimCol },
          ].map((node, i, arr) => (
            <React.Fragment key={i}>
              <div
                style={{
                  border: `1px solid ${borderCol}`,
                  background: cardBg,
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  color: textCol,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: node.dot }} />
                {node.label}
              </div>
              {i < arr.length - 1 && <span style={{ color: dimCol, fontSize: 12 }}>→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Task Queue Controls */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: dimCol, textTransform: 'uppercase', marginBottom: 10 }}>
          Verification Task Queue
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'pending', label: 'Pending' },
            { id: 'verified', label: 'Verified' },
            { id: 'conflict', label: 'Conflicting' },
            { id: 'more', label: 'Needs More Data' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                border: `1px solid ${filter === f.id ? (isDark ? '#38bdf8' : '#0e86b0') : borderCol}`,
                background: filter === f.id ? (isDark ? 'rgba(56,189,248,0.15)' : '#e6f4f9') : cardBg,
                color: filter === f.id ? (isDark ? '#38bdf8' : '#0b688a') : dimCol,
                padding: '6px 14px',
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Queue Table */}
      <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${borderCol}`, background: isDark ? '#070f1f' : '#f8fafc' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', color: dimCol, fontSize: 11, fontWeight: 700 }}>TASK ID</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', color: dimCol, fontSize: 11, fontWeight: 700 }}>LOCATION</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', color: dimCol, fontSize: 11, fontWeight: 700 }}>TARGET ISSUE</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', color: dimCol, fontSize: 11, fontWeight: 700 }}>PRIORITY</th>
              <th style={{ padding: '10px 14px', textAlign: 'left', color: dimCol, fontSize: 11, fontWeight: 700 }}>STATUS</th>
              <th style={{ padding: '10px 14px', textAlign: 'right', color: dimCol, fontSize: 11, fontWeight: 700 }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((t) => (
              <tr key={t.id} style={{ borderBottom: `1px solid ${borderCol}` }}>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 700, color: textCol }}>{t.id}</td>
                <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: dimCol }}>{t.loc}</td>
                <td style={{ padding: '12px 14px', color: textCol, fontWeight: 600 }}>{t.issue}</td>
                <td style={{ padding: '12px 14px', color: textCol }}>{t.priority}</td>
                <td style={{ padding: '12px 14px' }}>
                  <span
                    style={{
                      ...badgeStyles[t.status],
                      padding: '3px 10px',
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {badgeLabels[t.status]}
                  </span>
                </td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                  <button
                    onClick={() => onOpenPhoto && onOpenPhoto(t.id)}
                    style={{
                      background: 'none',
                      border: `1px solid ${borderCol}`,
                      color: isDark ? '#38bdf8' : '#0e86b0',
                      padding: '5px 12px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Open Photo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Field Form */}
      <div style={{ background: cardBg, border: `1px solid ${borderCol}`, borderRadius: 8, padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: textCol, marginBottom: 14 }}>
          Field Data Collection Form (Mobile Web Sync)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4 }}>Latitude</label>
            <input
              readOnly
              value="12.9812° N"
              style={{
                width: '100%',
                border: `1px solid ${borderCol}`,
                padding: '8px 10px',
                borderRadius: 6,
                background: isDark ? '#070f1f' : '#f8fafc',
                color: textCol,
                fontSize: 13,
                fontFamily: 'monospace',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4 }}>Longitude</label>
            <input
              readOnly
              value="80.1247° E"
              style={{
                width: '100%',
                border: `1px solid ${borderCol}`,
                padding: '8px 10px',
                borderRadius: 6,
                background: isDark ? '#070f1f' : '#f8fafc',
                color: textCol,
                fontSize: 13,
                fontFamily: 'monospace',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4 }}>GPS Accuracy</label>
            <input
              readOnly
              value="±4 m (RTK Fix)"
              style={{
                width: '100%',
                border: `1px solid ${borderCol}`,
                padding: '8px 10px',
                borderRadius: 6,
                background: isDark ? '#070f1f' : '#f8fafc',
                color: textCol,
                fontSize: 13,
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: dimCol, marginBottom: 4 }}>Field Officer</label>
            <input
              readOnly
              value="R. Kumar (WDC-TN)"
              style={{
                width: '100%',
                border: `1px solid ${borderCol}`,
                padding: '8px 10px',
                borderRadius: 6,
                background: isDark ? '#070f1f' : '#f8fafc',
                color: textCol,
                fontSize: 13,
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={{ background: cardBg, border: `1px solid ${borderCol}`, color: textCol, padding: '8px 16px', borderRadius: 6, fontSize: 12.5, cursor: 'pointer' }}>
            Acquire Live GPS
          </button>
          <button style={{ background: cardBg, border: `1px solid ${borderCol}`, color: textCol, padding: '8px 16px', borderRadius: 6, fontSize: 12.5, cursor: 'pointer' }}>
            Upload Field Photo
          </button>
          <button style={{ background: cardBg, border: `1px solid ${borderCol}`, color: textCol, padding: '8px 16px', borderRadius: 6, fontSize: 12.5, cursor: 'pointer' }}>
            Save Draft
          </button>
          <button
            onClick={() => onSubmitEvidence && onSubmitEvidence()}
            style={{ background: isDark ? '#38bdf8' : '#0e86b0', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 6, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}
          >
            Submit Evidence
          </button>
        </div>
      </div>
    </div>
  );
};
export default FieldVerificationWorkspace;
