export interface CitySearchResult {
  id?: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url?: string;
  localtime?: string;
  tz_id?: string;
}

export interface ConditionData {
  text: string;
  icon: string;
  code: number;
}

export interface WeatherSnapshot {
  last_updated: string;
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  humidity: number;
  condition: ConditionData;
  air_quality?: Record<string, number>;
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    avghumidity: number;
    daily_chance_of_rain?: number;
    condition: ConditionData;
  };
  astro?: {
    sunrise: string;
    sunset: string;
  };
}

export interface WeatherApiResult {
  city: CitySearchResult;
  current: WeatherSnapshot;
  forecast: ForecastDay[];
  alerts: string[];
  alertStatus: 'active' | 'none' | 'unavailable';
  fallbackReason?: 'cached' | 'mock';
}

export type LanguageCode = 'en' | 'hi';
