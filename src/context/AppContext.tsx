import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ContentItem } from '../types/api';
import { contentAggregatorService, UserPreferences } from '../services/contentAggregator';
import { useAuthStore } from '../stores/authStore';
import { useContentStore } from '../stores/contentStore';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: UserPreferences;
}

interface AppState {
  content: ContentItem[];
  searchQuery: string;
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONTENT'; payload: ContentItem[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_REAL_TIME_CONTENT'; payload: ContentItem[] }
  | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<UserPreferences> };

// Initial state
const initialState: AppState = {
  content: [],
  searchQuery: '',
  selectedCategory: 'All',
  isLoading: true,
  error: null
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'TOGGLE_FAVORITE':
      const itemId = action.payload;
      const updatedContent = state.content.map(item =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      );
      return { ...state, content: updatedContent };
    case 'MARK_AS_READ':
      const readContent = state.content.map(item =>
        item.id === action.payload ? { ...item, isRead: true } : item
      );
      return { ...state, content: readContent };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_CONTENT':
      return { ...state, content: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'ADD_REAL_TIME_CONTENT':
      // Add new content to the beginning of the list
      const newContent = [...action.payload, ...state.content];
      return { ...state, content: newContent };
    case 'UPDATE_USER_PREFERENCES':
      return { ...state };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  refreshContent: () => Promise<void>;
  searchContent: (query: string) => Promise<void>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user, isAuthenticated } = useAuthStore();
  const { favorites, readItems, toggleFavorite, markAsRead, userPreferences } = useContentStore();

  const refreshContent = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const preferences = user?.preferences || userPreferences;
      const content = await contentAggregatorService.fetchPersonalizedContent(preferences);
      
      // Update content with stored favorites and read status
      const contentWithStatus = content.map(item => ({
        ...item,
        isFavorite: favorites.includes(item.id),
        isRead: readItems.includes(item.id)
      }));

      dispatch({ type: 'SET_CONTENT', payload: contentWithStatus });
    } catch (error) {
      console.error('Error fetching content:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load content. Please try again.' });
    }
  };

  const searchContent = async (query: string) => {
    if (!query.trim()) {
      await refreshContent();
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const content = await contentAggregatorService.searchAllContent(query);
      
      const contentWithStatus = content.map(item => ({
        ...item,
        isFavorite: favorites.includes(item.id),
        isRead: readItems.includes(item.id)
      }));

      dispatch({ type: 'SET_CONTENT', payload: contentWithStatus });
    } catch (error) {
      console.error('Error searching content:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Search failed. Please try again.' });
    }
  };

  // Load content on mount and when user changes
  useEffect(() => {
    refreshContent();
  }, [user]);

  // Sync favorites and read status with store
  useEffect(() => {
    const updatedContent = state.content.map(item => ({
      ...item,
      isFavorite: favorites.includes(item.id),
      isRead: readItems.includes(item.id)
    }));
    
    if (JSON.stringify(updatedContent) !== JSON.stringify(state.content)) {
      dispatch({ type: 'SET_CONTENT', payload: updatedContent });
    }
  }, [favorites, readItems]);

  // Handle favorite toggle
  useEffect(() => {
    const handleToggleFavorite = (itemId: string) => {
      toggleFavorite(itemId);
      dispatch({ type: 'TOGGLE_FAVORITE', payload: itemId });
    };

    const handleMarkAsRead = (itemId: string) => {
      markAsRead(itemId);
      dispatch({ type: 'MARK_AS_READ', payload: itemId });
    };

    // Override dispatch for these actions
    const originalDispatch = dispatch;
    const enhancedDispatch = (action: AppAction) => {
      if (action.type === 'TOGGLE_FAVORITE') {
        handleToggleFavorite(action.payload);
      } else if (action.type === 'MARK_AS_READ') {
        handleMarkAsRead(action.payload);
      } else {
        originalDispatch(action);
      }
    };

    return () => {};
  }, [toggleFavorite, markAsRead]);

  return (
    <AppContext.Provider value={{ state, dispatch, refreshContent, searchContent }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}