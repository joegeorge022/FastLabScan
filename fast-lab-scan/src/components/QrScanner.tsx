'use client';

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

interface Props {
  onScan: (regNo: string) => void;
  duration: number;
  onSessionEnd: () => void;
}

export function QrScanner({ onScan, duration, onSessionEnd }: Props) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      aspectRatio: 1,
    }, false);

    scanner.render(
      (decodedText: string) => {
        onScan(decodedText);
      },
      (error: any) => {
        // Ignore errors
      }
    );

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          scanner.clear();
          onSessionEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

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