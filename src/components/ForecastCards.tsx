import type { ForecastDay } from '../types';

interface ForecastCardsProps {
  forecast: ForecastDay[];
  formatTemperature: (value: number, unit: 'C' | 'F') => string;
  timezone?: string;
}

function formatForecastDate(dateString: string, timezone?: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  if (timezone) {
    try {
      return new Intl.DateTimeFormat(undefined, { ...options, timeZone: timezone }).format(date);
    } catch {
      return date.toLocaleDateString(undefined, options);
    }
  }
  return date.toLocaleDateString(undefined, options);
}

export default function ForecastCards({ forecast, formatTemperature, timezone }: ForecastCardsProps) {
  return (
    <div style={{ display: 'grid', gap: '0.85rem' }}>
      {forecast.map((day) => (
        <article key={day.date} style={{ display: 'grid', gap: '0.8rem', borderRadius: '20px', background: 'var(--surface-muted)', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>{formatForecastDate(day.date, timezone)}</p>
              <p style={{ margin: '0.25rem 0 0', fontWeight: 700 }}>{day.day.condition.text}</p>
            </div>
            <img src={`https:${day.day.condition.icon}`} alt={day.day.condition.text} width={48} height={48} />
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <p style={{ margin: 0 }}>{formatTemperature(day.day.maxtemp_c, 'C')} / {formatTemperature(day.day.mintemp_c, 'C')}</p>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Humidity: {day.day.avghumidity}%</p>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Rain chance: {day.day.daily_chance_of_rain ?? 0}%</p>
          </div>
        </article>
      ))}
    </div>
  );
}
