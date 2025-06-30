import { useEffect, useRef } from 'react';
import { ContentItem } from '../types/api';

interface UseRealTimeUpdatesProps {
  onNewContent: (content: ContentItem[]) => void;
  interval?: number;
}

export const useRealTimeUpdates = ({ 
  onNewContent, 
  interval = 30000 
}: UseRealTimeUpdatesProps) => {
  const intervalRef = useRef<NodeJS.Timeout>();

  const generateRealTimeContent = (): ContentItem[] => {
    const now = new Date();
    const timeAgo = new Date(now.getTime() - Math.random() * 10 * 60 * 1000);

    const socialPosts: ContentItem[] = [
      {
        id: `realtime-${Date.now()}-1`,
        title: 'Breaking: New React 19 Features Announced',
        description: 'React team just announced exciting new features including automatic batching improvements and concurrent features.',
        category: 'Technology',
        author: 'React Team',
        date: timeAgo.toISOString(),
        readTime: 3,
        tags: ['React', 'JavaScript', 'Frontend'],
        imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
        isFavorite: false,
        isRead: false,
        source: 'social' as const,
        sourceData: {
          id: `realtime-${Date.now()}-1`,
          username: 'reactjs',
          displayName: 'React',
          avatar: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
          content: 'Breaking: New React 19 Features Announced - React team just announced exciting new features including automatic batching improvements and concurrent features.',
          timestamp: timeAgo.toISOString(),
          likes: Math.floor(Math.random() * 1000) + 100,
          shares: Math.floor(Math.random() * 100) + 10,
          comments: Math.floor(Math.random() * 50) + 5,
          hashtags: ['React', 'JavaScript', 'Frontend'],
          platform: 'twitter' as const,
          images: ['https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800']
        }
      },
      {
        id: `realtime-${Date.now()}-2`,
        title: 'AI Breakthrough in Natural Language Processing',
        description: 'Researchers achieve new milestone in AI language understanding with 95% accuracy in complex reasoning tasks.',
        category: 'Technology',
        author: 'AI Research Lab',
        date: timeAgo.toISOString(),
        readTime: 5,
        tags: ['AI', 'Machine Learning', 'NLP'],
        imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
        isFavorite: false,
        isRead: false,
        source: 'social' as const,
        sourceData: {
          id: `realtime-${Date.now()}-2`,
          username: 'ai_research',
          displayName: 'AI Research Lab',
          avatar: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
          content: 'AI Breakthrough in Natural Language Processing - Researchers achieve new milestone in AI language understanding with 95% accuracy in complex reasoning tasks.',
          timestamp: timeAgo.toISOString(),
          likes: Math.floor(Math.random() * 800) + 200,
          shares: Math.floor(Math.random() * 80) + 20,
          comments: Math.floor(Math.random() * 40) + 10,
          hashtags: ['AI', 'Machine Learning', 'NLP'],
          platform: 'linkedin' as const,
          images: ['https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800']
        }
      }
    ];

    return socialPosts;
  };

  useEffect(() => {
    const startRealTimeUpdates = () => {
      intervalRef.current = setInterval(() => {
        // Simulate real-time content updates
        if (Math.random() > 0.7) { // 30% chance of new content
          const newContent = generateRealTimeContent();
          onNewContent(newContent);
        }
      }, interval);
    };

    startRealTimeUpdates();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onNewContent, interval]);

  const stopUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const startUpdates = () => {
    stopUpdates();
    intervalRef.current = setInterval(() => {
      if (Math.random() > 0.7) {
        const newContent = generateRealTimeContent();
        onNewContent(newContent);
      }
    }, interval);
  };

  return { stopUpdates, startUpdates };
};