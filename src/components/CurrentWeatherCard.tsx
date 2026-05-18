import type { WeatherSnapshot, CitySearchResult } from '../types';

interface CurrentWeatherCardProps {
  city: CitySearchResult;
  weather: WeatherSnapshot;
  aqi?: Record<string, number>;
  alertCount: number;
  offline: boolean;
  localTimeLabel: string;
  conditionIcon: string;
  conditionText: string;
  formatTemperature: (value: number, unit: 'C' | 'F') => string;
  recommendation: string;
}

export default function CurrentWeatherCard({
  city,
  weather,
  aqi,
  alertCount,
  offline,
  localTimeLabel,
  conditionIcon,
  conditionText,
  formatTemperature,
  recommendation,
}: CurrentWeatherCardProps) {
  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>{city.name}, {city.region || city.country}</p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            {localTimeLabel}: {weather.last_updated}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <img src={conditionIcon} alt={conditionText} width={64} height={64} />
          <div>
            <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 700 }}>{formatTemperature(weather.temp_c, 'C')}</p>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)' }}>{conditionText}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
          <div style={{ borderRadius: '18px', background: 'var(--surface-muted)', padding: '0.85rem' }}>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>AQI</p>
            <p style={{ margin: '0.25rem 0 0', fontWeight: 700 }}>{aqi ? Math.round(aqi['us-epa-index'] ?? aqi['gb-defra-index'] ?? 0) : '—'}</p>
          </div>
          <div style={{ borderRadius: '18px', background: 'var(--surface-muted)', padding: '0.85rem' }}>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Humidity</p>
            <p style={{ margin: '0.25rem 0 0', fontWeight: 700 }}>{weather.humidity}%</p>
          </div>
          <div style={{ borderRadius: '18px', background: 'var(--surface-muted)', padding: '0.85rem' }}>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Alerts</p>
            <p style={{ margin: '0.25rem 0 0', fontWeight: 700 }}>{alertCount}</p>
          </div>
        </div>
        <div style={{ borderRadius: '18px', background: 'var(--surface-muted)', padding: '1rem' }}>
          <p style={{ margin: 0, fontWeight: 700 }}>Feels like {formatTemperature(weather.feelslike_c, 'C')}</p>
          {offline && (
            <p style={{ margin: '0.5rem 0 0', color: 'var(--warning)' }}>Offline or cached data in use.</p>
          )}
        </div>
      </div>
    </div>
  );
}
