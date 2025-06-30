import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useRealTimeUpdates } from '../../hooks/useRealTimeUpdates';
import { useApp } from '../../context/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';
import DraggableContentFeed from './DraggableContentFeed';
import StatsCards from './StatsCards';
import RealTimeIndicator from './RealTimeIndicator';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const { dispatch } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Real-time updates
  const { stopUpdates, startUpdates } = useRealTimeUpdates({
    onNewContent: (newContent) => {
      dispatch({ type: 'ADD_REAL_TIME_CONTENT', payload: newContent });
    },
    interval: 30000 // 30 seconds
  });

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isMobileSidebarOpen}
          onClose={handleMobileSidebarClose}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <motion.div
            initial={{ y: -64 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Header onMobileMenuToggle={handleMobileMenuToggle} />
          </motion.div>

          {/* Real-time Indicator */}
          <RealTimeIndicator 
            onToggle={(enabled) => enabled ? startUpdates() : stopUpdates()} 
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 bg-opacity-60 dark:bg-opacity-60 backdrop-blur-sm transition-colors duration-300">
            <div className="p-4 lg:p-6 space-y-6">
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <StatsCards />
              </motion.div>

              {/* Content Feed with Drag & Drop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <DraggableContentFeed />
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;