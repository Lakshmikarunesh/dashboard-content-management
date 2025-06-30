import { ContentItem } from '../types/api';
import { newsApiService } from './newsApi';
import { tmdbApiService } from './tmdbApi';
import { socialApiService } from './socialApi';

export interface UserPreferences {
  newsCategories: string[];
  movieGenres: string[];
  socialHashtags: string[];
  contentTypes: ('news' | 'movies' | 'social')[];
}

class ContentAggregatorService {
  async fetchPersonalizedContent(preferences: UserPreferences): Promise<ContentItem[]> {
    const promises: Promise<ContentItem[]>[] = [];

    // Fetch news if enabled
    if (preferences.contentTypes.includes('news')) {
      const newsPromise = this.fetchNewsContent(preferences.newsCategories);
      promises.push(newsPromise);
    }

    // Fetch movies if enabled
    if (preferences.contentTypes.includes('movies')) {
      const moviesPromise = this.fetchMovieContent();
      promises.push(moviesPromise);
    }

    // Fetch social media if enabled
    if (preferences.contentTypes.includes('social')) {
      const socialPromise = this.fetchSocialContent(preferences.socialHashtags);
      promises.push(socialPromise);
    }

    try {
      const results = await Promise.allSettled(promises);
      const allContent: ContentItem[] = [];

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          allContent.push(...result.value);
        } else {
          console.error('Error fetching content:', result.reason);
        }
      });

      // Sort by date (newest first) and mix content types
      return this.shuffleAndSort(allContent);
    } catch (error) {
      console.error('Error aggregating content:', error);
      return [];
    }
  }

  private async fetchNewsContent(categories: string[]): Promise<ContentItem[]> {
    try {
      const category = categories[0] || 'technology';
      const articles = await newsApiService.fetchTopHeadlines(category);
      return newsApiService.convertToContentItems(articles.slice(0, 8));
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  private async fetchMovieContent(): Promise<ContentItem[]> {
    try {
      const movies = await tmdbApiService.fetchPopularMovies();
      return tmdbApiService.convertToContentItems(movies.slice(0, 6));
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  }

  private async fetchSocialContent(hashtags: string[]): Promise<ContentItem[]> {
    try {
      const hashtag = hashtags[0] || 'technology';
      const posts = await socialApiService.fetchPosts(hashtag);
      return socialApiService.convertToContentItems(posts.slice(0, 8));
    } catch (error) {
      console.error('Error fetching social content:', error);
      return [];
    }
  }

  async searchAllContent(query: string): Promise<ContentItem[]> {
    const promises = [
      newsApiService.searchNews(query).then(articles => 
        newsApiService.convertToContentItems(articles.slice(0, 5))
      ),
      tmdbApiService.searchMovies(query).then(movies => 
        tmdbApiService.convertToContentItems(movies.slice(0, 5))
      ),
      socialApiService.searchPosts(query).then(posts => 
        socialApiService.convertToContentItems(posts.slice(0, 5))
      )
    ];

    try {
      const results = await Promise.allSettled(promises);
      const allContent: ContentItem[] = [];

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          allContent.push(...result.value);
        }
      });

      return this.shuffleAndSort(allContent);
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  }

  private shuffleAndSort(content: ContentItem[]): ContentItem[] {
    // Group by source
    const newsBySource = content.reduce((acc, item) => {
      if (!acc[item.source]) acc[item.source] = [];
      acc[item.source].push(item);
      return acc;
    }, {} as Record<string, ContentItem[]>);

    // Interleave content from different sources
    const result: ContentItem[] = [];
    const sources = Object.keys(newsBySource);
    let maxLength = Math.max(...Object.values(newsBySource).map(arr => arr.length));

    for (let i = 0; i < maxLength; i++) {
      sources.forEach(source => {
        if (newsBySource[source][i]) {
          result.push(newsBySource[source][i]);
        }
      });
    }

    // Sort by date within the mixed content
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getDefaultPreferences(): UserPreferences {
    return {
      newsCategories: ['technology', 'business'],
      movieGenres: ['action', 'drama', 'comedy'],
      socialHashtags: ['technology', 'webdev', 'startup'],
      contentTypes: ['news', 'movies', 'social']
    };
  }
}

export const contentAggregatorService = new ContentAggregatorService();