'use client';

import { useState, useEffect } from 'react';
import type { AttendanceSession } from '@/types';

const STORAGE_KEY = 'attendance_sessions';

export function useSessions() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSessions(JSON.parse(stored));
    }
  }, []);

  // Save session
  const saveSession = (session: AttendanceSession) => {
    setSessions(prev => {
      const updated = [...prev, session];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Download session as CSV
  const downloadSession = (session: AttendanceSession) => {
    const rows = [
      ['Registration No', 'Time', 'Department', 'Year'],
      ...session.students.map(student => [
        student.regNo,
        new Date(student.timestamp).toLocaleTimeString(),
        session.department,
        session.year
      ])
    ];

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${session.department}_${session.year}yr_${new Date(session.date).toLocaleDateString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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