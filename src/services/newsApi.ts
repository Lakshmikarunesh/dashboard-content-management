import axios from 'axios';
import { NewsResponse, NewsArticle, ContentItem } from '../types/api';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_BASE_URL = 'https://newsapi.org/v2';

// Fallback demo data for when API key is not available
const DEMO_NEWS: NewsArticle[] = [
  {
    source: { id: 'techcrunch', name: 'TechCrunch' },
    author: 'Sarah Perez',
    title: 'AI Revolution: How Machine Learning is Transforming Industries',
    description: 'Artificial intelligence and machine learning are reshaping everything from healthcare to finance, creating new opportunities and challenges.',
    url: 'https://techcrunch.com/ai-revolution',
    urlToImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    content: 'The artificial intelligence revolution is here, and it\'s transforming industries at an unprecedented pace...'
  },
  {
    source: { id: 'wired', name: 'Wired' },
    author: 'Alex Johnson',
    title: 'The Future of Remote Work: Trends and Technologies',
    description: 'As remote work becomes permanent, new technologies and practices are emerging to support distributed teams.',
    url: 'https://wired.com/remote-work-future',
    urlToImage: 'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    content: 'Remote work has evolved from a temporary pandemic solution to a permanent fixture of the modern workplace...'
  },
  {
    source: { id: 'the-verge', name: 'The Verge' },
    author: 'Emma Chen',
    title: 'Sustainable Technology: Green Innovations for 2024',
    description: 'Tech companies are leading the charge in sustainability with innovative solutions for climate change.',
    url: 'https://theverge.com/sustainable-tech',
    urlToImage: 'https://images.pexels.com/photos/9875414/pexels-photo-9875414.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    content: 'The technology sector is embracing sustainability like never before, with companies investing billions...'
  },
  {
    source: { id: 'ars-technica', name: 'Ars Technica' },
    author: 'Michael Rodriguez',
    title: 'Cybersecurity in 2024: New Threats and Defense Strategies',
    description: 'As cyber threats evolve, organizations must adapt their security strategies to protect against sophisticated attacks.',
    url: 'https://arstechnica.com/cybersecurity-2024',
    urlToImage: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    content: 'Cybersecurity threats are becoming more sophisticated, requiring organizations to rethink their defense strategies...'
  }
];

class NewsApiService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = NEWS_API_KEY || 'demo_key';
    this.baseUrl = NEWS_BASE_URL;
  }

  private isValidApiKey(): boolean {
    // Check if API key exists and is not a placeholder or demo key
    return !!(
      this.apiKey && 
      this.apiKey !== 'demo_key' && 
      this.apiKey !== 'your_news_api_key_here' &&
      this.apiKey !== '77407bc80c6b4eb0a4d9bd14962fe690' && // Known invalid demo key
      this.apiKey.length > 10 // Basic length check for valid API keys
    );
  }

  async fetchTopHeadlines(category?: string, country: string = 'us'): Promise<NewsArticle[]> {
    // Use demo data if no valid API key
    if (!this.isValidApiKey()) {
      console.log('Using demo news data - add your News API key to .env for real data');
      return DEMO_NEWS;
    }

    try {
      const params: any = {
        apiKey: this.apiKey,
        country,
        pageSize: 20
      };

      if (category && category !== 'general') {
        params.category = category;
      }

      const response = await axios.get<NewsResponse>(`${this.baseUrl}/top-headlines`, {
        params
      });

      return response.data.articles;
    } catch (error: any) {
      console.error('Error fetching news:', error);
      
      // If we get a 426 (Upgrade Required) or 401 (Unauthorized) error, 
      // it means the API key is invalid, so fall back to demo data
      if (error.response && (error.response.status === 426 || error.response.status === 401)) {
        console.log('API key appears to be invalid, using demo data instead');
        return DEMO_NEWS;
      }
      
      return DEMO_NEWS; // Fallback to demo data for any other errors
    }
  }

  async searchNews(query: string): Promise<NewsArticle[]> {
    if (!this.isValidApiKey()) {
      // Filter demo data based on query
      return DEMO_NEWS.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description?.toLowerCase().includes(query.toLowerCase())
      );
    }

    try {
      const response = await axios.get<NewsResponse>(`${this.baseUrl}/everything`, {
        params: {
          apiKey: this.apiKey,
          q: query,
          sortBy: 'publishedAt',
          pageSize: 20
        }
      });

      return response.data.articles;
    } catch (error: any) {
      console.error('Error searching news:', error);
      
      // If we get a 426 (Upgrade Required) or 401 (Unauthorized) error, 
      // fall back to filtered demo data
      if (error.response && (error.response.status === 426 || error.response.status === 401)) {
        console.log('API key appears to be invalid, using filtered demo data instead');
        return DEMO_NEWS.filter(article => 
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description?.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      return [];
    }
  }

  convertToContentItems(articles: NewsArticle[]): ContentItem[] {
    return articles.map((article, index) => ({
      id: `news-${index}-${Date.now()}`,
      title: article.title,
      description: article.description || 'No description available',
      category: 'Technology',
      author: article.author || article.source.name,
      date: article.publishedAt,
      readTime: Math.floor(Math.random() * 10) + 3, // Estimate 3-12 min read
      tags: this.extractTags(article.title + ' ' + (article.description || '')),
      imageUrl: article.urlToImage || 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
      isFavorite: false,
      isRead: false,
      source: 'news' as const,
      sourceData: article,
      url: article.url
    }));
  }

  private extractTags(text: string): string[] {
    const commonTags = ['Technology', 'AI', 'Business', 'Innovation', 'Science', 'Security', 'Remote Work', 'Sustainability'];
    const words = text.toLowerCase().split(/\s+/);
    
    return commonTags.filter(tag => 
      words.some(word => tag.toLowerCase().includes(word) || word.includes(tag.toLowerCase()))
    ).slice(0, 3);
  }
}

export const newsApiService = new NewsApiService();