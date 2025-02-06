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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Start Attendance Session
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={config.department}
                onChange={(e) => setConfig(prev => ({ ...prev, department: e.target.value }))}
              >
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={config.year}
                onChange={(e) => setConfig(prev => ({ ...prev, year: Number(e.target.value) }))}
              >
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={config.duration}
                onChange={(e) => setConfig(prev => ({ ...prev, duration: Number(e.target.value) }))}
              >
                {DURATIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onStart(config)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 