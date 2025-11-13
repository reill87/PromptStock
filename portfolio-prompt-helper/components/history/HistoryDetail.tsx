import { View, Text, ScrollView, Pressable, TextInput, Image, FlatList } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Analysis } from '@/types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { useClipboard } from '@/hooks/useClipboard';

export interface HistoryDetailProps {
  analysis: Analysis;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Analysis>) => void;
  onDelete: (id: string) => void;
}

export function HistoryDetail({
  analysis,
  onClose,
  onUpdate,
  onDelete,
}: HistoryDetailProps) {
  const { copy } = useClipboard();
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedNote, setEditedNote] = useState(analysis.userNote || '');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSaveNote = () => {
    onUpdate(analysis.id, { userNote: editedNote });
    setIsEditingNote(false);
  };

  const handleCancelEdit = () => {
    setEditedNote(analysis.userNote || '');
    setIsEditingNote(false);
  };

  const handleCopyPrompt = () => {
    copy(analysis.generatedPrompt);
  };

  const handleCopyResponse = () => {
    if (analysis.aiResponse) {
      copy(analysis.aiResponse);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <Pressable onPress={onClose} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text className="text-lg font-bold">히스토리 상세</Text>
        <Pressable
          onPress={() => onDelete(analysis.id)}
          className="p-2 -mr-2"
        >
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </Pressable>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Template Info */}
          <Card variant="elevated" className="mb-4">
            <View className="flex-row items-center mb-3">
              <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center mr-3">
                <Ionicons name="document-text" size={24} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900">
                  {analysis.templateName}
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  {formatDate(analysis.createdAt)}
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row gap-4 pt-3 border-t border-gray-100">
              <View className="flex-row items-center">
                <Ionicons name="images-outline" size={16} color="#9CA3AF" />
                <Text className="text-sm text-gray-600 ml-1">
                  이미지 {analysis.imageCount}장
                </Text>
              </View>
              {analysis.updatedAt !== analysis.createdAt && (
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                  <Text className="text-sm text-gray-600 ml-1">
                    수정됨
                  </Text>
                </View>
              )}
            </View>
          </Card>

          {/* Image Gallery */}
          {analysis.images && analysis.images.length > 0 && (
            <Card variant="elevated" className="mb-4">
              <Text className="text-base font-bold mb-3">
                포트폴리오 이미지 ({analysis.images.length}장)
              </Text>
              <FlatList
                data={analysis.images}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => `image-${index}`}
                renderItem={({ item, index }) => (
                  <View
                    className="mr-3 rounded-lg overflow-hidden border border-gray-200"
                    style={{ width: 200, height: 200 }}
                  >
                    <Image
                      source={{ uri: item }}
                      style={{ width: 200, height: 200 }}
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded">
                      <Text className="text-white text-xs font-semibold">
                        {index + 1}/{analysis.images.length}
                      </Text>
                    </View>
                  </View>
                )}
                contentContainerStyle={{ paddingRight: 16 }}
              />
            </Card>
          )}

          {/* Tags */}
          {analysis.tags.length > 0 && (
            <Card variant="elevated" className="mb-4">
              <Text className="text-base font-bold mb-3">태그</Text>
              <View className="flex-row flex-wrap gap-2">
                {analysis.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-blue-100 px-3 py-2 rounded-full"
                  >
                    <Text className="text-sm text-blue-700">#{tag}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* User Note */}
          <Card variant="elevated" className="mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-bold">메모</Text>
              {!isEditingNote && (
                <Pressable onPress={() => setIsEditingNote(true)}>
                  <Ionicons name="create-outline" size={20} color="#3B82F6" />
                </Pressable>
              )}
            </View>

            {isEditingNote ? (
              <>
                <TextInput
                  value={editedNote}
                  onChangeText={setEditedNote}
                  placeholder="메모를 입력하세요"
                  multiline
                  numberOfLines={4}
                  className="bg-gray-50 p-3 rounded-lg text-gray-900 mb-3"
                  style={{ minHeight: 100, textAlignVertical: 'top' }}
                />
                <View className="flex-row gap-2">
                  <Button
                    title="저장"
                    variant="primary"
                    size="sm"
                    onPress={handleSaveNote}
                    fullWidth
                  />
                  <Button
                    title="취소"
                    variant="outline"
                    size="sm"
                    onPress={handleCancelEdit}
                    fullWidth
                  />
                </View>
              </>
            ) : (
              <Text className="text-gray-700 leading-6">
                {analysis.userNote || '메모가 없습니다'}
              </Text>
            )}
          </Card>

          {/* Generated Prompt */}
          <Card variant="elevated" className="mb-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-bold">생성된 프롬프트</Text>
              <Pressable onPress={handleCopyPrompt}>
                <Ionicons name="copy-outline" size={20} color="#3B82F6" />
              </Pressable>
            </View>
            <View className="bg-gray-50 p-3 rounded-lg">
              <Text className="text-gray-900 leading-6">
                {analysis.generatedPrompt}
              </Text>
            </View>
            <Button
              title="프롬프트 복사"
              variant="outline"
              size="sm"
              onPress={handleCopyPrompt}
              fullWidth
              className="mt-3"
            />
          </Card>

          {/* AI Response */}
          {analysis.aiResponse && (
            <Card variant="elevated" className="mb-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-base font-bold">AI 분석 결과</Text>
                <Pressable onPress={handleCopyResponse}>
                  <Ionicons name="copy-outline" size={20} color="#3B82F6" />
                </Pressable>
              </View>
              <View className="bg-green-50 p-3 rounded-lg border border-green-200">
                <Text className="text-gray-900 leading-6">
                  {analysis.aiResponse}
                </Text>
              </View>
              <Button
                title="분석 결과 복사"
                variant="outline"
                size="sm"
                onPress={handleCopyResponse}
                fullWidth
                className="mt-3"
              />
            </Card>
          )}

          {/* Actions */}
          <View className="gap-3 pb-8">
            <Button
              title="닫기"
              variant="outline"
              onPress={onClose}
              fullWidth
            />
            <Button
              title="삭제"
              variant="danger"
              onPress={() => {
                onDelete(analysis.id);
                onClose();
              }}
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
