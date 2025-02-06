'use client';

import { useState } from 'react';
import { QrScanner } from '@/components/QrScanner';
import { SetupScreen, SessionConfig } from '@/components/SetupScreen';
import { useSessions, downloadSession } from '@/hooks/useSessions';
import { useRouter } from 'next/navigation';

interface Student {
  regNo: string;
  timestamp: number;
}

interface ActiveSession extends SessionConfig {
  students: Student[];
}

const formatRegNo = (regNo: string) => {
  // First try splitting by '/' for format like "21/CSE/001"
  const slashParts = regNo.split('/');
  if (slashParts.length === 3) {
    return slashParts[2];
  }
  
  // For format like "24CS129", extract last two digits
  const match = regNo.match(/\d{2}$/);  // Match last two digits
  if (match) {
    return match[0];
  }
  
  return regNo;
};

export default function Home() {
  const router = useRouter();
  const { saveSession } = useSessions();
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [showScanner, setShowScanner] = useState(true);

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

  const handleDownload = () => {
    if (!session) return;
    
    const sessionData = {
      id: Date.now().toString(),
      date: Date.now(),
      department: session.department,
      year: session.year,
      students: session.students
    };

    downloadSession(sessionData);
  };

  const renderSeatLayout = () => {
    if (!session) return null;
    
    // Calculate rows and columns for a roughly square grid
    const total = session.totalStudents;
    const cols = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / cols);
    const seats = Array(total).fill(null);

    // Fill seats in order of scanning
    session.students.forEach((student, index) => {
      if (index < seats.length) {
        seats[index] = student;
      }
    });

    return (
      <div className="p-4">
        <div className={`grid gap-2 mx-auto`} 
          style={{ 
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            maxWidth: `${cols * 3}rem` 
          }}
        >
          {seats.map((student, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium ${
                student
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 rounded"></div>
            <span className="text-green-800">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
            <span className="text-red-700">Absent</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 text-center text-sm">
          <span className="font-medium text-gray-900">
            {session.students.length}
          </span>
          <span className="text-gray-600">
            {' '}of{' '}
          </span>
          <span className="font-medium text-gray-900">
            {session.totalStudents}
          </span>
          <span className="text-gray-600">
            {' '}students present
          </span>
        </div>
      </div>
    );
  };

  if (!session) {
    return <SetupScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {session.department} - Year {session.year}
              </h1>
              <p className="text-sm text-gray-500">Attendance Session</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-xs text-green-800 font-medium">Present</div>
                <div className="text-xl font-bold text-green-900">{session.students.length}</div>
              </div>
              
              {/* Desktop Download Button */}
              <button
                onClick={handleDownload}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>

              {/* Mobile Toggle Button */}
              <button 
                onClick={() => setShowScanner(prev => !prev)}
                className="lg:hidden bg-blue-50 p-2 rounded-lg"
              >
                {showScanner ? (
                  <span className="text-blue-600">View Seats</span>
                ) : (
                  <span className="text-blue-600">Scan QR</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-6">
            {/* Scanner Section */}
            <div className={`transition-all duration-300 ${
              showScanner ? 'block' : 'hidden lg:block'
            }`}>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Scanner</h2>
                </div>
                <QrScanner 
                  onScan={handleScan}
                  duration={session.duration}
                  onSessionEnd={handleSessionEnd}
                />
              </div>
            </div>

            {/* Attendance Overview Section */}
            <div className={`transition-all duration-300 ${
              !showScanner ? 'block' : 'hidden lg:block'
            }`}>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">Attendance Overview</h2>
                  {/* Mobile Download Button */}
                  <button
                    onClick={handleDownload}
                    className="sm:hidden flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export
                  </button>
                </div>
                
                {/* Seat Layout */}
                {renderSeatLayout()}

                {/* Recent Scans List */}
                <div className="border-t">
                  <div className="p-4 border-b">
                    <h3 className="text-sm font-medium text-gray-700">Recent Scans</h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                    {session.students.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        No students scanned yet
                      </div>
                    ) : (
                      session.students.map((student) => (
                        <div 
                          key={student.regNo}
                          className="px-4 py-2 flex justify-between items-center hover:bg-gray-50"
                        >
                          <div className="font-medium text-gray-900">{student.regNo}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(student.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      )).reverse()
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
