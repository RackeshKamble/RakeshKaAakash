import type { ConditionData, ForecastDay, LanguageCode } from '../types';

export function formatTemperature(value: number, unit: 'C' | 'F' = 'C') {
  return `${Math.round(value)}°${unit}`;
}

export function conditionLabel(condition: ConditionData) {
  if (!condition?.text) {
    return 'Unknown condition';
  }
  return condition.text;
}

export function getWeatherRecommendation(condition: ConditionData) {
  const text = condition.text.toLowerCase();
  if (text.includes('rain') || text.includes('storm') || text.includes('shower')) {
    return 'Carry an umbrella and dress for wet weather.';
  }
  if (text.includes('snow') || text.includes('sleet')) {
    return 'Wear warm layers and keep boots nearby.';
  }
  if (text.includes('sunny') || text.includes('clear')) {
    return 'Great day for outdoor plans with sun protection.';
  }
  if (text.includes('cloud') || text.includes('mist') || text.includes('fog')) {
    return 'Keep a light jacket handy and stay visible.';
  }
  return 'Stay prepared and check for weather updates later.';
}

export function getForecastSummary(day: ForecastDay, lang: LanguageCode) {
  const rain = day.day.daily_chance_of_rain;
  if (rain && rain >= 60) {
    return 'Rain likely — prepare for showers.';
  }
  if (day.day.avghumidity >= 80) {
    return 'Higher humidity today — stay hydrated.';
  }
  const condition = day.day.condition.text.toLowerCase();
  if (condition.includes('sunny') || condition.includes('clear')) {
    return 'A bright day ahead.';
  }
  if (condition.includes('cloud')) {
    return 'Cloudy skies are expected.';
  }
  return 'Check the details for a smooth plan.';
}

export function getConditionIcon(condition: ConditionData) {
  if (!condition?.icon) {
    return '🌦️';
  }
  return `https:${condition.icon}`;
}
