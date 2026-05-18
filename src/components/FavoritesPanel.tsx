import type { CitySearchResult } from '../types';

interface FavoritesPanelProps {
  favorites: CitySearchResult[];
  onSelect: (city: CitySearchResult) => void;
  onRemove: (city: CitySearchResult) => void;
  noFavoritesText: string;
  removeLabel: string;
}

export default function FavoritesPanel({ favorites, onSelect, onRemove, noFavoritesText, removeLabel }: FavoritesPanelProps) {
  if (favorites.length === 0) {
    return <p style={{ margin: 0, color: 'var(--text-muted)' }}>{noFavoritesText}</p>;
  }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.75rem' }}>
      {favorites.map((city) => (
        <li key={`${city.name}-${city.region}-${city.country}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', borderRadius: '18px', background: 'var(--surface-muted)', padding: '0.85rem' }}>
            <button type="button" onClick={() => onSelect(city)} style={{ flex: 1, textAlign: 'left', border: 'none', background: 'transparent', color: 'var(--text)' }}>
              {city.name}, {city.region || city.country}
            </button>
            <button type="button" onClick={() => onRemove(city)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', fontWeight: 700 }}>
              {removeLabel}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
