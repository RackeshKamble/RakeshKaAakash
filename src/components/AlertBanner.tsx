interface AlertBannerProps {
  alerts: string[];
  fallbackLabel: string;
  title: string;
}

export default function AlertBanner({ alerts, fallbackLabel, title }: AlertBannerProps) {
  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{title}</h3>
      </div>
      {alerts.length > 0 ? (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.75rem' }}>
          {alerts.map((alert, index) => (
            <li key={`${alert}-${index}`} style={{ borderRadius: '18px', background: 'var(--surface-muted)', padding: '0.85rem', color: 'var(--text)' }}>
              <strong>⚠️</strong> {alert}
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ borderRadius: '18px', background: 'var(--surface-muted)', padding: '0.85rem', color: 'var(--text-muted)' }}>
          {fallbackLabel}
        </div>
      )}
    </div>
  );
}
