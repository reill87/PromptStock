import { Template } from '@/types';

export interface PromptGeneratorOptions {
  imageCount: number;
  customInputs?: Record<string, string>;
}

/**
 * Generate a prompt based on template and images
 * @param template - The selected template
 * @param options - Generation options (imageCount, customInputs)
 * @returns Generated prompt string
 */
export function generatePrompt(
  template: Template,
  options: PromptGeneratorOptions
): string {
  let prompt = template.promptTemplate;

  // Replace image count placeholder
  const imageText =
    options.imageCount > 1
      ? `위 ${options.imageCount}개의 포트폴리오 이미지를 보고`
      : '위 포트폴리오 이미지를 보고';

  prompt = prompt.replace(/위 포트폴리오 이미지를 보고/g, imageText);

  // Replace template variables if provided
  if (template.variables && template.variables.length > 0 && options.customInputs) {
    template.variables.forEach((variable) => {
      const value = options.customInputs![variable.key] || variable.defaultValue || '';
      const placeholder = `{{${variable.key}}}`;
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
    });
  }

  return prompt.trim();
}

/**
 * Get prompt preview with truncation
 * @param prompt - Full prompt text
 * @param maxLength - Maximum length before truncation
 * @returns Truncated prompt with ellipsis
 */
export function getPromptPreview(prompt: string, maxLength: number = 200): string {
  if (prompt.length <= maxLength) {
    return prompt;
  }
  return prompt.substring(0, maxLength) + '...';
}

/**
 * Count words in prompt
 * @param prompt - Prompt text
 * @returns Word count
 */
export function getPromptWordCount(prompt: string): number {
  return prompt.trim().split(/\s+/).length;
}

/**
 * Estimate prompt tokens (approximate for Korean text)
 * @param prompt - Prompt text
 * @returns Estimated token count
 */
export function estimateTokenCount(prompt: string): number {
  // Rough estimation: 1 token ≈ 4 characters for Korean
  return Math.ceil(prompt.length / 4);
}
