/**
 * 모델 관련 타입 정의
 * 모델 다운로드, 설치, 관리를 위한 타입
 */

import { LLMModelType } from './llm';

/**
 * 모델 파일 정보
 */
export interface ModelFile {
  name: string;
  url: string;
  size: number; // bytes
  checksum: string; // SHA256
  required: boolean;
}

/**
 * 모델 설정
 */
export interface ModelConfig {
  id: LLMModelType;
  displayName: string;
  description: string;

  /** 요구사항 */
  requirements: {
    minRAM: number; // GB
    minStorage: number; // GB
    minOSVersion: {
      ios?: string;
      android?: number;
    };
  };

  /** 파일 */
  files: {
    model: ModelFile;
    mmproj: ModelFile; // Vision projector
  };

  /** 성능 지표 */
  performance: {
    avgImageProcessingTime: number; // seconds
    avgTokensPerSecond: number;
    batteryImpact: 'low' | 'medium' | 'high';
  };
}

/**
 * 모델 다운로드 상태
 */
export interface ModelDownloadState {
  modelId: LLMModelType;
  status: 'idle' | 'downloading' | 'completed' | 'failed';
  progress: number; // 0-100
  downloadedBytes: number;
  totalBytes: number;
  error?: string;
}

/**
 * 설치된 모델 정보
 */
export interface InstalledModel {
  modelId: LLMModelType;
  installedAt: string;
  version: string;
  files: {
    modelPath: string;
    mmprojPath: string;
  };
  diskUsage: number; // bytes
}
