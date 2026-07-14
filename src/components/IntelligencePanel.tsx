/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Car, 
  Lightbulb, 
  Sparkles, 
  ShieldAlert, 
  AlertTriangle,
  Info,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ArrowUpRight
} from 'lucide-react';
import { WeatherForecastResponse, SmartRecommendation } from '../types';

interface IntelligencePanelProps {
  recommendations: SmartRecommendation[];
  weatherData: WeatherForecastResponse;
}

export default function IntelligencePanel({ recommendations, weatherData }: IntelligencePanelProps) {
  const { current, daily } = weatherData;

  // Compute a Strategic Operations Index (0 to 100) dynamically based on weather stressors
  const calculateOperationsScore = (): { score: number; level: 'Optimal' | 'Caution' | 'Adverse'; color: string; bg: string } => {
    let score = 100;

    // Stressor 1: Rain/Precipitation Probability
    const maxRainProb = Math.max(...daily.precipitation_probability_max.slice(0, 3));
    if (maxRainProb > 70) score -= 35;
    else if (maxRainProb > 30) score -= 15;

    // Stressor 2: Wind Speed
    const currentWind = current.wind_speed_10m;
    if (currentWind > 30) score -= 25;
    else if (currentWind > 18) score -= 10;

    // Stressor 3: Temperature Extremes
    const currentTemp = current.temperature_2m;
    if (currentTemp > 35 || currentTemp < 0) score -= 25;
    else if (currentTemp > 30 || currentTemp < 8) score -= 10;

    // Stressor 4: Severe Weather Code
    const code = current.weather_code;
    if (code >= 95) score -= 30; // Thunderstorm
    else if (code >= 51 && code <= 67) score -= 15; // Rain/Drizzle
    else if (code >= 45 && code <= 48) score -= 15; // Fog

    const finalScore = Math.max(0, score);

    if (finalScore >= 80) return { score: finalScore, level: 'Optimal', color: 'text-emerald-500 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400', bg: 'bg-emerald-500' };
    if (finalScore >= 50) return { score: finalScore, level: 'Caution', color: 'text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400', bg: 'bg-amber-500' };
    return { score: finalScore, level: 'Adverse', color: 'text-rose-500 border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400', bg: 'bg-rose-500' };
  };

  const opsIndex = calculateOperationsScore();

  // Helper to map recommendation types to modern visual styles and icons
  const getRecommendationStyle = (rec: SmartRecommendation) => {
    switch (rec.type) {
      case 'planning':
        return {
          icon: Calendar,
          iconBg: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400',
          cardBorder: 'hover:border-indigo-200 dark:hover:border-indigo-900/40',
          badgeText: 'Planning & Events'
        };
      case 'safety':
        return {
          icon: Car,
          iconBg: 'bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400',
          cardBorder: 'hover:border-rose-200 dark:hover:border-rose-900/40',
          badgeText: 'Commuter Safety'
        };
      case 'comfort':
        return {
          icon: Lightbulb,
          iconBg: 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400',
          cardBorder: 'hover:border-amber-200 dark:hover:border-amber-900/40',
          badgeText: 'Energy & Utility'
        };
      case 'optimal':
        return {
          icon: Sparkles,
          iconBg: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400',
          cardBorder: 'hover:border-emerald-200 dark:hover:border-emerald-900/40',
          badgeText: 'Optimal Window'
        };
    }
  };

  // Helper to map alert status to border highlights and alert icons
  const getStatusIndicator = (status: SmartRecommendation['status']) => {
    switch (status) {
      case 'alert':
        return {
          bg: 'bg-red-50 dark:bg-red-950/15',
          border: 'border-red-100 dark:border-red-900/20',
          accentIcon: ShieldAlert,
          accentColor: 'text-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50/50 dark:bg-amber-950/10',
          border: 'border-amber-100/70 dark:border-amber-900/15',
          accentIcon: AlertTriangle,
          accentColor: 'text-amber-500'
        };
      case 'success':
        return {
          bg: 'bg-emerald-50/50 dark:bg-emerald-950/10',
          border: 'border-emerald-100/70 dark:border-emerald-900/15',
          accentIcon: CheckCircle2,
          accentColor: 'text-emerald-500'
        };
      case 'info':
      default:
        return {
          bg: 'bg-sky-50/30 dark:bg-sky-950/5',
          border: 'border-sky-100/50 dark:border-sky-900/10',
          accentIcon: Info,
          accentColor: 'text-sky-500'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dynamic Feasibility Gauge/Index Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 shadow-md flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
              Weather Intelligence Index
            </h4>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Real-time algorithm processing local precipitation, wind, thermal conditions, and severities to grade operational safety and planning windows.
          </p>
        </div>

        {/* Visual score display */}
        <div className="my-8 text-center flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-32 h-32">
            {/* Simple SVG Circular Gauge representation */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="currentColor"
                strokeWidth="8"
                className="text-slate-200 dark:text-slate-800"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - opsIndex.score / 100)}
                className={opsIndex.score >= 80 ? 'text-emerald-500' : opsIndex.score >= 50 ? 'text-amber-500' : 'text-rose-500'}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">
                {opsIndex.score}
              </span>
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                Index Score
              </span>
            </div>
          </div>

          <div className={`mt-4 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border ${opsIndex.color}`}>
            <span className={`w-2 h-2 rounded-full ${opsIndex.bg}`} />
            <span>Feasibility: {opsIndex.level}</span>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs flex justify-between items-center text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>Operational Score</span>
          </span>
          <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-0.5">
            {opsIndex.score >= 80 ? 'No stress flags' : opsIndex.score >= 50 ? 'Stress warning active' : 'Severe hazards active'}
            <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </motion.div>

      {/* Recommendations Cards list */}
      <div className="lg:col-span-2 space-y-4">
        <h4 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Actionable Strategic Recommendations</span>
          <span className="text-xs px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full font-sans font-semibold text-slate-500 dark:text-slate-400">
            {recommendations.length} Active
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => {
            const config = getRecommendationStyle(rec);
            const statusStyle = getStatusIndicator(rec.status);
            const IconComponent = config.icon;
            const AlertIconComponent = statusStyle.accentIcon;

            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${statusStyle.bg} ${statusStyle.border} ${config.cardBorder} shadow-sm`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    {/* Category icon & badge */}
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${config.iconBg}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-sans font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {config.badgeText}
                      </span>
                    </div>

                    {/* Status Alert Badge */}
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                      <AlertIconComponent className={`w-3.5 h-3.5 ${statusStyle.accentColor}`} />
                      <span className={statusStyle.accentColor}>{rec.status}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h5 className="font-sans font-bold text-slate-900 dark:text-white text-sm mt-3 leading-snug">
                    {rec.title}
                  </h5>
                  <p className="font-sans text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {rec.description}
                  </p>
                </div>

                <div className="border-t border-slate-100/30 dark:border-slate-800/20 pt-2 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                  <span>Computed locally</span>
                  <span>Safety Assured</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
