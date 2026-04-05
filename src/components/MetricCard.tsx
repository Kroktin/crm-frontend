import React from 'react';

interface Props {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon: string;
}

export const MetricCard: React.FC<Props> = ({ label, value, sub, color = 'var(--accent)', icon }) => (
  <div style={{
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: 0, right: 0,
      width: 80, height: 80, borderRadius: '0 12px 0 80px',
      background: color, opacity: 0.08,
    }} />
    <div style={{ fontSize: 22 }}>{icon}</div>
    <div style={{ fontSize: 26, fontWeight: 800, color }}>{value}</div>
    <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{label}</div>
    {sub && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub}</div>}
  </div>
);
