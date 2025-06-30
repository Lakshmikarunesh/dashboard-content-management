import { SocialPost, SocialResponse, ContentItem } from '../types/api';

// Mock social media data
const DEMO_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'social-1',
    username: 'techguru_sarah',
    displayName: 'Sarah Tech',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    content: 'Just finished implementing a new React dashboard with real-time data fetching! The user experience is incredible. #ReactJS #WebDev #Dashboard',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    likes: 245,
    shares: 18,
    comments: 32,
    hashtags: ['ReactJS', 'WebDev', 'Dashboard'],
    platform: 'twitter',
    images: ['https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800']
  },
  {
    id: 'social-2',
    username: 'designmaster_alex',
    displayName: 'Alex Design',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    content: 'Color psychology in UI design is fascinating! Here\'s how different colors affect user behavior and engagement. Swipe to see examples! 🎨',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 189,
    shares: 25,
    comments: 41,
    hashtags: ['UIDesign', 'ColorTheory', 'UX'],
    platform: 'instagram',
    images: [
      'https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'
    ]
  },
  {
    id: 'social-3',
    username: 'startup_mike',
    displayName: 'Mike Entrepreneur',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    content: 'Building a successful startup requires more than just a great idea. Here are 5 key lessons I learned from scaling our company to $10M ARR. Thread 🧵',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: 567,
    shares: 89,
    comments: 78,
    hashtags: ['Startup', 'Entrepreneurship', 'Business'],
    platform: 'linkedin',
    images: ['https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800']
  },
  {
    id: 'social-4',
    username: 'ai_researcher_emma',
    displayName: 'Dr. Emma AI',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    content: 'Machine learning models are getting more sophisticated, but are we considering the ethical implications? Important discussion happening in the AI community. #AI #Ethics #MachineLearning',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes: 423,
    shares: 156,
    comments: 92,
    hashtags: ['AI', 'Ethics', 'MachineLearning'],
    platform: 'twitter',
    images: ['https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800']
  },
  {
    id: 'social-5',
    username: 'remote_work_lisa',
    displayName: 'Lisa Remote',
    avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    content: 'Remote work productivity tips that actually work! After 3 years of working from home, these are my top strategies for staying focused and motivated. 💪',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 312,
    shares: 67,
    comments: 45,
    hashtags: ['RemoteWork', 'Productivity', 'WorkFromHome'],
    platform: 'linkedin',
    images: ['https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800']
  },
  {
    id: 'social-6',
    username: 'frontend_dev_carlos',
    displayName: 'Carlos Frontend',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    content: 'CSS Grid vs Flexbox: When to use which? Here\'s a comprehensive guide with real examples! Perfect for developers looking to master modern layouts. 🔥',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    likes: 198,
    shares: 34,
    comments: 28,
    hashtags: ['CSS', 'WebDev', 'Frontend'],
    platform: 'twitter',
    images: ['https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800']
  }
];

class SocialApiService {
  async fetchPosts(hashtag?: string): Promise<SocialPost[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let posts = DEMO_SOCIAL_POSTS;

    if (hashtag) {
      posts = posts.filter(post => 
        post.hashtags.some(tag => 
          tag.toLowerCase().includes(hashtag.toLowerCase())
        ) ||
        post.content.toLowerCase().includes(hashtag.toLowerCase())
      );
    }

    return posts;
  }

  async fetchUserPosts(username: string): Promise<SocialPost[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return DEMO_SOCIAL_POSTS.filter(post => 
      post.username.toLowerCase().includes(username.toLowerCase()) ||
      post.displayName.toLowerCase().includes(username.toLowerCase())
    );
  }

  async searchPosts(query: string): Promise<SocialPost[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    return DEMO_SOCIAL_POSTS.filter(post =>
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
      post.displayName.toLowerCase().includes(query.toLowerCase())
    );
  }

  convertToContentItems(posts: SocialPost[]): ContentItem[] {
    return posts.map(post => ({
      id: post.id,
      title: this.generateTitle(post),
      description: post.content,
      category: 'Social',
      author: post.displayName,
      date: post.timestamp,
      readTime: Math.ceil(post.content.length / 200), // Estimate based on content length
      tags: post.hashtags.slice(0, 3),
      imageUrl: post.images?.[0] || post.avatar,
      isFavorite: false,
      isRead: false,
      source: 'social' as const,
      sourceData: post
    }));
  }

  private generateTitle(post: SocialPost): string {
    // Extract first sentence or first 50 characters as title
    const firstSentence = post.content.split('.')[0];
    if (firstSentence.length > 50) {
      return firstSentence.substring(0, 50) + '...';
    }
    return firstSentence || 'Social Media Post';
  }

  formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
}

export const socialApiService = new SocialApiService();