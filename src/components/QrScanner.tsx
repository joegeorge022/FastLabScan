'use client';

import { Html5QrcodeScanner, Html5QrcodeScannerState } from "html5-qrcode";
import { useEffect, useState, useRef } from "react";
import type { ReactElement } from 'react';

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
      defaultDeviceId: preferredCamera || 'environment',
      showTorchButtonIfSupported: true,
      videoConstraints: {
        facingMode: "environment",
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 }
      }
    }, false);

    scannerRef.current = scanner;

    // Handle camera selection
    setTimeout(() => {
      const cameraSelect = document.querySelector('#qr-reader select') as HTMLSelectElement;
      if (cameraSelect) {
        cameraSelect.addEventListener('change', (e) => {
          const selectedCamera = (e.target as HTMLSelectElement).value;
          localStorage.setItem(CAMERA_STORAGE_KEY, selectedCamera);
        });
      }
    }, 1000);

    // Start scanning
    scanner.render(
      (decodedText: string) => {
        // Prevent multiple scans of the same code in quick succession
        if (decodedText === lastScanned) {
          return;
        }

        // Vibrate if supported
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }

        // Add a success sound
        const audio = new Audio('/sounds/beep.mp3');
        audio.play().catch(() => {
          // Ignore audio play errors
        });

        setLastScanned(decodedText);
        onScan(decodedText);

        // Reset lastScanned after a delay to allow scanning the same code again
        setTimeout(() => {
          setLastScanned(null);
        }, 2000);
      },
      (error: unknown) => {
        console.debug('QR Scanner error:', error);
      }
    );

    // Set initialized after a short delay
    const initTimeout = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);

    // Cleanup function
    return () => {
      clearTimeout(initTimeout);
      if (scannerRef.current?.getState() === Html5QrcodeScannerState.SCANNING) {
        scannerRef.current.clear();
      }
      scannerRef.current = null;
    };
  }, [onScan, lastScanned]); // Only re-initialize if scan handler changes

  // Timer effect
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
      {/* Timer Display */}
      <div className="relative pt-1">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xl font-bold text-gray-900">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-600">
            Session {duration} min
          </div>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div 
            style={{ width: `${timePercentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
          />
        </div>
      </div>

      {/* Scanner */}
      <div 
        id="qr-reader" 
        className={`mx-auto transition-opacity duration-300 ${isInitialized ? 'opacity-100' : 'opacity-0'}`} 
      />

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600">
        Point the camera at a student's ID QR code
      </div>

      {/* Last Scanned Feedback */}
      {lastScanned && (
        <div className="text-center text-sm text-green-600 font-medium animate-fade-out">
          Successfully scanned!
        </div>
      )}
    </div>
  );
} 