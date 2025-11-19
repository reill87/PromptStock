import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSettingsStore, ImageQuality, ThemeMode } from '@/store/settingsStore';
import { useModelStore } from '@/store/modelStore';
import { DEFAULT_TEMPLATES } from '@/constants/templates';
import { useUIStore } from '@/store/uiStore';
import { useTheme } from '@/hooks/useTheme';
import {
  exportData,
  importData,
  clearAllData,
  getDataSize,
} from '@/utils/dataManagement';
import { getStorageStats } from '@/utils/storage';
import { getCustomTemplateStats } from '@/utils/templateStorage';
import Slider from '@react-native-community/slider';

export default function SettingsScreen() {
  const {
    defaultTemplateId,
    imageQuality,
    enableHaptics,
    appVersion,
    llmConfig,
    setDefaultTemplate,
    setImageQuality,
    setEnableHaptics,
    setLocalLLMConfig,
    setShowBatteryWarning,
    setShowStorageWarning,
    loadSettings,
    resetSettings,
  } = useSettingsStore();

  const { installedModel } = useModelStore();
  const { showToast } = useUIStore();
  const { themeMode, setTheme, isDark } = useTheme();

  const [dataStats, setDataStats] = useState({
    totalAnalyses: 0,
    totalTags: 0,
    sizeInKB: 0,
  });
  const [customTemplateCount, setCustomTemplateCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    loadSettings();
    loadDataStats();
  }, []);

  const loadDataStats = async () => {
    setIsLoadingStats(true);
    try {
      const [storageStats, dataSize, customStats] = await Promise.all([
        getStorageStats(),
        getDataSize(),
        getCustomTemplateStats(),
      ]);

      setDataStats({
        totalAnalyses: storageStats.totalAnalyses,
        totalTags: storageStats.totalTags,
        sizeInKB: dataSize.sizeInKB,
      });
      setCustomTemplateCount(customStats.totalCustom);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleExport = async () => {
    try {
      const result = await exportData();
      if (result.success) {
        showToast('success', result.message);
      } else {
        showToast('error', result.message);
      }
    } catch (error) {
      showToast('error', '데이터 내보내기에 실패했습니다.');
    }
  };

  const handleImport = async () => {
    try {
      const result = await importData();
      if (result.success) {
        showToast('success', result.message);
        loadDataStats(); // Refresh stats
      } else {
        showToast('error', result.message);
      }
    } catch (error) {
      showToast('error', '데이터 가져오기에 실패했습니다.');
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      '모든 데이터 삭제',
      '모든 분석 데이터와 설정이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            const result = await clearAllData();
            if (result.success) {
              showToast('success', result.message);
              loadDataStats();
              await resetSettings();
            } else {
              showToast('error', result.message);
            }
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert('설정 초기화', '모든 설정을 기본값으로 되돌립니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '초기화',
        onPress: async () => {
          await resetSettings();
          showToast('success', '설정이 초기화되었습니다.');
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-dark-bg-secondary">
      {/* Template Settings */}
      <View className="bg-white dark:bg-dark-bg-primary mt-4 px-4 py-3 border-b border-gray-200 dark:border-dark-border">
        <Text className="text-xs font-semibold text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wide mb-3">
          템플릿 설정
        </Text>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            기본 템플릿
          </Text>
          <Text className="text-xs text-gray-500 mb-3">
            새 분석 시 자동으로 선택될 템플릿입니다
          </Text>

          {DEFAULT_TEMPLATES.map((template) => (
            <TouchableOpacity
              key={template.id}
              onPress={() => setDefaultTemplate(template.id)}
              className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center flex-1">
                <Text className="text-xl mr-3">{template.icon}</Text>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-900">
                    {template.name}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {template.description}
                  </Text>
                </View>
              </View>
              {defaultTemplateId === template.id && (
                <Ionicons name="checkmark-circle" size={22} color="#3B82F6" />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => setDefaultTemplate(null)}
            className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center flex-1">
              <Ionicons name="close-circle-outline" size={24} color="#6B7280" />
              <Text className="text-sm font-medium text-gray-700 ml-3">
                기본 템플릿 없음
              </Text>
            </View>
            {defaultTemplateId === null && (
              <Ionicons name="checkmark-circle" size={22} color="#3B82F6" />
            )}
          </TouchableOpacity>

          {/* Custom Templates Management */}
          <TouchableOpacity
            onPress={() => router.push('/custom-templates')}
            className="flex-row items-center justify-between py-4 mt-3 bg-blue-50 rounded-lg px-4">
            <View className="flex-row items-center flex-1">
              <Ionicons name="create-outline" size={24} color="#3B82F6" />
              <View className="ml-3 flex-1">
                <Text className="text-sm font-semibold text-blue-700">
                  커스텀 템플릿 관리
                </Text>
                <Text className="text-xs text-blue-600 mt-0.5">
                  나만의 프롬프트 템플릿 만들기 · {customTemplateCount}개 생성됨
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Settings */}
      <View className="bg-white mt-4 px-4 py-3 border-b border-gray-200">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          이미지 설정
        </Text>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            이미지 품질
          </Text>
          <Text className="text-xs text-gray-500 mb-3">
            높은 품질은 더 많은 저장 공간을 사용합니다
          </Text>

          {(['low', 'medium', 'high'] as ImageQuality[]).map((quality) => (
            <TouchableOpacity
              key={quality}
              onPress={() => setImageQuality(quality)}
              className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View>
                <Text className="text-sm font-medium text-gray-900">
                  {quality === 'low' && '낮음 (빠름)'}
                  {quality === 'medium' && '보통 (권장)'}
                  {quality === 'high' && '높음 (느림)'}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {quality === 'low' && '압축률: 0.3'}
                  {quality === 'medium' && '압축률: 0.7'}
                  {quality === 'high' && '압축률: 1.0'}
                </Text>
              </View>
              {imageQuality === quality && (
                <Ionicons name="checkmark-circle" size={22} color="#3B82F6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* LLM Settings */}
      {Platform.OS !== 'web' && (
        <View className="bg-white mt-4 px-4 py-3 border-b border-gray-200">
          <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            로컬 AI 설정
          </Text>

          {/* Model Status */}
          <View className="bg-blue-50 rounded-lg p-4 mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-xs text-gray-600 mb-1">설치된 모델</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {installedModel
                    ? installedModel.modelId
                    : '모델 미설치'}
                </Text>
                {installedModel && (
                  <Text className="text-xs text-gray-500 mt-1">
                    {(
                      (installedModel.files.modelSize +
                        installedModel.files.mmprojSize) /
                      1024 /
                      1024 /
                      1024
                    ).toFixed(1)}{' '}
                    GB
                  </Text>
                )}
              </View>
              {installedModel && (
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              )}
            </View>
          </View>

          {/* Temperature Setting */}
          <View className="py-3 border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900">
                  Temperature
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  창의성 조절 (낮음: 일관성, 높음: 창의성)
                </Text>
              </View>
              <Text className="text-sm font-bold text-blue-600">
                {llmConfig.localConfig?.temperature?.toFixed(2) || '0.70'}
              </Text>
            </View>
            <Slider
              value={llmConfig.localConfig?.temperature || 0.7}
              onValueChange={(value) =>
                setLocalLLMConfig({ temperature: value })
              }
              minimumValue={0.0}
              maximumValue={1.0}
              step={0.05}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#D1D5DB"
              thumbTintColor="#3B82F6"
            />
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-400">0.0</Text>
              <Text className="text-xs text-gray-400">1.0</Text>
            </View>
          </View>

          {/* Max Tokens Setting */}
          <View className="py-3 border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900">
                  Max Tokens
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  최대 응답 길이 (높을수록 긴 응답)
                </Text>
              </View>
              <Text className="text-sm font-bold text-blue-600">
                {llmConfig.localConfig?.maxTokens || 512}
              </Text>
            </View>
            <Slider
              value={llmConfig.localConfig?.maxTokens || 512}
              onValueChange={(value) =>
                setLocalLLMConfig({ maxTokens: Math.round(value) })
              }
              minimumValue={128}
              maximumValue={2048}
              step={128}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#D1D5DB"
              thumbTintColor="#3B82F6"
            />
            <View className="flex-row justify-between">
              <Text className="text-xs text-gray-400">128</Text>
              <Text className="text-xs text-gray-400">2048</Text>
            </View>
          </View>

          {/* Context Size Setting */}
          <View className="py-3 border-b border-gray-100">
            <Text className="text-sm font-medium text-gray-900 mb-2">
              Context Size
            </Text>
            <Text className="text-xs text-gray-500 mb-3">
              컨텍스트 창 크기 (높을수록 메모리 사용 증가)
            </Text>

            {[1024, 2048, 4096].map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setLocalLLMConfig({ contextSize: size })}
                className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-900">{size}</Text>
                  {size > 2048 && (
                    <View className="ml-2 bg-orange-100 px-2 py-0.5 rounded">
                      <Text className="text-xs font-semibold text-orange-700">
                        메모리 많이 사용
                      </Text>
                    </View>
                  )}
                </View>
                {(llmConfig.localConfig?.contextSize || 2048) === size && (
                  <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Warning Settings */}
          <View className="py-3 border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900">
                  배터리 경고 표시
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  로컬 AI 사용 시 배터리 소모 경고
                </Text>
              </View>
              <Switch
                value={llmConfig.localConfig?.showBatteryWarning ?? true}
                onValueChange={setShowBatteryWarning}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={
                  llmConfig.localConfig?.showBatteryWarning ?? true
                    ? '#3B82F6'
                    : '#F3F4F6'
                }
              />
            </View>
          </View>

          <View className="py-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900">
                  저장 공간 경고 표시
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  모델 다운로드 시 저장 공간 경고
                </Text>
              </View>
              <Switch
                value={llmConfig.localConfig?.showStorageWarning ?? true}
                onValueChange={setShowStorageWarning}
                trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
                thumbColor={
                  llmConfig.localConfig?.showStorageWarning ?? true
                    ? '#3B82F6'
                    : '#F3F4F6'
                }
              />
            </View>
          </View>

          {/* Info Message */}
          <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <View className="flex-row items-start">
              <Ionicons
                name="information-circle"
                size={20}
                color="#D97706"
                style={{ marginTop: 2 }}
              />
              <Text className="text-xs text-yellow-800 ml-2 flex-1">
                로컬 AI는 iOS/Android에서만 사용 가능합니다. 높은 설정값은 더 나은
                결과를 제공하지만 배터리와 메모리를 더 많이 사용합니다.
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Theme Settings */}
      <View className="bg-white mt-4 px-4 py-3 border-b border-gray-200">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          테마 설정
        </Text>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            앱 테마
          </Text>
          <Text className="text-xs text-gray-500 mb-3">
            앱의 밝기 모드를 선택하세요
          </Text>

          {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setTheme(mode)}
              className="flex-row items-center justify-between py-3 border-b border-gray-100">
              <View className="flex-row items-center">
                <Ionicons
                  name={
                    mode === 'light'
                      ? 'sunny'
                      : mode === 'dark'
                      ? 'moon'
                      : 'phone-portrait-outline'
                  }
                  size={22}
                  color={themeMode === mode ? '#3B82F6' : '#6B7280'}
                />
                <View className="ml-3">
                  <Text className="text-sm font-medium text-gray-900">
                    {mode === 'light' && '라이트 모드'}
                    {mode === 'dark' && '다크 모드'}
                    {mode === 'system' && '시스템 설정'}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    {mode === 'light' && '항상 밝은 테마 사용'}
                    {mode === 'dark' && '항상 어두운 테마 사용'}
                    {mode === 'system' && '기기 설정에 따름'}
                  </Text>
                </View>
              </View>
              {themeMode === mode && (
                <Ionicons name="checkmark-circle" size={22} color="#3B82F6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* App Settings */}
      <View className="bg-white mt-4 px-4 py-3 border-b border-gray-200">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          앱 설정
        </Text>

        <View className="flex-row items-center justify-between py-3">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-900">
              햅틱 피드백
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5">
              터치 시 진동 피드백 제공
            </Text>
          </View>
          <Switch
            value={enableHaptics}
            onValueChange={setEnableHaptics}
            trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
            thumbColor={enableHaptics ? '#3B82F6' : '#F3F4F6'}
          />
        </View>
      </View>

      {/* Data Management */}
      <View className="bg-white mt-4 px-4 py-3 border-b border-gray-200">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          데이터 관리
        </Text>

        {/* Data Statistics */}
        <View className="bg-blue-50 rounded-lg p-4 mb-4">
          {isLoadingStats ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs text-gray-600">저장된 분석</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {dataStats.totalAnalyses}개
                </Text>
              </View>
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs text-gray-600">사용 중인 태그</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {dataStats.totalTags}개
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-600">데이터 크기</Text>
                <Text className="text-sm font-semibold text-gray-900">
                  {dataStats.sizeInKB} KB
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Data Actions */}
        <TouchableOpacity
          onPress={handleExport}
          className="flex-row items-center justify-between py-3 border-b border-gray-100">
          <View className="flex-row items-center flex-1">
            <Ionicons name="download-outline" size={22} color="#3B82F6" />
            <View className="ml-3">
              <Text className="text-sm font-medium text-gray-900">
                데이터 내보내기
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                모든 분석을 JSON 파일로 저장
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleImport}
          className="flex-row items-center justify-between py-3 border-b border-gray-100">
          <View className="flex-row items-center flex-1">
            <Ionicons name="cloud-upload-outline" size={22} color="#3B82F6" />
            <View className="ml-3">
              <Text className="text-sm font-medium text-gray-900">
                데이터 가져오기
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                백업 파일에서 데이터 복원
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleClearAll}
          className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center flex-1">
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
            <View className="ml-3">
              <Text className="text-sm font-medium text-red-600">
                모든 데이터 삭제
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                분석 및 설정 전체 삭제
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View className="bg-white mt-4 px-4 py-3 border-b border-gray-200 mb-8">
        <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          앱 정보
        </Text>

        <View className="py-3 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">버전</Text>
            <Text className="text-sm font-medium text-gray-900">
              {appVersion}
            </Text>
          </View>
        </View>

        <View className="py-3 border-b border-gray-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-600">개발자</Text>
            <Text className="text-sm font-medium text-gray-900">
              Portfolio Helper Team
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleResetSettings}
          className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center flex-1">
            <Ionicons name="refresh-outline" size={22} color="#6B7280" />
            <Text className="text-sm font-medium text-gray-700 ml-3">
              설정 초기화
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
