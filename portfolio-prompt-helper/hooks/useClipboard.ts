import { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useUIStore } from '@/store/uiStore';

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const showToast = useUIStore((state) => state.showToast);

  const copy = async (text: string): Promise<boolean> => {
    try {
      await Clipboard.setStringAsync(text);

      // Haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setCopied(true);
      showToast('success', '클립보드에 복사되었습니다!');

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      return true;
    } catch (error) {
      console.error('Clipboard error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast('error', '복사 중 오류가 발생했습니다');
      return false;
    }
  };

  const paste = async (): Promise<string | null> => {
    try {
      const text = await Clipboard.getStringAsync();
      return text;
    } catch (error) {
      console.error('Clipboard paste error:', error);
      showToast('error', '붙여넣기 중 오류가 발생했습니다');
      return null;
    }
  };

  return {
    copy,
    paste,
    copied,
  };
}
