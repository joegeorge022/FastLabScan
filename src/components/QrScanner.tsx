'use client';

import { Html5QrcodeScanner, Html5QrcodeScannerState, Html5Qrcode } from "html5-qrcode";
import { useEffect, useState, useRef } from "react";
import type { ReactElement } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface Props {
  onScan: (regNo: string) => void;
  duration: number;
  onSessionEnd: () => void;
}

const CAMERA_STORAGE_KEY = 'preferred_camera';

export function QrScanner({ onScan, duration, onSessionEnd }: Props): ReactElement {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [currentCamera, setCurrentCamera] = useState<string>('environment'); // Default to back camera
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const initializeScanner = async () => {
    try {
      const preferredCamera = localStorage.getItem(CAMERA_STORAGE_KEY);
      
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250
        },
        rememberLastUsedCamera: true,
        aspectRatio: 1,
        showTorchButtonIfSupported: true,
        videoConstraints: {
          facingMode: preferredCamera || currentCamera,
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          // Increase zoom for mobile devices
          advanced: [{ zoom: 2.0 }]
        }
      }, false);

      scannerRef.current = scanner;
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");

      scanner.render(
        (decodedText: string) => {
          if (decodedText === lastScanned) return;

          if ('vibrate' in navigator) {
            navigator.vibrate(100);
          }

          const audio = new Audio('/sounds/beep.mp3');
          audio.play().catch(() => {});

          setLastScanned(decodedText);
          onScan(decodedText);

          setTimeout(() => {
            setLastScanned(null);
          }, 2000);
        },
        (error: unknown) => {
          console.debug('QR Scanner error:', error);
        }
      );

      const initTimeout = setTimeout(() => {
        setIsInitialized(true);
      }, 1000);

      return () => clearTimeout(initTimeout);
    } catch (error) {
      console.error('Failed to initialize scanner:', error);
    }
  };

  const switchCamera = async () => {
    if (!html5QrCodeRef.current) return;

    // Toggle between front and back camera
    const newFacingMode = currentCamera === 'environment' ? 'user' : 'environment';
    setCurrentCamera(newFacingMode);
    localStorage.setItem(CAMERA_STORAGE_KEY, newFacingMode);

    // Stop current scanner
    if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
      await scannerRef.current.clear();
    }

    // Reinitialize with new camera
    await initializeScanner();
  };

  useEffect(() => {
    initializeScanner();

    return () => {
      if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current.clear();
      }
      scannerRef.current = null;
      html5QrCodeRef.current = null;
    };
  }, [onScan, lastScanned]);

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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timePercentage = (timeLeft / (duration * 60)) * 100;

  return (
    <div className="h-full flex flex-col">
      <Card className="mb-4">
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

      <div className="flex-1 flex flex-col">
        <div 
          id="qr-reader" 
          className={`flex-1 transition-opacity duration-300 ${isInitialized ? 'opacity-100' : 'opacity-0'}`} 
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
      </div>
    </div>
  );
} 