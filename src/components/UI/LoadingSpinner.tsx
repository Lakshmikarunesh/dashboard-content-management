import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full mx-auto mb-4"
        />
        <p className="text-gray-600 dark:text-gray-400">Loading personalized content...</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Fetching from multiple sources</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;