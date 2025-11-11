import { View, Text, Pressable } from 'react-native';
import { useUIStore, ToastType } from '@/store/uiStore';
import { Ionicons } from '@expo/vector-icons';

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const hideToast = useUIStore((state) => state.hideToast);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View className="absolute top-12 left-0 right-0 z-50 px-4">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </View>
  );
}

interface ToastItemProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: () => void;
}

function ToastItem({ type, message, onClose }: ToastItemProps) {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  };

  const icons: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
    success: 'checkmark-circle',
    error: 'close-circle',
    warning: 'warning',
    info: 'information-circle',
  };

  return (
    <View
      className={`${bgColors[type]} rounded-lg p-4 mb-2 flex-row items-center shadow-lg`}
    >
      <Ionicons name={icons[type]} size={24} color="white" />
      <Text className="text-white font-medium flex-1 ml-3">{message}</Text>
      <Pressable onPress={onClose} className="ml-2">
        <Ionicons name="close" size={20} color="white" />
      </Pressable>
    </View>
  );
}
