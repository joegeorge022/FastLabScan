"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string;
  isVisible: boolean;
  variant?: 'success' | 'error';
}

const ToastContext = React.createContext<{
  showToast: (message: string, variant?: 'success' | 'error') => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastProps>({
    message: '',
    isVisible: false,
    variant: 'success'
  });

  const showToast = React.useCallback((message: string, variant: 'success' | 'error' = 'success') => {
    setToast({ message, isVisible: true, variant });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={cn(
          "fixed left-1/2 -translate-x-1/2 transform transition-all duration-300",
          "bottom-[5.5rem] sm:bottom-24 z-[100]",
          toast.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <div className={cn(
          "px-4 py-2 rounded-md shadow-lg border text-sm font-medium min-w-[200px] text-center",
          toast.variant === 'success' && "bg-green-100 text-green-800 border-green-200",
          toast.variant === 'error' && "bg-red-100 text-red-800 border-red-200"
        )}>
          {toast.message}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
} 