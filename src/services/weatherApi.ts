import { weatherCache } from './cache';
import type { CitySearchResult, WeatherApiResult } from '../types';

const API_KEY = (import.meta.env.VITE_WEATHER_API_KEY as string | undefined) || '7061acb2dabd49848f3165647261705';
const BASE_URL = 'https://api.weatherapi.com/v1';
const CACHE_KEY_PREFIX = 'weather-last-known';
const SNAPSHOT_KEY = 'weather-snapshots';

function createSearchKey(query: string) {
  return `search:${query.toLowerCase().trim()}`;
}

function createWeatherKey(query: string) {
  return `weather:${query.toLowerCase().trim()}`;
}

function getLocalFallback(query: string): WeatherApiResult | null {
  try {
    const stored = window.localStorage.getItem(`${CACHE_KEY_PREFIX}:${query.toLowerCase().trim()}`);
    return stored ? (JSON.parse(stored) as WeatherApiResult) : null;
  } catch {
    return null;
  }
}

function saveLocalFallback(query: string, payload: WeatherApiResult) {
  try {
    window.localStorage.setItem(`${CACHE_KEY_PREFIX}:${query.toLowerCase().trim()}`, JSON.stringify(payload));
    saveSnapshot(payload);
  } catch {
    // ignore local storage failures
  }
}

function getSnapshotHistory(): WeatherApiResult[] {
  try {
    const stored = window.localStorage.getItem(SNAPSHOT_KEY);
    return stored ? (JSON.parse(stored) as WeatherApiResult[]) : [];
  } catch {
    return [];
  }
}

function saveSnapshot(payload: WeatherApiResult) {
  try {
    const history = getSnapshotHistory();
    const next = [payload, ...history.filter((item) => item.city.name !== payload.city.name || item.city.region !== payload.city.region || item.city.country !== payload.city.country)];
    window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(next.slice(0, 10)));
  } catch {
    // ignore local storage failures
  }
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${response.statusText} ${body}`);
  }
  return response.json();
}

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const cacheKey = createSearchKey(trimmed);
  const cached = weatherCache.get<CitySearchResult[]>(cacheKey);
  if (cached) {
    return cached;
  }

  if (!API_KEY) {
    return [];
  }

  try {
    const url = `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(trimmed)}`;
    const items = await fetchJson<CitySearchResult[]>(url);
    weatherCache.set(cacheKey, items);
    return items;
  } catch {
    return [];
  }
}

export async function loadWeatherForCity(location: CitySearchResult): Promise<WeatherApiResult> {
  const locationParts = [location.name, location.region || location.country].filter(Boolean);
  const query = locationParts.join(', ');
  const cacheKey = createWeatherKey(query);
  const cached = weatherCache.get<WeatherApiResult>(cacheKey);
  if (cached) {
    return cached;
  }

  if (!API_KEY) {
    const offline = getLocalFallback(query);
    if (offline) {
      return { ...offline, fallbackReason: 'cached' };
    }
    return getMockResult(location, 'mock');
  }

  try {
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(query)}&days=5&aqi=yes&alerts=yes`;
    const result = await fetchJson<any>(url);
    const rawAlerts = result.alerts;
    const alerts = Array.isArray(rawAlerts?.alert)
      ? rawAlerts.alert.map((alert: any) => alert.headline || alert.msg)
      : [];
    const apiResult: WeatherApiResult = {
      city: {
        name: result.location.name,
        region: result.location.region,
        country: result.location.country,
        lat: result.location.lat,
        lon: result.location.lon,
        localtime: result.location.localtime,
        tz_id: result.location.tz_id,
      },
      current: {
        last_updated: result.current.last_updated,
        temp_c: result.current.temp_c,
        temp_f: result.current.temp_f,
        feelslike_c: result.current.feelslike_c,
        humidity: result.current.humidity,
        condition: result.current.condition,
        air_quality: result.current.air_quality,
      },
      forecast: result.forecast.forecastday.map((day: any) => ({
        date: day.date,
        day: {
          maxtemp_c: day.day.maxtemp_c,
          mintemp_c: day.day.mintemp_c,
          avgtemp_c: day.day.avgtemp_c,
          avghumidity: day.day.avghumidity,
          daily_chance_of_rain: day.day.daily_chance_of_rain,
          condition: day.day.condition,
        },
        astro: {
          sunrise: day.astro.sunrise,
          sunset: day.astro.sunset,
        },
      })),
      alerts,
      alertStatus: rawAlerts == null ? 'unavailable' : alerts.length > 0 ? 'active' : 'none',
    };

    weatherCache.set(cacheKey, apiResult);
    saveLocalFallback(query, apiResult);
    return apiResult;
  } catch (error) {
    const fallback = getLocalFallback(query);
    if (fallback) {
      return {
        ...fallback,
        alertStatus: fallback.alerts.length > 0 ? 'active' : 'none',
        fallbackReason: 'cached',
      };
    }
    return getMockResult(location, 'mock');
  }
}

function getMockResult(location: CitySearchResult, fallbackReason: 'cached' | 'mock'): WeatherApiResult {
  const mock = {
    city: location,
    current: {
      last_updated: new Date().toISOString(),
      temp_c: 18.5,
      temp_f: 65.3,
      feelslike_c: 18.0,
      humidity: 62,
      condition: {
        text: 'Partly cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        code: 1003,
      },
      air_quality: {
        'us-epa-index': 2,
        'gb-defra-index': 2,
      },
    },
    forecast: [...Array(5)].map((_, index) => ({
      date: new Date(Date.now() + index * 86400000).toISOString().slice(0, 10),
      day: {
        maxtemp_c: 22 + index,
        mintemp_c: 13 + index,
        avgtemp_c: 17 + index,
        avghumidity: 60 + index,
        daily_chance_of_rain: 15 + index * 5,
        condition: {
          text: index % 2 === 0 ? 'Sunny' : 'Cloudy',
          icon: index % 2 === 0
            ? '//cdn.weatherapi.com/weather/64x64/day/113.png'
            : '//cdn.weatherapi.com/weather/64x64/day/116.png',
          code: 1000,
        },
      },
      astro: {
        sunrise: '06:00 AM',
        sunset: '08:15 PM',
      },
    })),
    alerts: [],
    alertStatus: 'unavailable',
    fallbackReason,
  } as WeatherApiResult;

  return mock;
}
