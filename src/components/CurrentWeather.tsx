/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Wind, Sun, CloudRain, Thermometer } from 'lucide-react';
import { WeatherForecastResponse, WeatherIntelligence } from '../types';
import { getWeatherCondition, formatDate } from '../utils/weatherUtils';

interface CurrentWeatherProps {
  cityName: string;
  weatherData: WeatherForecastResponse;
  intelligence: WeatherIntelligence;
  useFahrenheit: boolean;
  onToggleUnit: () => void;
}

export default function CurrentWeather({
  cityName,
  weatherData,
  intelligence,
  useFahrenheit,
  onToggleUnit
}: CurrentWeatherProps) {
  const { current, current_units } = weatherData;
  const { label, icon: WeatherIcon, description } = getWeatherCondition(current.weather_code);

  const displayTemp = (celsius: number) => {
    if (useFahrenheit) {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${celsius.toFixed(1)}°C`;
  };

  // Qualitative ratings for weather parameters
  const getUVStatus = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' };
    if (uv <= 5) return { text: 'Moderate', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' };
    if (uv <= 7) return { text: 'High', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' };
    if (uv <= 10) return { text: 'Very High', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' };
    return { text: 'Extreme', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' };
  };

  const getWindStatus = (speed: number) => {
    if (speed < 12) return 'Light';
    if (speed < 20) return 'Moderate';
    if (speed < 30) return 'Fresh';
    return 'Strong';
  };

  const getHumidityStatus = (humidity: number) => {
    if (humidity < 30) return 'Dry';
    if (humidity <= 60) return 'Pleasant';
    return 'Humid';
  };

  const uvRating = getUVStatus(current.uv_index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-3xl p-6 md:p-8 border border-slate-200/60 dark:border-slate-800/80 shadow-xl overflow-hidden bg-gradient-to-br ${intelligence.themeGradient}`}
    >
      {/* Decorative Blur Spheres for Aesthetic Depth */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-orange-400/5 rounded-full blur-2xl pointer-events-none" />

      {/* Hero Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {cityName}
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-1 rounded-md uppercase tracking-wider bg-slate-900/5 dark:bg-white/10 text-slate-600 dark:text-slate-300">
              Active
            </span>
          </div>
          <p className="text-sm font-sans font-medium text-slate-500 dark:text-slate-400 mt-1">
            {formatDate(current.time)}
          </p>
        </div>

        {/* C/F Switcher Widget */}
        <button
          onClick={onToggleUnit}
          className="self-start md:self-auto px-3.5 py-1.5 bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
        >
          <Thermometer className="w-3.5 h-3.5 text-blue-500" />
          Switch to {useFahrenheit ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
        </button>
      </div>

      {/* Main Temp & Condition Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 relative z-10 items-center">
        {/* Giant Temperature & Visual Condition */}
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white/45 dark:bg-slate-950/30 rounded-2xl border border-white/50 dark:border-white/5 backdrop-blur-xs flex items-center justify-center shadow-md">
            <WeatherIcon className="w-16 h-16 text-blue-600 dark:text-sky-400" />
          </div>
          <div>
            <div className="flex items-baseline">
              <span className="font-display text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                {displayTemp(current.temperature_2m)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-sans font-semibold text-lg text-slate-800 dark:text-slate-200">
                {label}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs font-sans text-slate-500 dark:text-slate-400">
                Feels like {displayTemp(current.apparent_temperature)}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
              {description}
            </p>
          </div>
        </div>

        {/* 4-Grid Metrics Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Humidity Card */}
          <div className="bg-white/40 dark:bg-slate-950/20 p-3.5 rounded-2xl border border-white/40 dark:border-white/5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Humidity</span>
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <div className="mt-2.5">
              <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                {current.relative_humidity_2m}%
              </span>
              <span className="text-[10px] font-sans text-slate-400 block mt-0.5">
                {getHumidityStatus(current.relative_humidity_2m)}
              </span>
            </div>
          </div>

          {/* Wind Speed Card */}
          <div className="bg-white/40 dark:bg-slate-950/20 p-3.5 rounded-2xl border border-white/40 dark:border-white/5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Wind Speed</span>
              <Wind className="w-4 h-4 text-teal-500" />
            </div>
            <div className="mt-2.5">
              <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                {current.wind_speed_10m.toFixed(1)} <span className="text-[10px] font-sans text-slate-400">km/h</span>
              </span>
              <span className="text-[10px] font-sans text-slate-400 block mt-0.5">
                {getWindStatus(current.wind_speed_10m)}
              </span>
            </div>
          </div>

          {/* UV Index Card */}
          <div className="bg-white/40 dark:bg-slate-950/20 p-3.5 rounded-2xl border border-white/40 dark:border-white/5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">UV Index</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2.5">
              <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                {current.uv_index.toFixed(1)}
              </span>
              <span className={`inline-block text-[9px] font-sans font-semibold rounded px-1.5 py-0.5 mt-1 ${uvRating.color}`}>
                {uvRating.text}
              </span>
            </div>
          </div>

          {/* Precipitation Card */}
          <div className="bg-white/40 dark:bg-slate-950/20 p-3.5 rounded-2xl border border-white/40 dark:border-white/5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Precipitation</span>
              <CloudRain className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2.5">
              <span className="font-mono text-lg font-bold text-slate-900 dark:text-white">
                {current.precipitation.toFixed(1)} <span className="text-[10px] font-sans text-slate-400">mm</span>
              </span>
              <span className="text-[10px] font-sans text-slate-400 block mt-0.5">
                {current.precipitation > 0 ? 'Active rain' : 'Dry conditions'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
