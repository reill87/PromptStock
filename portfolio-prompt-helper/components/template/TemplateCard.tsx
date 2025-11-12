import { View, Text, Pressable } from 'react-native';
import { Template } from '@/types';

interface TemplateCardProps {
  template: Template;
  onSelect: () => void;
  selected?: boolean;
}

export function TemplateCard({ template, onSelect, selected }: TemplateCardProps) {
  return (
    <Pressable
      onPress={onSelect}
      className={`p-4 rounded-lg border-2 ${
        selected
          ? 'border-primary bg-blue-50'
          : 'border-gray-200 bg-white active:bg-gray-50'
      }`}
    >
      {/* Icon and Custom Badge */}
      <View className="flex-row items-start justify-between mb-3">
        <Text className="text-4xl">{template.icon}</Text>
        {template.isCustom && (
          <View className="bg-purple-100 px-2 py-1 rounded">
            <Text className="text-xs font-semibold text-purple-700">커스텀</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text className="text-lg font-bold text-gray-900 mb-2">
        {template.name}
      </Text>

      {/* Description */}
      <Text className="text-sm text-gray-600 leading-5" numberOfLines={3}>
        {template.description}
      </Text>

      {/* Usage Count */}
      <View className="flex-row items-center mt-3 pt-3 border-t border-gray-200">
        <Text className="text-xs text-gray-500">
          사용 {template.usageCount.toLocaleString()}회
        </Text>
      </View>

      {/* Selected Indicator */}
      {selected && (
        <View className="absolute top-3 right-3 bg-primary rounded-full w-6 h-6 items-center justify-center">
          <Text className="text-white text-xs font-bold">✓</Text>
        </View>
      )}
    </Pressable>
  );
}
