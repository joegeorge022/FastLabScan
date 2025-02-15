'use client';

import { Html5QrcodeScanner, Html5QrcodeScannerState, Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useEffect, useState, useRef, useCallback } from "react";
import type { ReactElement } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PinDialog } from "@/components/ui/pin-dialog";
import { Lock, LockKeyhole } from "lucide-react";
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
  const [currentCamera, setCurrentCamera] = useState<string>('environment'); // i tried front camera but it was not stable so i used environment
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [manualRegNo, setManualRegNo] = useState('');
  const [isManualEntryLocked, setIsManualEntryLocked] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pinDialogMode, setPinDialogMode] = useState<'set' | 'verify'>('verify');
  const [sessionPin, setSessionPin] = useState<string | null>(null);
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/beep.mp3');
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleScan = useCallback(async (decodedText: string) => {
    if (isProcessingScan || decodedText === lastScanned) return;
    
    try {
      setIsProcessingScan(true);
      const parsed = parseRegNo(decodedText);
      
      if (!parsed.isValid) {
        showToast('Invalid registration number format', 'error');
        return;
      }

      if (parsed.department !== currentDepartment) {
        showToast(`Wrong department: ${parsed.department}`, 'error');
        return;
      }

      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }

      if (audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.debug('Audio play error:', error);
        }
      }

      setLastScanned(decodedText);
      onScan(decodedText);
      showToast(`Scanned: ${decodedText}`, 'success');

    } finally {
      setTimeout(() => {
        setIsProcessingScan(false);
        setLastScanned(null);
      }, 1000);
    }
  }, [currentDepartment, isProcessingScan, lastScanned, onScan, showToast]);

  const initializeScanner = useCallback(async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      
      const preferredCamera = localStorage.getItem(CAMERA_STORAGE_KEY);
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: isMobile ? 15 : 10,
        qrbox: {
          width: 250,
          height: 250
        },
        rememberLastUsedCamera: true,
        aspectRatio: 1,
        showTorchButtonIfSupported: true,
        videoConstraints: {
          facingMode: preferredCamera || currentCamera,
          width: isMobile ? 
            { min: 360, ideal: 720, max: 1280 } : 
            { min: 640, ideal: 1280, max: 1920 },
          height: isMobile ? 
            { min: 360, ideal: 720, max: 1280 } : 
            { min: 480, ideal: 720, max: 1080 },
        },
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: isMobile ? 1 : 1.5,
        disableFlip: isMobile
      }, false);

      scannerRef.current = scanner;
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");

      try {
        await scanner.render(
          handleScan,
          (error: unknown) => {
            console.debug('QR Scanner error:', error);
          }
        );
      } catch (error) {
        console.error('Scanner render error:', error);
        setTimeout(initializeScanner, 1000);
      }

      const initTimeout = setTimeout(() => {
        setIsInitialized(true);
      }, 1000);

      return () => clearTimeout(initTimeout);
    } catch (error) {
      console.error('Failed to initialize scanner:', error);
    }
  }, [currentCamera, handleScan]);

  const switchCamera = async () => {
    if (!html5QrCodeRef.current) return;

    const newFacingMode = currentCamera === 'environment' ? 'user' : 'environment';
    setCurrentCamera(newFacingMode);
    localStorage.setItem(CAMERA_STORAGE_KEY, newFacingMode);

    if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
      await scannerRef.current.clear();
    }

    await initializeScanner();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualRegNo.trim()) {
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }

      const audio = new Audio('/sounds/beep.mp3');
      audio.play().catch(() => {});

      onScan(manualRegNo.trim().toUpperCase());
      setManualRegNo('');
    }
  };

  const cleanupScanner = useCallback(async () => {
    try {
      if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
        await scannerRef.current.clear();
      }
      scannerRef.current = null;
      html5QrCodeRef.current = null;
    } catch (error) {
      console.debug('Scanner cleanup error:', error);
    }
  }, []);

  useEffect(() => {
    initializeScanner();
    return () => {
      cleanupScanner();
    };
  }, [initializeScanner, cleanupScanner]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
            scannerRef.current.clear();
          }
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

  return (
    <div className="flex flex-col h-full">
      {/* Timer Card */}
      <Card className="mb-3 sm:mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              {duration} min session
            </div>
          </div>
          <Progress value={timePercentage} />
        </CardContent>
      </Card>

      {/* QR Scanner Section */}
      <Card className="mb-3 sm:mb-4">
        <CardHeader className="py-2 sm:py-3 border-b">
          <CardTitle>QR Scanner</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div 
            id="qr-reader" 
            className={cn(
              "transition-opacity duration-300",
              "min-h-[350px] lg:min-h-[400px]",
              isInitialized ? 'opacity-100' : 'opacity-0'
            )}
          />
          {/* Camera Switch Button */}
          <div className="p-4 border-t bg-white">
            <Button
              onClick={switchCamera}
              variant="outline"
              className="w-full"
              type="button"
            >
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                />
              </svg>
              Switch Camera ({currentCamera === 'environment' ? 'Back' : 'Front'})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry moved to page.tsx */}
      <Card>
        <CardHeader className="py-2 sm:py-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Manual Entry</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLockClick}
              className="text-muted-foreground hover:text-foreground"
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
              placeholder={isManualEntryLocked ? "Locked - Click the lock icon to unlock" : "Enter Registration Number"}
              value={manualRegNo}
              onChange={(e) => setManualRegNo(e.target.value)}
              className="flex-1"
              pattern="[0-9A-Za-z]+"
              maxLength={20}
              disabled={isManualEntryLocked}
            />
            <Button 
              type="submit"
              variant="secondary"
              className="w-full sm:w-auto"
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