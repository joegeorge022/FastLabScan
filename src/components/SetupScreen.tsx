'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = 'last_department_config';

const DEPARTMENTS = [
  { value: 'CS', label: 'CS' },
  { value: 'AD', label: 'AD' },
  { value: 'AI', label: 'AI' },
  { value: 'EEE', label: 'EEE' },
  { value: 'ME', label: 'ME' },
  { value: 'CE', label: 'CE' },
  { value: 'ECE', label: 'ECE' },
  { value: 'ECS', label: 'ECS' },
] as const;

export type Department = typeof DEPARTMENTS[number]['value'];

export interface SessionConfig {
  department: Department;
  year: number;
  duration: number;
}

interface Props {
  onStart: (config: SessionConfig) => void;
}

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
    department: 'AD',
    year: 1,
    duration: 10,
  });

  // Load saved config on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(prev => ({
          ...prev,
          department: parsed.department || 'AD',
          year: parsed.year || 1,
          duration: 10
        }));
      } catch (error) {
        console.error('Error parsing saved config:', error);
      }
    }
  }, []);

  // Save department and year whenever they change
  useEffect(() => {
    if (config.department) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        department: config.department,
        year: config.year
      }));
    }
  }, [config.department, config.year]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Setup Attendance Session</CardTitle>
            <CardDescription>Configure the session details before starting</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Department Selection */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={config.department}
                onValueChange={(value: Department) => setConfig(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year Selection */}
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select
                value={config.year.toString()}
                onValueChange={(value: string) => setConfig(prev => ({ ...prev, year: parseInt(value) }))}
              >
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      Year {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Duration Selection */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={config.duration.toString()}
                onValueChange={(value: string) => setConfig(prev => ({ ...prev, duration: parseInt(value) }))}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Button */}
            <Button 
              className="w-full"
              size="lg"
              onClick={() => onStart(config)}
              disabled={!config.department || !config.year || !config.duration}
            >
              Start Scanning
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="mt-8 text-center text-muted-foreground">
          <p className="text-sm">
            Select department and year, set session duration.<br/>
            Students can start scanning their IDs once session begins.
          </p>
        </div>
      </div>
    </div>
  );
} 