import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Heart, TrendingUp, Archive, Tag, User, Settings, Newspaper, Film, MessageSquare, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useContentStore } from '../../stores/contentStore';
import { useAuthStore } from '../../stores/authStore';
import PreferencesModal from './PreferencesModal';

const categories = [
  { id: 'All', name: 'All', icon: Home, count: 0 },
  { id: 'News', name: 'News', icon: Newspaper, count: 0 },
  { id: 'Movies', name: 'Movies', icon: Film, count: 0 },
  { id: 'Social', name: 'Social', icon: MessageSquare, count: 0 },
  { id: 'Technology', name: 'Tech', icon: TrendingUp, count: 0 },
  { id: 'Entertainment', name: 'Entertainment', icon: BookOpen, count: 0 },
  { id: 'Business', name: 'Business', icon: User, count: 0 },
];

const specialCategories = [
  { id: 'Favorites', name: 'Favorites', icon: Heart, count: 0 },
  { id: 'Read Later', name: 'Read Later', icon: Archive, count: 0 },
  { id: 'Popular', name: 'Popular', icon: TrendingUp, count: 0 },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const { state, dispatch } = useApp();
  const { favorites, userPreferences } = useContentStore();
  const { user } = useAuthStore();
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const handleCategorySelect = (categoryId: string) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: categoryId });
    if (onClose) onClose(); // Close mobile sidebar after selection
  };

  const getCategoryCount = (categoryId: string) => {
    if (!state.content || state.content.length === 0) return 0;
    
    switch (categoryId) {
      case 'All':
        return state.content.length;
      case 'News':
        return state.content.filter(item => item.source === 'news').length;
      case 'Movies':
        return state.content.filter(item => item.source === 'movies').length;
      case 'Social':
        return state.content.filter(item => item.source === 'social').length;
      case 'Favorites':
        return favorites.length;
      case 'Read Later':
        return state.content.filter(item => !item.isRead).length;
      case 'Popular':
        return state.content.filter(item => item.rating && item.rating > 7).length;
      default:
        return state.content.filter(item => item.category === categoryId).length;
    }
  };

  const getContentTypeStats = () => {
    if (!state.content || state.content.length === 0) {
      return { news: 0, movies: 0, social: 0 };
    }
    
    const stats = state.content.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stats;
  };

  const getPreferences = () => {
    if (user?.preferences) {
      return user.preferences;
    }
    return userPreferences;
  };

  const preferences = getPreferences();
  const stats = getContentTypeStats();

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Content Sources Overview */}
        {state.content && state.content.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Sources
            </h3>
            <div className="space-y-2">
              {stats.news > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Newspaper className="h-3 w-3 mr-2 text-blue-500 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-300">News</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">{stats.news}</span>
                </div>
              )}
              {stats.movies > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Film className="h-3 w-3 mr-2 text-purple-500 dark:text-purple-400" />
                    <span className="text-gray-700 dark:text-gray-300">Movies</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">{stats.movies}</span>
                </div>
              )}
              {stats.social > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-2 text-green-500 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">Social</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">{stats.social}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Categories
          </h3>
          <nav className="space-y-1">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isActive = state.selectedCategory === category.id;
              const itemCount = getCategoryCount(category.id);

              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-all duration-200 group text-sm ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                    <span className="font-medium truncate">{category.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {itemCount}
                  </span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Special Categories */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Collections
          </h3>
          <nav className="space-y-1">
            {specialCategories.map((category, index) => {
              const Icon = category.icon;
              const isActive = state.selectedCategory === category.id;
              const itemCount = getCategoryCount(category.id);

              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (index + categories.length) * 0.05 }}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-all duration-200 group text-sm ${
                    isActive
                      ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`} />
                    <span className="font-medium truncate">{category.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-purple-100 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {itemCount}
                  </span>
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* User Interests */}
        {preferences && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Interests
            </h3>
            <div className="flex flex-wrap gap-1">
              {(preferences.newsCategories || []).concat(
                preferences.socialHashtags || []
              ).slice(0, 4).map((preference, index) => (
                <motion.span
                  key={preference}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                >
                  <Tag className="h-2 w-2 mr-1" />
                  {preference}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preferences Button */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsPreferencesOpen(true)}
          className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm"
        >
          <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Preferences</span>
        </motion.button>
      </div>

      {/* Preferences Modal */}
      <PreferencesModal 
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-md border-r border-gray-200 dark:border-gray-700 h-full">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-50 shadow-xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;