export interface Analysis {
  id: string;
  createdAt: string;
  updatedAt: string;
  templateId: string;
  templateName: string;
  images: string[]; // base64 or IndexedDB keys
  generatedPrompt: string;
  customPrompt?: string;
  llmResponse?: string;
  userNote?: string;
  tags: string[];
  metadata: {
    stockCount?: number;
    totalValue?: number;
    extractedData?: Record<string, any>;
  };
}
