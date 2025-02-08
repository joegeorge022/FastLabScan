"use client"

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KeyRound, X, Delete } from "lucide-react";
import { cn } from "@/lib/utils";

interface PinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  onSetPin?: (pin: string) => void;
  mode: 'set' | 'verify';
  sessionPin: string | null;
}

export function PinDialog({ isOpen, onClose, onUnlock, onSetPin, mode, sessionPin }: PinDialogProps) {
  const [pin, setPin] = React.useState('');
  const [confirmPin, setConfirmPin] = React.useState('');
  const [error, setError] = React.useState('');
  const [isConfirming, setIsConfirming] = React.useState(false);

  const handleNumberClick = (number: number) => {
    const targetPin = isConfirming ? confirmPin : pin;
    if (targetPin.length < 4) {
      if (isConfirming) {
        setConfirmPin(prev => prev + number);
      } else {
        setPin(prev => prev + number);
      }
    }
  };

  const handleDelete = () => {
    if (isConfirming) {
      setConfirmPin(prev => prev.slice(0, -1));
    } else {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (isConfirming) {
      setConfirmPin('');
    } else {
      setPin('');
    }
  };

  const handleSubmit = () => {
    setError('');

    if (mode === 'set') {
      if (pin.length !== 4) {
        setError('PIN must be 4 digits');
        return;
      }
      if (!isConfirming) {
        setIsConfirming(true);
        return;
      }
      if (pin !== confirmPin) {
        setError('PINs do not match');
        setConfirmPin('');
        return;
      }
      onSetPin?.(pin);
      handleClose();
    } else {
      if (pin.length !== 4) {
        setError('PIN must be 4 digits');
        return;
      }
      if (pin === sessionPin) {
        onUnlock();
        handleClose();
      } else {
        setError('Incorrect PIN');
        setPin('');
      }
    }
  };

  const handleClose = () => {
    setPin('');
    setConfirmPin('');
    setError('');
    setIsConfirming(false);
    onClose();
  };

  const renderPinDisplay = (value: string) => {
    return (
      <div className="flex justify-center gap-3 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "w-4 h-4 rounded-full border-2",
              value[i] ? "bg-primary border-primary" : "border-muted-foreground"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[90%] sm:max-w-[320px] mx-auto rounded-2xl p-4 sm:p-6 border-none shadow-lg">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            {mode === 'set' 
              ? (isConfirming ? 'Confirm PIN' : 'Set Teacher PIN')
              : 'Enter Teacher PIN'
            }
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {mode === 'set'
              ? (isConfirming 
                  ? 'Re-enter the PIN to confirm'
                  : 'Create a 4-digit PIN to protect manual entry')
              : 'Enter PIN to unlock manual entry'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6">
          {renderPinDisplay(isConfirming ? confirmPin : pin)}
          
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full max-w-[220px] sm:max-w-[240px]">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <Button
                key={number}
                variant="outline"
                className="h-12 sm:h-14 text-lg sm:text-xl font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleNumberClick(number)}
              >
                {number}
              </Button>
            ))}
            <Button
              variant="outline"
              className="h-12 sm:h-14 text-lg sm:text-xl font-semibold rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={handleClear}
            >
              <X className="h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
            <Button
              variant="outline"
              className="h-12 sm:h-14 text-lg sm:text-xl font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleNumberClick(0)}
            >
              0
            </Button>
            <Button
              variant="outline"
              className="h-12 sm:h-14 text-lg sm:text-xl font-semibold rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={handleDelete}
            >
              <Delete className="h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
          </div>

          <div className="flex justify-between w-full max-w-[220px] sm:max-w-[240px] gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-xl h-11 sm:h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 rounded-xl h-11 sm:h-12"
              disabled={(mode === 'set' && !isConfirming) ? pin.length !== 4 : false}
            >
              {mode === 'set' 
                ? (isConfirming ? 'Confirm' : 'Next')
                : 'Unlock'
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 