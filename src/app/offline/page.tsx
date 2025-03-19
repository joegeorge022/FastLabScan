'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">You're Offline</h1>
          <p className="text-muted-foreground">
            Don't worry! FastLabScan works offline. You can continue using the app with limited functionality.
          </p>
        </div>
        
        <div className="space-y-4 pt-4">
          <Link href="/" className="w-full">
            <Button className="w-full">Go to Home Page</Button>
          </Link>
          
          <Link href="/history" className="w-full">
            <Button variant="outline" className="w-full">View Attendance History</Button>
          </Link>
        </div>
        
        <p className="text-sm text-muted-foreground pt-8">
          Note: Some features like exporting data may require an internet connection.
        </p>
      </div>
    </div>
  );
}