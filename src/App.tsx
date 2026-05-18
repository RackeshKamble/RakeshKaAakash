import { useEffect, useMemo, useState } from 'react';
import type { CitySearchResult, LanguageCode, WeatherApiResult } from './types';
import { searchCities, loadWeatherForCity } from './services/weatherApi';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { useLocalStorage } from './hooks/useLocalStorage';
import { t } from './i18n/translations';
import { getConditionIcon, getWeatherRecommendation, formatTemperature } from './utils/weatherUtils';
import SearchBar from './components/SearchBar';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ForecastCards from './components/ForecastCards';
import MapView from './components/MapView';
import FavoritesPanel from './components/FavoritesPanel';
import AlertBanner from './components/AlertBanner';
import ThemeToggle from './components/ThemeToggle';
import LanguageSwitcher from './components/LanguageSwitcher';
import ViewTabs from './components/ViewTabs';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorMessage from './components/ErrorMessage';
import RecommendationCard from './components/RecommendationCard';

const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'hi'];

function App() {
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState<'dashboard' | 'forecast' | 'map'>('forecast');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null);
  const [weatherResponse, setWeatherResponse] = useState<WeatherApiResult | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [favorites, setFavorites] = useLocalStorage<CitySearchResult[]>('weather-favorites', []);
  const [theme, setTheme] = useLocalStorage<'day' | 'night'>('weather-theme', 'day');
  const [language, setLanguage] = useLocalStorage<LanguageCode>('weather-language', 'en');
  const [currentDateTime, setCurrentDateTime] = useState('');

  const debouncedQuery = useDebouncedValue(query, 450);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const updateDateTime = () => setCurrentDateTime(formatter.format(new Date()));
    updateDateTime();
    const interval = window.setInterval(updateDateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    let active = true;
    searchCities(debouncedQuery).then((items) => {
      if (active) {
        setResults(items.slice(0, 6));
      }
    });
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const selectedName = useMemo(() => {
    if (!selectedCity) {
      return '';
    }
    return `${selectedCity.name}, ${selectedCity.region || selectedCity.country}`;
  }, [selectedCity]);

  const handleSearch = async (value: string, city?: CitySearchResult) => {
    const input = city ? `${city.name}, ${city.region || city.country}`.trim() : value.trim();
    if (!input) {
      setErrorMessage(t('cityNotFound', language));
      setWeatherResponse(null);
      setSelectedCity(null);
      setResults([]);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setStatusMessage(t('loading', language));
    setOfflineMode(false);

    try {
      if (!city) {
        const searchResults = await searchCities(input);
        if (searchResults.length === 0) {
          setErrorMessage(t('cityNotFound', language));
          setStatusMessage('');
          setLoading(false);
          setWeatherResponse(null);
          setSelectedCity(null);
          setResults([]);
          return;
        }
      }
      const location = city ?? { name: input, region: '', country: '', lat: 0, lon: 0 };
      const response = await loadWeatherForCity(location);
      setWeatherResponse(response);
      setSelectedCity(response.city);
      setStatusMessage('');
      if (response.fallbackReason) {
        setOfflineMode(true);
        setStatusMessage(t('fallbackNotice', language));
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(t('cityNotFound', language));
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCity = (item: CitySearchResult) => {
    setQuery(`${item.name}, ${item.region || item.country}`);
    setResults([]);
    handleSearch('', item);
  };

  const addFavorite = () => {
    if (!selectedCity) {
      return;
    }
    if (favorites.some((item) => item.name === selectedCity.name && item.country === selectedCity.country && item.region === selectedCity.region)) {
      setStatusMessage(t('duplicateFavorite', language));
      return;
    }
    const next = [selectedCity, ...favorites].slice(0, 8);
    setFavorites(next);
    setStatusMessage(t('addedFavorite', language));
  };

  const removeFavorite = (city: CitySearchResult) => {
    setFavorites(favorites.filter((item) => item.name !== city.name || item.country !== city.country || item.region !== city.region));
    setStatusMessage(t('removedFavorite', language));
  };

  const displayText = (key: string) => t(key, language);
  const hasWeatherData = !!weatherResponse && !errorMessage;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="branding">
          <h1>{displayText('title')}</h1>
          <p>{displayText('subtitle')}</p>
        </div>
        <div className="header-meta">{currentDateTime} IST</div>
        <div className="controls">
          <LanguageSwitcher language={language} languages={SUPPORTED_LANGUAGES} onChange={setLanguage} label={displayText('language')} />
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'day' ? 'night' : 'day')} label={displayText('theme')} />
        </div>
      </header>

      <main className="app-main">
        <section className="panel">
          <SearchBar
            label={displayText('searchLabel')}
            placeholder={displayText('searchPlaceholder')}
            value={query}
            results={results}
            onChange={setQuery}
            onSubmit={() => handleSearch(query)}
            onSelect={handleSelectCity}
          />
        </section>

        <section aria-live="polite" className="status-line" role="status">
          {loading && displayText('loading')}
          {!loading && statusMessage && statusMessage}
        </section>

        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            onRetry={() => {
              setQuery('');
              setErrorMessage('');
              setResults([]);
              const el = document.getElementById('city-search') as HTMLInputElement | null;
              el?.focus();
            }}
            retryLabel={displayText('ok')}
          />
        )}

        <div className="grid-layout">
        <div className="card-list">
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">{displayText('favorites')}</h2>
            </div>
            <FavoritesPanel
              favorites={favorites}
              onSelect={(city) => handleSelectCity(city)}
              onRemove={removeFavorite}
              noFavoritesText={displayText('noFavorites')}
              removeLabel={displayText('remove')}
            />
          </section>
          {hasWeatherData && (
            <section className="panel">
              <div className="panel-header">
                <h2 className="panel-title">{displayText('currentWeather')}</h2>
                <button type="button" onClick={addFavorite} disabled={!weatherResponse}>
                  {displayText('addFavorite')}
                </button>
              </div>
              <CurrentWeatherCard
                city={weatherResponse.city}
                weather={weatherResponse.current}
                alertCount={weatherResponse.alerts.length}
                offline={offlineMode}
                aqi={weatherResponse.current.air_quality}
                localTimeLabel={displayText('localTime')}
                conditionIcon={getConditionIcon(weatherResponse.current.condition)}
                conditionText={weatherResponse.current.condition.text}
                formatTemperature={formatTemperature}
                recommendation={getWeatherRecommendation(weatherResponse.current.condition)}
              />
            </section>
          )}
          {hasWeatherData && (
            <section className="panel">
              <AlertBanner
                alerts={weatherResponse.alerts}
                fallbackLabel={
                  weatherResponse.alertStatus === 'unavailable'
                    ? displayText('alertUnavailable')
                    : displayText('noActiveAlerts')
                }
                title={displayText('activeAlerts')}
              />
            </section>
          )}
          {hasWeatherData && (
            <section className="panel">
              <RecommendationCard text={getWeatherRecommendation(weatherResponse.current.condition)} title={displayText('recommendation')} />
            </section>
          )}
        </div>

        <div className="card-list">
          <section className="panel">
            <ViewTabs
              active={activeView}
              options={[
                { key: 'dashboard', label: displayText('viewDashboard') },
                { key: 'forecast', label: displayText('viewForecast') },
                { key: 'map', label: displayText('viewMap') },
              ]}
              onChange={(value) => setActiveView(value)}
            />
          </section>
          {activeView === 'dashboard' && (
            <section className="panel">
              <h2 className="panel-title">{displayText('viewDashboard')}</h2>
              {loading && <LoadingSkeleton />}
              {!loading && weatherResponse ? (
                <div className="dashboard-summary-grid">
                  <div className="dashboard-summary-card">
                    <span>{displayText('currentWeather')}</span>
                    <strong>{formatTemperature(weatherResponse.current.temp_c)}°C</strong>
                  </div>
                  <div className="dashboard-summary-card">
                    <span>{displayText('humidity')}</span>
                    <strong>{weatherResponse.current.humidity}%</strong>
                  </div>
                  <div className="dashboard-summary-card">
                    <span>{displayText('feelsLike')}</span>
                    <strong>{formatTemperature(weatherResponse.current.feelslike_c)}°C</strong>
                  </div>
                  <div className="dashboard-summary-card">
                    <span>{displayText('aqi')}</span>
                    <strong>{weatherResponse.current.air_quality?.us_epa_index ?? '—'}</strong>
                  </div>
                </div>
              ) : (
                !loading && <p>{displayText('noData')}</p>
              )}
            </section>
          )}
          {hasWeatherData && activeView === 'forecast' && (
            <section className="panel">
              <h2 className="panel-title">{displayText('forecast')}</h2>
              <ForecastCards forecast={weatherResponse.forecast} formatTemperature={formatTemperature} timezone={weatherResponse.city.tz_id} />
            </section>
          )}
          {hasWeatherData && activeView === 'map' && (
            <section className="panel">
              <h2 className="panel-title">{displayText('map')}</h2>
              <MapView location={weatherResponse.city} />
            </section>
          )}
        </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          © 2026 <a href="https://www.RakeshKamble.com" target="_blank" rel="noopener noreferrer">www.RakeshKamble.com</a> Weather Monitoring System | Developed for Public Weather Display
        </p>
      </footer>
    </div>
  );
}

export default App;
