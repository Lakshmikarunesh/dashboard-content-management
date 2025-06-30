import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Heart, BookOpen, Eye, ExternalLink, Star, MessageCircle, Share, ThumbsUp } from 'lucide-react';
import { ContentItem, useApp } from '../../context/AppContext';

interface ContentCardProps {
  item: ContentItem;
}

const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  const { dispatch } = useApp();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_FAVORITE', payload: item.id });
  };

  const handleMarkAsRead = () => {
    if (!item.isRead) {
      dispatch({ type: 'MARK_AS_READ', payload: item.id });
    }
  };

  const handleCardClick = () => {
    handleMarkAsRead();
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Technology': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      'Design': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      'Business': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      'Entertainment': 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
      'Social': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'news':
        return '📰';
      case 'movies':
        return '🎬';
      case 'social':
        return '💬';
      default:
        return '📄';
    }
  };

  const renderSocialStats = () => {
    if (item.source === 'social' && item.sourceData) {
      const socialData = item.sourceData as any;
      return (
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
          <div className="flex items-center">
            <ThumbsUp className="h-3 w-3 mr-1" />
            <span>{socialData.likes}</span>
          </div>
          <div className="flex items-center">
            <MessageCircle className="h-3 w-3 mr-1" />
            <span>{socialData.comments}</span>
          </div>
          <div className="flex items-center">
            <Share className="h-3 w-3 mr-1" />
            <span>{socialData.shares}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderMovieRating = () => {
    if (item.source === 'movies' && item.rating) {
      return (
        <div className="flex items-center space-x-1 text-xs text-yellow-600 dark:text-yellow-400 mt-2">
          <Star className="h-3 w-3 fill-current" />
          <span>{item.rating.toFixed(1)}/10</span>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        
        {/* Source Badge */}
        <div className="absolute top-3 left-3 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium flex items-center border border-gray-200 dark:border-gray-600">
          <span className="mr-1">{getSourceIcon(item.source)}</span>
          <span className="capitalize text-gray-700 dark:text-gray-300">{item.source}</span>
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
            item.isFavorite 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white border border-gray-200 dark:border-gray-600'
          }`}
        >
          <Heart className={`h-4 w-4 ${item.isFavorite ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Read Status */}
        {item.isRead && (
          <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            Read
          </div>
        )}

        {/* External Link Icon */}
        {item.url && (
          <div className="absolute bottom-3 right-3 bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ExternalLink className="h-3 w-3" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md font-medium">
              +{item.tags.length - 3}
            </span>
          )}
        </div>

        {/* Movie Rating */}
        {renderMovieRating()}

        {/* Social Stats */}
        {renderSocialStats()}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span className="truncate max-w-24">{item.author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {item.source === 'movies' ? `${item.readTime}m` : `${item.readTime}m read`}
              </span>
            </div>
          </div>
          <div className="text-xs">
            {new Date(item.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              ...(new Date(item.date).getFullYear() !== new Date().getFullYear() && { year: 'numeric' })
            })}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ContentCard;