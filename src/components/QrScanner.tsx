'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import type { ReactElement } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import type { IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PinDialog } from "@/components/ui/pin-dialog";
import { Lock, LockKeyhole, Camera, CameraOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface ParsedRegNo {
  year: string;
  department: string;
  rollNo: string;
  isValid: boolean;
}

const parseRegNo = (regNo: string): ParsedRegNo => {
  const match = regNo.match(/^(\d{2})((?:CS|AD|AI|EE|ME|CE|EC|ECS))(\d{3})$/);
  
  if (!match) {
    return { year: '', department: '', rollNo: '', isValid: false };
  }

  return {
    year: match[1],
    department: match[2],
    rollNo: match[3],
    isValid: true
  };
};

interface Props {
  onScan: (regNo: string) => void;
  duration: number;
  onSessionEnd: () => void;
  currentDepartment: string;
}

const CAMERA_STORAGE_KEY = 'preferred_camera';

export function QrScanner({ onScan, duration, onSessionEnd, currentDepartment }: Props): ReactElement {
  const { showToast } = useToast();
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [manualRegNo, setManualRegNo] = useState('');
  const [isManualEntryLocked, setIsManualEntryLocked] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinDialogMode, setPinDialogMode] = useState<'set' | 'verify'>('verify');
  const [sessionPin, setSessionPin] = useState<string | null>(null);
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [scannerKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/beep.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const preferredCamera = localStorage.getItem(CAMERA_STORAGE_KEY);
    if (preferredCamera === 'user' || preferredCamera === 'environment') {
      setCameraFacingMode(preferredCamera);
    }
    
    const initTimeout = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);

    return () => clearTimeout(initTimeout);
  }, []);

  const handleScan = useCallback(async (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length === 0 || isProcessingScan) return;
    
    const result = detectedCodes[0].rawValue;
    
    if (result === lastScanned) return;
    
    try {
      setIsProcessingScan(true);
      const parsed = parseRegNo(result);
      
      if (!parsed.isValid) {
        showToast('Invalid registration number format', 'error');
        return;
      }

      if (parsed.department !== currentDepartment) {
        showToast(`Wrong department: ${parsed.department}`, 'error');
        return;
      }

      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }

      if (audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.debug('Audio play error:', error);
        }
      }

      setLastScanned(result);
      onScan(result);
      showToast(`Scanned: ${result}`, 'success');

    } finally {
      setTimeout(() => {
        setIsProcessingScan(false);
        setLastScanned(null);
      }, 1500);
    }
  }, [currentDepartment, isProcessingScan, lastScanned, onScan, showToast]);

  const switchCamera = () => {
    const newFacingMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    setCameraFacingMode(newFacingMode);
    localStorage.setItem(CAMERA_STORAGE_KEY, newFacingMode);
    showToast(`Camera switched to ${newFacingMode === 'environment' ? 'back' : 'front'}`, 'success');
  };

  const toggleCamera = () => {
    setIsCameraActive(!isCameraActive);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualRegNo.trim()) {
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }

      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      onScan(manualRegNo.trim().toUpperCase());
      setManualRegNo('');
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          onSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [duration, onSessionEnd]);

  const handleSetPin = (pin: string) => {
    setSessionPin(pin);
    setIsManualEntryLocked(true);
    setShowPinDialog(false);
  };

  const handleUnlock = () => {
    setIsManualEntryLocked(false);
    setShowPinDialog(false);
  };

  const handleLockClick = () => {
    if (isManualEntryLocked) {
      setPinDialogMode('verify');
      setShowPinDialog(true);
    } else {
      if (!sessionPin) {
        setPinDialogMode('set');
        setShowPinDialog(true);
      } else {
        setIsManualEntryLocked(true);
      }
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timePercentage = (timeLeft / (duration * 60)) * 100;

  const getScannerConstraints = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isMobile) {
      return {
        facingMode: cameraFacingMode,
        width: { min: 360, ideal: 720, max: 1080 },
        height: { min: 360, ideal: 720, max: 1080 },
        aspectRatio: { min: 0.5, max: 1.5 }
      };
    }
    
    return {
      facingMode: cameraFacingMode,
      width: { min: 640, ideal: 1080, max: 1920 },
      height: { min: 480, ideal: 1080, max: 1080 },
      aspectRatio: { min: 0.75, max: 1.33 }
    };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Timer Card */}
      <Card className="mb-3 sm:mb-4 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl sm:text-3xl font-bold">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              {duration} min session
            </div>
          </div>
          <Progress value={timePercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* QR Scanner Section */}
      <Card className="mb-3 sm:mb-4 shadow-sm overflow-hidden">
        <CardHeader className="py-2 sm:py-3 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
              <span className="hidden sm:inline">QR</span> Scanner
            </CardTitle>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleCamera}
                className="h-9 w-9"
                title={isCameraActive ? "Turn Off Camera" : "Turn On Camera"}
              >
                {isCameraActive ? (
                  <CameraOff className="h-4 w-4" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={switchCamera}
                className="h-9 w-9 text-primary"
                title="Switch Camera (Front/Back)"
                disabled={!isCameraActive}
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col items-center justify-center">
          <div 
            ref={scannerContainerRef}
            className={cn(
              "transition-opacity duration-300 w-full",
              "h-[350px] sm:h-[400px] md:h-[450px]",
              isInitialized ? 'opacity-100' : 'opacity-0'
            )}
          >
            {isCameraActive && (
              <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Scanner
                    key={scannerKey}
                    onScan={handleScan}
                    onError={(error: unknown) => console.debug('QR Scanner error:', error)}
                    scanDelay={500}
                    constraints={getScannerConstraints()}
                    styles={{
                      container: {
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      },
                      video: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        overflow: 'hidden'
                      }
                    }}
                    components={{
                      audio: true,
                      finder: false
                    }}
                  />
                </div>
                {/* Custom scanner frame overlay - mobile optimized */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] md:w-[320px] md:h-[320px] border-2 border-dashed border-red-500/40 rounded-lg">
                    <div className="absolute top-0 left-0 w-10 h-10 sm:w-12 sm:h-12 border-t-4 border-l-4 border-red-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-10 h-10 sm:w-12 sm:h-12 border-t-4 border-r-4 border-red-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 sm:w-12 sm:h-12 border-b-4 border-l-4 border-red-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 border-b-4 border-r-4 border-red-500 rounded-br-lg"></div>
                  </div>
                </div>
              </div>
            )}
            {!isCameraActive && (
              <div className="flex items-center justify-center h-full min-h-[350px] bg-muted/20">
                <div className="text-center">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground/70" />
                  <p className="text-muted-foreground">Camera is turned off</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleCamera} 
                    className="mt-3"
                  >
                    Turn On Camera
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry Section */}
      <Card className="shadow-sm mb-20">
        <CardHeader className="py-2 sm:py-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg">Manual Entry</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLockClick}
              className="text-muted-foreground hover:text-foreground"
              title={isManualEntryLocked ? "Unlock Entry" : "Lock Entry"}
            >
              {isManualEntryLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <LockKeyhole className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleManualSubmit} className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder={isManualEntryLocked ? "Locked - Tap the lock icon to unlock" : "Enter Registration Number"}
              value={manualRegNo}
              onChange={(e) => setManualRegNo(e.target.value)}
              className="flex-1 text-base h-12 sm:h-10"
              pattern="[0-9A-Za-z]+"
              maxLength={20}
              disabled={isManualEntryLocked}
              inputMode="text"
              autoCapitalize="characters"
            />
            <Button 
              type="submit"
              variant="secondary"
              className="w-full h-12 sm:h-10 sm:w-auto text-base"
              disabled={isManualEntryLocked}
            >
              Add Student
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* PIN Dialog */}
      <PinDialog
        isOpen={showPinDialog}
        onClose={() => setShowPinDialog(false)}
        onUnlock={handleUnlock}
        onSetPin={handleSetPin}
        mode={pinDialogMode}
        sessionPin={sessionPin}
      />
    </div>
  );
} 