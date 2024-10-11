import axios from 'axios';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export const fetchRecentNews = async (query: string): Promise<NewsArticle[]> => {
  if (!API_KEY) {
    console.warn('No News API key found. Skipping news fetch.');
    return [];
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        apiKey: API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 5,
      },
    });

    return response.data.articles;
  } catch (error) {
    console.error('Error fetching news:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
};