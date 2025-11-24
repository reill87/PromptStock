import { LLMMode } from './llm';

/**
 * 종목 보유 정보
 */
export interface StockHolding {
  name: string;       // 종목명
  ratio?: number;     // 비중 (%)
  value?: number;     // 평가금액
}

/**
 * 포트폴리오 스냅샷 정보
 * 시간에 따른 포트폴리오 변화 추적을 위한 수치 데이터
 */
export interface PortfolioSnapshot {
  totalValue?: number;           // 총 평가금액
  stockCount?: number;            // 종목 수
  topHoldings?: StockHolding[];   // 상위 종목 목록
}

/**
 * 분석 기록
 * LLM을 사용한 포트폴리오 분석 결과를 저장
 */
export interface Analysis {
  id: string;
  createdAt: string;
  updatedAt: string;
  templateName: string;
  generatedPrompt: string;
  imageCount: number; // Number of images used
  images?: string[]; // Base64 encoded images
  thumbnails?: string[]; // Base64 encoded thumbnails for performance
  userNote?: string;
  tags: string[];
  llmMode?: LLMMode; // Mode used for analysis (clipboard or local) - deprecated
  aiResponse?: string; // Optional AI response after using the prompt

  // 포트폴리오 스냅샷 (선택적)
  snapshot?: PortfolioSnapshot;

  // 비교 분석 메타데이터
  comparedWith?: string[];  // 이 분석과 비교한 다른 분석 ID 목록
}
