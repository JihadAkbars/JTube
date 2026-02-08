import { GoogleGenAI } from "@google/genai";
import { JTubeInput, JTubeOutput } from "../types";

export const generateSEOContent = async (input: JTubeInput): Promise<JTubeOutput> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    throw new Error("Currently lacking funds to build the AI, please donate at https://saweria.co/DragonFroze so this website can work again.");
  }

  const ai = new GoogleGenAI({ apiKey });

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

    --- MANDATORY OUTPUT FORMAT ---
    AI-Generated YouTube Titles:
    1. [Title 1]
    ...

    YouTube Description (Ready to Copy):
    [The complete description block]

    SEO Tags:
    [tag1, tag2, tag3...]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    
    const titleMatch = text.match(/AI-Generated YouTube Titles:\s*([\s\S]*?)(?=YouTube Description|$)/i);
    const titles = titleMatch 
      ? titleMatch[1].trim().split('\n').map(t => t.replace(/^\d+\.\s*/, '').trim()).filter(Boolean)
      : [];

    const descMatch = text.match(/YouTube Description \(Ready to Copy\):\s*([\s\S]*?)(?=SEO Tags|$)/i);
    const description = descMatch ? descMatch[1].trim() : '';

    const tagsMatch = text.match(/SEO Tags:\s*([\s\S]*?)$/i);
    const tags = tagsMatch ? tagsMatch[1].trim() : '';

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
  } catch (error: any) {
    const errorMsg = error.toString();
    console.error("Gemini API Error:", error);

    // Use the specific donation message for all funding/quota/key related issues as requested
    if (
      errorMsg.includes("RESOURCE_EXHAUSTED") || 
      errorMsg.includes("429") || 
      errorMsg.includes("403") || 
      errorMsg.includes("401") ||
      errorMsg.includes("API key not valid")
    ) {
      throw new Error("Currently lacking funds to build the AI, please donate at https://saweria.co/DragonFroze so this website can work again.");
    }

    throw new Error(error.message || "An unexpected error occurred. Please try again later.");
  }
};
