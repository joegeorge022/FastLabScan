'use client';

import { useState, useEffect } from 'react';
import type { AttendanceSession } from '@/types';

const STORAGE_KEY = 'attendance_sessions';

export const downloadSession = (session: AttendanceSession) => {
  // Helper function to format date
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${ampm}`;
  };

  const rows = [
    ['SI No', 'Registration No', 'Time', 'Department', 'Year'],
    ...session.students.map((student, index) => [
      (index + 1).toString(), // SI No
      student.regNo,
      formatDate(new Date(student.timestamp)),
      session.department,
      session.year.toString()
    ])
  ];

  // Ensure proper CSV formatting with quotes around fields that might contain commas
  const csvContent = rows.map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  
  // Format filename date
  const fileDate = formatDate(new Date(session.date)).split(' ')[0]; // Get just the date part
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendance_${fileDate}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export function useSessions() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSessions(JSON.parse(stored));
    }
  }, []);

  const saveSession = (session: AttendanceSession) => {
    setSessions(prev => {
      const updated = [...prev, session];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Delete session
  const deleteSession = (sessionId: string) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== sessionId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return {
    sessions,
    saveSession,
    downloadSession,
    deleteSession
  };
} 