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
  aiResponse?: string; // Optional AI response after using the prompt
}
