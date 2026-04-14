"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore, useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () =>
      setNavVisible(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`fixed right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-200 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:ring-gray-600 dark:hover:bg-gray-700 ${navVisible ? "hidden" : ""}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-gray-600" />
      )}
    </button>
  );
}
