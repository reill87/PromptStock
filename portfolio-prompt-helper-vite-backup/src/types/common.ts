import { Template } from './template';

export type LLMProvider = 'chatgpt' | 'claude' | 'other';
export type ImageQuality = 'low' | 'medium' | 'high';

export interface UserSettings {
  defaultTemplate?: string;
  autoSave: boolean;
  imageQuality: ImageQuality;
  preferredLLM: LLMProvider;
  customTemplates: Template[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}
