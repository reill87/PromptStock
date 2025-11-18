/**
 * LLMModeSwitcher
 * LLM 실행 방식을 선택하는 컴포넌트
 * 클립보드 / 로컬 AI 모드 전환
 */

import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@/store/settingsStore';
import { useModelStore } from '@/store/modelStore';
import { LLMMode } from '@/types/llm';

interface ModeOption {
  mode: LLMMode;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  badge?: string;
}

export function LLMModeSwitcher() {
  const llmMode = useSettingsStore((state) => state.llmConfig.mode);
  const setLLMMode = useSettingsStore((state) => state.setLLMMode);
  const installedModel = useModelStore((state) => state.installedModel);

  const modes: ModeOption[] = [
    {
      mode: 'clipboard',
      icon: 'clipboard-outline',
      label: '클립보드 복사',
      description: '빠르고 가벼움',
    },
    {
      mode: 'local',
      icon: 'phone-portrait-outline',
      label: '로컬 AI 분석',
      description: '오프라인 사용 가능',
      badge: installedModel ? undefined : '다운로드 필요',
    },
  ];

  const handleModeSelect = async (mode: LLMMode) => {
    // 로컬 모드 선택 시 모델 설치 확인
    if (mode === 'local' && !installedModel) {
      // 모델이 설치되지 않았으면 모드 변경하지 않음
      // UI에서 다운로드 섹션으로 유도
      return;
    }

    await setLLMMode(mode);
  };

  return (
    <View className="space-y-2">
      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        LLM 실행 방식
      </Text>

      {modes.map(({ mode, icon, label, description, badge }) => {
        const isSelected = llmMode === mode;
        const isDisabled = mode === 'local' && !installedModel;

        return (
          <Pressable
            key={mode}
            onPress={() => handleModeSelect(mode)}
            disabled={isDisabled}
            className={`
              p-4 rounded-lg border-2 flex-row items-center
              ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : isDisabled
                  ? 'border-gray-200 dark:border-gray-700 opacity-50'
                  : 'border-gray-200 dark:border-gray-700'
              }
            `}
          >
            <Ionicons
              name={icon}
              size={24}
              color={isSelected ? '#3B82F6' : isDisabled ? '#9CA3AF' : '#6B7280'}
            />

            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <Text
                  className={`font-semibold ${
                    isSelected
                      ? 'text-blue-600 dark:text-blue-400'
                      : isDisabled
                      ? 'text-gray-400'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {label}
                </Text>
                {badge && (
                  <View className="ml-2 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 rounded">
                    <Text className="text-xs text-orange-700 dark:text-orange-300">
                      {badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </Text>
            </View>

            {isSelected && (
              <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
