import React, { useMemo, useState, useCallback } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle, Shuffle, Lock, Unlock, GripVertical } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useContentStore } from '../../stores/contentStore';
import DraggableContentCard from '../Content/DraggableContentCard';
import FilterBar from '../Filters/FilterBar';
import LoadingSpinner from '../UI/LoadingSpinner';

const DraggableContentFeed: React.FC = () => {
  const { state, refreshContent } = useApp();
  const { contentOrder, updateContentOrder } = useContentStore();
  const [isDragEnabled, setIsDragEnabled] = useState(true);

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

    // Apply custom order if available
    if (contentOrder.length > 0 && !state.searchQuery && state.selectedCategory === 'All') {
      const orderedContent = [];
      const contentMap = new Map(filtered.map(item => [item.id, item]));
      
      // Add items in custom order
      for (const id of contentOrder) {
        const item = contentMap.get(id);
        if (item) {
          orderedContent.push(item);
          contentMap.delete(id);
        }
      }
      
      // Add any remaining items
      orderedContent.push(...Array.from(contentMap.values()));
      
      return orderedContent;
    }

    return filtered;
  }, [state.content, state.selectedCategory, state.searchQuery, contentOrder]);

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination || !isDragEnabled) return;

    const items = Array.from(filteredContent);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const newOrder = items.map(item => item.id);
    updateContentOrder(newOrder);
  }, [filteredContent, updateContentOrder, isDragEnabled]);

  const shuffleContent = () => {
    const shuffled = [...filteredContent].sort(() => Math.random() - 0.5);
    const newOrder = shuffled.map(item => item.id);
    updateContentOrder(newOrder);
  };

  const resetOrder = () => {
    updateContentOrder([]);
  };

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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Content</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{state.error}</p>
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
  const canDrag = state.selectedCategory === 'All' && !state.searchQuery;

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar />

      {/* Content Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getCategoryTitle()}
          </h2>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-gray-600 dark:text-gray-400">
              {filteredContent.length} {filteredContent.length === 1 ? 'item' : 'items'} 
              {state.searchQuery && ` matching "${state.searchQuery}"`}
            </p>
            {state.selectedCategory === 'All' && (
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                {stats.news && <span>{stats.news} news</span>}
                {stats.movies && <span>{stats.movies} movies</span>}
                {stats.social && <span>{stats.social} social</span>}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Drag Controls */}
          {canDrag && (
            <>
              <button
                onClick={() => setIsDragEnabled(!isDragEnabled)}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isDragEnabled 
                    ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={isDragEnabled ? 'Disable drag & drop' : 'Enable drag & drop'}
              >
                {isDragEnabled ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                {isDragEnabled ? 'Drag Enabled' : 'Drag Disabled'}
              </button>

              <button
                onClick={shuffleContent}
                className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Shuffle content"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Shuffle
              </button>

              {contentOrder.length > 0 && (
                <button
                  onClick={resetOrder}
                  className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                  title="Reset to default order"
                >
                  Reset Order
                </button>
              )}
            </>
          )}

          <button
            onClick={refreshContent}
            className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={state.isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Drag & Drop Info */}
      {canDrag && isDragEnabled && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <GripVertical className="inline h-4 w-4 mr-1" />
            Drag and drop cards to reorder your content feed. Your custom order will be saved automatically.
          </p>
        </motion.div>
      )}

      {/* Content Grid with Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="content-feed">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4' : ''
              }`}
            >
              <AnimatePresence mode="popLayout">
                {filteredContent.map((item, index) => (
                  <DraggableContentCard
                    key={item.id}
                    item={item}
                    index={index}
                    isDragDisabled={!canDrag || !isDragEnabled}
                  />
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Empty State */}
      {filteredContent.length === 0 && !state.isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No content found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
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

export default DraggableContentFeed;