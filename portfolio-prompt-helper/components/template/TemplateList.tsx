import { View, Text, FlatList, TextInput } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Template } from '@/types';
import { TemplateCard } from './TemplateCard';

interface TemplateListProps {
  templates: Template[];
  selectedTemplateId?: string;
  onSelectTemplate: (template: Template) => void;
}

export function TemplateList({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1">
      {/* Search Bar */}
      <View className="mb-4">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="템플릿 검색..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-base text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <Ionicons
              name="close-circle"
              size={20}
              color="#9CA3AF"
              onPress={() => setSearchQuery('')}
            />
          )}
        </View>
      </View>

      {/* Results Count */}
      <Text className="text-sm text-gray-600 mb-3">
        {filteredTemplates.length}개의 템플릿
      </Text>

      {/* Template List */}
      {filteredTemplates.length > 0 ? (
        <FlatList
          data={filteredTemplates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TemplateCard
              template={item}
              selected={item.id === selectedTemplateId}
              onSelect={() => onSelectTemplate(item)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center py-12">
          <Ionicons name="search-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-500 mt-4 text-center">
            검색 결과가 없습니다
          </Text>
        </View>
      )}
    </View>
  );
}
