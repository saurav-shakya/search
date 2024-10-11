import React, { useState, useCallback } from 'react';
import { Search, PanelRightOpen } from 'lucide-react';
import TreeChart from './TreeChart';
import { SearchNode } from '../types';
import { generateSearchResults, generateConciseAnswer } from './GeminiService';
import { fetchRecentNews, NewsArticle } from './NewsService';
import NewsWidget from './NewsWidget';
import SidePanel from './SidePanel';

const SearchInterface: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [showNews, setShowNews] = useState(true);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [searchInfo, setSearchInfo] = useState<string>('');

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults(null);
    setNewsArticles([]);
    setSearchInfo('');

    try {
      const results = await generateSearchResults(searchQuery);
      setSearchResults(results);

      const news = await fetchRecentNews(searchQuery);
      setNewsArticles(news);

      // Generate a concise answer for the side panel
      const conciseAnswer = await generateConciseAnswer(searchQuery);
      setSearchInfo(conciseAnswer);
      setSidePanelOpen(true);
    } catch (err: any) {
      setError(`Error fetching results: ${err.message}`);
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAskClick = useCallback((nodeName: string) => {
    setQuery(nodeName);
    handleSearch(nodeName);
    setShowNews(false);
  }, [handleSearch]);

  const toggleSidePanel = () => {
    setSidePanelOpen(!sidePanelOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 relative">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-5xl font-bold text-center">Next-Generation Search Engine</h1>
          <span className="text-xl font-semibold ml-4 text-blue-400">by Saurav</span>
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="Enter your search query..."
              className="w-2/3 p-4 rounded-l-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-xl"
            />
            <button
              onClick={() => handleSearch(query)}
              className="bg-blue-600 text-white p-4 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <Search size={32} />
            </button>
          </div>

          {loading && <p className="text-center text-xl mt-4">Generating...</p>}
          {error && (
            <div className="text-center text-red-500 mt-4">
              <p className="text-xl">{error}</p>
              <p className="mt-2">Please try again or check your API key configuration.</p>
            </div>
          )}
        </div>

        {showNews && newsArticles.length > 0 && <NewsWidget articles={newsArticles} />}

        {searchResults && (
          <div className="mt-8">
            <h2 className="text-4xl font-bold mb-6 text-center">Search Results</h2>
            <TreeChart initialData={searchResults} onAskClick={handleAskClick} />
          </div>
        )}
      </div>
      <button
        onClick={toggleSidePanel}
        className="fixed top-4 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <PanelRightOpen size={24} />
      </button>
      <SidePanel 
        isOpen={sidePanelOpen} 
        onClose={toggleSidePanel}
        query={query}
        searchInfo={searchInfo}
      />
    </div>
  );
};

export default SearchInterface;