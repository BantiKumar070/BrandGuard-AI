import { useEffect, useState } from "react";

// Like useState, but remembers the value in this browser. Falls back quietly if storage is blocked.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved === null ? initialValue : JSON.parse(saved);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked - the app keeps working, it just will not remember.
    }
  }, [key, value]);

  return [value, setValue];
}
