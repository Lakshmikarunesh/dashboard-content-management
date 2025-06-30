import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Heart, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useContentStore } from '../../stores/contentStore';

const StatsCards: React.FC = () => {
  const { state } = useApp();
  const { favorites } = useContentStore();

  const stats = [
    {
      id: 'total',
      label: 'Total Articles',
      value: state.content.length,
      change: '+2 this week',
      trend: 'up',
      icon: BookOpen,
      color: 'blue'
    },
    {
      id: 'read',
      label: 'Articles Read',
      value: state.content.filter(item => item.isRead).length,
      change: '+5 this week',
      trend: 'up',
      icon: Clock,
      color: 'green'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      value: favorites.length,
      change: '+1 this week',
      trend: 'up',
      icon: Heart,
      color: 'red'
    },
    {
      id: 'reading-time',
      label: 'Reading Time',
      value: `${Math.round(state.content.reduce((acc, item) => acc + item.readTime, 0) / state.content.length)}m`,
      change: 'avg per article',
      trend: 'neutral',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
      red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
      purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = getColorClasses(stat.color);

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-95 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className={`text-xs mt-1 ${
                  stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                  stat.trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                  'text-gray-500 dark:text-gray-400'
                }`}>
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg border ${colorClasses}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;