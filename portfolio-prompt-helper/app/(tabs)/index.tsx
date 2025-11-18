import { View, Text, ScrollView, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useUIStore } from '@/store/uiStore';
import { useSettingsStore } from '@/store/settingsStore';
import { ImageUploader } from '@/components/upload/ImageUploader';
import { ImagePreview } from '@/components/upload/ImagePreview';
import { TemplateList } from '@/components/template/TemplateList';
import { PromptPreview } from '@/components/prompt/PromptPreview';
import { LLMModeSwitcher } from '@/components/llm/LLMModeSwitcher';
import { ModelDownloader } from '@/components/llm/ModelDownloader';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useHistory } from '@/hooks/useHistory';
import { useLLMClient } from '@/hooks/useLLMClient';
import { DEFAULT_TEMPLATES } from '@/constants/templates';
import { Template } from '@/types';
import { generatePrompt } from '@/utils/promptGenerator';
import { getCustomTemplates } from '@/utils/templateStorage';

export default function HomeScreen() {
  const showToast = useUIStore((state) => state.showToast);
  const showModal = useUIStore((state) => state.showModal);
  const llmMode = useSettingsStore((state) => state.llmConfig.mode);
  const { images, loading, pickImages, takePhoto, removeImage, clearImages, convertImagesToBase64 } = useImageUpload();
  const { saveToHistory, loading: savingToHistory } = useHistory();
  const { executeAnalysis, cancelAnalysis, isProcessing, progress } = useLLMClient();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [userNote, setUserNote] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
  const [allTemplates, setAllTemplates] = useState<Template[]>(DEFAULT_TEMPLATES);

  // Load custom templates on mount
  useEffect(() => {
    loadCustomTemplates();
  }, []);

  const loadCustomTemplates = async () => {
    try {
      const customs = await getCustomTemplates();
      setCustomTemplates(customs);
      // Combine default and custom templates
      setAllTemplates([...DEFAULT_TEMPLATES, ...customs]);
    } catch (error) {
      console.error('Error loading custom templates:', error);
    }
  };

  const handleGeneratePrompt = async () => {
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
    setIsSaved(false);

    // Clipboard mode: Just copy to clipboard (existing behavior)
    if (llmMode === 'clipboard') {
      showToast('success', '프롬프트가 생성되었습니다!');
      return;
    }

    // Local LLM mode: Execute AI analysis
    try {
      // Convert images to base64
      const imageData = await convertImagesToBase64(false);
      const base64Images = imageData.images;

      // Execute analysis
      const response = await executeAnalysis(prompt, base64Images);

      setAiResponse(response.text);
      showToast('success', `AI 분석 완료! (${(response.processingTime / 1000).toFixed(1)}초)`);
    } catch (error: any) {
      console.error('AI analysis failed:', error);
      showToast('error', `분석 실패: ${error.message}`);
      setAiResponse(null);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSaveToHistory = async () => {
    if (!selectedTemplate || !generatedPrompt) return;

    try {
      // Convert images to base64 for storage
      const imageData = images.length > 0
        ? await convertImagesToBase64(true)
        : { images: [], thumbnails: [] };

      await saveToHistory({
        templateName: selectedTemplate.name,
        generatedPrompt: generatedPrompt,
        imageCount: images.length,
        images: imageData.images,
        thumbnails: imageData.thumbnails,
        userNote: userNote.trim() || undefined,
        tags: tags,
      });

      setIsSaved(true);
      setShowSaveForm(false);
      setUserNote('');
      setTags([]);
      setTagInput('');
    } catch (error) {
      console.error('Error saving to history:', error);
      showToast('error', '이미지 처리 중 오류가 발생했습니다');
    }
  };

  const handleReset = () => {
    showModal(
      '초기화',
      '모든 내용을 초기화하시겠습니까?',
      () => {
        // Cancel any ongoing analysis
        if (isProcessing) {
          cancelAnalysis();
        }

        clearImages();
        setSelectedTemplate(null);
        setGeneratedPrompt(null);
        setAiResponse(null);
        setShowSaveForm(false);
        setUserNote('');
        setTags([]);
        setTagInput('');
        setIsSaved(false);
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
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold">Step 2. 분석 템플릿 선택</Text>
            {customTemplates.length > 0 && (
              <View className="bg-blue-100 px-2 py-1 rounded">
                <Text className="text-xs font-semibold text-blue-700">
                  커스텀 {customTemplates.length}개 포함
                </Text>
              </View>
            )}
          </View>
          <TemplateList
            templates={allTemplates}
            selectedTemplateId={selectedTemplate?.id}
            onSelectTemplate={setSelectedTemplate}
          />
        </Card>

        {/* Step 2.5: LLM Mode Selection */}
        <Card variant="elevated" className="mb-4">
          <Text className="text-xl font-bold mb-4">Step 3. 분석 방식 선택</Text>
          <LLMModeSwitcher />

          {/* Model Downloader (only show in local mode) */}
          {llmMode === 'local' && (
            <View className="mt-4">
              <ModelDownloader />
            </View>
          )}
        </Card>

        {/* Generate/Analyze Button */}
        {images.length > 0 && selectedTemplate && !generatedPrompt && (
          <View>
            <Button
              title={llmMode === 'clipboard' ? '프롬프트 생성' : 'AI 분석 시작'}
              variant="primary"
              size="lg"
              onPress={handleGeneratePrompt}
              loading={isProcessing}
              disabled={isProcessing}
              fullWidth
            />

            {/* Progress Indicator */}
            {isProcessing && progress && (
              <Card variant="outlined" className="mt-4">
                <View className="items-center py-4">
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text className="text-lg font-semibold text-gray-900 mt-3">
                    {progress.message}
                  </Text>
                  <Text className="text-sm text-gray-600 mt-1">
                    {progress.progress.toFixed(0)}%
                  </Text>
                  <View className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <View
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </View>
                  <Button
                    title="취소"
                    variant="outline"
                    size="sm"
                    onPress={cancelAnalysis}
                    className="mt-4"
                  />
                </View>
              </Card>
            )}
          </View>
        )}

        {/* Step 4: Results */}
        {generatedPrompt && (
          <View className="mb-4">
            <Text className="text-xl font-bold mb-4">Step 4. 결과 확인</Text>

            {/* AI Response (Local LLM mode only) */}
            {llmMode === 'local' && aiResponse && (
              <Card variant="elevated" className="mb-4">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="sparkles" size={24} color="#3B82F6" />
                  <Text className="text-lg font-bold text-gray-900 ml-2">
                    AI 분석 결과
                  </Text>
                </View>
                <View className="bg-blue-50 p-4 rounded-lg">
                  <Text className="text-gray-900 leading-6">{aiResponse}</Text>
                </View>
              </Card>
            )}

            {/* Prompt Preview */}
            <View className="mb-2">
              <Text className="text-base font-semibold text-gray-700 mb-2">
                {llmMode === 'local' ? '사용된 프롬프트' : '생성된 프롬프트'}
              </Text>
            </View>
            <PromptPreview
              prompt={generatedPrompt}
              onEdit={setGeneratedPrompt}
              editable
            />
            <Button
              title={llmMode === 'clipboard' ? '새로 생성' : '다시 분석'}
              variant="outline"
              onPress={handleGeneratePrompt}
              fullWidth
              className="mt-3"
              disabled={isProcessing}
            />

            {/* Save to History Section */}
            <Card variant="elevated" className="mt-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-bold">히스토리 저장</Text>
                {isSaved && (
                  <View className="flex-row items-center">
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text className="text-sm text-green-600 ml-1">저장됨</Text>
                  </View>
                )}
              </View>

              {!isSaved && (
                <>
                  {!showSaveForm ? (
                    <Button
                      title="히스토리에 저장"
                      variant="secondary"
                      onPress={() => setShowSaveForm(true)}
                      fullWidth
                    />
                  ) : (
                    <View>
                      {/* Note Input */}
                      <Text className="text-sm font-semibold text-gray-700 mb-2">
                        메모 (선택사항)
                      </Text>
                      <TextInput
                        value={userNote}
                        onChangeText={setUserNote}
                        placeholder="이 분석에 대한 메모를 입력하세요"
                        multiline
                        numberOfLines={3}
                        className="bg-gray-50 p-3 rounded-lg text-gray-900 mb-4"
                        style={{ minHeight: 80, textAlignVertical: 'top' }}
                      />

                      {/* Tag Input */}
                      <Text className="text-sm font-semibold text-gray-700 mb-2">
                        태그 (선택사항)
                      </Text>
                      <View className="flex-row mb-3">
                        <TextInput
                          value={tagInput}
                          onChangeText={setTagInput}
                          placeholder="태그 입력 후 추가 버튼 클릭"
                          onSubmitEditing={handleAddTag}
                          className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-gray-900 mr-2"
                        />
                        <Pressable
                          onPress={handleAddTag}
                          className="bg-blue-100 px-4 py-2 rounded-lg items-center justify-center"
                        >
                          <Text className="text-blue-700 font-semibold">추가</Text>
                        </Pressable>
                      </View>

                      {/* Tags Display */}
                      {tags.length > 0 && (
                        <View className="flex-row flex-wrap gap-2 mb-4">
                          {tags.map((tag, index) => (
                            <View
                              key={index}
                              className="bg-blue-100 px-3 py-2 rounded-full flex-row items-center"
                            >
                              <Text className="text-sm text-blue-700 mr-2">#{tag}</Text>
                              <Pressable onPress={() => handleRemoveTag(tag)}>
                                <Ionicons name="close-circle" size={16} color="#3B82F6" />
                              </Pressable>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Action Buttons */}
                      <View className="flex-row gap-2">
                        <Button
                          title="저장"
                          variant="primary"
                          onPress={handleSaveToHistory}
                          loading={savingToHistory}
                          fullWidth
                        />
                        <Button
                          title="취소"
                          variant="outline"
                          onPress={() => {
                            setShowSaveForm(false);
                            setUserNote('');
                            setTags([]);
                            setTagInput('');
                          }}
                          fullWidth
                        />
                      </View>
                    </View>
                  )}
                </>
              )}

              {isSaved && (
                <Text className="text-sm text-gray-600 text-center">
                  히스토리 탭에서 저장된 분석을 확인할 수 있습니다
                </Text>
              )}
            </Card>
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
