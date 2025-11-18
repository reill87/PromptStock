/**
 * Model Store
 * 로컬 LLM 모델의 설치 상태 및 다운로드 진행 상태 관리
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InstalledModel, ModelDownloadState, LLMModelType } from '@/types/model';

const INSTALLED_MODEL_KEY = '@installed_model';

interface ModelState {
  /** 설치된 모델 정보 */
  installedModel: InstalledModel | null;

  /** 현재 다운로드 상태 */
  downloadState: ModelDownloadState | null;

  /** 설치된 모델 설정 */
  setInstalledModel: (model: InstalledModel | null) => Promise<void>;

  /** 다운로드 상태 업데이트 */
  setDownloadState: (state: ModelDownloadState | null) => void;

  /** 설치된 모델 정보 로드 */
  loadInstalledModel: () => Promise<void>;

  /** 다운로드 상태 초기화 */
  clearDownloadState: () => void;

  /** 모델이 설치되어 있는지 확인 */
  isModelInstalled: (modelId: LLMModelType) => boolean;
}

export const useModelStore = create<ModelState>((set, get) => ({
  installedModel: null,
  downloadState: null,

  setInstalledModel: async (model) => {
    set({ installedModel: model });

    try {
      if (model) {
        await AsyncStorage.setItem(INSTALLED_MODEL_KEY, JSON.stringify(model));
      } else {
        await AsyncStorage.removeItem(INSTALLED_MODEL_KEY);
      }
    } catch (error) {
      console.error('Failed to save installed model:', error);
      throw new Error('모델 정보 저장 실패');
    }
  },

  setDownloadState: (state) => {
    set({ downloadState: state });
  },

  loadInstalledModel: async () => {
    try {
      const data = await AsyncStorage.getItem(INSTALLED_MODEL_KEY);
      if (data) {
        const model = JSON.parse(data) as InstalledModel;
        set({ installedModel: model });
      }
    } catch (error) {
      console.error('Failed to load installed model:', error);
    }
  },

  clearDownloadState: () => {
    set({ downloadState: null });
  },

  isModelInstalled: (modelId) => {
    const { installedModel } = get();
    return installedModel?.modelId === modelId;
  },
}));
