import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Activity, Pause, Play } from 'lucide-react';

interface RealTimeIndicatorProps {
  onToggle: (enabled: boolean) => void;
}

const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({ onToggle }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [newContentCount, setNewContentCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isEnabled && Math.random() > 0.8) { // 20% chance of simulated update
        setLastUpdate(new Date());
        setNewContentCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isEnabled]);

  const toggleRealTime = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onToggle(newState);
    if (!newState) {
      setNewContentCount(0);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Real-time Status */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              {isEnabled ? (
                <Wifi className="h-4 w-4 text-green-500 dark:text-green-400" />
              ) : (
                <WifiOff className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              )}
              {isEnabled && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"
                />
              )}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Real-time Updates
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isEnabled 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {isEnabled ? 'Active' : 'Paused'}
            </span>
          </div>

          {/* Last Update */}
          {isEnabled && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Activity className="h-3 w-3" />
              <span>Last update: {formatTimeAgo(lastUpdate)}</span>
            </div>
          )}

          {/* New Content Counter */}
          <AnimatePresence>
            {newContentCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full text-xs"
              >
                <span>{newContentCount} new</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleRealTime}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
              isEnabled
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {isEnabled ? (
              <>
                <Pause className="h-3 w-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                <span>Resume</span>
              </>
            )}
          </button>

          {newContentCount > 0 && (
            <button
              onClick={() => setNewContentCount(0)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RealTimeIndicator;