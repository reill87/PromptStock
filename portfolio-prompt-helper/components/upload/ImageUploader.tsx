import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/common/Button';

interface ImageUploaderProps {
  onPickImages: () => void;
  onTakePhoto: () => void;
  loading: boolean;
  imageCount: number;
  maxImages?: number;
}

export function ImageUploader({
  onPickImages,
  onTakePhoto,
  loading,
  imageCount,
  maxImages = 5,
}: ImageUploaderProps) {
  const isMaxReached = imageCount >= maxImages;

  return (
    <View className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300">
      <View className="items-center">
        <Ionicons name="images-outline" size={64} color="#9CA3AF" />
        <Text className="text-xl font-bold mt-4 text-gray-900">
          포트폴리오 스크린샷 업로드
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          증권 앱 스크린샷을 업로드하거나{'\n'}
          직접 촬영해주세요
        </Text>
        <Text className="text-sm text-gray-500 mt-2">
          {imageCount}/{maxImages}장
        </Text>

        {isMaxReached && (
          <View className="mt-3 bg-yellow-100 p-3 rounded-lg">
            <Text className="text-yellow-800 text-sm text-center">
              최대 {maxImages}장까지 업로드 가능합니다
            </Text>
          </View>
        )}

        <View className="flex-row gap-3 mt-6 w-full">
          <Button
            title="갤러리에서 선택"
            variant="primary"
            onPress={onPickImages}
            loading={loading}
            disabled={isMaxReached}
            fullWidth
          />
          <Button
            title="사진 촬영"
            variant="outline"
            onPress={onTakePhoto}
            loading={loading}
            disabled={isMaxReached}
            fullWidth
          />
        </View>

        <Text className="text-xs text-gray-400 mt-4 text-center">
          JPG, PNG 형식 지원 · 자동 압축
        </Text>
      </View>
    </View>
  );
}
