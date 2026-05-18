export default function LoadingSkeleton() {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {[...Array(3)].map((_, index) => (
        <div key={index} style={{ borderRadius: '20px', background: 'var(--surface-muted)', minHeight: '72px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
      <style>{`@keyframes pulse { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }`}</style>
    </div>
  );
}
