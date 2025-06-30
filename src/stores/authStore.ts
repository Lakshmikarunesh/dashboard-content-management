import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: {
    newsCategories: string[];
    movieGenres: string[];
    socialHashtags: string[];
    contentTypes: ('news' | 'movies' | 'social')[];
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    preferences: {
      newsCategories: ['technology', 'business'],
      movieGenres: ['action', 'drama', 'comedy'],
      socialHashtags: ['technology', 'webdev', 'startup'],
      contentTypes: ['news', 'movies', 'social']
    }
  },
  {
    id: '2',
    name: 'Demo User',
    email: 'demo@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    preferences: {
      newsCategories: ['technology', 'science'],
      movieGenres: ['sci-fi', 'thriller'],
      socialHashtags: ['tech', 'innovation'],
      contentTypes: ['news', 'movies', 'social']
    }
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = mockUsers.find(u => u.email === email);
        
        if (user && password === 'password') {
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const existingUser = mockUsers.find(u => u.email === email);
        
        if (!existingUser) {
          const newUser: User = {
            id: Date.now().toString(),
            name,
            email,
            avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
            preferences: {
              newsCategories: ['technology'],
              movieGenres: ['action'],
              socialHashtags: ['technology'],
              contentTypes: ['news', 'movies', 'social']
            }
          };
          
          mockUsers.push(newUser);
          set({ user: newUser, isAuthenticated: true, isLoading: false });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...updates };
          set({ user: updatedUser });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);