import React, { useEffect } from 'react';
import { useThemeStore } from './stores/themeStore';
import Dashboard from './components/Dashboard/Dashboard';
import { AppProvider } from './context/AppContext';

function App() {
  const { isDarkMode, setDarkMode } = useThemeStore();

  // Initialize theme from system preference if not set
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme if not already set
    if (localStorage.getItem('theme-storage') === null) {
      setDarkMode(mediaQuery.matches);
    }

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme-storage') === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setDarkMode]);

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Dashboard />
      </div>
    </AppProvider>
  );
}

export default App;