import { View, Text, Image, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImageAsset } from '@/hooks/useImageUpload';

interface ImagePreviewProps {
  images: ImageAsset[];
  onRemove: (index: number) => void;
  onClear?: () => void;
}

export function ImagePreview({ images, onRemove, onClear }: ImagePreviewProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <View className="mt-4">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-900">
          업로드된 이미지 ({images.length}장)
        </Text>
        {onClear && (
          <Pressable onPress={onClear} className="flex-row items-center">
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
            <Text className="text-red-500 ml-1 text-sm">전체 삭제</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <ImagePreviewItem
            image={item}
            index={index}
            onRemove={() => onRemove(index)}
          />
        )}
        ItemSeparatorComponent={() => <View className="w-3" />}
        contentContainerClassName="pb-2"
      />
    </View>
  );
}

interface ImagePreviewItemProps {
  image: ImageAsset;
  index: number;
  onRemove: () => void;
}

function ImagePreviewItem({ image, index, onRemove }: ImagePreviewItemProps) {
  return (
    <View className="relative">
      <Image
        source={{ uri: image.uri }}
        className="w-32 h-32 rounded-lg"
        resizeMode="cover"
      />

      {/* Remove Button */}
      <Pressable
        onPress={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center shadow-lg"
      >
        <Ionicons name="close" size={16} color="white" />
      </Pressable>

      {/* Index Badge */}
      <View className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
        <Text className="text-white text-xs font-bold">{index + 1}</Text>
      </View>
    </View>
  );
}
