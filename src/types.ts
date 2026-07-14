/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CitySearchResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
}

export interface CurrentWeatherData {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  uv_index: number;
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  uv_index_max: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface WeatherForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    apparent_temperature: string;
    wind_speed_10m: string;
    uv_index: string;
    precipitation: string;
  };
  current: CurrentWeatherData;
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    uv_index_max: string;
    precipitation_probability_max: string;
    wind_speed_10m_max: string;
  };
  daily: DailyWeatherData;
}

export interface SmartRecommendation {
  id: string;
  type: 'planning' | 'safety' | 'comfort' | 'optimal';
  title: string;
  description: string;
  status: 'warning' | 'info' | 'success' | 'alert';
}

export interface WeatherIntelligence {
  recommendations: SmartRecommendation[];
  themeGradient: string; // Tailwind gradient classes
  accentColor: string; // Tailwind accent color classes
  conditionLabel: string;
  textColor: string;
}
