'use client';

import { useState, useEffect, useRef } from 'react';
import { QrScanner } from '@/components/QrScanner';
import { SetupScreen, SessionConfig } from '@/components/SetupScreen';
import { useSessions, downloadExcel, downloadJSON, downloadCSV } from '@/hooks/useSessions';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Download, FileSpreadsheet, FileJson, FileText } from "lucide-react";
import { LoadingScreen } from '@/components/LoadingScreen';

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

const getSeatNumberFromRegNo = (regNo: string): number => {
const match = regNo.match(/(\d+)$/);
if (match) {
return parseInt(match[0], 10);
}
return 0;
};

export default function Home() {
  const router = useRouter();
  const { saveSession } = useSessions();
  const [session, setSession] = useState<ActiveSession | null>(null);
  const [showScanner, setShowScanner] = useState(true);
  const { showToast } = useToast();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('activeSession');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession) as ActiveSession & { lastUpdated?: number };
        
        const thirtyMinutesInMs = 30 * 60 * 1000;
        const now = Date.now();
        const lastUpdated = parsedSession.lastUpdated || 0;
        
        if (now - lastUpdated > thirtyMinutesInMs) {
          localStorage.removeItem('activeSession');
          showToast('Previous session expired', 'error');
          return;
        }
        
        setSession(parsedSession);
        showToast('Session restored from previous session', 'success');
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('activeSession');
      }
    }
  }, [showToast]);

  useEffect(() => {
    const savedSession = localStorage.getItem('activeSession');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession) as ActiveSession & { lastUpdated?: number };
        
        const thirtyMinutesInMs = 30 * 60 * 1000;
        const now = Date.now();
        const lastUpdated = parsedSession.lastUpdated || 0;
        
        if (now - lastUpdated > thirtyMinutesInMs) {
          localStorage.removeItem('activeSession');
          showToast('Previous session expired', 'error');
          return;
        }
        
        setSession(parsedSession);
        showToast('Session restored from previous session', 'success');
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('activeSession');
      }
    }
  }, [showToast]);

  useEffect(() => {
    if (session && session.students.length > 0) {
      const dims = getGridDimensions(session.students.length);
      const maxSeatNumber = Math.max(
        ...session.students.map(s => getSeatNumberFromRegNo(s.regNo))
      );
      if (maxSeatNumber > dims.rows * dims.cols) {
        setSession(prev => prev ? {...prev} : null);
      }
    }
  }, [session?.students.length]);

  useEffect(() => {
    if (session) {
      const sessionWithTimestamp = {
        ...session,
        lastUpdated: Date.now()
      };
      localStorage.setItem('activeSession', JSON.stringify(sessionWithTimestamp));
    } else {
      localStorage.removeItem('activeSession');
    }
  }, [session]);

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

  const withLoading = async (callback: () => Promise<void> | void) => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(true);
    }, 300);
    
    try {
      await callback();
    } finally {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      setIsLoading(false);
    }
  };

  const handleStart = (config: SessionConfig) => {
    withLoading(async () => {
      localStorage.removeItem('activeSession');
      
      setSession({
        ...config,
        students: []
      });
    });
  };

  const handleScan = (regNo: string) => {
    if (!session) return;
  
    if (session.students.some(s => s.regNo === regNo)) {
      showToast(`${regNo} already scanned`, 'error');
      return;
    }
  
    const newStudent: Student = {
      regNo,
      timestamp: Date.now()
    };
  
    const newSeatNumber = getSeatNumberFromRegNo(regNo);
    const existingSeatStudent = session.students.find(s => 
      getSeatNumberFromRegNo(s.regNo) === newSeatNumber
    );
    
    if (existingSeatStudent) {
      showToast(`Seat ${newSeatNumber} already occupied by ${existingSeatStudent.regNo}`, 'error');
      return;
    }

    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        students: [...prev.students, newStudent]
      };
    });

    showToast(`✓ Scanned: ${regNo}`, 'success');
  };

  const getGridDimensions = (studentCount: number) => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 0;
    
    let colsPerRow = 6;
    
    if (width < 640) {
      colsPerRow = 5;
    } else if (width < 768) {
      colsPerRow = 6;
    } else if (width < 1024) {
      colsPerRow = 6;
    } else if (width >= 1600) {
      colsPerRow = 8;
    }
    
    const baseRows = Math.ceil(60 / colsPerRow);
    const totalRows = Math.ceil(studentCount / colsPerRow);
    
    return {
      rows: Math.max(baseRows, totalRows),
      cols: colsPerRow
    };
  };

  const dimensions = session ? getGridDimensions(session.students.length) : { rows: 6, cols: 10 };

  const handleSessionEnd = () => {
    if (!session) return;
    
    withLoading(async () => {
      const timestamp = Date.now();
      saveSession({
        id: timestamp.toString(),
        date: timestamp,
        department: session.department,
        year: session.year,
        students: session.students
      });
      
      localStorage.removeItem('activeSession');
      
      setSession(null);
      router.push('/history');
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setSession(prev => prev ? {...prev} : null);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderSeatLayout = () => {
    if (!session) return null;
    
    const width = typeof window !== 'undefined' ? window.innerWidth : 0;
    const isSmallMobile = width < 640;
    const isMobile = width < 768;
    const isDesktop = width >= 1024;
    const isLargeDesktop = width >= 1440;
    
    const gapClass = isLargeDesktop ? 'gap-4' : isDesktop ? 'gap-3' : isMobile ? 'gap-1.5' : 'gap-2';
    const paddingClass = isDesktop ? (dimensions.cols >= 8 ? 'p-2' : 'p-3') : 'p-1.5';
    
    const seatMap: Record<number, Student> = {};
    session.students.forEach(student => {
      const seatNumber = getSeatNumberFromRegNo(student.regNo);
      seatMap[seatNumber] = student;
    });
    
    const maxGridSeat = dimensions.rows * dimensions.cols;
    
    const occupiedSeats = session.students.map(s => getSeatNumberFromRegNo(s.regNo)).sort((a, b) => a - b);
    
    const seatNumbers: number[] = [];
    
    for (let i = 1; i <= maxGridSeat; i++) {
      seatNumbers.push(i);
    }
    
    if (occupiedSeats.some(seat => seat > maxGridSeat)) {
      const overflowSeats = occupiedSeats.filter(seat => seat > maxGridSeat);
      
      seatNumbers.push(-1);
      
      seatNumbers.push(...overflowSeats);
    }
    
    for (let i = 1; i < seatNumbers.length; i++) {
      const current = seatNumbers[i];
      const prev = seatNumbers[i-1];
      
      if (current === -1 || prev === -1 || current === prev + 1) continue;
      
      if (current > prev + 1) {
        seatNumbers.splice(i, 0, -1);
        i++;
      }
    }
    
    return (
      <div 
        className={`grid ${gapClass} ${paddingClass}`}
        style={{ 
          gridTemplateColumns: `repeat(${dimensions.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${Math.ceil(seatNumbers.length / dimensions.cols)}, minmax(0, 1fr))`
        }}
      >
        {seatNumbers.map((seatNumber, index) => {
          if (seatNumber === -1) {
            return (
              <div
                key={`placeholder-${index}`}
                className={cn(
                  "aspect-square rounded-lg text-center flex flex-col items-center justify-center relative",
                  "bg-gray-100 text-gray-500 border-2 border-gray-200"
                )}
              >
                <div className="text-2xl font-bold">...</div>
              </div>
            );
          }
          
          const student = seatMap[seatNumber];
          
          return (
            <div
              key={`seat-${seatNumber}`}
              className={cn(
                "aspect-square rounded-lg text-center flex flex-col items-center justify-center relative",
                "transition-colors duration-200 active:scale-95 touch-manipulation shadow-sm",
                isDesktop ? (dimensions.cols >= 8 ? "p-2" : "p-3") : "p-1.5",
                student 
                  ? "bg-green-100 text-green-800 border-2 border-green-300" 
                  : "bg-red-100 text-red-900 border-2 border-red-300"
              )}
              title={student ? student.regNo : ''}
            >
              {!student && (
                <div className={cn(
                  "absolute top-1 left-1.5 font-bold",
                  isSmallMobile ? "text-xs" : isMobile ? "text-sm" :
                  isLargeDesktop ? (dimensions.cols >= 8 ? "text-base" : "text-lg") : "text-base",
                  "text-red-700"
                )}>
                  {seatNumber}
                </div>
              )}
              
              {student && (
                <div className="text-center">
                  <div className={cn(
                    "font-bold",
                    isSmallMobile ? "text-lg" : isMobile ? "text-xl" :
                    isLargeDesktop ? (dimensions.cols >= 8 ? "text-xl" : "text-2xl") : "text-xl"
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
        <LoadingScreen isLoading={isLoading} />
        
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
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="h-8 w-8 transition-all duration-200 active:scale-95"
                    >
                      <Download className="h-4 w-4 transition-transform duration-200" />
                    </Button>

                    {showExportMenu && (
                      <div
                        ref={exportMenuRef}
                        className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
                      >
                        <button
                          onClick={() => {
                            const sessionData = {
                              id: Date.now().toString(),
                              date: Date.now(),
                              department: session.department,
                              year: session.year,
                              students: session.students
                            };
                            downloadExcel(sessionData);
                            setShowExportMenu(false);
                          }}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-4 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
                        >
                          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                          Export as Excel
                        </button>
                        <button
                          onClick={() => {
                            const sessionData = {
                              id: Date.now().toString(),
                              date: Date.now(),
                              department: session.department,
                              year: session.year,
                              students: session.students
                            };
                            downloadJSON(sessionData);
                            setShowExportMenu(false);
                          }}
                          className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-4 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.98]"
                        >
                          <FileJson className="mr-2 h-4 w-4 text-blue-600" />
                          Export as JSON
                        </button>
                        <button
                          onClick={() => {
                            const sessionData = {
                              id: Date.now().toString(),
                              date: Date.now(),
                              department: session.department,
                              year: session.year,
                              students: session.students
                            };
                            downloadCSV(sessionData);
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

        <div className="w-full h-[4rem] sm:h-[4.5rem] flex-none" aria-hidden="true" />

        <main className="flex-1 w-full">
          <div className="w-full h-full px-2 sm:container sm:mx-auto sm:px-4 py-4 pb-24">
            <div className="grid lg:grid-cols-2 gap-3 sm:gap-4 h-full">
              <div className={cn(
                "transition-all duration-300 transform h-full",
                showScanner 
                  ? 'block lg:col-span-1 opacity-100 translate-x-0' 
                  : 'hidden lg:block lg:col-span-1 lg:opacity-100 lg:translate-x-0'
              )}>
                <QrScanner
                  onScan={handleScan}
                  duration={session.duration}
                  onSessionEnd={handleSessionEnd}
                  currentDepartment={session.department}
                />
              </div>

              <div className={cn(
                "transition-all duration-300 transform h-full",
                showScanner
                  ? 'hidden lg:block lg:col-span-1 lg:opacity-100 lg:translate-x-0'
                  : 'block lg:col-span-1 opacity-100 translate-x-0'
              )}>
                <Card className="h-full">
                  <CardHeader className="py-2 sm:py-3 border-b sticky top-0 bg-card z-10">
                    <div className="flex justify-between items-center">
                      <CardTitle>Attendance Overview</CardTitle>
                      <div className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full text-primary">
                        {session.students.length} / {dimensions.rows * dimensions.cols}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="overflow-auto p-1 sm:p-3 pb-16 h-[calc(100%-3.5rem)]">
                    <div className="min-h-full">
                      {renderSeatLayout()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-t safe-area-bottom z-50">
          <div className="w-full px-2 sm:container sm:mx-auto sm:px-4 py-2">
            <div className="flex justify-between items-center gap-2">
              <div className="w-full lg:hidden">
                <Button
                  onClick={() => setShowScanner(!showScanner)}
                  variant="secondary"
                  className="w-full h-11 text-sm font-medium active:scale-95 transition-transform"
                >
                  {showScanner ? (
                    <div className="flex items-center justify-center w-full">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      View Seats
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                      Scan QR
                    </div>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="mt-2 mb-1">
              <Button
                onClick={handleSessionEnd}
                variant="destructive"
                className="w-full lg:w-1/3 mx-auto block h-12 text-base font-medium active:scale-95 transition-transform"
              >
                End Session
              </Button>
            </div>
          </div>
        </footer>

        <div className="w-full h-[4rem] flex-none" aria-hidden="true" />
      </div>
    </>
  );
}

