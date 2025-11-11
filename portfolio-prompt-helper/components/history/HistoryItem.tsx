import { View, Text, Pressable } from 'react-native';
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

export function HistoryItem({
  analysis,
  onPress,
  onDelete,
  selected = false,
  onToggleSelect,
  showCheckbox = false,
}: HistoryItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
  };

  const getTruncatedNote = (note?: string) => {
    if (!note) return '메모 없음';
    return note.length > 60 ? note.substring(0, 60) + '...' : note;
  };

  return (
    <Card variant="elevated" className="mb-3">
      <View className="flex-row items-start">
        {/* Checkbox for selection */}
        {showCheckbox && (
          <Pressable
            onPress={() => onToggleSelect?.(analysis.id)}
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
          onPress={() => onPress(analysis)}
          className="flex-1"
        >
          {/* Template name and date */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-2">
              <Text className="text-lg font-bold text-gray-900">
                {analysis.templateName}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {formatDate(analysis.createdAt)}
              </Text>
            </View>

            {/* Delete button */}
            <Pressable
              onPress={() => onDelete(analysis.id)}
              className="p-2 -m-2"
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </Pressable>
          </View>

          {/* Tags */}
          {analysis.tags.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-2">
              {analysis.tags.slice(0, 3).map((tag, index) => (
                <View
                  key={index}
                  className="bg-blue-100 px-2 py-1 rounded-full"
                >
                  <Text className="text-xs text-blue-700">#{tag}</Text>
                </View>
              ))}
              {analysis.tags.length > 3 && (
                <View className="bg-gray-100 px-2 py-1 rounded-full">
                  <Text className="text-xs text-gray-600">
                    +{analysis.tags.length - 3}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* User note preview */}
          <Text className="text-sm text-gray-600 leading-5">
            {getTruncatedNote(analysis.userNote)}
          </Text>

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
}
