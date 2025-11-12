import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Template, TemplateCategory } from '@/types';
import { Button } from '@/components/common/Button';

// Available icons for templates
const AVAILABLE_ICONS = ['📊', '💰', '🎯', '⚖️', '📋', '📈', '💼', '🔍', '⚡', '🌟', '🎨', '📱'];

// Available categories
const CATEGORIES: { value: TemplateCategory; label: string }[] = [
  { value: 'risk', label: '위험도 분석' },
  { value: 'rebalance', label: '리밸런싱' },
  { value: 'checklist', label: '체크리스트' },
  { value: 'sector', label: '섹터 분석' },
  { value: 'profit', label: '수익률 분석' },
];

// Available output formats
const OUTPUT_FORMATS = [
  { value: 'table', label: '표 형식' },
  { value: 'list', label: '리스트 형식' },
  { value: 'text', label: '텍스트 형식' },
];

interface TemplateEditorProps {
  template?: Template; // If provided, edit mode; otherwise, create mode
  onSave: (template: Omit<Template, 'id' | 'createdAt' | 'usageCount'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function TemplateEditor({ template, onSave, onCancel, loading }: TemplateEditorProps) {
  const [name, setName] = useState(template?.name || '');
  const [description, setDescription] = useState(template?.description || '');
  const [category, setCategory] = useState<TemplateCategory>(template?.category || 'risk');
  const [icon, setIcon] = useState(template?.icon || '📊');
  const [promptTemplate, setPromptTemplate] = useState(template?.promptTemplate || '');
  const [outputFormat, setOutputFormat] = useState(template?.outputFormat || 'table');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = '템플릿 이름을 입력하세요';
    }

    if (!description.trim()) {
      newErrors.description = '설명을 입력하세요';
    }

    if (!promptTemplate.trim()) {
      newErrors.promptTemplate = '프롬프트 템플릿을 입력하세요';
    } else if (promptTemplate.trim().length < 50) {
      newErrors.promptTemplate = '프롬프트는 최소 50자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      category,
      icon,
      promptTemplate: promptTemplate.trim(),
      outputFormat,
      variables: [],
      isCustom: true,
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {template ? '템플릿 편집' : '새 템플릿 만들기'}
          </Text>
          <Text className="text-sm text-gray-500">
            나만의 커스텀 프롬프트 템플릿을 만들어보세요
          </Text>
        </View>

        {/* Basic Info Card */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-3">기본 정보</Text>

          {/* Name Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              템플릿 이름 <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="예: 배당주 분석"
              className="border border-gray-300 rounded-lg px-3 py-2 text-base"
              placeholderTextColor="#9CA3AF"
            />
            {errors.name && (
              <Text className="text-xs text-red-500 mt-1">{errors.name}</Text>
            )}
          </View>

          {/* Description Input */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              설명 <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="템플릿의 용도를 설명해주세요"
              multiline
              numberOfLines={2}
              className="border border-gray-300 rounded-lg px-3 py-2 text-base"
              placeholderTextColor="#9CA3AF"
            />
            {errors.description && (
              <Text className="text-xs text-red-500 mt-1">{errors.description}</Text>
            )}
          </View>

          {/* Icon Selector */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">아이콘</Text>
            <View className="flex-row flex-wrap gap-2">
              {AVAILABLE_ICONS.map((availableIcon) => (
                <TouchableOpacity
                  key={availableIcon}
                  onPress={() => setIcon(availableIcon)}
                  className={`w-12 h-12 items-center justify-center rounded-lg border-2 ${
                    icon === availableIcon
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}>
                  <Text className="text-2xl">{availableIcon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Selector */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">카테고리</Text>
            <View className="gap-2">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => setCategory(cat.value)}
                  className={`flex-row items-center justify-between px-4 py-3 rounded-lg border ${
                    category === cat.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      category === cat.value ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                    {cat.label}
                  </Text>
                  {category === cat.value && (
                    <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Output Format Selector */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">출력 형식</Text>
            <View className="gap-2">
              {OUTPUT_FORMATS.map((format) => (
                <TouchableOpacity
                  key={format.value}
                  onPress={() => setOutputFormat(format.value)}
                  className={`flex-row items-center justify-between px-4 py-3 rounded-lg border ${
                    outputFormat === format.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}>
                  <Text
                    className={`text-sm font-medium ${
                      outputFormat === format.value ? 'text-blue-700' : 'text-gray-700'
                    }`}>
                    {format.label}
                  </Text>
                  {outputFormat === format.value && (
                    <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Prompt Template Card */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-1">
            프롬프트 템플릿 <Text className="text-red-500">*</Text>
          </Text>
          <Text className="text-xs text-gray-500 mb-3">
            AI에게 전달될 프롬프트 내용을 작성하세요 (최소 50자)
          </Text>

          <TextInput
            value={promptTemplate}
            onChangeText={setPromptTemplate}
            placeholder={`예시:

위 포트폴리오 이미지를 보고 배당주를 분석해주세요:

1. **배당 수익률 분석**
   - 각 종목의 배당수익률
   - 평균 배당수익률

2. **배당 안정성 평가**
   - 배당 지급 이력
   - 배당 성장률

3. **개선 제안**
   - 고배당주 추천
   - 포트폴리오 배당 수익률 개선 방안`}
            multiline
            numberOfLines={15}
            textAlignVertical="top"
            className="border border-gray-300 rounded-lg px-3 py-3 text-base min-h-[300px]"
            placeholderTextColor="#9CA3AF"
          />
          <View className="flex-row items-center justify-between mt-2">
            {errors.promptTemplate && (
              <Text className="text-xs text-red-500">{errors.promptTemplate}</Text>
            )}
            <Text
              className={`text-xs ${
                promptTemplate.length < 50 ? 'text-red-500' : 'text-gray-500'
              } ml-auto`}>
              {promptTemplate.length}자
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1">
            <Button
              title="취소"
              variant="outline"
              onPress={onCancel}
              disabled={loading}
            />
          </View>
          <View className="flex-1">
            <Button
              title={template ? '수정 완료' : '저장'}
              onPress={handleSave}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
