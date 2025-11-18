/**
 * LocalLLMClient
 * 로컬 디바이스에서 LLM을 실행하는 클라이언트
 * llama.rn을 사용하여 Vision LLM 모델 실행
 */

import { Platform } from 'react-native';
import { initLlama } from 'llama.rn';
import type { LlamaContext } from 'llama.rn';
import { LLMClient, LLMResponse, LLMGenerationProgress } from '@/types/llm';

export class LocalLLMClient implements LLMClient {
  name = 'LLaVA 1.5 7B (로컬)';
  mode = 'local' as const;
  supportsImages = true;

  private context: LlamaContext | null = null;
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
   * llama.rn을 사용하여 모델과 vision projector 로드
   */
  async initialize(): Promise<void> {
    if (Platform.OS === 'web') {
      throw new Error('로컬 LLM은 웹 플랫폼에서 지원되지 않습니다');
    }

    if (this.context) {
      console.warn('Context already initialized');
      return;
    }

    try {
      this.onProgress?.({
        stage: 'initializing',
        progress: 10,
        message: '모델 로딩 중...',
      });

      // llama.rn 초기화
      this.context = await initLlama({
        model: this.modelPath,
        mmproj: this.mmprojPath, // Vision projector
        use_mlock: true, // 메모리 잠금 (성능 향상)
        n_ctx: this.config.contextSize || 2048, // 컨텍스트 크기
        n_gpu_layers: 0, // CPU만 사용 (배터리 고려)
        seed: 42, // 재현 가능한 결과
      });

      this.onProgress?.({
        stage: 'initializing',
        progress: 100,
        message: '모델 준비 완료',
      });

      console.log('LocalLLMClient initialized successfully');
    } catch (error: any) {
      console.error('Failed to initialize llama.rn:', error);
      this.context = null;
      throw new Error(`모델 초기화 실패: ${error.message}`);
    }
  }

  /**
   * 프롬프트 실행 및 응답 생성
   *
   * @param prompt 프롬프트 텍스트
   * @param images 이미지 배열 (base64 인코딩)
   * @returns LLM 응답
   */
  async generate(prompt: string, images?: string[]): Promise<LLMResponse> {
    if (!this.context) {
      await this.initialize();
    }

    const startTime = Date.now();

    try {
      // 이미지 처리 단계
      if (images && images.length > 0) {
        this.onProgress?.({
          stage: 'processing-images',
          progress: 30,
          message: `이미지 처리 중... (${images.length}개)`,
        });
      }

      // 응답 생성 단계
      this.onProgress?.({
        stage: 'generating',
        progress: 50,
        message: '응답 생성 중...',
      });

      // 이미지를 data URL 형식으로 변환
      const imageDataURLs = images?.map((base64) => {
        // base64가 이미 data URL 형식인지 확인
        if (base64.startsWith('data:')) {
          return base64;
        }
        // 아니면 data URL 형식으로 변환
        return `data:image/jpeg;base64,${base64}`;
      });

      // llama.rn completion 실행
      const result = await this.context!.completion({
        prompt,
        images: imageDataURLs,
        n_predict: this.config.maxTokens || 512,
        temperature: this.config.temperature || 0.7,
        top_k: 40,
        top_p: 0.95,
        stop: ['</s>', '\n\n\n'], // 중지 토큰
      });

      this.onProgress?.({
        stage: 'completed',
        progress: 100,
        message: '완료',
      });

      const processingTime = Date.now() - startTime;

      console.log(`Generation completed in ${processingTime}ms`);

      return {
        text: result.text.trim(),
        processingTime,
        modelUsed: this.name,
        tokenCount: result.tokens?.length,
      };
    } catch (error: any) {
      console.error('Generation failed:', error);
      throw new Error(`분석 실패: ${error.message}`);
    }
  }

  /**
   * 리소스 정리
   * 메모리 해제 및 모델 언로드
   */
  async cleanup(): Promise<void> {
    if (this.context) {
      try {
        await this.context.release();
        console.log('LocalLLMClient context released');
      } catch (error) {
        console.error('Failed to release context:', error);
      } finally {
        this.context = null;
      }
    }
  }

  /**
   * 준비 상태 확인
   */
  isReady(): boolean {
    return this.context !== null;
  }

  /**
   * 생성 중단
   * 긴 생성 작업을 중단할 때 사용
   */
  async stopGeneration(): Promise<void> {
    if (this.context) {
      try {
        await this.context.stopCompletion();
        console.log('Generation stopped');
      } catch (error) {
        console.error('Failed to stop generation:', error);
      }
    }
  }
}
