/**
 * LocalLLMClient
 * 로컬 디바이스에서 LLM을 실행하는 클라이언트
 *
 * Phase 1: 스텁 구현 (인터페이스만)
 * Phase 4: 실제 llama.rn 통합
 */

import { Platform } from 'react-native';
import { LLMClient, LLMResponse, LLMGenerationProgress } from '@/types/llm';

export class LocalLLMClient implements LLMClient {
  name = 'LLaVA 1.5 7B (로컬)';
  mode = 'local' as const;
  supportsImages = true;

  private context: any = null;
  private onProgress?: (progress: LLMGenerationProgress) => void;

  constructor(
    private modelPath: string,
    private mmprojPath: string,
    private config: {
      maxTokens?: number;
      temperature?: number;
      contextSize?: number;
    } = {},
    progressCallback?: (progress: LLMGenerationProgress) => void
  ) {
    this.onProgress = progressCallback;
  }

  /**
   * 모델 초기화
   * Phase 4에서 구현 예정
   */
  async initialize(): Promise<void> {
    if (Platform.OS === 'web') {
      throw new Error('로컬 LLM은 웹 플랫폼에서 지원되지 않습니다');
    }

    // TODO: Phase 4에서 llama.rn 통합
    throw new Error('Phase 4에서 구현 예정: 모델 초기화');
  }

  /**
   * 프롬프트 실행 및 응답 생성
   * Phase 4에서 구현 예정
   */
  async generate(prompt: string, images?: string[]): Promise<LLMResponse> {
    // TODO: Phase 4에서 llama.rn 통합
    throw new Error('Phase 4에서 구현 예정: 프롬프트 생성');
  }

  /**
   * 리소스 정리
   * Phase 4에서 구현 예정
   */
  async cleanup(): Promise<void> {
    // TODO: Phase 4에서 구현
    if (this.context) {
      // await this.context.release();
      this.context = null;
    }
  }

  /**
   * 준비 상태 확인
   */
  isReady(): boolean {
    return this.context !== null;
  }
}
