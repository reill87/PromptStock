/**
 * ModelDownloader
 * 로컬 AI 모델 다운로드 및 관리 컴포넌트
 */

import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useModelStore } from '@/store/modelStore';
import { useUIStore } from '@/store/uiStore';
import { DEFAULT_MODEL, formatBytes, getTotalModelSize } from '@/constants/models';
import { ModelManager } from '@/services/model/ModelManager';
import { SUPPORTED_MODELS } from '@/constants/models';

export function ModelDownloader() {
  const installedModel = useModelStore((state) => state.installedModel);
  const downloadState = useModelStore((state) => state.downloadState);
  const showToast = useUIStore((state) => state.showToast);

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = async () => {
    try {
      // 저장 공간 체크
      const hasEnough = await ModelManager.hasEnoughStorage(DEFAULT_MODEL);
      if (!hasEnough) {
        showToast('error', '저장 공간이 부족합니다');
        return;
      }

      await ModelManager.downloadModel(DEFAULT_MODEL, (progress) => {
        console.log(`Download progress: ${progress.toFixed(1)}%`);
      });

      showToast('success', '모델 다운로드 완료!');
    } catch (error: any) {
      showToast('error', `다운로드 실패: ${error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!installedModel) return;

    try {
      setIsDeleting(true);
      await ModelManager.deleteModel(installedModel.modelId);
      showToast('success', '모델이 삭제되었습니다');
    } catch (error: any) {
      showToast('error', `삭제 실패: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // 설치된 모델이 있는 경우
  if (installedModel) {
    const config = SUPPORTED_MODELS[installedModel.modelId];

    return (
      <View className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <View className="flex-row items-center mb-2">
          <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          <Text className="ml-2 font-semibold text-green-700 dark:text-green-300">
            모델 설치됨
          </Text>
        </View>

        <Text className="text-sm text-gray-700 dark:text-gray-300 mb-1">
          {config.displayName}
        </Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          크기: {formatBytes(installedModel.diskUsage)}
        </Text>

        <Pressable
          onPress={handleDelete}
          disabled={isDeleting}
          className="bg-red-500 py-2 px-4 rounded-lg flex-row items-center justify-center"
        >
          {isDeleting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={16} color="white" />
              <Text className="text-white font-semibold ml-2">삭제</Text>
            </>
          )}
        </Pressable>
      </View>
    );
  }

  const config = SUPPORTED_MODELS[DEFAULT_MODEL];
  const totalSize = getTotalModelSize(DEFAULT_MODEL);
  const isDownloading = downloadState?.status === 'downloading';

  return (
    <View className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <Text className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
        로컬 AI 모델 다운로드
      </Text>

      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {config.description}
      </Text>

      <View className="space-y-1 mb-4">
        <View className="flex-row items-center">
          <Ionicons name="download-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            크기: {formatBytes(totalSize)}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            처리 속도: 약 {config.performance.avgImageProcessingTime}초/이미지
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="wifi-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            Wi-Fi 연결 권장
          </Text>
        </View>
      </View>

      {isDownloading && downloadState ? (
        <View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              다운로드 중... {downloadState.progress.toFixed(0)}%
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {formatBytes(downloadState.downloadedBytes)} /{' '}
              {formatBytes(downloadState.totalBytes)}
            </Text>
          </View>

          <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <View
              className="h-full bg-blue-500"
              style={{ width: `${downloadState.progress}%` }}
            />
          </View>

          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            백그라운드에서 계속 다운로드됩니다
          </Text>
        </View>
      ) : (
        <Pressable
          onPress={handleDownload}
          className="bg-blue-500 py-3 px-4 rounded-lg flex-row items-center justify-center"
        >
          <Ionicons name="download-outline" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">다운로드 시작</Text>
        </Pressable>
      )}
    </View>
  );
}
