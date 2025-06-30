import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SortAsc, Grid, List, X, Calendar, User, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FilterBar: React.FC = () => {
  const { state, dispatch } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    dateRange: 'all',
    author: '',
    tags: [] as string[],
    readStatus: 'all'
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'readTime', label: 'Reading Time' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const readStatusOptions = [
    { value: 'all', label: 'All Articles' },
    { value: 'read', label: 'Read' },
    { value: 'unread', label: 'Unread' }
  ];

  // Get unique authors and tags from content
  const uniqueAuthors = [...new Set(state.content.map(item => item.author))];
  const uniqueTags = [...new Set(state.content.flatMap(item => item.tags))];

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    // Apply sorting logic here
    let sortedContent = [...state.content];
    
    switch (newSort) {
      case 'newest':
        sortedContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        sortedContent.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'popular':
        sortedContent.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'readTime':
        sortedContent.sort((a, b) => a.readTime - b.readTime);
        break;
      case 'alphabetical':
        sortedContent.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    dispatch({ type: 'SET_CONTENT', payload: sortedContent });
  };

  const handleFilterChange = (filterType: string, value: string | string[]) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyFilters = () => {
    let filteredContent = [...state.content];

    // Apply date range filter
    if (activeFilters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (activeFilters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filteredContent = filteredContent.filter(item => 
        new Date(item.date) >= filterDate
      );
    }

    // Apply author filter
    if (activeFilters.author) {
      filteredContent = filteredContent.filter(item => 
        item.author.toLowerCase().includes(activeFilters.author.toLowerCase())
      );
    }

    // Apply tags filter
    if (activeFilters.tags.length > 0) {
      filteredContent = filteredContent.filter(item =>
        activeFilters.tags.some(tag => item.tags.includes(tag))
      );
    }

    // Apply read status filter
    if (activeFilters.readStatus !== 'all') {
      filteredContent = filteredContent.filter(item =>
        activeFilters.readStatus === 'read' ? item.isRead : !item.isRead
      );
    }

    dispatch({ type: 'SET_CONTENT', payload: filteredContent });
    setShowFilters(false);
  };

  const clearFilters = () => {
    setActiveFilters({
      dateRange: 'all',
      author: '',
      tags: [],
      readStatus: 'all'
    });
    // Reset to original content
    dispatch({ type: 'SET_CONTENT', payload: state.content });
  };

  const hasActiveFilters = activeFilters.dateRange !== 'all' || 
                          activeFilters.author !== '' || 
                          activeFilters.tags.length > 0 || 
                          activeFilters.readStatus !== 'all';

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {Object.values(activeFilters).filter(v => v !== 'all' && v !== '' && (Array.isArray(v) ? v.length > 0 : true)).length}
              </span>
            )}
          </motion.button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <SortAsc className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-sm border-0 bg-transparent focus:ring-0 focus:outline-none text-gray-600 dark:text-gray-400 font-medium cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Active:</span>
              {activeFilters.dateRange !== 'all' && (
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                  {dateRangeOptions.find(opt => opt.value === activeFilters.dateRange)?.label}
                </span>
              )}
              {activeFilters.author && (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                  Author: {activeFilters.author}
                </span>
              )}
              {activeFilters.tags.length > 0 && (
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs">
                  {activeFilters.tags.length} tag{activeFilters.tags.length > 1 ? 's' : ''}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Grid className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <List className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-95 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date Range
                  </label>
                  <select
                    value={activeFilters.dateRange}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {dateRangeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Author
                  </label>
                  <input
                    type="text"
                    placeholder="Search authors..."
                    value={activeFilters.author}
                    onChange={(e) => handleFilterChange('author', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Read Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Read Status
                  </label>
                  <select
                    value={activeFilters.readStatus}
                    onChange={(e) => handleFilterChange('readStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {readStatusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="h-4 w-4 inline mr-1" />
                    Tags
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-700">
                    {uniqueTags.slice(0, 10).map(tag => (
                      <label key={tag} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={activeFilters.tags.includes(tag)}
                          onChange={(e) => {
                            const newTags = e.target.checked
                              ? [...activeFilters.tags, tag]
                              : activeFilters.tags.filter(t => t !== tag);
                            handleFilterChange('tags', newTags);
                          }}
                          className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;