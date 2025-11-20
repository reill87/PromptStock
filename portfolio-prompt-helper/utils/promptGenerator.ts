import { Template } from '@/types';

export interface PromptGeneratorOptions {
  imageCount: number;
  customInputs?: Record<string, string>;
  llmMode?: 'clipboard' | 'local'; // LLM 모드 추가
}

/**
 * Vision LLM을 위한 단순화된 프롬프트 생성
 * 작은 Vision 모델(SmolVLM2 2.2B)은 복잡한 구조화된 요구사항을 처리하기 어려움
 * 핵심 질문만 간단명료하게 추출
 */
function simplifyPromptForVisionLLM(originalPrompt: string, template: Template): string {
  // 템플릿별 단순화된 프롬프트 (영어 + 한국어 혼합)
  // Vision LLM은 영어를 더 잘 처리하므로 영어로 질문하고 한국어로 답변 요청
  const simplifiedPrompts: Record<string, string> = {
    'risk-analysis':
      `Describe this portfolio image in detail. List ALL stock names, percentages, and values you can see. Provide complete information. Answer in Korean.`,

    'rebalancing':
      `Describe this portfolio image in detail. List ALL stock names, percentages, and values you can see. Provide complete information. Answer in Korean.`,

    'checklist':
      `Describe this portfolio image in detail. List ALL stock names and information you can see. Provide complete information. Answer in Korean.`,

    'sector-balance':
      `Describe this portfolio image in detail. List ALL stock names and information you can see. Provide complete information. Answer in Korean.`,

    'profit-improvement':
      `Describe this portfolio image in detail. List ALL stock names, percentages, and values you can see. Provide complete information. Answer in Korean.`,
  };

  // 템플릿 ID에 맞는 단순화된 프롬프트 사용, 없으면 기본 프롬프트
  const simplified = simplifiedPrompts[template.id];

  if (simplified) {
    return `You are a portfolio analysis expert. Analyze the image carefully.\n\n${simplified}`;
  }

  // 커스텀 템플릿이거나 ID가 없는 경우: 원본에서 불필요한 부분 제거
  let cleanPrompt = originalPrompt
    .replace(/위 포트폴리오 이미지를 보고/g, '이 포트폴리오 이미지를 분석해서')
    .replace(/\*\*/g, '') // 마크다운 볼드 제거
    .replace(/출력 형식[:\s]*.*$/gm, '') // 출력 형식 요구사항 제거
    .replace(/표 형태로.*$/gm, '') // 표 형식 요구사항 제거
    .trim();

  return `You are a portfolio analysis expert. Analyze the image.\n\n${cleanPrompt}\n\nPlease answer concisely in Korean.`;
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
    // Vision LLM을 위한 단순화된 프롬프트 생성
    // 복잡한 구조화 요구사항을 제거하고 핵심 질문만 추출
    const simplifiedPrompt = simplifyPromptForVisionLLM(prompt, template);
    prompt = simplifiedPrompt;
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
