import { View, Text, ScrollView } from 'react-native';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useUIStore } from '@/store/uiStore';
import { ImageUploader } from '@/components/upload/ImageUploader';
import { ImagePreview } from '@/components/upload/ImagePreview';
import { TemplateList } from '@/components/template/TemplateList';
import { PromptPreview } from '@/components/prompt/PromptPreview';
import { useImageUpload } from '@/hooks/useImageUpload';
import { DEFAULT_TEMPLATES } from '@/constants/templates';
import { Template } from '@/types';
import { generatePrompt } from '@/utils/promptGenerator';

export default function HomeScreen() {
  const showToast = useUIStore((state) => state.showToast);
  const showModal = useUIStore((state) => state.showModal);
  const { images, loading, pickImages, takePhoto, removeImage, clearImages } = useImageUpload();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  const handleGeneratePrompt = () => {
    if (!selectedTemplate) {
      showToast('warning', '템플릿을 선택해주세요');
      return;
    }

    if (images.length === 0) {
      showToast('warning', '이미지를 업로드해주세요');
      return;
    }

    const prompt = generatePrompt(selectedTemplate, {
      imageCount: images.length,
    });

    setGeneratedPrompt(prompt);
    showToast('success', '프롬프트가 생성되었습니다!');
  };

  const handleReset = () => {
    showModal(
      '초기화',
      '모든 내용을 초기화하시겠습니까?',
      () => {
        clearImages();
        setSelectedTemplate(null);
        setGeneratedPrompt(null);
        showToast('info', '초기화되었습니다');
      }
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-gray-900">
                Portfolio Prompt Helper
              </Text>
              <Text className="text-gray-600 mt-2">
                포트폴리오 AI 분석 도우미
              </Text>
            </View>
            {(images.length > 0 || selectedTemplate || generatedPrompt) && (
              <Button
                title="초기화"
                variant="outline"
                size="sm"
                onPress={handleReset}
              />
            )}
          </View>
        </View>

        {/* Step 1: Image Upload */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-xl font-bold mb-4">Step 1. 이미지 업로드</Text>
          <ImageUploader
            onPickImages={pickImages}
            onTakePhoto={takePhoto}
            loading={loading}
            imageCount={images.length}
          />
          <ImagePreview
            images={images}
            onRemove={removeImage}
            onClear={clearImages}
          />
        </Card>

        {/* Step 2: Template Selection */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-xl font-bold mb-4">Step 2. 분석 템플릿 선택</Text>
          <TemplateList
            templates={DEFAULT_TEMPLATES}
            selectedTemplateId={selectedTemplate?.id}
            onSelectTemplate={setSelectedTemplate}
          />
        </Card>

        {/* Generate Button */}
        {images.length > 0 && selectedTemplate && !generatedPrompt && (
          <Button
            title="프롬프트 생성"
            variant="primary"
            size="lg"
            onPress={handleGeneratePrompt}
            fullWidth
          />
        )}

        {/* Step 3: Prompt Preview */}
        {generatedPrompt && (
          <View className="mb-4">
            <Text className="text-xl font-bold mb-4">Step 3. 프롬프트 확인 및 복사</Text>
            <PromptPreview
              prompt={generatedPrompt}
              onEdit={setGeneratedPrompt}
              editable
            />
            <Button
              title="새로 생성"
              variant="outline"
              onPress={handleGeneratePrompt}
              fullWidth
              className="mt-3"
            />
          </View>
        )}

        {/* Old Component Tests (collapsed) */}
        <View className="mt-8">
          <Text className="text-lg font-bold mb-4 text-gray-500">
            컴포넌트 테스트 (개발용)
          </Text>

          {/* Component Test Section */}
          <Card variant="elevated" className="mb-4">
          <Text className="text-xl font-bold mb-4">Button 컴포넌트 테스트</Text>

          <View className="gap-3">
            <Button
              title="Primary Button"
              variant="primary"
              onPress={() => showToast('success', 'Primary 버튼 클릭!')}
            />

            <Button
              title="Secondary Button"
              variant="secondary"
              onPress={() => showToast('info', 'Secondary 버튼 클릭!')}
            />

            <Button
              title="Danger Button"
              variant="danger"
              onPress={() => showToast('error', 'Danger 버튼 클릭!')}
            />

            <Button
              title="Outline Button"
              variant="outline"
              onPress={() => showToast('warning', 'Outline 버튼 클릭!')}
            />

            <Button
              title="Loading Button"
              variant="primary"
              loading
              onPress={() => {}}
            />

            <Button
              title="Disabled Button"
              variant="primary"
              disabled
              onPress={() => {}}
            />
          </View>
        </Card>

        <Card variant="elevated" className="mb-4">
          <Text className="text-xl font-bold mb-4">Toast 테스트</Text>

          <View className="gap-3">
            <Button
              title="Success Toast"
              variant="secondary"
              size="sm"
              onPress={() => showToast('success', '성공 메시지입니다!')}
            />

            <Button
              title="Error Toast"
              variant="danger"
              size="sm"
              onPress={() => showToast('error', '에러 메시지입니다!')}
            />

            <Button
              title="Warning Toast"
              variant="outline"
              size="sm"
              onPress={() => showToast('warning', '경고 메시지입니다!')}
            />

            <Button
              title="Info Toast"
              variant="primary"
              size="sm"
              onPress={() => showToast('info', '정보 메시지입니다!')}
            />
          </View>
        </Card>

        <Card variant="elevated" className="mb-4">
          <Text className="text-xl font-bold mb-4">Modal 테스트</Text>

          <View className="gap-3">
            <Button
              title="Confirmation Modal"
              variant="primary"
              onPress={() =>
                showModal(
                  '확인',
                  '정말로 이 작업을 수행하시겠습니까?',
                  () => showToast('success', '확인을 눌렀습니다!'),
                  () => showToast('info', '취소를 눌렀습니다!')
                )
              }
            />

            <Button
              title="Info Modal"
              variant="outline"
              onPress={() =>
                showModal(
                  '정보',
                  '이것은 정보 모달입니다. 확인 버튼만 있습니다.',
                  () => showToast('info', '확인!')
                )
              }
            />
          </View>
        </Card>

        <Card variant="outlined" className="mb-4">
          <Text className="text-xl font-bold mb-2">Card 변형 테스트</Text>
          <Text className="text-gray-600">이것은 Outlined 카드입니다</Text>
        </Card>

          <Card variant="elevated" onPress={() => showToast('info', '카드를 눌렀습니다!')}>
            <Text className="text-xl font-bold mb-2">Pressable Card</Text>
            <Text className="text-gray-600">이 카드를 눌러보세요!</Text>
          </Card>
        </View>
      </View>
    </ScrollView>
  );
}
