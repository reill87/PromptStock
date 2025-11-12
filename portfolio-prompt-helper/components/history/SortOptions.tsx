import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SortOptionsProps {
  sortBy: 'date' | 'name';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sortBy: 'date' | 'name') => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export function SortOptions({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: SortOptionsProps) {
  const getSortLabel = () => {
    const byLabel = sortBy === 'date' ? '날짜' : '이름';
    const orderLabel = sortOrder === 'asc' ? '오름차순' : '내림차순';
    return `${byLabel} (${orderLabel})`;
  };

  const getSortIcon = () => {
    if (sortBy === 'date') {
      return sortOrder === 'asc' ? 'calendar-outline' : 'calendar';
    } else {
      return sortOrder === 'asc' ? 'text-outline' : 'text';
    }
  };

  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <View className="py-3">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3 px-4">
        <View className="flex-row items-center">
          <Ionicons name="swap-vertical" size={16} color="#6B7280" />
          <Text className="text-sm font-semibold text-gray-700 ml-2">
            정렬
          </Text>
        </View>
        <Text className="text-xs text-gray-600">{getSortLabel()}</Text>
      </View>

      {/* Sort By Options */}
      <View className="px-4 mb-4">
        <Text className="text-xs font-medium text-gray-600 mb-2">정렬 기준</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onSortByChange('date')}
            className={`flex-1 flex-row items-center justify-center px-4 py-3 rounded-lg border ${
              sortBy === 'date'
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white border-gray-300'
            }`}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={sortBy === 'date' ? '#fff' : '#6B7280'}
            />
            <Text
              className={`ml-2 text-sm font-medium ${
                sortBy === 'date' ? 'text-white' : 'text-gray-700'
              }`}
            >
              날짜
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onSortByChange('name')}
            className={`flex-1 flex-row items-center justify-center px-4 py-3 rounded-lg border ${
              sortBy === 'name'
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white border-gray-300'
            }`}
          >
            <Ionicons
              name="text-outline"
              size={18}
              color={sortBy === 'name' ? '#fff' : '#6B7280'}
            />
            <Text
              className={`ml-2 text-sm font-medium ${
                sortBy === 'name' ? 'text-white' : 'text-gray-700'
              }`}
            >
              이름
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Order Toggle */}
      <View className="px-4">
        <Text className="text-xs font-medium text-gray-600 mb-2">정렬 순서</Text>
        <TouchableOpacity
          onPress={toggleSortOrder}
          className="bg-white border border-gray-300 rounded-lg p-4"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons
                name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                size={20}
                color="#3B82F6"
              />
              <View className="ml-3 flex-1">
                <Text className="text-sm font-semibold text-gray-900">
                  {sortOrder === 'asc' ? '오름차순' : '내림차순'}
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {sortBy === 'date' && sortOrder === 'asc' && '오래된 순서'}
                  {sortBy === 'date' && sortOrder === 'desc' && '최신 순서'}
                  {sortBy === 'name' && sortOrder === 'asc' && 'ㄱ → ㅎ'}
                  {sortBy === 'name' && sortOrder === 'desc' && 'ㅎ → ㄱ'}
                </Text>
              </View>
            </View>
            <View className="bg-blue-100 rounded-full p-2">
              <Ionicons name="swap-vertical" size={16} color="#3B82F6" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Info Box */}
      <View className="px-4 mt-4">
        <View className="bg-blue-50 rounded-lg p-3">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={16} color="#3B82F6" />
            <Text className="text-xs text-blue-700 ml-2 flex-1">
              {sortBy === 'date' && '분석이 생성된 날짜를 기준으로 정렬됩니다'}
              {sortBy === 'name' && '템플릿 이름을 기준으로 정렬됩니다'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
