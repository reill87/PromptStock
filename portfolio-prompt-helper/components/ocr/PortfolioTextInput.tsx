/**
 * PortfolioTextInput
 * OCR로 추출된 포트폴리오 텍스트를 표시하고 수정할 수 있는 컴포넌트
 */

import { View, Text, TextInput, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { OCRResult } from '@/types/ocr';
import { Card } from '@/components/common/Card';

interface PortfolioTextInputProps {
  /** OCR 결과 */
  ocrResult: OCRResult | null;
  /** 텍스트 변경 시 콜백 */
  onTextChange?: (text: string) => void;
  /** 분석 시작 콜백 */
  onAnalyze?: (text: string) => void;
  /** 초기화 콜백 */
  onReset?: () => void;
}

export function PortfolioTextInput({
  ocrResult,
  onTextChange,
  onAnalyze,
  onReset,
}: PortfolioTextInputProps) {
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // OCR 결과가 업데이트되면 텍스트 자동 설정
  useEffect(() => {
    if (ocrResult?.success && ocrResult.fullText) {
      setText(ocrResult.fullText);
      onTextChange?.(ocrResult.fullText);
    }
  }, [ocrResult]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    onTextChange?.(newText);
  };

  const handleAnalyze = () => {
    if (text.trim()) {
      onAnalyze?.(text.trim());
    }
  };

  const handleReset = () => {
    setText('');
    setIsEditing(false);
    onReset?.();
  };

  // OCR 결과가 없고 텍스트도 비어있으면 표시 안함
  if (!ocrResult && !text) {
    return null;
  }

  const hasText = text.trim().length > 0;
  const charCount = text.length;

  return (
    <Card variant="outlined" className="mt-4">
      <View className="mb-3">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="document-text" size={20} color="#3B82F6" />
            <Text className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
              추출된 텍스트
            </Text>
          </View>

          {hasText && (
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {charCount}자
            </Text>
          )}
        </View>

        {ocrResult && !ocrResult.success && (
          <View className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
            <Text className="text-xs text-red-700 dark:text-red-300">
              {ocrResult.error || 'OCR 처리 실패'}
            </Text>
          </View>
        )}

        {ocrResult?.success && ocrResult.processingTime && (
          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            처리 시간: {(ocrResult.processingTime / 1000).toFixed(2)}초 | 블록:{' '}
            {ocrResult.blocks.length}개
          </Text>
        )}
      </View>

      {/* 텍스트 입력 영역 */}
      <TextInput
        value={text}
        onChangeText={handleTextChange}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        multiline
        numberOfLines={10}
        placeholder="OCR로 추출된 텍스트가 여기에 표시됩니다.&#10;수동으로 텍스트를 입력하거나 수정할 수도 있습니다."
        className={`p-3 rounded-lg border ${
          isEditing
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
            : 'border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-600'
        } text-gray-900 dark:text-gray-100 min-h-[200px]`}
        style={{ textAlignVertical: 'top' }}
      />

      {/* 액션 버튼들 */}
      <View className="flex-row gap-2 mt-3">
        <Pressable
          onPress={handleAnalyze}
          disabled={!hasText}
          className={`flex-1 py-3 px-4 rounded-lg flex-row items-center justify-center ${
            hasText
              ? 'bg-blue-500'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        >
          <Ionicons name="analytics" size={18} color="white" />
          <Text className="text-white font-semibold ml-2">AI 분석</Text>
        </Pressable>

        {hasText && (
          <Pressable
            onPress={handleReset}
            className="py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-600 flex-row items-center justify-center"
          >
            <Ionicons name="refresh" size={18} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300 font-semibold ml-2">
              초기화
            </Text>
          </Pressable>
        )}
      </View>

      {/* 안내 메시지 */}
      {hasText && (
        <View className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <Text className="text-xs text-blue-700 dark:text-blue-300">
            💡 추출된 텍스트를 확인하고 필요시 수정한 후 'AI 분석' 버튼을 눌러주세요.
          </Text>
        </View>
      )}
    </Card>
  );
}
