"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string;
  isVisible: boolean;
}

const ToastContext = React.createContext<{
  showToast: (message: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastProps>({
    message: '',
    isVisible: false,
  });

  const showToast = React.useCallback((message: string) => {
    setToast({ message, isVisible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 2000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Updated Toast Component */}
      <div
        className={cn(
          "fixed left-1/2 -translate-x-1/2 transform transition-all duration-300",
          // Adjust bottom position and z-index
          "bottom-[5.5rem] sm:bottom-24 z-[100]",
          // Improved visibility and animation
          toast.isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-lg border border-green-200 text-sm font-medium min-w-[200px] text-center">
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