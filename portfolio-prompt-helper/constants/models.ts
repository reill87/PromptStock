/**
 * 지원하는 로컬 LLM 모델 설정
 */

import { ModelConfig, LLMModelType } from '@/types/model';

/**
 * 지원하는 모델 목록
 */
export const SUPPORTED_MODELS: Record<LLMModelType, ModelConfig> = {
  'smolvlm2-2.2b-q4': {
    id: 'smolvlm2-2.2b-q4',
    displayName: 'SmolVLM2 2.2B Q4 (경량)',
    description: '가볍고 빠른 비전 언어 모델. 한국어 OCR 성능 제한적',

    requirements: {
      minRAM: 3, // GB
      minStorage: 2, // GB
      minOSVersion: {
        ios: '15.0',
        android: 24,
      },
    },

    files: {
      model: {
        name: 'SmolVLM2-2.2B-Instruct-Q4_K_M.gguf',
        url: 'https://huggingface.co/ggml-org/SmolVLM2-2.2B-Instruct-GGUF/resolve/main/SmolVLM2-2.2B-Instruct-Q4_K_M.gguf',
        size: 1_300_000_000, // 1.3GB
        checksum: '',
        required: true,
      },
      mmproj: {
        name: 'mmproj-SmolVLM2-2.2B-Instruct-Q8_0.gguf',
        url: 'https://huggingface.co/ggml-org/SmolVLM2-2.2B-Instruct-GGUF/resolve/main/mmproj-SmolVLM2-2.2B-Instruct-Q8_0.gguf',
        size: 600_000_000, // 600MB
        checksum: '',
        required: true,
      },
    },

    performance: {
      avgImageProcessingTime: 5, // seconds
      avgTokensPerSecond: 20,
      batteryImpact: 'medium',
    },
  },

  'llava-1.5-7b-q4': {
    id: 'llava-1.5-7b-q4',
    displayName: 'LLaVA 1.5 7B Q4 (권장)',
    description: '우수한 한국어 OCR 성능. SmolVLM2보다 정확한 이미지 분석',

    requirements: {
      minRAM: 4, // GB
      minStorage: 5, // GB
      minOSVersion: {
        ios: '15.0',
        android: 24,
      },
    },

    files: {
      model: {
        name: 'llava-v1.5-7b-q4_k_m.gguf',
        // HuggingFace 모델 URL (실제 사용 시 업데이트 필요)
        url: 'https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/ggml-model-q4_k.gguf',
        size: 4_200_000_000, // 4.2GB
        checksum: '', // TODO: 실제 체크섬으로 업데이트
        required: true,
      },
      mmproj: {
        name: 'mmproj-model-f16.gguf',
        url: 'https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/mmproj-model-f16.gguf',
        size: 624_000_000, // 624MB
        checksum: '', // TODO: 실제 체크섬으로 업데이트
        required: true,
      },
    },

    performance: {
      avgImageProcessingTime: 8, // seconds
      avgTokensPerSecond: 15,
      batteryImpact: 'high',
    },
  },

  'llava-1.5-7b-q8': {
    id: 'llava-1.5-7b-q8',
    displayName: 'LLaVA 1.5 7B Q8 (고품질)',
    description: '높은 정확도, 느린 속도. 고성능 디바이스 권장',

    requirements: {
      minRAM: 6, // GB
      minStorage: 8, // GB
      minOSVersion: {
        ios: '15.0',
        android: 24,
      },
    },

    files: {
      model: {
        name: 'llava-v1.5-7b-q8_0.gguf',
        url: 'https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/ggml-model-q8_0.gguf',
        size: 7_800_000_000, // 7.8GB
        checksum: '', // TODO: 실제 체크섬으로 업데이트
        required: true,
      },
      mmproj: {
        name: 'mmproj-model-f16.gguf',
        url: 'https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/mmproj-model-f16.gguf',
        size: 624_000_000, // 624MB
        checksum: '', // TODO: 실제 체크섬으로 업데이트
        required: true,
      },
    },

    performance: {
      avgImageProcessingTime: 12, // seconds
      avgTokensPerSecond: 10,
      batteryImpact: 'high',
    },
  },

  'qwen2.5-vl-7b-q4': {
    id: 'qwen2.5-vl-7b-q4',
    displayName: 'Qwen2.5-VL 7B Q4 (권장)',
    description: '우수한 다국어 지원. 한국어 이미지 분석 성능 최고',

    requirements: {
      minRAM: 4, // GB
      minStorage: 7, // GB
      minOSVersion: {
        ios: '15.0',
        android: 24,
      },
    },

    files: {
      model: {
        name: 'Qwen2.5-VL-7B-Instruct-Q4_K_M.gguf',
        url: 'https://huggingface.co/Mungert/Qwen2.5-VL-7B-Instruct-GGUF/resolve/main/Qwen2.5-VL-7B-Instruct-Q4_K_M.gguf',
        size: 6_200_000_000, // 약 6.2GB
        checksum: '', // TODO: 실제 체크섬으로 업데이트
        required: true,
      },
      mmproj: {
        name: 'Qwen2.5-VL-7B-Instruct-mmproj-f16.gguf',
        url: 'https://huggingface.co/Mungert/Qwen2.5-VL-7B-Instruct-GGUF/resolve/main/Qwen2.5-VL-7B-Instruct-mmproj-f16.gguf',
        size: 600_000_000, // 약 600MB
        checksum: '', // TODO: 실제 체크섬으로 업데이트
        required: true,
      },
    },

    performance: {
      avgImageProcessingTime: 8, // seconds (추정)
      avgTokensPerSecond: 15,
      batteryImpact: 'high',
    },
  },
};

/**
 * 기본 모델 (Qwen2.5-VL - 한국어 OCR 최고)
 */
export const DEFAULT_MODEL: LLMModelType = 'qwen2.5-vl-7b-q4';

/**
 * 모델 ID로 설정 가져오기
 */
export function getModelConfig(modelId: LLMModelType): ModelConfig {
  const config = SUPPORTED_MODELS[modelId];
  if (!config) {
    throw new Error(`Unknown model: ${modelId}`);
  }
  return config;
}

/**
 * 모델 총 크기 계산 (bytes)
 */
export function getTotalModelSize(modelId: LLMModelType): number {
  const config = getModelConfig(modelId);
  return config.files.model.size + config.files.mmproj.size;
}

/**
 * 사람이 읽기 쉬운 크기 포맷
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
