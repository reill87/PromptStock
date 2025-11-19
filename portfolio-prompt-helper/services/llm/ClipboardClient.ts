/**
 * ClipboardClient
 * 기존 클립보드 복사 기능을 LLMClient 인터페이스로 래핑
 * 사용자가 직접 ChatGPT/Claude에 붙여넣는 방식
 */

import * as Clipboard from 'expo-clipboard';
import { LLMClient, LLMResponse } from '@/types/llm';

export class ClipboardClient implements LLMClient {
  name = '클립보드 복사';
  mode = 'clipboard' as const;
  supportsImages = false;

  private ready = true;

  /**
   * 클립보드 모드는 초기화가 필요 없음
   */
  async initialize(): Promise<void> {
    // No initialization needed for clipboard mode
  }

  /**
   * 프롬프트를 클립보드에 복사
   * @param prompt 프롬프트 텍스트
   * @param images 이미지 (클립보드 모드에서는 무시됨)
   * @returns 빈 응답 (실제 응답은 사용자가 외부 LLM에서 받음)
   */
  async generate(prompt: string, images?: string[]): Promise<LLMResponse> {
    const startTime = Date.now();

    try {
      // 프롬프트를 클립보드에 복사
      await Clipboard.setStringAsync(prompt);

      return {
        text: '', // 클립보드 모드에서는 응답 없음
        processingTime: Date.now() - startTime,
        modelUsed: 'clipboard',
      };
    } catch (error: any) {
      throw new Error(`클립보드 복사 실패: ${error.message}`);
    }
  }

  /**
   * 클립보드 모드는 정리할 리소스가 없음
   */
  async cleanup(): Promise<void> {
    // Nothing to clean up
  }

  /**
   * 클립보드 모드는 항상 준비됨
   */
  isReady(): boolean {
    return this.ready;
  }
}
