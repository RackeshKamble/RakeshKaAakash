import type { CitySearchResult } from '../types';

interface SearchBarProps {
  label: string;
  placeholder: string;
  value: string;
  results: CitySearchResult[];
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSelect: (city: CitySearchResult) => void;
}

export default function SearchBar({ label, placeholder, value, results, onChange, onSubmit, onSelect }: SearchBarProps) {
  return (
    <div>
      <label htmlFor="city-search" className="visually-hidden">
        {label}
      </label>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            id="city-search"
            name="city-search"
            type="search"
            aria-label={label}
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onSubmit();
              }
            }}
            style={{
              flex: 1,
              minWidth: 0,
              borderRadius: '18px',
              border: '1px solid var(--border)',
              padding: '0.95rem 1rem',
              background: 'var(--surface)',
              color: 'var(--text)',
            }}
          />
          <button type="button" onClick={onSubmit} style={{ borderRadius: '18px', padding: '0.95rem 1rem', border: 'none', background: 'var(--primary)', color: '#fff' }}>
            {label}
          </button>
        </div>
        {results.length > 0 && (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Select a result to narrow your search.</p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.5rem' }}>
              {results.map((item) => (
                <li key={`${item.name}-${item.region}-${item.country}`}>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface)',
                      padding: '0.85rem 1rem',
                      color: 'var(--text)',
                    }}
                  >
                    {item.name}, {item.region || item.country}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
