import { LLMMode } from './llm';

export interface Analysis {
  id: string;
  createdAt: string;
  updatedAt: string;
  templateName: string;
  generatedPrompt: string;
  imageCount: number; // Number of images used
  images?: string[]; // Base64 encoded images
  thumbnails?: string[]; // Base64 encoded thumbnails for performance
  userNote?: string;
  tags: string[];
  llmMode?: LLMMode; // Mode used for analysis (clipboard or local)
  aiResponse?: string; // Optional AI response after using the prompt
}
