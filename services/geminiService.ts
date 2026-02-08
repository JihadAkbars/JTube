
import { GoogleGenAI } from "@google/genai";
import { JTubeInput, JTubeOutput } from "../types";

export const generateSEOContent = async (input: JTubeInput): Promise<JTubeOutput> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    You are an AI engine for a web application called "JTube".
    Your task is to generate AI-powered, SEO-optimized YouTube Video Titles, Descriptions, and SEO Tags based on current trends for the following input:

    Game Title: ${input.gameTitle}
    Content Type: ${input.contentType}
    Game Genre: ${input.gameGenre || 'Not specified'}
    Game Link: ${input.gameLink || 'Not specified'}
    Donation Link: ${input.donationLink || 'Not specified'}
    Language: ${input.language || 'English'}
    Target Region: ${input.targetRegion || 'Global'}

    --- TREND & SEO INTELLIGENCE RULES ---
    - Use Google Search to analyze recent trends related to "${input.gameTitle}" and "${input.contentType}".
    - Base optimization on trending content patterns and high-performing keyword structures.
    - Prioritize recent and high-engagement trends.

    --- CONTENT GENERATION RULES ---
    1. AI-GENERATED YOUTUBE TITLES: Generate 5-10 titles. No emojis in titles.
    2. YOUTUBE DESCRIPTION: Generate ONE full emoji-enhanced block. Include Game Title, Genre, Game Link, and Donation link ONLY if they were provided (do not use placeholders).
    3. SEO TAGS: Generate primary, long-tail, and content-specific tags as a comma-separated list. No emojis in tags.

    --- MANDATORY OUTPUT FORMAT (Strictly follow this structure) ---
    AI-Generated YouTube Titles:
    1. [Title 1]
    2. [Title 2]
    ...

    YouTube Description (Ready to Copy):
    [The complete description block]

    SEO Tags:
    [tag1, tag2, tag3...]
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.7,
    },
  });

  const text = response.text || '';
  
  // Parse Titles
  const titleMatch = text.match(/AI-Generated YouTube Titles:\s*([\s\S]*?)(?=YouTube Description|$)/i);
  const titles = titleMatch 
    ? titleMatch[1].trim().split('\n').map(t => t.replace(/^\d+\.\s*/, '').trim()).filter(Boolean)
    : [];

  // Parse Description
  const descMatch = text.match(/YouTube Description \(Ready to Copy\):\s*([\s\S]*?)(?=SEO Tags|$)/i);
  const description = descMatch ? descMatch[1].trim() : '';

  // Parse Tags
  const tagsMatch = text.match(/SEO Tags:\s*([\s\S]*?)$/i);
  const tags = tagsMatch ? tagsMatch[1].trim() : '';

  // Extract Grounding Sources
  const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map(chunk => ({
      title: chunk.web?.title || 'Source',
      uri: chunk.web?.uri || ''
    }))
    .filter(source => source.uri) || [];

  return {
    titles,
    description,
    tags,
    groundingSources,
  };
};
