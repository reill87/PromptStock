/**
 * LocalLLMClient
 * 로컬 디바이스에서 LLM을 실행하는 클라이언트
 * llama.rn을 사용하여 Vision LLM 모델 실행
 */

import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { initLlama } from 'llama.rn';
import type { LlamaContext } from 'llama.rn';
import { LLMClient, LLMResponse, LLMGenerationProgress } from '@/types/llm';

// 타임아웃 상수 (5분)
const GENERATION_TIMEOUT_MS = 5 * 60 * 1000;

/**
 * 타임아웃 래퍼 함수
 */
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

export class LocalLLMClient implements LLMClient {
  name = 'Vision LLM (로컬)';
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
        progress: 5,
        message: '모델 파일 확인 중...',
      });

      // 모델 파일 존재 여부 확인
      const modelExists = await FileSystem.getInfoAsync(this.modelPath);
      if (!modelExists.exists) {
        throw new Error(
          `모델 파일을 찾을 수 없습니다.\n경로: ${this.modelPath}\n\n모델을 다시 다운로드해주세요.`
        );
      }

      const mmprojExists = await FileSystem.getInfoAsync(this.mmprojPath);
      if (!mmprojExists.exists) {
        throw new Error(
          `Vision 모델 파일을 찾을 수 없습니다.\n경로: ${this.mmprojPath}\n\n모델을 다시 다운로드해주세요.`
        );
      }

      this.onProgress?.({
        stage: 'initializing',
        progress: 20,
        message: '모델 로딩 중...',
      });

      console.log('Initializing llama.rn with:', {
        model: this.modelPath,
        mmproj: this.mmprojPath,
        contextSize: this.config.contextSize || 2048,
      });

      // Step 1: llama.rn 기본 모델 초기화 (타임아웃 2분)
      this.context = await withTimeout(
        initLlama({
          model: this.modelPath,
          // mmproj는 initMultimodal에서 별도로 로드
          use_mlock: true, // 메모리 잠금 (성능 향상)
          n_ctx: this.config.contextSize || 2048, // 컨텍스트 크기
          n_gpu_layers: 0, // CPU만 사용 (배터리 고려)
          ctx_shift: false, // Multimodal 필수: 미디어 토큰 위치 유지
          seed: 42, // 재현 가능한 결과
        }),
        120000,
        '모델 로딩 시간 초과 (2분). 디바이스 메모리가 부족하거나 모델이 손상되었을 수 있습니다.'
      );

      this.onProgress?.({
        stage: 'initializing',
        progress: 60,
        message: 'Vision 모델 로딩 중...',
      });

      // Step 2: Multimodal (Vision) 초기화
      console.log('🔧 Starting multimodal initialization...');
      console.log('📂 mmproj path:', this.mmprojPath);

      const multimodalSuccess = await withTimeout(
        this.context.initMultimodal({
          path: this.mmprojPath,
          use_gpu: true, // GPU 사용 (이미지 처리 성능 향상)
        }),
        60000,
        'Vision 모델 로딩 시간 초과 (1분). mmproj 파일이 손상되었을 수 있습니다.'
      );

      console.log('✅ initMultimodal returned:', multimodalSuccess);

      // Multimodal 활성화 확인
      const isEnabled = await this.context.isMultimodalEnabled();
      console.log('🔍 isMultimodalEnabled:', isEnabled);

      if (!isEnabled) {
        throw new Error(
          'Multimodal 초기화 실패. mmproj 파일이 손상되었거나 모델과 호환되지 않습니다.\n\n' +
          '해결 방법:\n' +
          '1. 모델을 다시 다운로드해주세요\n' +
          '2. LLaVA 1.5 7B Q4 모델인지 확인해주세요'
        );
      }

      // Multimodal 지원 확인
      const multimodalSupport = await this.context.getMultimodalSupport();
      console.log('📊 Multimodal support:', multimodalSupport);

      this.onProgress?.({
        stage: 'initializing',
        progress: 100,
        message: '모델 준비 완료',
      });

      console.log('LocalLLMClient initialized successfully with vision support');
    } catch (error: any) {
      console.error('Failed to initialize llama.rn:', error);
      this.context = null;

      // 에러 타입별로 다른 메시지 제공
      if (error.message.includes('메모리')) {
        throw new Error(
          '메모리 부족: 디바이스 RAM이 부족합니다. 다른 앱을 종료하고 다시 시도해주세요.'
        );
      } else if (error.message.includes('찾을 수 없습니다')) {
        throw error; // 이미 명확한 메시지
      } else if (error.message.includes('시간 초과')) {
        throw error; // 타임아웃 메시지
      } else {
        throw new Error(
          `모델 초기화 실패: ${error.message}\n\n앱을 재시작하거나 모델을 다시 다운로드해주세요.`
        );
      }
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
    // 입력 검증
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('프롬프트가 비어있습니다.');
    }

    if (prompt.length > 10000) {
      throw new Error(
        '프롬프트가 너무 깁니다. 10,000자 이하로 작성해주세요.'
      );
    }

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

        // 이미지 개수 제한
        if (images.length > 10) {
          throw new Error(
            '이미지가 너무 많습니다. 최대 10개까지만 지원합니다.'
          );
        }
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

      // 🔍 상세 디버깅 로그
      console.log('========== LocalLLM Generation Debug ==========');
      console.log('📝 Original prompt length:', prompt.length);
      console.log('📝 Original prompt preview:', prompt.substring(0, 100) + '...');
      console.log('🖼️  Images received:', images?.length || 0);
      console.log('🖼️  Image data URLs created:', imageDataURLs?.length || 0);

      if (imageDataURLs && imageDataURLs.length > 0) {
        console.log('🖼️  First image info:', {
          startsWithData: imageDataURLs[0].startsWith('data:'),
          length: imageDataURLs[0].length,
          prefix: imageDataURLs[0].substring(0, 50) + '...'
        });
      }

      // messages 형식으로 content 구성
      // llama.rn은 messages API를 통해 자동으로 LLaVA 템플릿 적용
      const messageContent: any[] = [];

      // 이미지가 있으면 먼저 추가
      if (imageDataURLs && imageDataURLs.length > 0) {
        imageDataURLs.forEach((url) => {
          messageContent.push({
            type: 'image_url',
            image_url: { url },
          });
        });
      }

      // 텍스트 프롬프트 추가
      messageContent.push({
        type: 'text',
        text: prompt,
      });

      console.log('📋 Message content structure:', {
        imageCount: imageDataURLs?.length || 0,
        hasText: true,
        totalContentItems: messageContent.length,
      });
      console.log('⚙️  Completion params:', {
        maxTokens: this.config.maxTokens || 2048,
        temperature: this.config.temperature || 0.7,
        usingMessagesAPI: true,
      });
      console.log('===============================================');

      // llama.rn completion 실행 (messages API 사용, 타임아웃 5분)
      const result = await withTimeout(
        this.context!.completion({
          messages: [
            {
              role: 'user',
              content: messageContent,
            },
          ],
          n_predict: this.config.maxTokens || 2048, // 512 → 2048로 증가
          temperature: this.config.temperature || 0.7,
          top_k: 40,
          top_p: 0.95,
          stop: ['</s>'], // '\n\n\n' 제거 - 너무 일찍 중단됨
        }),
        GENERATION_TIMEOUT_MS,
        '응답 생성 시간 초과 (5분). 프롬프트를 더 짧게 하거나 이미지 개수를 줄여주세요.'
      );

      this.onProgress?.({
        stage: 'completed',
        progress: 100,
        message: '완료',
      });

      const processingTime = Date.now() - startTime;

      console.log('========== Generation Result Debug ==========');
      console.log(`⏱️  Processing time: ${processingTime}ms`);
      console.log('📊 Result stats:', {
        tokenCount: result.tokens?.length,
        textLength: result.text.length,
      });
      console.log('📄 Generated text (first 200 chars):');
      console.log(result.text.substring(0, 200));
      console.log('============================================');

      // 빈 응답 체크
      const responseText = result.text.trim();
      if (!responseText) {
        throw new Error(
          '모델이 빈 응답을 생성했습니다. 프롬프트를 수정하거나 다시 시도해주세요.'
        );
      }

      return {
        text: responseText,
        processingTime,
        modelUsed: this.name,
        tokenCount: result.tokens?.length,
      };
    } catch (error: any) {
      console.error('Generation failed:', error);

      // 에러 타입별로 다른 메시지 제공
      if (error.message.includes('시간 초과')) {
        throw error; // 타임아웃 메시지
      } else if (error.message.includes('메모리')) {
        throw new Error(
          '메모리 부족: 디바이스 RAM이 부족합니다. 다른 앱을 종료하고 다시 시도해주세요.'
        );
      } else if (error.message.includes('너무')) {
        throw error; // 입력 크기 관련 메시지
      } else {
        throw new Error(
          `분석 실패: ${error.message}\n\n앱을 재시작하거나 설정을 조정해주세요.`
        );
      }
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
