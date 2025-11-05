export type TemplateCategory = 'risk' | 'rebalance' | 'checklist' | 'sector' | 'profit';

export interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  defaultValue?: string;
}

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  icon: string;
  promptTemplate: string;
  outputFormat: string;
  exampleResult?: string;
  variables: TemplateVariable[];
  isCustom: boolean;
  createdAt: string;
  usageCount: number;
}
