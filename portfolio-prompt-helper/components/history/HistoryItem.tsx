import React, { useMemo, useCallback, memo } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Analysis } from '@/types';
import { Card } from '@/components/common/Card';

export interface HistoryItemProps {
  analysis: Analysis;
  onPress: (analysis: Analysis) => void;
  onDelete: (id: string) => void;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  showCheckbox?: boolean;
}

export const HistoryItem = memo(function HistoryItem({
  analysis,
  onPress,
  onDelete,
  selected = false,
  onToggleSelect,
  showCheckbox = false,
}: HistoryItemProps) {
  const formattedDate = useMemo(() => {
    const date = new Date(analysis.createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return '오늘';
    } else if (diffInDays === 1) {
      return '어제';
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  }, [analysis.createdAt]);

  const truncatedNote = useMemo(() => {
    if (!analysis.userNote) return '메모 없음';
    return analysis.userNote.length > 60
      ? analysis.userNote.substring(0, 60) + '...'
      : analysis.userNote;
  }, [analysis.userNote]);

  const handlePress = useCallback(() => {
    onPress(analysis);
  }, [onPress, analysis]);

  const handleDelete = useCallback(() => {
    onDelete(analysis.id);
  }, [onDelete, analysis.id]);

  const handleToggleSelect = useCallback(() => {
    onToggleSelect?.(analysis.id);
  }, [onToggleSelect, analysis.id]);

  const visibleTags = useMemo(
    () => analysis.tags.slice(0, 3),
    [analysis.tags]
  );

  const remainingTagsCount = useMemo(
    () => Math.max(0, analysis.tags.length - 3),
    [analysis.tags.length]
  );

  const visibleThumbnails = useMemo(
    () => analysis.thumbnails?.slice(0, 3) || [],
    [analysis.thumbnails]
  );

  const remainingImagesCount = useMemo(
    () => Math.max(0, (analysis.thumbnails?.length || 0) - 3),
    [analysis.thumbnails]
  );

  return (
    <Card variant="elevated" className="mb-3">
      <View className="flex-row items-start">
        {/* Checkbox for selection */}
        {showCheckbox && (
          <Pressable
            onPress={handleToggleSelect}
            className="mr-3 mt-1"
          >
            <Ionicons
              name={selected ? 'checkbox' : 'square-outline'}
              size={24}
              color={selected ? '#3B82F6' : '#9CA3AF'}
            />
          </Pressable>
        )}

        {/* Main content - pressable */}
        <Pressable
          onPress={handlePress}
          className="flex-1"
        >
          {/* Thumbnails Preview */}
          {visibleThumbnails.length > 0 && (
            <View className="flex-row mb-3 gap-2">
              {visibleThumbnails.map((thumbnail, index) => (
                <View
                  key={`${analysis.id}-thumb-${index}`}
                  className="rounded-lg overflow-hidden border border-gray-200"
                  style={{ width: 64, height: 64 }}
                >
                  <Image
                    source={{ uri: thumbnail }}
                    style={{ width: 64, height: 64 }}
                    resizeMode="cover"
                  />
                </View>
              ))}
              {remainingImagesCount > 0 && (
                <View
                  className="rounded-lg bg-gray-100 items-center justify-center border border-gray-200"
                  style={{ width: 64, height: 64 }}
                >
                  <Text className="text-sm font-bold text-gray-600">
                    +{remainingImagesCount}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Template name and date */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-2">
              <View className="flex-row items-center gap-2 mb-1">
                <Text className="text-lg font-bold text-gray-900">
                  {analysis.templateName}
                </Text>
                {analysis.llmMode === 'local' && (
                  <View className="bg-green-100 px-2 py-0.5 rounded">
                    <Text className="text-xs font-semibold text-green-700">
                      AI
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-sm text-gray-500">
                {formattedDate}
              </Text>
            </View>

            {/* Delete button */}
            <Pressable
              onPress={handleDelete}
              className="p-2 -m-2"
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </Pressable>
          </View>

          {/* Tags */}
          {analysis.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-2">
              {visibleTags.map((tag, index) => (
                <View
                  key={`${analysis.id}-tag-${index}`}
                  className="bg-blue-100 px-2 py-1 rounded-full"
                >
                  <Text className="text-xs text-blue-700">#{tag}</Text>
                </View>
              ))}
              {remainingTagsCount > 0 && (
                <View className="bg-gray-100 px-2 py-1 rounded-full">
                  <Text className="text-xs text-gray-600">
                    +{remainingTagsCount}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* User note preview */}
          <Text className="text-sm text-gray-600 leading-5">
            {truncatedNote}
          </Text>

          {/* Portfolio Snapshot */}
          {analysis.snapshot && (
            <View className="flex-row items-center mt-2 p-2 bg-blue-50 rounded-lg">
              {analysis.snapshot.totalValue && (
                <View className="flex-row items-center mr-3">
                  <Text className="text-sm font-bold text-blue-900">
                    💰 {analysis.snapshot.totalValue.toLocaleString()}만원
                  </Text>
                </View>
              )}
              {analysis.snapshot.stockCount && (
                <View className="flex-row items-center">
                  <Text className="text-sm text-blue-700">
                    📊 {analysis.snapshot.stockCount}종목
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Bottom info */}
          <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
            <Ionicons name="images-outline" size={14} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 ml-1 mr-3">
              이미지 {analysis.imageCount}장
            </Text>

            {analysis.aiResponse && (
              <>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text className="text-xs text-green-600 ml-1">
                  분석 완료
                </Text>
              </>
            )}
          </View>
        </Pressable>
      </View>
    </Card>
  );
});
