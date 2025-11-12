import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TemplateCategory } from '@/types';

interface CategoryInfo {
  value: TemplateCategory;
  label: string;
  icon: string;
  color: string;
}

const CATEGORIES: CategoryInfo[] = [
  {
    value: 'risk',
    label: '위험도 분석',
    icon: '🎯',
    color: '#EF4444', // red
  },
  {
    value: 'rebalance',
    label: '리밸런싱',
    icon: '⚖️',
    color: '#F59E0B', // amber
  },
  {
    value: 'checklist',
    label: '체크리스트',
    icon: '📋',
    color: '#10B981', // green
  },
  {
    value: 'sector',
    label: '섹터 분석',
    icon: '📊',
    color: '#3B82F6', // blue
  },
  {
    value: 'profit',
    label: '수익률 분석',
    icon: '💰',
    color: '#8B5CF6', // purple
  },
];

interface TemplateTypeFilterProps {
  selectedCategories: TemplateCategory[];
  onCategoriesChange: (categories: TemplateCategory[]) => void;
}

export function TemplateTypeFilter({
  selectedCategories,
  onCategoriesChange,
}: TemplateTypeFilterProps) {
  const toggleCategory = (category: TemplateCategory) => {
    if (selectedCategories.includes(category)) {
      // Remove category
      onCategoriesChange(selectedCategories.filter((c) => c !== category));
    } else {
      // Add category
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const clearAllCategories = () => {
    onCategoriesChange([]);
  };

  const selectAllCategories = () => {
    onCategoriesChange(CATEGORIES.map((c) => c.value));
  };

  return (
    <View className="py-3">
      {/* Header with actions */}
      <View className="flex-row items-center justify-between mb-3 px-4">
        <View className="flex-row items-center">
          <Ionicons name="apps" size={16} color="#6B7280" />
          <Text className="text-sm font-semibold text-gray-700 ml-2">
            템플릿 유형
          </Text>
          {selectedCategories.length > 0 && (
            <View className="bg-blue-500 rounded-full ml-2 px-2 py-0.5">
              <Text className="text-xs font-bold text-white">
                {selectedCategories.length}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row gap-2">
          {selectedCategories.length > 0 && (
            <TouchableOpacity onPress={clearAllCategories}>
              <Text className="text-sm font-medium text-blue-600">초기화</Text>
            </TouchableOpacity>
          )}
          {selectedCategories.length < CATEGORIES.length && (
            <TouchableOpacity onPress={selectAllCategories}>
              <Text className="text-sm font-medium text-blue-600">전체 선택</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category chips - Scrollable */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-4 gap-3"
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category.value);
          return (
            <TouchableOpacity
              key={category.value}
              onPress={() => toggleCategory(category.value)}
              className={`flex-row items-center px-4 py-3 rounded-full border-2 ${
                isSelected
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-gray-300'
              }`}
            >
              <Text className="text-xl mr-2">{category.icon}</Text>
              <Text
                className={`text-sm font-medium ${
                  isSelected ? 'text-white' : 'text-gray-700'
                }`}
              >
                {category.label}
              </Text>
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#fff"
                  style={{ marginLeft: 6 }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected categories summary */}
      {selectedCategories.length > 0 && (
        <View className="mt-3 px-4">
          <View className="bg-blue-50 rounded-lg p-3">
            <Text className="text-xs text-blue-700 font-medium mb-2">
              선택된 유형: {selectedCategories.length}개
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {selectedCategories.map((categoryValue) => {
                const category = CATEGORIES.find((c) => c.value === categoryValue);
                if (!category) return null;

                return (
                  <View
                    key={categoryValue}
                    className="bg-white rounded-full px-3 py-1 flex-row items-center"
                  >
                    <Text className="text-base mr-1">{category.icon}</Text>
                    <Text className="text-xs font-medium text-gray-700">
                      {category.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* Helper Text */}
      <View className="px-4 mt-3">
        <Text className="text-xs text-gray-500 text-center">
          💡 선택한 유형의 템플릿으로 생성된 히스토리만 표시됩니다
        </Text>
      </View>
    </View>
  );
}
