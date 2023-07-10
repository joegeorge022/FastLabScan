import { useState } from "react";

export const useLocalStorage = <T>(key:string, initialValue:T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = localStorage.getItem(key);
      // return item ? JSON.parse(item) : initialValue;
      if (item) {
        return JSON.parse(item);
      }
      else {
        localStorage.setItem(key, JSON.stringify(initialValue))
        return initialValue
      }
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  const setValue:typeof setStoredValue = (value) => {
    try {
      if (typeof value === "function") {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
      else {
        setStoredValue(value);
        if (typeof window !== "undefined") {
          if (value === null) localStorage.removeItem(key);
          else localStorage.setItem(key, JSON.stringify(value));
        }
      }

    } catch (error) {
      console.warn(error);
    }
  };
  return [storedValue, setValue] as [T , typeof setValue];
};
