import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { useUIStore } from '@/store/uiStore';

export interface ImageAsset {
  uri: string;
  base64?: string;
  width?: number;
  height?: number;
}

export function useImageUpload() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageAsset[]>([]);
  const showToast = useUIStore((state) => state.showToast);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('error', '갤러리 접근 권한이 필요합니다');
      return false;
    }
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

  const compressAndConvert = async (uri: string): Promise<ImageAsset> => {
    try {
      // Resize and compress image
      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1920 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Convert to base64 (optional, for storage)
      const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
        encoding: 'base64',
      });

      return {
        uri: manipulated.uri,
        base64: `data:image/jpeg;base64,${base64}`,
        width: manipulated.width,
        height: manipulated.height,
      };
    } catch (error) {
      console.error('Image compression error:', error);
      throw error;
    }
  };

  const pickImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      });

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

      // Compress and convert images
      const processedImages = await Promise.all(
        result.assets.map((asset) => compressAndConvert(asset.uri))
      );

      setImages([...images, ...processedImages]);
      showToast('success', `${processedImages.length}장의 이미지를 추가했습니다`);
    } catch (error) {
      console.error('Image picker error:', error);
      showToast('error', '이미지 업로드 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
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

      const processedImage = await compressAndConvert(result.assets[0].uri);
      setImages([...images, processedImage]);
      showToast('success', '사진을 추가했습니다');
    } catch (error) {
      console.error('Camera error:', error);
      showToast('error', '사진 촬영 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    showToast('info', '이미지를 삭제했습니다');
  };

  const clearImages = () => {
    setImages([]);
    showToast('info', '모든 이미지를 삭제했습니다');
  };

  return {
    images,
    loading,
    pickImages,
    takePhoto,
    removeImage,
    clearImages,
    setImages,
  };
}
