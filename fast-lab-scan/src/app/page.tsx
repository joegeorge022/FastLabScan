'use client';

import { useState } from 'react';
import { QrScanner } from '@/components/QrScanner';
import { SetupScreen, SessionConfig } from '@/components/SetupScreen';

interface Student {
  regNo: string;
  timestamp: number;
}

interface ActiveSession extends SessionConfig {
  students: Student[];
}

export default function Home() {
  const [session, setSession] = useState<ActiveSession | null>(null);

  const handleStart = (config: SessionConfig) => {
    setSession({
      ...config,
      students: []
    });
  };

  const handleScan = (regNo: string) => {
    if (!session) return;
    
    if (session.students.some(s => s.regNo === regNo)) {
      // Could add a "duplicate scan" notification here
      return;
    }

    setSession(prev => ({
      ...prev!,
      students: [...prev!.students, {
        regNo,
        timestamp: Date.now()
      }]
    }));
  };

  const handleSessionEnd = () => {
    if (!session) return;
    
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
    a.download = `attendance_${session.department}_${session.year}yr_${new Date().toLocaleDateString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    setSession(null);
  };

  if (!session) {
    return <SetupScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {session.department} - Year {session.year}
              </h3>
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                Present: {session.students.length}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Scanner */}
              <div className="bg-gray-50 rounded-lg p-4">
                <QrScanner 
                  onScan={handleScan}
                  duration={session.duration}
                  onSessionEnd={handleSessionEnd}
                />
              </div>

              {/* Student List */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="overflow-y-auto max-h-[500px]">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registration No
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {session.students.map((student) => (
                        <tr key={student.regNo}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.regNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {new Date(student.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
