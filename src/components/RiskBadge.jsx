export default function RiskBadge({ risk, size = 'sm', showLabel = true }) {
  const config = {
    none:   { label: 'No Tariff',     cls: 'badge-none'   },
    low:    { label: 'Low Risk',      cls: 'badge-low'    },
    medium: { label: 'Medium Risk',   cls: 'badge-medium' },
    high:   { label: 'High Risk',     cls: 'badge-high'   },
  };
  const { label, cls } = config[risk] ?? config.none;

  return (
    <span className={`risk-badge ${cls} risk-badge-${size}`}>
      <span className="risk-dot" />
      {showLabel && label}
    </span>
  );
}
