import type { LanguageCode } from '../types';

interface LanguageSwitcherProps {
  language: LanguageCode;
  languages: LanguageCode[];
  onChange: (lang: LanguageCode) => void;
  label: string;
}

export default function LanguageSwitcher({ language, languages, onChange, label }: LanguageSwitcherProps) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <span className="visually-hidden">{label}</span>
      <select
        value={language}
        onChange={(event) => onChange(event.target.value as LanguageCode)}
        style={{ borderRadius: '18px', border: '1px solid var(--border)', padding: '0.75rem 1rem', background: 'var(--surface)', color: 'var(--text)' }}
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
