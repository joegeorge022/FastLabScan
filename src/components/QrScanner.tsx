'use client';

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import type { ReactElement } from 'react';

interface Props {
  onScan: (regNo: string) => void;
  duration: number;
  onSessionEnd: () => void;
}

export function QrScanner({ onScan, duration, onSessionEnd }: Props): ReactElement {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      aspectRatio: 1,
      defaultDeviceId: 'environment'
    }, false);

    scanner.render(
      (decodedText: string) => {
        onScan(decodedText);
      },
      (error: unknown) => {
        // Log errors for debugging but don't show to user
        console.debug('QR Scanner error:', error);
      }
    );

    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          scanner.clear();
          onSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(timer);
      scanner.clear();
    };
  }, [onScan, duration, onSessionEnd]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="space-y-4">
      <div className="text-center text-xl font-bold">
        Time Remaining: {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <div id="qr-reader" className="mx-auto" />
    </div>
  );
} 