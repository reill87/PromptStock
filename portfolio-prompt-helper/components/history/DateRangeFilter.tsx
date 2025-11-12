import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DateRangeFilterProps {
  startDate: string | null;
  endDate: string | null;
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
}

type QuickSelectOption = 'all' | '7days' | '30days' | '90days' | 'custom';

export function DateRangeFilter({
  startDate,
  endDate,
  onDateRangeChange,
}: DateRangeFilterProps) {
  const [selectedOption, setSelectedOption] = useState<QuickSelectOption>('all');

  const handleQuickSelect = (option: QuickSelectOption) => {
    setSelectedOption(option);

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let newStartDate: string | null = null;
    let newEndDate: string | null = null;

    switch (option) {
      case 'all':
        // No date filter
        newStartDate = null;
        newEndDate = null;
        break;

      case '7days':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        newStartDate = sevenDaysAgo.toISOString();
        newEndDate = today.toISOString();
        break;

      case '30days':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        newStartDate = thirtyDaysAgo.toISOString();
        newEndDate = today.toISOString();
        break;

      case '90days':
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(today.getDate() - 90);
        ninetyDaysAgo.setHours(0, 0, 0, 0);
        newStartDate = ninetyDaysAgo.toISOString();
        newEndDate = today.toISOString();
        break;

      case 'custom':
        // Keep current dates for custom selection
        return;
    }

    onDateRangeChange(newStartDate, newEndDate);
  };

  const handleClearDates = () => {
    setSelectedOption('all');
    onDateRangeChange(null, null);
  };

  const formatDateLabel = (dateString: string | null) => {
    if (!dateString) return '선택 안 함';

    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getActiveFilterLabel = () => {
    if (!startDate && !endDate) {
      return '전체 기간';
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) return '최근 7일';
      if (diffDays <= 30) return '최근 30일';
      if (diffDays <= 90) return '최근 90일';
    }

    return '사용자 지정';
  };

  const quickOptions: { value: QuickSelectOption; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: '7days', label: '최근 7일' },
    { value: '30days', label: '최근 30일' },
    { value: '90days', label: '최근 90일' },
  ];

  return (
    <View className="py-3">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3 px-4">
        <View className="flex-row items-center">
          <Ionicons name="calendar" size={16} color="#6B7280" />
          <Text className="text-sm font-semibold text-gray-700 ml-2">
            날짜 범위
          </Text>
          {(startDate || endDate) && (
            <View className="bg-blue-500 rounded-full ml-2 px-2 py-0.5">
              <Text className="text-xs font-bold text-white">필터 활성</Text>
            </View>
          )}
        </View>

        {(startDate || endDate) && (
          <TouchableOpacity onPress={handleClearDates}>
            <Text className="text-sm font-medium text-blue-600">초기화</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Select Options */}
      <View className="px-4 mb-3">
        <View className="flex-row flex-wrap gap-2">
          {quickOptions.map((option) => {
            const isSelected = selectedOption === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleQuickSelect(option.value)}
                className={`px-4 py-2 rounded-full border ${
                  isSelected
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white border-gray-300'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Current Range Display */}
      {(startDate || endDate) && (
        <View className="px-4">
          <View className="bg-blue-50 rounded-lg p-3">
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={16} color="#3B82F6" />
              <Text className="text-xs text-blue-700 font-medium ml-2">
                선택된 기간: {getActiveFilterLabel()}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-xs text-blue-600 mb-1">시작일</Text>
                <Text className="text-sm text-blue-900 font-medium">
                  {formatDateLabel(startDate)}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#93C5FD" />
              <View className="flex-1 items-end">
                <Text className="text-xs text-blue-600 mb-1">종료일</Text>
                <Text className="text-sm text-blue-900 font-medium">
                  {formatDateLabel(endDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Helper Text */}
      <View className="px-4 mt-3">
        <Text className="text-xs text-gray-500 text-center">
          💡 날짜 범위를 선택하면 해당 기간의 히스토리만 표시됩니다
        </Text>
      </View>
    </View>
  );
}
