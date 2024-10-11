import OpenAI from 'openai';
import { SearchNode } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const generateSearchResults = async (query: string): Promise<SearchNode> => {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      console.log(`Attempt ${i + 1}: Sending request to OpenAI API...`);
      
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that provides search results in a hierarchical format." },
          { role: "user", content: `Generate a hierarchical search result for: "${query}". Provide the result in JSON format with the following structure:
            {
              "id": "1",
              "name": "${query}",
              "category": "main",
              "children": [
                {
                  "id": "1.1",
                  "name": "Subtopic 1",
                  "category": "category1",
                  "children": [
                    {
                      "id": "1.1.1",
                      "name": "Sub-subtopic 1",
                      "category": "category1"
    },
                    ...
                  ]
                },
                ...
              ]
            }
            Use appropriate categories like 'technology', 'science', 'history', etc. Limit to 3 levels of depth and 5 children per node. Ensure that the content is informative and relevant to the query.` }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content in the API response");
      }

      console.log('Received response from OpenAI API:', content);
      return JSON.parse(content) as SearchNode;
    } catch (error: any) {
      console.error(`Attempt ${i + 1} failed. Error in OpenAI API call:`, error);
      if (error.error?.code === "insufficient_quota") {
        throw new Error("API quota exceeded");
      }
      if (i < MAX_RETRIES - 1) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        continue;
      }
      throw error;
    }
  }
  throw new Error('Failed to generate search results after multiple retries');
};