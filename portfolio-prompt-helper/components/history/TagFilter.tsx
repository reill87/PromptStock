import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllTags } from '@/utils/storage';

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagFilter({ selectedTags, onTagsChange }: TagFilterProps) {
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const tags = await getAllTags();
      setAllTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remove tag
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      // Add tag
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  if (loading) {
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  }

  if (allTags.length === 0) {
    return (
      <View className="py-4 items-center">
        <Text className="text-sm text-gray-500">사용 가능한 태그가 없습니다</Text>
      </View>
    );
  }

  return (
    <View className="py-3">
      {/* Header with clear button */}
      <View className="flex-row items-center justify-between mb-3 px-4">
        <View className="flex-row items-center">
          <Ionicons name="pricetag" size={16} color="#6B7280" />
          <Text className="text-sm font-semibold text-gray-700 ml-2">
            태그로 필터링
          </Text>
          {selectedTags.length > 0 && (
            <View className="bg-blue-500 rounded-full ml-2 px-2 py-0.5">
              <Text className="text-xs font-bold text-white">
                {selectedTags.length}
              </Text>
            </View>
          )}
        </View>

        {selectedTags.length > 0 && (
          <TouchableOpacity onPress={clearAllTags}>
            <Text className="text-sm font-medium text-blue-600">모두 지우기</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tag chips - Horizontal scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-2"
      >
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              onPress={() => toggleTag(tag)}
              className={`flex-row items-center px-3 py-2 rounded-full border ${
                isSelected
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-gray-300'
              }`}
            >
              <Ionicons
                name={isSelected ? 'checkmark-circle' : 'pricetag-outline'}
                size={16}
                color={isSelected ? '#fff' : '#6B7280'}
              />
              <Text
                className={`ml-1.5 text-sm font-medium ${
                  isSelected ? 'text-white' : 'text-gray-700'
                }`}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected tags summary */}
      {selectedTags.length > 0 && (
        <View className="mt-3 px-4">
          <View className="bg-blue-50 rounded-lg p-3">
            <Text className="text-xs text-blue-700 font-medium mb-1">
              선택된 태그:
            </Text>
            <Text className="text-sm text-blue-900">
              {selectedTags.join(', ')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
