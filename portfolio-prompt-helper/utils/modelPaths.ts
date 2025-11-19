/**
 * 모델 경로 관리 유틸리티
 */

import * as FileSystem from 'expo-file-system';
import { LLMModelType } from '@/types/model';
import { getModelConfig } from '@/constants/models';

/**
 * 모델 루트 디렉토리
 */
export const MODELS_ROOT_DIR = `${FileSystem.documentDirectory}models/`;

/**
 * 모델 파일 경로 가져오기
 */
export function getModelPath(modelId: LLMModelType): string {
  const config = getModelConfig(modelId);
  return `${MODELS_ROOT_DIR}${config.files.model.name}`;
}

/**
 * mmproj 파일 경로 가져오기
 */
export function getMmprojPath(modelId: LLMModelType): string {
  const config = getModelConfig(modelId);
  return `${MODELS_ROOT_DIR}${config.files.mmproj.name}`;
}

/**
 * 모델 디렉토리가 존재하는지 확인
 */
export async function modelsDirectoryExists(): Promise<boolean> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(MODELS_ROOT_DIR);
    return dirInfo.exists;
  } catch {
    return false;
  }
}

/**
 * 모델 디렉토리 생성
 */
export async function ensureModelsDirectory(): Promise<void> {
  const exists = await modelsDirectoryExists();
  if (!exists) {
    await FileSystem.makeDirectoryAsync(MODELS_ROOT_DIR, { intermediates: true });
  }
}
