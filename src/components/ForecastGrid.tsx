/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Droplets, Wind } from 'lucide-react';
import { WeatherForecastResponse } from '../types';
import { getWeatherCondition, formatDayName } from '../utils/weatherUtils';

interface ForecastGridProps {
  weatherData: WeatherForecastResponse;
  useFahrenheit: boolean;
}

export default function ForecastGrid({ weatherData, useFahrenheit }: ForecastGridProps) {
  const { daily } = weatherData;

  const displayTemp = (celsius: number) => {
    if (useFahrenheit) {
      return `${Math.round((celsius * 9) / 5 + 32)}°`;
    }
    return `${Math.round(celsius)}°`;
  };

  // Convert raw ISO date "2026-07-14" to formatted month and day "Jul 14"
  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span>7-Day Strategic Forecast</span>
          <span className="text-xs font-normal text-slate-400 dark:text-slate-500 font-mono">(Metrics synced)</span>
        </h3>
      </div>

      {/* Grid of 7 Days */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {daily.time.map((timeStr, idx) => {
          const code = daily.weather_code[idx];
          const tempMax = daily.temperature_2m_max[idx];
          const tempMin = daily.temperature_2m_min[idx];
          const rainProb = daily.precipitation_probability_max[idx];
          const windMax = daily.wind_speed_10m_max[idx];
          
          const { label, icon: WeatherIcon } = getWeatherCondition(code);
          const isToday = idx === 0;

          return (
            <motion.div
              key={timeStr}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`relative rounded-2xl p-4 border transition-all flex flex-row lg:flex-col justify-between items-center lg:justify-center gap-4 ${
                isToday
                  ? 'bg-blue-600/5 dark:bg-blue-500/5 border-blue-200 dark:border-blue-900/40 shadow-xs'
                  : 'bg-white dark:bg-slate-800/80 border-slate-100 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs'
              }`}
            >
              {isToday && (
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
              )}

              {/* Day Name / Date Info */}
              <div className="text-left lg:text-center flex-1 lg:flex-none">
                <p className="font-sans font-bold text-sm text-slate-900 dark:text-white flex items-center lg:justify-center gap-1.5">
                  {isToday ? 'Today' : formatDayName(timeStr)}
                </p>
                <p className="text-[11px] font-sans font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                  {formatDateLabel(timeStr)}
                </p>
              </div>

              {/* Weather Icon & Status Label */}
              <div className="flex flex-col items-center justify-center">
                <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/30`}>
                  <WeatherIcon className="w-8 h-8 text-blue-500 dark:text-sky-400" />
                </div>
                <span className="text-[10px] font-sans font-semibold text-slate-500 dark:text-slate-400 mt-1.5 text-center hidden lg:block max-w-[80px] truncate" title={label}>
                  {label}
                </span>
              </div>

              {/* Temperatures Min/Max */}
              <div className="text-right lg:text-center flex items-center lg:justify-center gap-2">
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {displayTemp(tempMax)}
                </span>
                <span className="text-slate-300 dark:text-slate-600 font-sans text-xs">/</span>
                <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
                  {displayTemp(tempMin)}
                </span>
              </div>

              {/* Extra Weather Stats (Rain / Wind) */}
              <div className="flex flex-col gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2 w-full lg:flex hidden">
                {/* Rain Prob */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span>Rain</span>
                  </div>
                  <span className={`font-mono font-semibold ${rainProb > 50 ? 'text-blue-500 dark:text-blue-400 font-bold' : ''}`}>
                    {rainProb}%
                  </span>
                </div>

                {/* Wind Speed Max */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-teal-400" />
                    <span>Wind</span>
                  </div>
                  <span className="font-mono">
                    {Math.round(windMax)} <span className="text-[8px]">km/h</span>
                  </span>
                </div>
              </div>

              {/* Mobile-Only Secondary Info (Row Display) */}
              <div className="flex lg:hidden flex-col items-end text-xs gap-1 flex-1">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>Rain: {rainProb}%</span>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">
                  Wind: {Math.round(windMax)} km/h
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
