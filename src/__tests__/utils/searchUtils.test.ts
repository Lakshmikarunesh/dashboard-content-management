import { describe, it, expect } from 'vitest';
import { searchContent, getSearchSuggestions, highlightSearchTerms } from '../../utils/searchUtils';
import { ContentItem } from '../../context/AppContext';

const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'React Best Practices',
    description: 'Learn React development',
    category: 'Technology',
    author: 'John Doe',
    date: '2024-01-01',
    readTime: 5,
    tags: ['React', 'JavaScript'],
    imageUrl: '',
    isFavorite: false,
    isRead: false
  },
  {
    id: '2',
    title: 'Design Systems',
    description: 'Building scalable design systems',
    category: 'Design',
    author: 'Jane Smith',
    date: '2024-01-02',
    readTime: 8,
    tags: ['Design', 'UI/UX'],
    imageUrl: '',
    isFavorite: false,
    isRead: false
  }
];

describe('searchUtils', () => {
  describe('searchContent', () => {
    it('filters content by title', () => {
      const results = searchContent(mockContent, 'React');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('React Best Practices');
    });

    it('filters content by author', () => {
      const results = searchContent(mockContent, 'Jane');
      expect(results).toHaveLength(1);
      expect(results[0].author).toBe('Jane Smith');
    });

    it('returns all content for empty query', () => {
      const results = searchContent(mockContent, '');
      expect(results).toHaveLength(2);
    });
  });

  describe('getSearchSuggestions', () => {
    it('returns suggestions based on content', () => {
      const suggestions = getSearchSuggestions(mockContent, 'Re');
      expect(suggestions).toContain('React Best Practices');
    });

    it('returns empty array for short queries', () => {
      const suggestions = getSearchSuggestions(mockContent, 'R');
      expect(suggestions).toHaveLength(0);
    });
  });

  describe('highlightSearchTerms', () => {
    it('highlights matching terms', () => {
      const result = highlightSearchTerms('React is awesome', 'React');
      expect(result).toContain('<mark');
      expect(result).toContain('React');
    });

    it('returns original text for empty query', () => {
      const text = 'React is awesome';
      const result = highlightSearchTerms(text, '');
      expect(result).toBe(text);
    });
  });
});