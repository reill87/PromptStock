/**
 * LLM 관련 타입 정의
 * 로컬 LLM 및 클립보드 모드를 위한 공통 인터페이스
 */

/**
 * LLM 실행 모드
 * - clipboard: 프롬프트를 클립보드에 복사 (기본, 기존 방식)
 * - local: 로컬 디바이스에서 LLM 실행 (신규, 옵셔널)
 */
export type LLMMode = 'clipboard' | 'local';

/**
 * 로컬 LLM 모델 타입
 */
export type LLMModelType = 'llava-1.5-7b-q4' | 'llava-1.5-7b-q8';

/**
 * 로컬 LLM 설정
 */
export interface LocalLLMConfig {
  modelType: LLMModelType;
  enableGPU: boolean;
  maxTokens: number;
  temperature: number;
  contextSize: number;
}

/**
 * LLM 설정
 */
export interface LLMConfig {
  mode: LLMMode;
  localConfig?: LocalLLMConfig;
}

/**
 * LLM 응답
 */
export interface LLMResponse {
  text: string;
  processingTime: number; // ms
  modelUsed: string;
  tokenCount?: number;
}

/**
 * LLM 생성 진행 상태
 */
export interface LLMGenerationProgress {
  stage: 'initializing' | 'processing-images' | 'generating' | 'completed';
  progress: number; // 0-100
  message: string;
}

/**
 * LLM 클라이언트 인터페이스
 * 모든 LLM 클라이언트는 이 인터페이스를 구현해야 함
 */
export interface LLMClient {
  /** 클라이언트 이름 */
  name: string;

  /** LLM 모드 */
  mode: LLMMode;

  /** 이미지 지원 여부 */
  supportsImages: boolean;

  /**
   * 클라이언트 초기화
   * 모델 로딩 등의 초기화 작업 수행
   */
  initialize(): Promise<void>;

  /**
   * 프롬프트를 실행하고 응답 생성
   * @param prompt 프롬프트 텍스트
   * @param images 이미지 배열 (base64 인코딩)
   * @returns LLM 응답
   */
  generate(prompt: string, images?: string[]): Promise<LLMResponse>;

  /**
   * 리소스 정리
   * 메모리 해제, 모델 언로드 등
   */
  cleanup(): Promise<void>;

  /**
   * 클라이언트 준비 상태 확인
   * @returns 사용 가능 여부
   */
  isReady(): boolean;
}
