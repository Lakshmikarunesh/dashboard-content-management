import { ContentItem } from '../context/AppContext';

export function highlightSearchTerms(text: string, searchQuery: string): string {
  if (!searchQuery) return text;
  
  const regex = new RegExp(`(${searchQuery})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
}

export function searchContent(content: ContentItem[], query: string): ContentItem[] {
  if (!query) return content;
  
  const searchTerm = query.toLowerCase();
  
  return content.filter(item => 
    item.title.toLowerCase().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm) ||
    item.author.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

export function getSearchSuggestions(content: ContentItem[], query: string): string[] {
  if (!query || query.length < 2) return [];
  
  const suggestions = new Set<string>();
  const searchTerm = query.toLowerCase();
  
  content.forEach(item => {
    // Add matching titles
    if (item.title.toLowerCase().includes(searchTerm)) {
      suggestions.add(item.title);
    }
    
    // Add matching authors
    if (item.author.toLowerCase().includes(searchTerm)) {
      suggestions.add(item.author);
    }
    
    // Add matching tags
    item.tags.forEach(tag => {
      if (tag.toLowerCase().includes(searchTerm)) {
        suggestions.add(tag);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 5);
}