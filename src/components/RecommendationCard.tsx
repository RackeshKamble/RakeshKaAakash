interface RecommendationCardProps {
  title: string;
  text: string;
}

export default function RecommendationCard({ title, text }: RecommendationCardProps) {
  return (
    <div style={{ borderRadius: '20px', background: 'var(--surface-muted)', padding: '1rem', display: 'grid', gap: '0.75rem' }}>
      <p style={{ margin: 0, fontWeight: 700 }}>{title}</p>
      <p style={{ margin: 0, color: 'var(--text-muted)' }}>{text}</p>
    </div>
  );
}
