import React, { useCallback, memo } from 'react';
import { View, Text, Image, Pressable, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ImageAsset } from '@/hooks/useImageUpload';

interface ImagePreviewProps {
  images: ImageAsset[];
  onRemove: (index: number) => void;
  onClear?: () => void;
}

export const ImagePreview = memo(function ImagePreview({
  images,
  onRemove,
  onClear
}: ImagePreviewProps) {
  const keyExtractor = useCallback((item: ImageAsset, index: number) =>
    item.uri || index.toString(),
    []
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ImageAsset; index: number }) => (
      <ImagePreviewItem
        image={item}
        index={index}
        onRemove={() => onRemove(index)}
      />
    ),
    [onRemove]
  );

  const renderSeparator = useCallback(() => <View className="w-3" />, []);

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
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        contentContainerClassName="pb-2"
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        initialNumToRender={5}
        windowSize={3}
      />
    </View>
  );
});

interface ImagePreviewItemProps {
  image: ImageAsset;
  index: number;
  onRemove: () => void;
}

const ImagePreviewItem = memo(function ImagePreviewItem({
  image,
  index,
  onRemove
}: ImagePreviewItemProps) {
  return (
    <View className="relative">
      <Image
        source={{ uri: image.uri }}
        className="w-32 h-32 rounded-lg"
        resizeMode="cover"
        // Enable caching for better performance
        cache="force-cache"
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
});
