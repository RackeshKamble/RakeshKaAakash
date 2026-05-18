interface ViewTabsProps {
  active: 'dashboard' | 'forecast' | 'map';
  options: Array<{ key: 'dashboard' | 'forecast' | 'map'; label: string }>;
  onChange: (value: 'dashboard' | 'forecast' | 'map') => void;
}

export default function ViewTabs({ active, options, onChange }: ViewTabsProps) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {options.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => onChange(option.key)}
          aria-pressed={active === option.key}
          style={{
            borderRadius: '18px',
            border: active === option.key ? '1px solid var(--primary-strong)' : '1px solid var(--border)',
            background: active === option.key ? 'var(--primary)' : 'var(--surface)',
            color: active === option.key ? '#fff' : 'var(--text)',
            padding: '0.85rem 1rem',
            minWidth: '120px',
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
