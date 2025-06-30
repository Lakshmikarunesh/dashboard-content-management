// News API Types
export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// TMDB Types
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
  original_title: string;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenresResponse {
  genres: TMDBGenre[];
}

// Social Media Types (Mock)
export interface SocialPost {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
  comments: number;
  hashtags: string[];
  images?: string[];
  platform: 'twitter' | 'instagram' | 'linkedin';
}

export interface SocialResponse {
  posts: SocialPost[];
  hasMore: boolean;
  nextCursor?: string;
}

// Unified Content Item
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  tags: string[];
  imageUrl: string;
  isFavorite: boolean;
  isRead: boolean;
  source: 'news' | 'movies' | 'social';
  sourceData?: NewsArticle | TMDBMovie | SocialPost;
  url?: string;
  rating?: number;
}