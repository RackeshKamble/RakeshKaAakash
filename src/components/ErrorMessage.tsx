interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  retryLabel: string;
}

export default function ErrorMessage({ message, onRetry, retryLabel }: ErrorMessageProps) {
  return (
    <div style={{ borderRadius: '20px', border: '1px solid var(--danger)', padding: '1rem', background: 'rgba(220, 38, 38, 0.08)', color: 'var(--text)' }} role="alert">
      <p style={{ margin: 0, fontWeight: 700 }}>⚠️ {message}</p>
      <button type="button" onClick={onRetry} style={{ marginTop: '0.75rem', borderRadius: '18px', border: 'none', padding: '0.85rem 1rem', background: 'var(--danger)', color: '#fff' }}>
        {retryLabel}
      </button>
    </div>
  );
}
