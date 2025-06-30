import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Settings, Newspaper, Film, MessageSquare, Tag } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useContentStore } from '../../stores/contentStore';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuthStore();
  const { userPreferences, updatePreferences } = useContentStore();
  
  const [preferences, setPreferences] = useState({
    newsCategories: ['technology', 'business'],
    movieGenres: ['action', 'drama', 'comedy'],
    socialHashtags: ['technology', 'webdev', 'startup'],
    contentTypes: ['news', 'movies', 'social'] as ('news' | 'movies' | 'social')[]
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentPrefs = user?.preferences || userPreferences;
      setPreferences(currentPrefs);
    }
  }, [isOpen, user, userPreferences]);

  const newsCategories = [
    'technology', 'business', 'science', 'health', 'sports', 
    'entertainment', 'politics', 'general'
  ];

  const movieGenres = [
    'action', 'adventure', 'comedy', 'drama', 'horror', 
    'sci-fi', 'thriller', 'romance', 'documentary'
  ];

  const socialHashtags = [
    'technology', 'webdev', 'startup', 'design', 'programming',
    'ai', 'machinelearning', 'react', 'javascript', 'css'
  ];

  const handleCategoryToggle = (category: string, type: 'newsCategories' | 'movieGenres' | 'socialHashtags') => {
    setPreferences(prev => ({
      ...prev,
      [type]: prev[type].includes(category)
        ? prev[type].filter(c => c !== category)
        : [...prev[type], category]
    }));
  };

  const handleContentTypeToggle = (contentType: 'news' | 'movies' | 'social') => {
    setPreferences(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(contentType)
        ? prev.contentTypes.filter(t => t !== contentType)
        : [...prev.contentTypes, contentType]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update user preferences if authenticated
      if (user) {
        updateProfile({ preferences });
      } else {
        // Update local preferences
        updatePreferences(preferences);
      }
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
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
            className="fixed inset-0 bg-black bg-opacity-50 z-[100] backdrop-blur-sm"
          />

          {/* Modal - Centered */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Preferences</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Customize your content experience</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-8">
                  {/* Content Types */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Sources</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'news', label: 'News Articles', icon: Newspaper, color: 'blue' },
                        { id: 'movies', label: 'Movies', icon: Film, color: 'purple' },
                        { id: 'social', label: 'Social Media', icon: MessageSquare, color: 'green' }
                      ].map(({ id, label, icon: Icon, color }) => (
                        <button
                          key={id}
                          onClick={() => handleContentTypeToggle(id as 'news' | 'movies' | 'social')}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            preferences.contentTypes.includes(id as 'news' | 'movies' | 'social')
                              ? color === 'blue' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                                color === 'purple' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' :
                                'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <Icon className={`h-6 w-6 mx-auto mb-2 ${
                            preferences.contentTypes.includes(id as 'news' | 'movies' | 'social')
                              ? color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                                'text-green-600 dark:text-green-400'
                              : 'text-gray-500 dark:text-gray-400'
                          }`} />
                          <p className={`text-sm font-medium ${
                            preferences.contentTypes.includes(id as 'news' | 'movies' | 'social')
                              ? color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                                color === 'purple' ? 'text-purple-700 dark:text-purple-300' :
                                'text-green-700 dark:text-green-300'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {label}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* News Categories */}
                  {preferences.contentTypes.includes('news') && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">News Categories</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {newsCategories.map(category => (
                          <button
                            key={category}
                            onClick={() => handleCategoryToggle(category, 'newsCategories')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                              preferences.newsCategories.includes(category)
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Movie Genres */}
                  {preferences.contentTypes.includes('movies') && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Movie Genres</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {movieGenres.map(genre => (
                          <button
                            key={genre}
                            onClick={() => handleCategoryToggle(genre, 'movieGenres')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                              preferences.movieGenres.includes(genre)
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Hashtags */}
                  {preferences.contentTypes.includes('social') && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Interests</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {socialHashtags.map(hashtag => (
                          <button
                            key={hashtag}
                            onClick={() => handleCategoryToggle(hashtag, 'socialHashtags')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                              preferences.socialHashtags.includes(hashtag)
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {hashtag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Preferences</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PreferencesModal;