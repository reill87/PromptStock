import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Template } from '@/types';
import {
  getCustomTemplates,
  deleteCustomTemplate,
} from '@/utils/templateStorage';
import { Card } from '@/components/common/Card';

interface CustomTemplatesListProps {
  onEdit: (template: Template) => void;
  onRefresh?: () => void;
}

export function CustomTemplatesList({ onEdit, onRefresh }: CustomTemplatesListProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const customTemplates = await getCustomTemplates();
      setTemplates(customTemplates);
    } catch (error) {
      console.error('Error loading custom templates:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTemplates();
    onRefresh?.();
  };

  const handleDelete = (template: Template) => {
    Alert.alert(
      '템플릿 삭제',
      `"${template.name}" 템플릿을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCustomTemplate(template.id);
              await loadTemplates();
              onRefresh?.();
            } catch (error) {
              Alert.alert('오류', '템플릿 삭제 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const renderTemplate = ({ item }: { item: Template }) => (
    <Card variant="elevated" className="mb-3">
      <View className="flex-row items-start">
        {/* Icon */}
        <View className="mr-3">
          <Text className="text-3xl">{item.icon}</Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {item.name}
          </Text>
          <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
            {item.description}
          </Text>

          {/* Stats */}
          <View className="flex-row items-center gap-4 mb-3">
            <View className="flex-row items-center">
              <Ionicons name="eye-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1">
                사용 {item.usageCount}회
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="document-text-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1">
                {item.outputFormat === 'table' && '표 형식'}
                {item.outputFormat === 'list' && '리스트'}
                {item.outputFormat === 'text' && '텍스트'}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => onEdit(item)}
              className="flex-1 flex-row items-center justify-center bg-blue-50 rounded-lg py-2">
              <Ionicons name="pencil-outline" size={16} color="#3B82F6" />
              <Text className="text-sm font-medium text-blue-600 ml-1">
                편집
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDelete(item)}
              className="flex-1 flex-row items-center justify-center bg-red-50 rounded-lg py-2">
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
              <Text className="text-sm font-medium text-red-600 ml-1">
                삭제
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-sm text-gray-500 mt-3">템플릿 로딩 중...</Text>
      </View>
    );
  }

  if (templates.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <Ionicons name="document-outline" size={48} color="#D1D5DB" />
        <Text className="text-base font-medium text-gray-900 mt-4">
          커스텀 템플릿이 없습니다
        </Text>
        <Text className="text-sm text-gray-500 mt-2 text-center">
          나만의 프롬프트 템플릿을 만들어보세요
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={templates}
      renderItem={renderTemplate}
      keyExtractor={(item) => item.id}
      contentContainerClassName="p-4"
      refreshing={refreshing}
      onRefresh={handleRefresh}
      showsVerticalScrollIndicator={false}
    />
  );
}
