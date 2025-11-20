import { Template } from '@/types';

export interface PromptGeneratorOptions {
  imageCount: number;
  customInputs?: Record<string, string>;
  llmMode?: 'clipboard' | 'local'; // LLM 모드 추가
}

/**
 * Generate a prompt based on template and images
 * @param template - The selected template
 * @param options - Generation options (imageCount, customInputs, llmMode)
 * @returns Generated prompt string
 */
export function generatePrompt(
  template: Template,
  options: PromptGeneratorOptions
): string {
  let prompt = template.promptTemplate;

  // Local LLM 모드일 때는 Vision LLM에 최적화된 프롬프트로 변환
  if (options.llmMode === 'local') {
    // "위 포트폴리오 이미지를 보고" → "이 이미지들을 분석해서"
    const imageText =
      options.imageCount > 1
        ? `이 ${options.imageCount}개의 포트폴리오 이미지를 분석해서`
        : '이 포트폴리오 이미지를 분석해서';

    prompt = prompt.replace(/위 포트폴리오 이미지를 보고/g, imageText);

    // Vision LLM에 더 직접적인 지시 추가
    prompt = `당신은 전문 포트폴리오 분석가입니다. 제공된 이미지를 자세히 분석하고 아래 요구사항에 따라 답변해주세요.\n\n${prompt}`;
  } else {
    // Clipboard 모드: 기존 형식 유지 (사용자가 ChatGPT 등에 붙여넣을 것)
    const imageText =
      options.imageCount > 1
        ? `위 ${options.imageCount}개의 포트폴리오 이미지를 보고`
        : '위 포트폴리오 이미지를 보고';

    prompt = prompt.replace(/위 포트폴리오 이미지를 보고/g, imageText);
  }

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
