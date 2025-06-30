import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ContentItem } from '../types/api';

interface ContentState {
  contentOrder: string[];
  favorites: string[];
  readItems: string[];
  userPreferences: {
    newsCategories: string[];
    movieGenres: string[];
    socialHashtags: string[];
    contentTypes: ('news' | 'movies' | 'social')[];
  };
  updateContentOrder: (newOrder: string[]) => void;
  toggleFavorite: (itemId: string) => void;
  markAsRead: (itemId: string) => void;
  updatePreferences: (preferences: Partial<ContentState['userPreferences']>) => void;
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      contentOrder: [],
      favorites: [],
      readItems: [],
      userPreferences: {
        newsCategories: ['technology', 'business'],
        movieGenres: ['action', 'drama', 'comedy'],
        socialHashtags: ['technology', 'webdev', 'startup'],
        contentTypes: ['news', 'movies', 'social']
      },

      updateContentOrder: (newOrder: string[]) => 
        set({ contentOrder: newOrder }),

      toggleFavorite: (itemId: string) =>
        set((state) => ({
          favorites: state.favorites.includes(itemId)
            ? state.favorites.filter(id => id !== itemId)
            : [...state.favorites, itemId]
        })),

      markAsRead: (itemId: string) =>
        set((state) => ({
          readItems: state.readItems.includes(itemId)
            ? state.readItems
            : [...state.readItems, itemId]
        })),

      updatePreferences: (preferences) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences }
        })),
    }),
    {
      name: 'content-storage',
    }
  )
);