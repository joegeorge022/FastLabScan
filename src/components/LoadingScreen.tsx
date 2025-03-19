'use client';

import React from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <div className="text-primary text-lg font-medium">Loading...</div>
      </div>
    </div>
  );
} 