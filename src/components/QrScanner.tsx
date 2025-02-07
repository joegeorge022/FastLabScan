'use client';

import { Html5QrcodeScanner, Html5QrcodeScannerState } from "html5-qrcode";
import { useEffect, useState, useRef } from "react";
import type { ReactElement } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const preferredCamera = localStorage.getItem(CAMERA_STORAGE_KEY);

    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      aspectRatio: 1,
      cameraId: preferredCamera || undefined,
      showTorchButtonIfSupported: true,
      videoConstraints: {
        facingMode: { ideal: "user" },
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 }
      }
    }, false);

    scannerRef.current = scanner;

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

    return () => {
      clearTimeout(initTimeout);
      if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current.clear();
      }
      scannerRef.current = null;
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
    <div className="space-y-4">
      <Card>
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

      <Card>
        <CardContent className="p-0">
          <div 
            id="qr-reader" 
            className={`transition-opacity duration-300 ${isInitialized ? 'opacity-100' : 'opacity-0'}`} 
          />
        </CardContent>
      </Card>
    </div>
  );
} 