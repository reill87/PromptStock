/**
 * DeviceCapabilityChecker
 * 디바이스가 로컬 LLM을 실행할 수 있는지 확인
 */

import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as FileSystem from 'expo-file-system/legacy';
import { ModelConfig } from '@/types/model';

/**
 * 디바이스 호환성 체크 결과
 */
export interface DeviceCapability {
  /** 전체 호환 여부 */
  isCompatible: boolean;

  /** 개별 체크 결과 */
  checks: {
    platform: { passed: boolean; message: string };
    ram: { passed: boolean; message: string; value?: number };
    storage: { passed: boolean; message: string; value?: number };
    osVersion: { passed: boolean; message: string; value?: string };
  };

  /** 경고 메시지 */
  warnings: string[];
}

/**
 * 디바이스 호환성 체커
 */
export class DeviceCapabilityChecker {
  /**
   * 모델 실행 가능 여부 종합 체크
   *
   * @param modelConfig 모델 설정
   * @returns 호환성 체크 결과
   */
  static async checkCompatibility(modelConfig: ModelConfig): Promise<DeviceCapability> {
    // 개별 체크 실행
    const checks = {
      platform: await this.checkPlatform(),
      ram: await this.checkRAM(modelConfig.requirements.minRAM),
      storage: await this.checkStorage(modelConfig.requirements.minStorage),
      osVersion: await this.checkOSVersion(modelConfig.requirements.minOSVersion),
    };

    // 경고 메시지 수집
    const warnings: string[] = [];

    // 배터리 경고
    if (modelConfig.performance.batteryImpact === 'high') {
      warnings.push('⚠️ 배터리 소모가 클 수 있습니다. 충전 중 사용을 권장합니다.');
    }

    // 처리 시간 경고
    if (modelConfig.performance.avgImageProcessingTime > 5) {
      warnings.push(
        `⏱️ 이미지 분석에 약 ${modelConfig.performance.avgImageProcessingTime}초가 소요됩니다.`
      );
    }

    // 저장 공간 경고
    const totalSize = modelConfig.files.model.size + modelConfig.files.mmproj.size;
    const sizeGB = (totalSize / (1024 ** 3)).toFixed(1);
    warnings.push(`💾 모델 다운로드 시 약 ${sizeGB}GB의 저장 공간이 필요합니다.`);

    // 전체 호환 여부 판단
    const isCompatible = Object.values(checks).every((check) => check.passed);

    return {
      isCompatible,
      checks,
      warnings,
    };
  }

  /**
   * 플랫폼 체크 (Web 제외)
   */
  private static async checkPlatform(): Promise<{
    passed: boolean;
    message: string;
  }> {
    if (Platform.OS === 'web') {
      return {
        passed: false,
        message: '❌ 웹 플랫폼에서는 로컬 LLM이 지원되지 않습니다.',
      };
    }

    return {
      passed: true,
      message: `✅ ${Platform.OS === 'ios' ? 'iOS' : 'Android'} 플랫폼 지원`,
    };
  }

  /**
   * RAM 체크
   */
  private static async checkRAM(
    minRAM: number
  ): Promise<{ passed: boolean; message: string; value?: number }> {
    try {
      const totalMemory = await DeviceInfo.getTotalMemory();
      const totalMemoryGB = totalMemory / (1024 ** 3);

      const passed = totalMemoryGB >= minRAM;

      return {
        passed,
        message: passed
          ? `✅ RAM: ${totalMemoryGB.toFixed(1)}GB (충분)`
          : `❌ RAM: ${totalMemoryGB.toFixed(1)}GB (최소 ${minRAM}GB 필요)`,
        value: totalMemoryGB,
      };
    } catch (error) {
      console.error('Failed to check RAM:', error);
      return {
        passed: false,
        message: '❓ RAM 정보를 가져올 수 없습니다.',
      };
    }
  }

  /**
   * 저장 공간 체크
   */
  private static async checkStorage(
    minStorageGB: number
  ): Promise<{ passed: boolean; message: string; value?: number }> {
    try {
      const freeStorage = await FileSystem.getFreeDiskStorageAsync();
      const freeStorageGB = freeStorage / (1024 ** 3);

      const passed = freeStorageGB >= minStorageGB;

      return {
        passed,
        message: passed
          ? `✅ 저장공간: ${freeStorageGB.toFixed(1)}GB 사용 가능`
          : `❌ 저장공간: ${freeStorageGB.toFixed(1)}GB (최소 ${minStorageGB}GB 필요)`,
        value: freeStorageGB,
      };
    } catch (error) {
      console.error('Failed to check storage:', error);
      return {
        passed: false,
        message: '❓ 저장공간 정보를 가져올 수 없습니다.',
      };
    }
  }

  /**
   * OS 버전 체크
   */
  private static async checkOSVersion(minVersion: {
    ios?: string;
    android?: number;
  }): Promise<{ passed: boolean; message: string; value?: string }> {
    try {
      const systemVersion = await DeviceInfo.getSystemVersion();

      if (Platform.OS === 'ios') {
        const minIOS = minVersion.ios || '15.0';
        const currentVersion = parseFloat(systemVersion);
        const requiredVersion = parseFloat(minIOS);
        const passed = currentVersion >= requiredVersion;

        return {
          passed,
          message: passed
            ? `✅ iOS ${systemVersion} (호환)`
            : `❌ iOS ${systemVersion} (최소 ${minIOS} 필요)`,
          value: systemVersion,
        };
      } else if (Platform.OS === 'android') {
        const apiLevel = await DeviceInfo.getApiLevel();
        const minAPI = minVersion.android || 24;
        const passed = apiLevel >= minAPI;

        return {
          passed,
          message: passed
            ? `✅ Android API ${apiLevel} (호환)`
            : `❌ Android API ${apiLevel} (최소 API ${minAPI} 필요)`,
          value: apiLevel.toString(),
        };
      }

      return {
        passed: false,
        message: '❌ 지원되지 않는 플랫폼',
      };
    } catch (error) {
      console.error('Failed to check OS version:', error);
      return {
        passed: false,
        message: '❓ OS 버전 정보를 가져올 수 없습니다.',
      };
    }
  }

  /**
   * 빠른 호환성 체크 (간단한 버전)
   * 자세한 정보 없이 가능/불가능만 반환
   */
  static async quickCheck(modelConfig: ModelConfig): Promise<boolean> {
    const result = await this.checkCompatibility(modelConfig);
    return result.isCompatible;
  }

  /**
   * 현재 디바이스 정보 가져오기 (디버그용)
   */
  static async getDeviceInfo(): Promise<{
    platform: string;
    osVersion: string;
    totalRAM: number;
    freeStorage: number;
    deviceModel: string;
  }> {
    try {
      const totalMemory = await DeviceInfo.getTotalMemory();
      const freeStorage = await FileSystem.getFreeDiskStorageAsync();
      const systemVersion = await DeviceInfo.getSystemVersion();
      const deviceModel = await DeviceInfo.getModel();

      return {
        platform: Platform.OS,
        osVersion: systemVersion,
        totalRAM: totalMemory / (1024 ** 3), // GB
        freeStorage: freeStorage / (1024 ** 3), // GB
        deviceModel,
      };
    } catch (error) {
      console.error('Failed to get device info:', error);
      throw new Error('디바이스 정보를 가져올 수 없습니다');
    }
  }
}
