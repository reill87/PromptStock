import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import { useUIStore } from '@/store/uiStore';
import { useSettingsStore } from '@/store/settingsStore';

export interface ImageAsset {
  uri: string;
  base64?: string;
  width?: number;
  height?: number;
}

// Quality settings mapping
const QUALITY_SETTINGS = {
  low: { compress: 0.5, maxWidth: 1280 },
  medium: { compress: 0.7, maxWidth: 1920 },
  high: { compress: 0.9, maxWidth: 2560 },
};

export function useImageUpload() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageAsset[]>([]);
  const showToast = useUIStore((state) => state.showToast);
  const imageQuality = useSettingsStore((state) => state.imageQuality);

  const requestPermissions = async () => {
    console.log('🔐 Requesting media library permissions...');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('🔐 Permission status:', status);

    if (status !== 'granted') {
      console.error('❌ Permission denied:', status);
      showToast('error', '갤러리 접근 권한이 필요합니다');
      return false;
    }

    console.log('✅ Permission granted');
    return true;
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showToast('error', '카메라 접근 권한이 필요합니다');
      return false;
    }
    return true;
  };

  const compressAndConvert = useCallback(
    async (uri: string, includeBase64: boolean = false): Promise<ImageAsset> => {
      try {
        const qualitySettings = QUALITY_SETTINGS[imageQuality];

        // Resize and compress image based on quality settings
        const manipulated = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: qualitySettings.maxWidth } }],
          {
            compress: qualitySettings.compress,
            format: ImageManipulator.SaveFormat.JPEG
          }
        );

        // Convert to base64 only if needed (for storage)
        let base64: string | undefined;
        if (includeBase64) {
          if (Platform.OS === 'web') {
            // Web: use fetch and FileReader
            const response = await fetch(manipulated.uri);
            const blob = await response.blob();
            base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } else {
            // Native: use FileSystem
            const base64String = await FileSystem.readAsStringAsync(manipulated.uri, {
              encoding: 'base64',
            });
            base64 = `data:image/jpeg;base64,${base64String}`;
          }
        }

        return {
          uri: manipulated.uri,
          base64,
          width: manipulated.width,
          height: manipulated.height,
        };
      } catch (error) {
        console.error('Image compression error:', error);
        throw error;
      }
    },
    [imageQuality]
  );

  const pickImages = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    try {
      console.log('📸 Opening image picker...');

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      });

      console.log('📸 Image picker result:', result.canceled ? 'canceled' : `${result.assets.length} images selected`);

      if (result.canceled) {
        setLoading(false);
        return;
      }

      // Check total image count (max 5)
      const totalImages = images.length + result.assets.length;
      if (totalImages > 5) {
        showToast('warning', '최대 5장까지 업로드 가능합니다');
        setLoading(false);
        return;
      }

      // Process images sequentially to avoid memory issues
      const processedImages: ImageAsset[] = [];
      for (let i = 0; i < result.assets.length; i++) {
        const asset = result.assets[i];
        console.log(`🖼️  Processing image ${i + 1}/${result.assets.length}...`);

        try {
          const processed = await compressAndConvert(asset.uri, false);
          processedImages.push(processed);
          console.log(`✅ Image ${i + 1} processed successfully`);
        } catch (error) {
          console.error(`❌ Failed to process image ${i + 1}:`, error);
          showToast('warning', `이미지 ${i + 1} 처리 실패`);
        }
      }

      if (processedImages.length > 0) {
        setImages([...images, ...processedImages]);
        showToast('success', `${processedImages.length}장의 이미지를 추가했습니다`);
      } else {
        showToast('error', '이미지 처리에 실패했습니다');
      }
    } catch (error) {
      console.error('❌ Image picker error:', error);
      showToast('error', '이미지 업로드 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
      console.log('📸 Image picker completed');
    }
  }, [images, compressAndConvert, showToast]);

  const takePhoto = useCallback(async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    // Check total image count (max 5)
    if (images.length >= 5) {
      showToast('warning', '최대 5장까지 업로드 가능합니다');
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: false,
      });

      if (result.canceled) {
        setLoading(false);
        return;
      }

      const processedImage = await compressAndConvert(result.assets[0].uri, false);
      setImages([...images, processedImage]);
      showToast('success', '사진을 추가했습니다');
    } catch (error) {
      console.error('Camera error:', error);
      showToast('error', '사진 촬영 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  }, [images, compressAndConvert, showToast]);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    showToast('info', '이미지를 삭제했습니다');
  }, [images, showToast]);

  const clearImages = useCallback(() => {
    setImages([]);
    showToast('info', '모든 이미지를 삭제했습니다');
  }, [showToast]);

  /**
   * Convert images to base64 for storage
   * @param includeThumbnails - Generate small thumbnails for list view
   */
  const convertImagesToBase64 = useCallback(async (includeThumbnails: boolean = true) => {
    try {
      const base64Images: string[] = [];
      const thumbnails: string[] = [];

      for (const image of images) {
        // Convert full image to base64
        const fullImage = await compressAndConvert(image.uri, true);
        if (fullImage.base64) {
          base64Images.push(fullImage.base64);
        }

        // Generate thumbnail if requested
        if (includeThumbnails) {
          const thumbnail = await ImageManipulator.manipulateAsync(
            image.uri,
            [{ resize: { width: 128 } }],
            {
              compress: 0.5,
              format: ImageManipulator.SaveFormat.JPEG
            }
          );

          let thumbnailBase64: string;
          if (Platform.OS === 'web') {
            // Web: use fetch and FileReader
            const response = await fetch(thumbnail.uri);
            const blob = await response.blob();
            thumbnailBase64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } else {
            // Native: use FileSystem
            const base64String = await FileSystem.readAsStringAsync(thumbnail.uri, {
              encoding: 'base64',
            });
            thumbnailBase64 = `data:image/jpeg;base64,${base64String}`;
          }
          thumbnails.push(thumbnailBase64);
        }
      }

      return { images: base64Images, thumbnails: includeThumbnails ? thumbnails : undefined };
    } catch (error) {
      console.error('Error converting images to base64:', error);
      throw error;
    }
  }, [images, compressAndConvert]);

  return {
    images,
    loading,
    pickImages,
    takePhoto,
    removeImage,
    clearImages,
    setImages,
    convertImagesToBase64,
  };
}
