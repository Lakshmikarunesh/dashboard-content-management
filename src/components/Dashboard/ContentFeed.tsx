import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ContentCard from '../Content/ContentCard';
import FilterBar from '../Filters/FilterBar';
import LoadingSpinner from '../UI/LoadingSpinner';

const ContentFeed: React.FC = () => {
  const { state, refreshContent } = useApp();

  // Filter content based on search query and selected category
  const filteredContent = useMemo(() => {
    let filtered = state.content;

    // Filter by category
    if (state.selectedCategory !== 'All') {
      if (state.selectedCategory === 'Favorites') {
        filtered = filtered.filter(item => item.isFavorite);
      } else if (state.selectedCategory === 'Read Later') {
        filtered = filtered.filter(item => !item.isRead);
      } else if (state.selectedCategory === 'Popular') {
        // Sort by rating or engagement for popular content
        filtered = [...filtered].sort((a, b) => {
          const aScore = (a.rating || 0) + a.readTime;
          const bScore = (b.rating || 0) + b.readTime;
          return bScore - aScore;
        });
      } else if (state.selectedCategory === 'News') {
        filtered = filtered.filter(item => item.source === 'news');
      } else if (state.selectedCategory === 'Movies') {
        filtered = filtered.filter(item => item.source === 'movies');
      } else if (state.selectedCategory === 'Social') {
        filtered = filtered.filter(item => item.source === 'social');
      } else {
        filtered = filtered.filter(item => item.category === state.selectedCategory);
      }
    }

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [state.content, state.selectedCategory, state.searchQuery]);

  const getCategoryTitle = () => {
    switch (state.selectedCategory) {
      case 'All': return 'Personalized Feed';
      case 'Favorites': return 'Your Favorites';
      case 'Read Later': return 'Read Later';
      case 'Popular': return 'Popular Content';
      case 'News': return 'Latest News';
      case 'Movies': return 'Movie Recommendations';
      case 'Social': return 'Social Media';
      default: return state.selectedCategory;
    }
  };

  const getContentTypeStats = () => {
    const stats = state.content.reduce((acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return stats;
  };

  if (state.isLoading) {
    return (
      <div className="space-y-6">
        <FilterBar />
        <LoadingSpinner />
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="space-y-6">
        <FilterBar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Content</h3>
          <p className="text-gray-500 mb-4">{state.error}</p>
          <button
            onClick={refreshContent}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  const stats = getContentTypeStats();

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar />

      {/* Content Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {getCategoryTitle()}
          </h2>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-gray-600">
              {filteredContent.length} {filteredContent.length === 1 ? 'item' : 'items'} 
              {state.searchQuery && ` matching "${state.searchQuery}"`}
            </p>
            {state.selectedCategory === 'All' && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                {stats.news && <span>{stats.news} news</span>}
                {stats.movies && <span>{stats.movies} movies</span>}
                {stats.social && <span>{stats.social} social</span>}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={refreshContent}
          className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={state.isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredContent.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                layout: { duration: 0.3 }
              }}
            >
              <ContentCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredContent.length === 0 && !state.isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
          <p className="text-gray-500 mb-4">
            {state.searchQuery 
              ? `No items match "${state.searchQuery}". Try adjusting your search terms.`
              : 'No content available in this category.'
            }
          </p>
          <button
            onClick={refreshContent}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Content
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ContentFeed;