/**
 * OCR 관련 타입 정의
 */

/**
 * OCR 결과 - 인식된 텍스트 블록
 */
export interface OCRTextBlock {
  text: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * OCR 분석 결과
 */
export interface OCRResult {
  /** 전체 텍스트 (모든 블록 합침) */
  fullText: string;
  /** 개별 텍스트 블록들 */
  blocks: OCRTextBlock[];
  /** 처리 시간 (ms) */
  processingTime: number;
  /** 성공 여부 */
  success: boolean;
  /** 에러 메시지 (실패시) */
  error?: string;
}

/**
 * OCR 진행 상태
 */
export interface OCRProgress {
  stage: 'preparing' | 'processing' | 'completed';
  progress: number; // 0-100
  message: string;
}
