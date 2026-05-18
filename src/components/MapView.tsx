import type { CitySearchResult } from '../types';

interface MapViewProps {
  location: CitySearchResult;
}

export default function MapView({ location }: MapViewProps) {
  const { lat, lon, name, region, country } = location;
  const bboxOffset = 0.8;
  const left = lon - bboxOffset;
  const right = lon + bboxOffset;
  const top = lat + bboxOffset;
  const bottom = lat - bboxOffset;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${left},${bottom},${right},${top}&layer=mapnik&marker=${lat},${lon}`;

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <p style={{ margin: 0, fontWeight: 700 }}>{name}, {region || country}</p>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Coords: {lat.toFixed(2)}, {lon.toFixed(2)}</p>
      </div>
      <div style={{ borderRadius: '24px', overflow: 'hidden', minHeight: '320px', background: 'var(--surface-muted)' }}>
        <iframe
          title={`Map for ${name}`}
          src={src}
          style={{ width: '100%', minHeight: '320px', border: 0 }}
          loading="lazy"
        />
      </div>
      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Interact with the map to preview the city location and terrain.</p>
    </div>
  );
}
