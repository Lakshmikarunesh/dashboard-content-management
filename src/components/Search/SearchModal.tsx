import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Newspaper, Film, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSearch }) => {
  const { state } = useApp();
  const [searchInput, setSearchInput] = useState(state.searchQuery);

  const recentSearches = ['React TypeScript', 'AI Technology', 'Remote Work', 'Movie Recommendations'];
  const trendingTopics = ['Machine Learning', 'Web Development', 'Startup Stories', 'Design Systems'];

  useEffect(() => {
    if (isOpen) {
      setSearchInput(state.searchQuery);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, state.searchQuery]);

  const handleSearch = (query: string) => {
    onSearch(query);
    setSearchInput(query);
  };

  const handleInputSubmit = () => {
    if (searchInput.trim()) {
      handleSearch(searchInput.trim());
    }
  };

  // Filter content based on current search input
  const searchResults = state.content.filter(item => {
    if (!searchInput || searchInput.length < 2) return false;
    const query = searchInput.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }).slice(0, 5);

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'news':
        return <Newspaper className="h-4 w-4 text-blue-500 dark:text-blue-400" />;
      case 'movies':
        return <Film className="h-4 w-4 text-purple-500 dark:text-purple-400" />;
      case 'social':
        return <MessageSquare className="h-4 w-4 text-green-500 dark:text-green-400" />;
      default:
        return <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-16 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 mx-4 border border-gray-200 dark:border-gray-700"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search across news, movies, and social media..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleInputSubmit();
                    }
                  }}
                  className="w-full pl-10 pr-10 py-3 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent text-gray-900 dark:text-white"
                  autoFocus
                />
                <button
                  onClick={onClose}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {searchInput && searchInput.length >= 2 ? (
                /* Search Results */
                <div className="p-4">
                  {searchResults.length > 0 ? (
                    <>
                      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Search Results ({searchResults.length})
                      </h3>
                      <div className="space-y-3">
                        {searchResults.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                            onClick={() => handleSearch(searchInput)}
                          >
                            <div className="flex-shrink-0 mt-1">
                              {getSourceIcon(item.source)}
                            </div>
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=100';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                {item.description}
                              </p>
                              <div className="flex items-center mt-2 text-xs text-gray-400 dark:text-gray-500">
                                <span className="capitalize">{item.source}</span>
                                <span className="mx-2">•</span>
                                <span>{item.author}</span>
                                <span className="mx-2">•</span>
                                <span>{item.readTime}m</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      {searchResults.length >= 5 && (
                        <button
                          onClick={handleInputSubmit}
                          className="w-full mt-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          See all results for "{searchInput}"
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-400 dark:text-gray-500 mb-2">
                        <Search className="h-8 w-8 mx-auto" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">No results found for "{searchInput}"</p>
                      <button
                        onClick={handleInputSubmit}
                        className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        Search anyway
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Default State */
                <div className="p-4 space-y-6">
                  {/* Recent Searches */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent Searches
                    </h3>
                    <div className="space-y-2">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSearch(search)}
                          className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trending Topics */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Trending Topics
                    </h3>
                    <div className="space-y-2">
                      {trendingTopics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => handleSearch(topic)}
                          className="block w-full text-left px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Sources */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Search by Source
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSearch('source:news')}
                        className="flex items-center justify-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Newspaper className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">News</span>
                      </button>
                      <button
                        onClick={() => handleSearch('source:movies')}
                        className="flex items-center justify-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Film className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Movies</span>
                      </button>
                      <button
                        onClick={() => handleSearch('source:social')}
                        className="flex items-center justify-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MessageSquare className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Social</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;