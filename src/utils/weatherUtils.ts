/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  LucideIcon,
  HelpCircle
} from 'lucide-react';
import { CurrentWeatherData, DailyWeatherData, SmartRecommendation, WeatherIntelligence } from '../types';

/**
 * Maps WMO Weather Interpretation Codes to Lucide icons and condition names
 */
export function getWeatherCondition(code: number): {
  label: string;
  icon: LucideIcon;
  description: string;
} {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        icon: Sun,
        description: 'Sunny and clear conditions'
      };
    case 1:
      return {
        label: 'Mainly Clear',
        icon: CloudSun,
        description: 'Mostly sunny with few clouds'
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        icon: CloudSun,
        description: 'Intermittent sun and clouds'
      };
    case 3:
      return {
        label: 'Overcast',
        icon: Cloud,
        description: 'Gray, heavily overcast skies'
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        icon: CloudFog,
        description: 'Reduced visibility due to fog'
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        icon: CloudDrizzle,
        description: 'Light, continuous misty rain'
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        icon: CloudSnow,
        description: 'Ice-forming light precipitation'
      };
    case 61:
      return {
        label: 'Slight Rain',
        icon: CloudRain,
        description: 'Light rain showers'
      };
    case 63:
      return {
        label: 'Moderate Rain',
        icon: CloudRain,
        description: 'Steady rain conditions'
      };
    case 65:
      return {
        label: 'Heavy Rain',
        icon: CloudRain,
        description: 'Torrential downpours, potential pooling'
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        icon: CloudSnow,
        description: 'Rain freezing on impact'
      };
    case 71:
    case 73:
    case 75:
      return {
        label: 'Snowfall',
        icon: CloudSnow,
        description: 'Snow accumulation expected'
      };
    case 77:
      return {
        label: 'Snow Grains',
        icon: CloudSnow,
        description: 'Very small frozen particles'
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        icon: CloudRain,
        description: 'Passing rain showers'
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        icon: CloudSnow,
        description: 'Passing snow flurries'
      };
    case 95:
      return {
        label: 'Thunderstorm',
        icon: CloudLightning,
        description: 'Lightning, thunder, and gusty winds'
      };
    case 96:
    case 99:
      return {
        label: 'Severe Thunderstorm',
        icon: CloudLightning,
        description: 'Thunderstorm with risk of heavy hail'
      };
    default:
      return {
        label: 'Unknown',
        icon: HelpCircle,
        description: 'Variable local conditions'
      };
  }
}

/**
 * Computes aesthetic theme details and smart recommendations based on current and daily conditions
 */
