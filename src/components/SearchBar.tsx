/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CitySearchResult } from '../types';

interface SearchBarProps {
  onSelectCity: (city: { name: string; latitude: number; longitude: number }) => void;
  isLoadingLocation: boolean;
  setIsLoadingLocation: (loading: boolean) => void;
}

const PRESET_CITIES = [
  { name: 'London', latitude: 51.5085, longitude: -0.1257, country: 'United Kingdom' },
  { name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'United States' },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan' },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, country: 'Australia' },
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, country: 'India' },
];

export default function SearchBar({ onSelectCity, isLoadingLocation, setIsLoadingLocation }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce-based Geocoding Search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
        );
        if (!response.ok) {
          throw new Error('Geocoding service unavailable');
        }
        const data = await response.json();
        if (data.results) {
          setResults(data.results);
          setIsOpen(true);
        } else {
          setResults([]);
          setError('No cities found matching your search.');
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Geocoding error:', err);
        setError('Failed to search for locations. Please try again.');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 450); // 450ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Request Current Geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Attempt reverse geocoding to get a readable name using Open-Meteo (we look up nearest city if possible)
          // Since Open-Meteo doesn't have an exact reverse geocoding API, we fetch the city name by running forecast,
          // or we can label it "Your Location" with coordinates. Let's label it "Current Location" and fallback.
          onSelectCity({
            name: 'Current Location',
            latitude,
            longitude
          });
          setQuery('');
          setIsOpen(false);
        } catch (err) {
          console.error(err);
          onSelectCity({
            name: `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
            latitude,
            longitude
          });
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        let msg = 'Could not retrieve your location. Make sure GPS is enabled and permissions are granted.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location access denied. Please enable location permissions or search for a city manually.';
        }
        setError(msg);
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={dropdownRef}>
      {/* Quick Access Preset Chips */}
      <div className="flex flex-wrap gap-2 items-center justify-center mb-4 text-xs">
        <span className="text-slate-500 font-medium">Quick Select:</span>
        {PRESET_CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() => onSelectCity({ name: city.name, latitude: city.latitude, longitude: city.longitude })}
            className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            {city.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {/* Main Search Input Container */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
            {isSearching ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          <input
            type="text"
            id="city-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0 || error) setIsOpen(true);
            }}
            placeholder="Search city, e.g., Tokyo, Paris, San Francisco..."
            className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans transition-all text-sm"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Current Location GPS Button */}
        <button
          onClick={handleGetCurrentLocation}
          disabled={isLoadingLocation}
          title="Use current GPS location"
          className="flex items-center justify-center p-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl disabled:shadow-none transition-all cursor-pointer active:scale-95 disabled:pointer-events-none"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Navigation className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Geocoding Error Message banner */}
      {error && !isOpen && (
        <div className="mt-2 text-xs text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg p-2 flex items-start gap-1.5 animate-fadeIn">
          <span className="font-semibold">Notice:</span> {error}
        </div>
      )}

      {/* Dropdown for Geocoding Matches */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-700"
          >
            {error && (
              <div className="p-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                {error}
              </div>
            )}
            {results.map((city) => (
              <button
                key={city.id}
                onClick={() => {
                  onSelectCity({
                    name: city.name,
                    latitude: city.latitude,
                    longitude: city.longitude
                  });
                  setQuery('');
                  setResults([]);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-100 transition-all cursor-pointer first:rounded-t-2xl last:rounded-b-2xl"
              >
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-sm truncate block">
                    {city.name}
                  </span>
                  <span className="text-xs text-slate-400 truncate block">
                    {city.admin1 ? `${city.admin1}, ` : ''}
                    {city.country}
                  </span>
                </div>
                {city.country_code && (
                  <span className="text-xs uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-mono rounded font-semibold">
                    {city.country_code}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
