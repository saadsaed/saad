import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Switch to bright / light mode" : "Switch to dark mode"}
      className={`relative inline-flex items-center justify-center p-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-600/30 ${className}`}
    >
      {isDark ? (
        <Sun size={16} className="text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon size={16} className="text-neutral-700 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
