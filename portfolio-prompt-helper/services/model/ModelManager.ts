/**
 * ModelManager
 * 로컬 LLM 모델의 다운로드, 설치, 삭제를 관리
 */

import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { getModelConfig, getTotalModelSize } from '@/constants/models';
import { InstalledModel, LLMModelType } from '@/types/model';
import { useModelStore } from '@/store/modelStore';

export class ModelManager {
  /**
   * 모델 저장 디렉토리
   */
  private static MODELS_DIR = `${FileSystem.documentDirectory}models/`;

  /**
   * 모델 디렉토리 초기화
   */
  static async initialize(): Promise<void> {
    const dirInfo = await FileSystem.getInfoAsync(this.MODELS_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.MODELS_DIR, { intermediates: true });
    }
  }

  /**
   * 모델 다운로드 및 설치
   *
   * @param modelId 모델 ID
   * @param onProgress 진행률 콜백 (0-100)
   * @returns 설치된 모델 정보
   */
  static async downloadModel(
    modelId: LLMModelType,
    onProgress?: (progress: number) => void
  ): Promise<InstalledModel> {
    const config = getModelConfig(modelId);
    const modelStore = useModelStore.getState();

    await this.initialize();

    const totalSize = config.files.model.size + config.files.mmproj.size;
    let downloadedBytes = 0;

    try {
      // 다운로드 시작
      modelStore.setDownloadState({
        modelId,
        status: 'downloading',
        progress: 0,
        downloadedBytes: 0,
        totalBytes: totalSize,
      });

      // 1. 모델 파일 다운로드
      const modelPath = await this.downloadFileWithProgress(
        config.files.model.url,
        `${this.MODELS_DIR}${config.files.model.name}`,
        (downloaded) => {
          downloadedBytes = downloaded;
          const totalProgress = (downloadedBytes / totalSize) * 100;

          modelStore.setDownloadState({
            modelId,
            status: 'downloading',
            progress: totalProgress,
            downloadedBytes,
            totalBytes: totalSize,
          });

          onProgress?.(totalProgress);
        }
      );

      // 2. mmproj 파일 다운로드
      const mmprojPath = await this.downloadFileWithProgress(
        config.files.mmproj.url,
        `${this.MODELS_DIR}${config.files.mmproj.name}`,
        (downloaded) => {
          downloadedBytes = config.files.model.size + downloaded;
          const totalProgress = (downloadedBytes / totalSize) * 100;

          modelStore.setDownloadState({
            modelId,
            status: 'downloading',
            progress: totalProgress,
            downloadedBytes,
            totalBytes: totalSize,
          });

          onProgress?.(totalProgress);
        }
      );

      // 3. 설치 정보 저장
      const installedModel: InstalledModel = {
        modelId,
        installedAt: new Date().toISOString(),
        version: '1.5',
        files: {
          modelPath,
          mmprojPath,
        },
        diskUsage: totalSize,
      };

      await modelStore.setInstalledModel(installedModel);

      // 다운로드 완료
      modelStore.setDownloadState({
        modelId,
        status: 'completed',
        progress: 100,
        downloadedBytes: totalSize,
        totalBytes: totalSize,
      });

      return installedModel;
    } catch (error: any) {
      // 다운로드 실패
      modelStore.setDownloadState({
        modelId,
        status: 'failed',
        progress: 0,
        downloadedBytes: 0,
        totalBytes: totalSize,
        error: error.message,
      });

      // 실패 시 부분 다운로드 파일 정리
      await this.cleanupPartialDownload(modelId);

      throw new Error(`모델 다운로드 실패: ${error.message}`);
    }
  }

  /**
   * 파일 다운로드 with 진행률
   */
  private static async downloadFileWithProgress(
    url: string,
    destination: string,
    onProgress?: (downloadedBytes: number) => void
  ): Promise<string> {
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      destination,
      {},
      (downloadProgress) => {
        const downloaded = downloadProgress.totalBytesWritten;
        onProgress?.(downloaded);
      }
    );

    const result = await downloadResumable.downloadAsync();
    if (!result) {
      throw new Error('Download failed');
    }

    return result.uri;
  }

  /**
   * 모델 삭제
   */
  static async deleteModel(modelId: LLMModelType): Promise<void> {
    const modelStore = useModelStore.getState();
    const installed = modelStore.installedModel;

    if (!installed || installed.modelId !== modelId) {
      throw new Error('모델이 설치되어 있지 않습니다');
    }

    try {
      // 파일 삭제
      await FileSystem.deleteAsync(installed.files.modelPath, { idempotent: true });
      await FileSystem.deleteAsync(installed.files.mmprojPath, { idempotent: true });

      // 상태 업데이트
      await modelStore.setInstalledModel(null);
    } catch (error: any) {
      throw new Error(`모델 삭제 실패: ${error.message}`);
    }
  }

  /**
   * 부분 다운로드 파일 정리
   */
  private static async cleanupPartialDownload(modelId: LLMModelType): Promise<void> {
    try {
      const config = getModelConfig(modelId);

      const modelPath = `${this.MODELS_DIR}${config.files.model.name}`;
      const mmprojPath = `${this.MODELS_DIR}${config.files.mmproj.name}`;

      await FileSystem.deleteAsync(modelPath, { idempotent: true });
      await FileSystem.deleteAsync(mmprojPath, { idempotent: true });
    } catch (error) {
      console.warn('Failed to cleanup partial download:', error);
    }
  }

  /**
   * 사용 가능한 저장 공간 확인 (bytes)
   */
  static async getAvailableStorage(): Promise<number> {
    if (Platform.OS === 'web') {
      return Infinity;
    }

    try {
      const freeDiskStorage = await FileSystem.getFreeDiskStorageAsync();
      return freeDiskStorage;
    } catch (error) {
      console.error('Failed to get available storage:', error);
      return 0;
    }
  }

  /**
   * 모델 다운로드에 충분한 공간이 있는지 확인
   */
  static async hasEnoughStorage(modelId: LLMModelType): Promise<boolean> {
    const requiredSize = getTotalModelSize(modelId);
    const availableSize = await this.getAvailableStorage();

    // 10% 여유 공간 추가
    const requiredWithBuffer = requiredSize * 1.1;

    return availableSize >= requiredWithBuffer;
  }

  /**
   * 모델 파일이 실제로 존재하는지 확인
   */
  static async verifyModelFiles(model: InstalledModel): Promise<boolean> {
    try {
      const modelInfo = await FileSystem.getInfoAsync(model.files.modelPath);
      const mmprojInfo = await FileSystem.getInfoAsync(model.files.mmprojPath);

      return modelInfo.exists && mmprojInfo.exists;
    } catch (error) {
      console.error('Failed to verify model files:', error);
      return false;
    }
  }

  /**
   * 모델 디렉토리 사용량 계산
   */
  static async getModelDirectorySize(): Promise<number> {
    try {
      await this.initialize();

      const dirInfo = await FileSystem.getInfoAsync(this.MODELS_DIR);
      if (!dirInfo.exists) {
        return 0;
      }

      // 디렉토리 내 파일들의 크기 합산
      const files = await FileSystem.readDirectoryAsync(this.MODELS_DIR);
      let totalSize = 0;

      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(`${this.MODELS_DIR}${file}`);
        if (fileInfo.exists && !fileInfo.isDirectory) {
          totalSize += fileInfo.size || 0;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to calculate directory size:', error);
      return 0;
    }
  }
}
