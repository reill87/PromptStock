import { View, Text, ScrollView, TextInput } from 'react-native';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useClipboard } from '@/hooks/useClipboard';
import { estimateTokenCount, getPromptWordCount } from '@/utils/promptGenerator';
import { Ionicons } from '@expo/vector-icons';

interface PromptPreviewProps {
  prompt: string;
  onEdit?: (newPrompt: string) => void;
  editable?: boolean;
}

export function PromptPreview({ prompt, onEdit, editable = false }: PromptPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(prompt);
  const { copy, copied } = useClipboard();

  const wordCount = getPromptWordCount(prompt);
  const tokenCount = estimateTokenCount(prompt);

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(editedPrompt);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedPrompt(prompt);
    setIsEditing(false);
  };

  return (
    <Card variant="elevated" padding="lg">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Ionicons name="document-text" size={24} color="#3B82F6" />
          <Text className="text-xl font-bold ml-2">생성된 프롬프트</Text>
        </View>
        {editable && !isEditing && (
          <Button
            title="수정"
            variant="outline"
            size="sm"
            onPress={() => setIsEditing(true)}
          />
        )}
      </View>

      {/* Stats */}
      <View className="flex-row gap-4 mb-4">
        <View className="flex-row items-center">
          <Ionicons name="text" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">
            {wordCount.toLocaleString()}단어
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="analytics" size={16} color="#6B7280" />
          <Text className="text-sm text-gray-600 ml-1">
            ~{tokenCount.toLocaleString()}토큰
          </Text>
        </View>
      </View>

      {/* Prompt Content */}
      {isEditing ? (
        <View>
          <TextInput
            value={editedPrompt}
            onChangeText={setEditedPrompt}
            multiline
            className="bg-gray-50 p-4 rounded-lg text-base text-gray-900 min-h-[200px]"
            textAlignVertical="top"
            placeholder="프롬프트를 입력하세요..."
          />
          <View className="flex-row gap-2 mt-3">
            <Button
              title="저장"
              variant="primary"
              onPress={handleSaveEdit}
              fullWidth
            />
            <Button
              title="취소"
              variant="outline"
              onPress={handleCancelEdit}
              fullWidth
            />
          </View>
        </View>
      ) : (
        <ScrollView
          className="bg-gray-50 p-4 rounded-lg max-h-[300px]"
          showsVerticalScrollIndicator={true}
        >
          <Text className="text-base text-gray-900 leading-6">{prompt}</Text>
        </ScrollView>
      )}

      {/* Copy Button */}
      {!isEditing && (
        <View className="mt-4">
          <Button
            title={copied ? '복사 완료!' : '클립보드에 복사'}
            variant={copied ? 'secondary' : 'primary'}
            onPress={() => copy(prompt)}
            fullWidth
          />
          <View className="mt-3 bg-blue-50 p-3 rounded-lg">
            <View className="flex-row">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <View className="flex-1 ml-2">
                <Text className="text-sm text-blue-900 font-semibold mb-1">
                  다음 단계
                </Text>
                <Text className="text-xs text-blue-700 leading-5">
                  1. 위 프롬프트를 복사하세요{'\n'}
                  2. ChatGPT 또는 Claude를 열고{'\n'}
                  3. 포트폴리오 이미지와 함께 붙여넣으세요
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Card>
  );
}
