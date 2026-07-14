/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudSun, 
  Loader2, 
  AlertCircle, 
  Github, 
  Globe, 
  Terminal, 
  Layers, 
  FileCode, 
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { WeatherForecastResponse, WeatherIntelligence } from './types';
import { processWeatherIntelligence } from './utils/weatherUtils';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import ForecastGrid from './components/ForecastGrid';
import IntelligencePanel from './components/IntelligencePanel';

export default function App() {
  const [selectedCity, setSelectedCity] = useState('London');
  const [coords, setCoords] = useState({ latitude: 51.5085, longitude: -0.1257 });
  const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);
  const [intelligence, setIntelligence] = useState<WeatherIntelligence | null>(null);
  
  const [useFahrenheit, setUseFahrenheit] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Collapse/Expand state for the Cloudflare deployment handbook
  const [showDeploymentGuide, setShowDeploymentGuide] = useState(false);

  // Fetch forecast data whenever coordinates update
  useEffect(() => {
    let isMounted = true;
    
    async function fetchForecast() {
      setIsLoadingWeather(true);
      setError(null);
      
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Unable to retrieve weather telemetry. Service may be undergoing maintenance.');
        }
        
        const data: WeatherForecastResponse = await response.json();
        
        if (isMounted) {
          setWeatherData(data);
          const computedIntel = processWeatherIntelligence(data.current, data.daily);
          setIntelligence(computedIntel);
        }
      } catch (err: any) {
        console.error('Forecast acquisition failure:', err);
        if (isMounted) {
          setError(err?.message || 'A network disturbance occurred while requesting forecast metrics.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingWeather(false);
        }
      }
    }

    fetchForecast();

    return () => {
      isMounted = false;
    };
  }, [coords]);

  const handleSelectCity = (city: { name: string; latitude: number; longitude: number }) => {
    setSelectedCity(city.name);
    setCoords({ latitude: city.latitude, longitude: city.longitude });
  };

  const handleToggleUnit = () => {
    setUseFahrenheit(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans transition-colors duration-500 pb-16">
      {/* Header Bar */}
      <header className="bg-white border-b border-slate-100 shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
              <CloudSun className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-display font-bold text-base md:text-lg tracking-tight text-slate-900 leading-tight">
                Weather Intelligence
              </h1>
              <p className="text-[10px] font-mono text-slate-400 font-medium tracking-wide uppercase">
                Analytical Forecast System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Realtime API status dot */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-[10px] font-mono font-bold text-emerald-600">API ACTIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Core Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Top level Search Component & Instructions */}
        <section className="space-y-4">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="font-display text-2xl md:text-3.5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Aeronautical &amp; Logistical Weather Intel
            </h2>
            <p className="font-sans text-xs md:text-sm text-slate-500 mt-2">
              Process real-time atmospheric metrics to optimize logistical timelines, event scheduling, commuter routes, and energy utilization.
            </p>
          </div>
          
          <SearchBar 
            onSelectCity={handleSelectCity}
            isLoadingLocation={isLoadingLocation}
            setIsLoadingLocation={setIsLoadingLocation}
          />
        </section>

        {/* Dynamic Display Panels triggered by active weather data */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {isLoadingWeather ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-4"
              >
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest">
                  Analyzing Weather Telemetry...
                </p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 rounded-2xl bg-red-50 border border-red-200/60 max-w-xl mx-auto text-center flex flex-col items-center gap-3.5 shadow-md"
              >
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div>
                  <h3 className="font-sans font-bold text-sm text-red-800">Forecast Access Obstruction</h3>
                  <p className="font-sans text-xs text-red-600 mt-1">{error}</p>
                </div>
                <button
                  onClick={() => setCoords({ ...coords })}
                  className="px-4 py-1.5 bg-red-600 text-white font-semibold text-xs rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Retry Request
                </button>
              </motion.div>
            ) : weatherData && intelligence ? (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* 1. Hero Current Weather Card */}
                <section>
                  <CurrentWeather 
                    cityName={selectedCity}
                    weatherData={weatherData}
                    intelligence={intelligence}
                    useFahrenheit={useFahrenheit}
                    onToggleUnit={handleToggleUnit}
                  />
                </section>

                {/* 2. Intelligence Recommendations Panel */}
                <section>
                  <IntelligencePanel 
                    recommendations={intelligence.recommendations}
                    weatherData={weatherData}
                  />
                </section>

                {/* 3. 7-Day strategic Grid */}
                <section>
                  <ForecastGrid 
                    weatherData={weatherData}
                    useFahrenheit={useFahrenheit}
                  />
                </section>

              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Cloudflare Pages Deployment Handbook Panel (Collapsible) */}
        <section className="border-t border-slate-200 pt-8 mt-12">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <button
              onClick={() => setShowDeploymentGuide(prev => !prev)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    Cloudflare Pages Deployment Handbook
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-green-500/10 text-green-600 rounded">COMPATIBLE</span>
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    Simple guide to compile and deploy this applet to production on Cloudflare Pages via GitHub.
                  </p>
                </div>
              </div>
              <div>
                {showDeploymentGuide ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {showDeploymentGuide && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-slate-100 dark:border-slate-800"
                >
                  <div className="p-6 space-y-6 text-sm text-slate-600 dark:text-slate-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Step 1 */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-mono font-bold text-xs">
                            1
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                            Push Code to GitHub
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Initialize a Git repository, commit your workspace, and push to a clean GitHub repository. Cloudflare Pages integrates seamlessly with GitHub.
                        </p>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-[10px] text-slate-500 space-y-1">
                          <p>git init</p>
                          <p>git add .</p>
                          <p>git commit -m "feat: weather"</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-mono font-bold text-xs">
                            2
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                            Connect to Pages
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Log into the <span className="font-semibold text-slate-700 dark:text-slate-200">Cloudflare Dashboard</span>, go to <span className="italic">Workers &amp; Pages</span>, select <span className="font-semibold text-slate-700 dark:text-slate-200">Create Application</span>, click the "Pages" tab, and select "Connect to Git".
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 bg-orange-500/5 p-2 rounded-lg border border-orange-500/10 text-orange-600">
                          <Github className="w-3.5 h-3.5" />
                          <span>Imports automatically from git</span>
                        </p>
                      </div>

                      {/* Step 3 */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-mono font-bold text-xs">
                            3
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                            Configure Build Engine
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          When prompted in Cloudflare Pages build settings, configure exactly these target options to enable complete automated production builds:
                        </p>
                        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-400 space-y-1">
                          <p><span className="font-bold text-blue-500">Framework Preset:</span> Vite</p>
                          <p><span className="font-bold text-blue-500">Build Command:</span> <code className="bg-slate-200/50 dark:bg-slate-800 px-1 rounded">npm run build</code></p>
                          <p><span className="font-bold text-blue-500">Build Output:</span> <code className="bg-slate-200/50 dark:bg-slate-800 px-1 rounded">dist</code></p>
                        </div>
                      </div>

                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileCode className="w-3.5 h-3.5 text-blue-500" />
                        <span>Root wrangler.toml provided successfully</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Production Compliant SPA</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      </main>
    </div>
  );
}
