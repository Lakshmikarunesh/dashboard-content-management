import axios from 'axios';
import { TMDBResponse, TMDBMovie, TMDBGenresResponse, ContentItem } from '../types/api';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Demo movie data
const DEMO_MOVIES: TMDBMovie[] = [
  {
    id: 1,
    title: 'The Future of AI',
    overview: 'A documentary exploring the potential and challenges of artificial intelligence in the modern world.',
    poster_path: '/ai-documentary.jpg',
    backdrop_path: '/ai-backdrop.jpg',
    release_date: '2024-01-15',
    vote_average: 8.5,
    vote_count: 1250,
    genre_ids: [99, 878],
    popularity: 95.5,
    adult: false,
    video: false,
    original_language: 'en',
    original_title: 'The Future of AI'
  },
  {
    id: 2,
    title: 'Code Warriors',
    overview: 'Follow the journey of software developers as they build the next generation of applications.',
    poster_path: '/code-warriors.jpg',
    backdrop_path: '/code-backdrop.jpg',
    release_date: '2024-02-20',
    vote_average: 7.8,
    vote_count: 890,
    genre_ids: [99, 18],
    popularity: 78.3,
    adult: false,
    video: false,
    original_language: 'en',
    original_title: 'Code Warriors'
  },
  {
    id: 3,
    title: 'Digital Revolution',
    overview: 'An in-depth look at how digital transformation is reshaping industries worldwide.',
    poster_path: '/digital-revolution.jpg',
    backdrop_path: '/digital-backdrop.jpg',
    release_date: '2024-03-10',
    vote_average: 8.2,
    vote_count: 1100,
    genre_ids: [99],
    popularity: 88.7,
    adult: false,
    video: false,
    original_language: 'en',
    original_title: 'Digital Revolution'
  },
  {
    id: 4,
    title: 'Startup Dreams',
    overview: 'The inspiring stories of entrepreneurs who turned their ideas into successful businesses.',
    poster_path: '/startup-dreams.jpg',
    backdrop_path: '/startup-backdrop.jpg',
    release_date: '2024-04-05',
    vote_average: 7.6,
    vote_count: 750,
    genre_ids: [99, 18],
    popularity: 72.1,
    adult: false,
    video: false,
    original_language: 'en',
    original_title: 'Startup Dreams'
  }
];

class TMDBApiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = TMDB_API_KEY || 'demo_key';
    this.baseUrl = TMDB_BASE_URL;
  }

  async fetchPopularMovies(): Promise<TMDBMovie[]> {
    if (!this.apiKey || this.apiKey === 'demo_key') {
      console.log('Using demo movie data - add your TMDB API key to .env for real data');
      return DEMO_MOVIES;
    }

    try {
      const response = await axios.get<TMDBResponse>(`${this.baseUrl}/movie/popular`, {
        params: {
          api_key: this.apiKey,
          page: 1
        }
      });

      return response.data.results;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return DEMO_MOVIES;
    }
  }

  async fetchTrendingMovies(): Promise<TMDBMovie[]> {
    if (!this.apiKey || this.apiKey === 'demo_key') {
      return DEMO_MOVIES;
    }

    try {
      const response = await axios.get<TMDBResponse>(`${this.baseUrl}/trending/movie/week`, {
        params: {
          api_key: this.apiKey
        }
      });

      return response.data.results;
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return DEMO_MOVIES;
    }
  }

  async searchMovies(query: string): Promise<TMDBMovie[]> {
    if (!this.apiKey || this.apiKey === 'demo_key') {
      return DEMO_MOVIES.filter(movie => 
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.overview.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const response = await axios.get<TMDBResponse>(`${this.baseUrl}/search/movie`, {
        params: {
          api_key: this.apiKey,
          query,
          page: 1
        }
      });

      return response.data.results;
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  convertToContentItems(movies: TMDBMovie[]): ContentItem[] {
    return movies.map(movie => ({
      id: `movie-${movie.id}`,
      title: movie.title,
      description: movie.overview,
      category: 'Entertainment',
      author: 'TMDB',
      date: movie.release_date,
      readTime: Math.floor(movie.vote_average * 10) + 90, // Convert rating to "watch time"
      tags: this.getMovieTags(movie),
      imageUrl: movie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
        : 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800',
      isFavorite: false,
      isRead: false,
      source: 'movies' as const,
      sourceData: movie,
      rating: movie.vote_average
    }));
  }

  private getMovieTags(movie: TMDBMovie): string[] {
    const tags = ['Movies', 'Entertainment'];
    
    if (movie.vote_average >= 8) tags.push('Highly Rated');
    if (movie.popularity > 50) tags.push('Popular');
    if (movie.release_date && new Date(movie.release_date).getFullYear() === 2024) {
      tags.push('New Release');
    }
    
    return tags.slice(0, 4);
  }

  getImageUrl(path: string | null): string {
    if (!path) return 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800';
    return `${TMDB_IMAGE_BASE_URL}${path}`;
  }
}

export const tmdbApiService = new TMDBApiService();