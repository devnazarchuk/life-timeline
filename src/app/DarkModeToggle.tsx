"use client";
import { useEffect, useState } from "react";

// Dark mode toggle button, top right
export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);
  // Set initial dark mode from system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <button
      className="fixed top-4 right-4 z-50 bg-gray-200 dark:bg-gray-800 rounded-full p-2 shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle dark mode"
    >
      <span className="text-xl">{dark ? "🌙" : "☀️"}</span>
    </button>
  );
} 