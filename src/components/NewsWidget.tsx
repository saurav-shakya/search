import React from 'react';
import { NewsArticle } from './NewsService';

interface NewsWidgetProps {
  articles: NewsArticle[];
}

const NewsWidget: React.FC<NewsWidgetProps> = ({ articles }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Recent News</h2>
      {articles.length > 0 ? (
        <ul className="space-y-4">
          {articles.map((article, index) => (
            <li key={index} className="border-b border-gray-700 pb-4">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-lg">
                {article.title}
              </a>
              <p className="text-gray-400 text-base mt-2">{article.description}</p>
              <div className="text-gray-500 text-sm mt-2">
                {article.source.name} - {new Date(article.publishedAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-lg">No recent news found for this topic.</p>
      )}
    </div>
  );
};

export default NewsWidget;