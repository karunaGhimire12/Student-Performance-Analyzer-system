// src/components/SummaryCard.jsx
import './SummaryCard.css';

export default function SummaryCard({ title, value, subtitle, icon, color = 'primary', trend }) {
  return (
    <div className={`summary-card summary-card--${color}`}>
      <div className="summary-card-top">
        <div className="summary-card-icon">{icon}</div>
        {trend !== undefined && (
          <span className={`summary-trend ${trend >= 0 ? 'up' : 'down'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="summary-card-value">{value ?? '—'}</div>
      <div className="summary-card-title">{title}</div>
      {subtitle && <div className="summary-card-sub">{subtitle}</div>}
    </div>
  );
}
