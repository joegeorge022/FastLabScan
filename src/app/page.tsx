'use client';

import { useState } from 'react';
import { QrScanner } from '@/components/QrScanner';
import { SetupScreen, SessionConfig } from '@/components/SetupScreen';
import { useSessions } from '@/hooks/useSessions';
import { useRouter } from 'next/navigation';

interface Student {
  regNo: string;
  timestamp: number;
}

interface ActiveSession extends SessionConfig {
  students: Student[];
}

export default function Home() {
  const router = useRouter();
  const { saveSession } = useSessions();
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
    
    // Save session to localStorage
    saveSession({
      id: Date.now().toString(),
      date: Date.now(),
      department: session.department,
      year: session.year,
      students: session.students
    });
    
    setSession(null);
    router.push('/history');
  };

  if (!session) {
    return <SetupScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header Card */}
        <div className="bg-white shadow-lg rounded-xl mb-6">
          <div className="px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {session.department} - Year {session.year}
                </h1>
                <p className="text-gray-500 mt-1">Attendance Session</p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <div className="text-sm text-green-800 font-medium">Present</div>
                  <div className="text-2xl font-bold text-green-900">{session.students.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Scanner</h2>
              <QrScanner 
                onScan={handleScan}
                duration={session.duration}
                onSessionEnd={handleSessionEnd}
              />
            </div>
          </div>

          {/* Student List Section */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Scanned Students</h2>
              <div className="overflow-y-auto max-h-[500px] rounded-lg border border-gray-200">
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
                    {session.students.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                          No students scanned yet
                        </td>
                      </tr>
                    ) : (
                      session.students.map((student) => (
                        <tr key={student.regNo} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.regNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {new Date(student.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
