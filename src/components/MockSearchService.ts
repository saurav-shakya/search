import { SearchNode } from '../types';

const samAltmanData: SearchNode = {
  id: '1',
  name: 'Sam Altman',
  category: 'person',
  children: [
    {
      id: '1.1',
      name: 'Personal Information',
      category: 'personal',
      children: [
        { id: '1.1.1', name: 'Age: 38 years (as of 2023)', category: 'personal' },
        { id: '1.1.2', name: 'Birthplace: Chicago, Illinois', category: 'personal' },
        { id: '1.1.3', name: 'Current Location: San Francisco Bay Area', category: 'personal' },
      ]
    },
    {
      id: '1.2',
      name: 'Education',
      category: 'education',
      children: [
        { id: '1.2.1', name: 'Degree: Dropped out', category: 'education' },
        { id: '1.2.2', name: 'Institution: Stanford University', category: 'education' },
      ]
    },
    {
      id: '1.3',
      name: 'Career',
      category: 'career',
      children: [
        { id: '1.3.1', name: 'Current Position: CEO of OpenAI', category: 'career' },
        { id: '1.3.2', name: 'Previous Role: President of Y Combinator', category: 'career' },
        { id: '1.3.3', name: 'Co-founder of Loopt', category: 'career' },
      ]
    },
    {
      id: '1.4',
      name: 'Achievements',
      category: 'achievements',
      children: [
        { id: '1.4.1', name: 'Forbes 30 Under 30', category: 'achievements' },
        { id: '1.4.2', name: 'Time 100 Next 2019', category: 'achievements' },
      ]
    },
    {
      id: '1.5',
      name: 'Contributions',
      category: 'contributions',
      children: [
        { id: '1.5.1', name: 'Field: Artificial Intelligence', category: 'contributions' },
        { id: '1.5.2', name: 'Major Impact: Advancing AI research and development', category: 'contributions' },
      ]
    },
  ]
};

export const generateMockResults = (query: string): SearchNode => {
  if (query.toLowerCase() === "who is sam altman") {
    return samAltmanData;
  } else if (query.toLowerCase().startsWith("who is ")) {
    const name = query.slice(7); // Remove "who is " from the query
    return {
      ...samAltmanData,
      name: name,
    };
  } else {
    // Default search result structure for non-biography queries
    return {
      id: '1',
      name: query,
      category: 'main',
      children: [
        {
          id: '1.1',
          name: 'Definition',
          category: 'information',
          children: [
            { id: '1.1.1', name: 'Basic concept', category: 'information' },
            { id: '1.1.2', name: 'Historical context', category: 'information' },
          ]
        },
        {
          id: '1.2',
          name: 'Types',
          category: 'classification',
          children: [
            { id: '1.2.1', name: 'Type 1', category: 'classification' },
            { id: '1.2.2', name: 'Type 2', category: 'classification' },
            { id: '1.2.3', name: 'Type 3', category: 'classification' },
          ]
        },
        {
          id: '1.3',
          name: 'Applications',
          category: 'usage',
          children: [
            { id: '1.3.1', name: 'In science', category: 'usage' },
            { id: '1.3.2', name: 'In technology', category: 'usage' },
            { id: '1.3.3', name: 'In everyday life', category: 'usage' },
          ]
        },
        {
          id: '1.4',
          name: 'Recent developments',
          category: 'news',
          children: [
            { id: '1.4.1', name: 'Latest research', category: 'news' },
            { id: '1.4.2', name: 'Future prospects', category: 'news' },
          ]
        },
      ]
    };
  }
};