export function processWeatherIntelligence(
  current: CurrentWeatherData,
  daily: DailyWeatherData
): WeatherIntelligence {
  const temp = current.temperature_2m;
  const isDay = current.is_day === 1;

  // 1. Determine dynamic theme based on temperature and day/night state
  let themeGradient = 'from-blue-50/70 to-indigo-50/50 dark:from-slate-900 dark:to-indigo-950/40';
  let accentColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30';
  let textColor = 'text-slate-800 dark:text-slate-200';

  if (temp >= 30) {
    // Hot / Scorching (Amber/Red Accent)
    themeGradient = 'from-amber-500/10 via-orange-500/5 to-red-500/5 dark:from-orange-950/20 dark:via-amber-950/10 dark:to-red-950/5';
    accentColor = 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/30';
  } else if (temp >= 18) {
    // Mild / Pleasant (Emerald/Teal Accent)
    themeGradient = 'from-emerald-500/10 via-teal-500/5 to-cyan-500/5 dark:from-emerald-950/20 dark:via-teal-950/10 dark:to-cyan-950/5';
    accentColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30';
  } else if (temp >= 5) {
    // Cool / Chilly (Blue/Indigo Accent)
    themeGradient = 'from-sky-500/10 via-blue-500/5 to-indigo-500/5 dark:from-sky-950/20 dark:via-blue-950/10 dark:to-indigo-950/5';
    accentColor = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/30';
  } else {
    // Freezing / Frosty (Cyan/Slate Accent)
    themeGradient = 'from-cyan-500/15 via-slate-500/5 to-blue-500/5 dark:from-cyan-950/20 dark:via-slate-950/10 dark:to-blue-950/5';
    accentColor = 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/30';
  }

  // Get current weather code label
  const { label: conditionLabel } = getWeatherCondition(current.weather_code);

  // 2. Compute Smart Recommendations
  const recommendations: SmartRecommendation[] = [];

  // Check 1: Logistical Planning (Rain and Precipitation)
  // Max precipitation probability in the next 3 days
  const maxRainProb = Math.max(...daily.precipitation_probability_max.slice(0, 3));
  if (current.precipitation > 0 || maxRainProb > 70) {
    recommendations.push({
      id: 'planning-rain',
      type: 'planning',
      title: 'Logistical Planning Alert',
      description: `High precipitation probability detected (${maxRainProb}% max). Move outdoor events indoors and adjust sensitive logistics.`,
      status: 'alert'
    });
  } else if (maxRainProb > 30) {
    recommendations.push({
      id: 'planning-drizzle',
      type: 'planning',
      title: 'Logistical Planning Warning',
      description: `Slight risk of rain today (${maxRainProb}%). Pack cover for sensitive outdoor operations.`,
      status: 'warning'
    });
  }

  // Check 2: Commuter Safety (Wind speed & Visibility)
  const maxWindSpeed = Math.max(...daily.wind_speed_10m_max.slice(0, 3));
  if (current.wind_speed_10m > 30 || maxWindSpeed > 30) {
    recommendations.push({
      id: 'commute-wind',
      type: 'safety',
      title: 'Commuter Safety Hazard',
      description: `High winds (${Math.max(current.wind_speed_10m, maxWindSpeed).toFixed(1)} km/h) reported. Secure loose exterior items and anticipate transit or flight delays.`,
      status: 'alert'
    });
  } else if (current.weather_code === 45 || current.weather_code === 48) {
    recommendations.push({
      id: 'commute-fog',
      type: 'safety',
      title: 'Commuter Safety Alert',
      description: 'Dense fog reported. Low visibility on roads. Exercise extreme caution, use fog lights, and allow extra travel time.',
      status: 'warning'
    });
  } else if (current.weather_code >= 71 && current.weather_code <= 77) {
    recommendations.push({
      id: 'commute-snow',
      type: 'safety',
      title: 'Snow & Frost Warning',
      description: 'Active snowfall can lead to hazardous road conditions and icy patches. Ensure vehicles are winter-ready.',
      status: 'alert'
    });
  }

  // Check 3: Energy & Comfort (UV and Heat/Cold)
  const maxUV = Math.max(...daily.uv_index_max.slice(0, 3));
  if (current.uv_index > 6 || maxUV > 6) {
    recommendations.push({
      id: 'energy-uv',
      type: 'comfort',
      title: 'UV Radiation Hazard',
      description: `Elevated UV Index (${Math.max(current.uv_index, maxUV).toFixed(1)}). Wear sunscreen (SPF 30+), sunglasses, and wide-brimmed hats. Peak solar grid generation active.`,
      status: 'warning'
    });
  }

  if (temp >= 33) {
    recommendations.push({
      id: 'energy-heat',
      type: 'comfort',
      title: 'Extreme Thermal Stress',
      description: `High ambient temperature (${temp.toFixed(1)}°C). Stay hydrated, avoid heavy outdoor labor, and plan for peak building cooling demands.`,
      status: 'alert'
    });
  } else if (temp <= 5) {
    recommendations.push({
      id: 'energy-cold',
      type: 'comfort',
      title: 'Increased Heating Demand',
      description: `Chilly conditions (${temp.toFixed(1)}°C). Dress in heavy layers, inspect exterior heating ventilation, and protect fragile pipes.`,
      status: 'info'
    });
  }

  // Check 4: Optimal Conditions
  const isClearCode = current.weather_code <= 2;
  const isComfortableTemp = temp >= 18 && temp <= 27;
  const isModerateWind = current.wind_speed_10m < 20;
  const isDry = current.precipitation === 0 && maxRainProb < 20;

  if (isClearCode && isComfortableTemp && isModerateWind && isDry) {
    recommendations.push({
      id: 'optimal-day',
      type: 'optimal',
      title: 'Ideal Outdoor Operations',
      description: 'Clear skies, comfortable temperatures, and light breezes. Perfect day for construction, filming, sports, or external maintenance.',
      status: 'success'
    });
  }

  // Fallback optimal if no warnings or alerts exist and conditions are generally calm
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'optimal-calm',
      type: 'optimal',
      title: 'Stable Local Weather',
      description: 'No severe weather events, extreme temperatures, or high-risk warnings active. Safe for standard operations.',
      status: 'success'
    });
  }

  return {
    recommendations,
    themeGradient,
    accentColor,
    conditionLabel,
    textColor
  };
}

/**
 * Returns a short formatted date string (e.g. "Tuesday, Jul 14")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Returns a short day name (e.g., "Tue")
 */
export function formatDayName(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}
