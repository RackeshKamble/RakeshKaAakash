interface ThemeToggleProps {
  theme: 'day' | 'night';
  onToggle: () => void;
  label: string;
}

export default function ThemeToggle({ theme, onToggle, label }: ThemeToggleProps) {
  return (
    <button type="button" onClick={onToggle} style={{ borderRadius: '18px', border: '1px solid var(--border)', padding: '0.75rem 1rem', background: 'var(--surface)', color: 'var(--text)' }} aria-label={label}>
      {theme === 'day' ? '☀️ Day' : '🌙 Night'}
    </button>
  );
}
