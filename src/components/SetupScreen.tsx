'use client';

import { useState } from 'react';

export interface SessionConfig {
  department: string;
  year: number;
  duration: number;
}

interface Props {
  onStart: (config: SessionConfig) => void;
}

const DEPARTMENTS = ['AD', 'CSE', 'EEE', 'ECE', 'ME', 'CE'];
const YEARS = [1, 2, 3, 4];
const DURATIONS = [
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
];

export function SetupScreen({ onStart }: Props) {
  const [config, setConfig] = useState<SessionConfig>({
    department: DEPARTMENTS[0],
    year: YEARS[0],
    duration: DURATIONS[0].value
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h1 className="text-center text-4xl font-bold text-gray-900 mb-2">
          Lab Scanner
        </h1>
        <h2 className="text-center text-xl text-gray-600 mb-8">
          Start New Session
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
          <div className="space-y-8">
            {/* Department Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Department
              </label>
              <div className="relative">
                <select
                  className="appearance-none block w-full px-4 py-4 text-xl bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={config.department}
                  onChange={(e) => setConfig(prev => ({ ...prev, department: e.target.value }))}
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept} className="py-2">
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Year Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Year
              </label>
              <div className="grid grid-cols-4 gap-3">
                {YEARS.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, year }))}
                    className={`py-4 text-xl font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      config.year === year
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Duration
              </label>
              <div className="relative">
                <select
                  className="appearance-none block w-full px-4 py-4 text-xl bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={config.duration}
                  onChange={(e) => setConfig(prev => ({ ...prev, duration: Number(e.target.value) }))}
                >
                  {DURATIONS.map(({ value, label }) => (
                    <option key={value} value={value} className="py-2">
                      {label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => onStart(config)}
              className="w-full flex justify-center py-5 px-4 border border-transparent rounded-xl shadow-sm text-2xl font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Start Scanning
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-base">
            Select department and year, then set duration.<br/>
            Students can start scanning their IDs once session begins.
          </p>
        </div>
      </div>
    </div>
  );
} 