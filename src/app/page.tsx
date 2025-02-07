'use client';

import { useState } from 'react';
import { QrScanner } from '@/components/QrScanner';
import { SetupScreen, SessionConfig } from '@/components/SetupScreen';
import { useSessions, downloadSession } from '@/hooks/useSessions';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface Student {
  regNo: string;
  timestamp: number;
}

interface ActiveSession extends SessionConfig {
  students: Student[];
}

const formatRegNo = (regNo: string) => {
  // Split into prefix and number (e.g., "24CS" and "129")
  const prefix = regNo.slice(0, -3);
  const number = regNo.slice(-3);
  return { prefix, number };
};

export default function Home() {
  const router = useRouter();
  const { saveSession } = useSessions();
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [showScanner, setShowScanner] = useState(true);
  const { showToast } = useToast();

  const handleStart = (config: SessionConfig) => {
    setSession({
      ...config,
      students: []
    });
  };

  const handleScan = (regNo: string) => {
    if (!session) return;

    // Check if student already scanned
    if (session.students.some(s => s.regNo === regNo)) {
      return;
    }

    const newStudent: Student = {
      regNo,
      timestamp: Date.now()
    };

    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        students: [...prev.students, newStudent]
      };
    });

    // Show toast
    showToast(`✓ Scanned: ${regNo}`);
  };

  // Calculate number of rows needed based on student count
  const getGridDimensions = (studentCount: number) => {
    const baseRows = Math.ceil(60 / 10); // Base 6 rows for 60 students (10 per row)
    const totalRows = Math.ceil(studentCount / 10); // Actual rows needed
    return {
      rows: Math.max(baseRows, totalRows),
      cols: 10
    };
  };

  const dimensions = session ? getGridDimensions(session.students.length) : { rows: 6, cols: 10 };

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
    
    return (
      <div className="grid gap-2" 
        style={{ 
          gridTemplateColumns: `repeat(${dimensions.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${dimensions.rows}, minmax(0, 1fr))`
        }}>
        {Array.from({ length: dimensions.rows * dimensions.cols }).map((_, index) => {
          const student = session?.students[index];
          return (
            <div
              key={index}
              className={cn(
                "aspect-square rounded-lg p-2 text-center flex flex-col items-center justify-center relative",
                student 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-50 text-red-700 border border-red-200"
              )}
              // Add tooltip with full reg number
              title={student ? student.regNo : ''}
            >
              {/* Always show seat number */}
              <div className={cn(
                "absolute top-1 left-2 text-xs",
                student ? "text-green-700" : "text-red-600"
              )}>
                {index + 1}
              </div>
              
              {student && (
                <div className="text-center">
                  <div className="text-xs font-medium opacity-75">{formatRegNo(student.regNo).prefix}</div>
                  <div className="text-sm font-bold">{formatRegNo(student.regNo).number}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!session) {
    return <SetupScreen onStart={handleStart} />;
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold">
                  {session?.department} - Year {session?.year}
                </h1>
                <p className="text-sm text-muted-foreground">Attendance Session</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 px-4 py-2 rounded-lg">
                  <div className="text-xs text-primary font-medium">Present</div>
                  <div className="text-xl font-bold text-primary">{session?.students.length}</div>
                </div>
                
                {/* Only Export and Toggle buttons remain in header */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="hidden sm:flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export CSV
                  </Button>

                </div>
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

        {/* New Fixed Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-center">
              <Button
                onClick={handleSessionEnd}
                variant="destructive"
                size="lg"
                className="w-full max-w-sm flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                End Session
              </Button>
            </div>
          </div>
        </div>

        {/* Add padding to prevent content from being hidden behind the bottom bar */}
        <div className="h-20"></div>
      </div>
    </>
  );
}
