'use client';

import { useState, useEffect, useRef } from 'react';
import { QrScanner } from '@/components/QrScanner';
import { SetupScreen, SessionConfig } from '@/components/SetupScreen';
import { useSessions, downloadSession, downloadExcel, downloadJSON, downloadCSV } from '@/hooks/useSessions';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Download, FileSpreadsheet, FileJson, FileText } from "lucide-react";

interface Student {
  regNo: string;
  timestamp: number;
}

interface ActiveSession extends SessionConfig {
  students: Student[];
}

const formatRegNo = (regNo: string) => {
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
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

    // Show toast. i.e the 'succesfully scanned' component
    showToast(`✓ Scanned: ${regNo}`);
  };

  // Calculate number of rows needed based on student count
  const getGridDimensions = (studentCount: number) => {
    // Use different column counts for mobile and desktop
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    const colsPerRow = isMobile ? 7 : 10;
    const baseRows = 6;
    const totalRows = Math.ceil(studentCount / colsPerRow);
    
    return {
      rows: Math.max(baseRows, totalRows),
      cols: colsPerRow
    };
  };

  const dimensions = session ? getGridDimensions(session.students.length) : { rows: 6, cols: 10 };

  const handleSessionEnd = () => {
    if (!session) return;
    
    // Save session to localStorage with current timestamp
    const timestamp = Date.now();
    saveSession({
      id: timestamp.toString(),
      date: timestamp,  // Make sure we set the date
      department: session.department,
      year: session.year,
      students: session.students
    });
    
    setSession(null);
    router.push('/history');
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Add window resize handler
  useEffect(() => {
    const handleResize = () => {
      // Force re-render when window is resized
      setSession(prev => prev ? {...prev} : null);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderSeatLayout = () => {
    if (!session) return null;
    
    const isMobile = window.innerWidth < 1024;
    
    return (
      <div className="grid gap-1 sm:gap-1.5" 
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
                "aspect-square rounded-md text-center flex flex-col items-center justify-center relative",
                "transition-colors duration-200 active:scale-95 touch-manipulation",
                student 
                  ? "bg-green-100 text-green-800 border border-green-200" 
                  : "bg-red-100 text-red-900 border-2 border-red-200"
              )}
              title={student ? student.regNo : ''}
            >
              <div className={cn(
                "absolute top-0.5 left-1 font-medium",
                isMobile ? "text-[10px]" : "text-sm",
                student ? "text-green-700" : "text-red-700"
              )}>
                {index + 1}
              </div>
              
              {student && (
                <div className="text-center mt-1">
                  <div className={cn(
                    "font-medium opacity-75",
                    isMobile ? "text-[9px]" : "text-xs"
                  )}>
                    {formatRegNo(student.regNo).prefix}
                  </div>
                  <div className={cn(
                    "font-bold",
                    isMobile ? "text-[11px]" : "text-sm"
                  )}>
                    {formatRegNo(student.regNo).number}
                  </div>
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
      <div className="min-h-screen bg-background flex flex-col">
        {/* Fixed Header with explicit height */}
        <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b safe-area-top h-[4rem] sm:h-[4.5rem]">
          <div className="w-full h-full px-2 sm:container sm:mx-auto sm:px-4 flex items-center">
            <div className="flex-1 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">
                  {session?.department} - Year {session?.year}
                </h1>
                <p className="text-sm text-muted-foreground">Attendance Session</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 px-4 py-2 rounded-lg">
                  <div className="text-xs text-primary font-medium">Present</div>
                  <div className="text-xl font-bold text-primary">{session?.students.length}</div>
                </div>
                
                {/* Export and Toggle buttons */}
                <div className="flex items-center gap-2">
                  {/* Mobile View Toggle */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setShowScanner(!showScanner)}
                  >
                    {showScanner ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                    )}
                  </Button>

                  {/* Export Button Container */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="h-8 w-8 transition-all duration-200 active:scale-95"
                    >
                      <Download className="h-4 w-4 transition-transform duration-200" />
                    </Button>

                    {/* Export Menu */}
                    {showExportMenu && (
                      <div
                        ref={exportMenuRef}
                        className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
                      >
                        <button
                          onClick={() => {
                            downloadExcel(session);
                            setShowExportMenu(false);
                          }}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-4 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
                        >
                          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                          Export as Excel
                        </button>
                        <button
                          onClick={() => {
                            downloadJSON(session);
                            setShowExportMenu(false);
                          }}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-4 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
                        >
                          <FileJson className="mr-2 h-4 w-4 text-blue-600" />
                          Export as JSON
                        </button>
                        <button
                          onClick={() => {
                            downloadCSV(session);
                            setShowExportMenu(false);
                          }}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-4 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
                        >
                          <FileText className="mr-2 h-4 w-4 text-orange-600" />
                          Export as CSV
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Static spacer div with matching height */}
        <div className="w-full h-[4rem] sm:h-[4.5rem] flex-none" aria-hidden="true" />

        {/* Main Content Wrapper */}
        <main className="flex-1 w-full">
          <div className="w-full h-full px-2 sm:container sm:mx-auto sm:px-4 py-4 pb-24">
            <div className="grid lg:grid-cols-2 gap-3 sm:gap-4 h-full">
              {/* Scanner Section */}
              <div className={cn(
                "transition-all duration-300 h-full",
                showScanner 
                  ? 'block lg:col-span-1' 
                  : 'hidden lg:block lg:col-span-2'
              )}>
                <QrScanner
                  onScan={handleScan}
                  duration={session.duration}
                  onSessionEnd={handleSessionEnd}
                />
              </div>

              {/* Attendance Overview Section */}
              <div className={cn(
                "transition-all duration-300 h-full",
                showScanner
                  ? 'hidden lg:block lg:col-span-1'
                  : 'block lg:col-span-2'
              )}>
                <Card className="h-full">
                  <CardHeader className="py-2 sm:py-3 border-b">
                    <CardTitle>Attendance Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[calc(100%-3rem)] overflow-auto p-2 sm:p-4">
                    {renderSeatLayout()}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        {/* Fixed Bottom Bar */}
        <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t safe-area-bottom z-50 h-[4rem]">
          <div className="w-full h-full px-2 sm:container sm:mx-auto sm:px-4 flex items-center">
            <div className="w-full flex justify-center">
              <Button
                onClick={handleSessionEnd}
                variant="destructive"
                size="lg"
                className="w-full max-w-sm active:scale-95 transition-transform"
              >
                End Session
              </Button>
            </div>
          </div>
        </footer>

        {/* Bottom spacer */}
        <div className="w-full h-[4rem] flex-none" aria-hidden="true" />
      </div>
    </>
  );
}
