import { Modal as RNModal, View, Text, Pressable } from 'react-native';
import { useUIStore } from '@/store/uiStore';
import { Button } from './Button';
import { ReactNode } from 'react';

export function Modal() {
  const modal = useUIStore((state) => state.modal);
  const hideModal = useUIStore((state) => state.hideModal);

  const handleConfirm = () => {
    modal.onConfirm?.();
    hideModal();
  };

  const handleCancel = () => {
    modal.onCancel?.();
    hideModal();
  };

  return (
    <RNModal
      visible={modal.isOpen}
      transparent
      animationType="fade"
      onRequestClose={hideModal}
    >
      {/* Backdrop */}
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={hideModal}
      >
        {/* Modal Content */}
        <Pressable
          className="bg-white rounded-lg p-6 m-4 max-w-md w-11/12"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Title */}
          {modal.title && (
            <Text className="text-xl font-bold mb-4">{modal.title}</Text>
          )}

          {/* Content */}
          {typeof modal.content === 'string' ? (
            <Text className="text-gray-700 mb-6">{modal.content}</Text>
          ) : (
            <View className="mb-6">{modal.content as ReactNode}</View>
          )}

          {/* Actions */}
          <View className="flex-row gap-3">
            {modal.onCancel && (
              <Button
                title="취소"
                variant="outline"
                onPress={handleCancel}
                fullWidth
              />
            )}
            {modal.onConfirm && (
              <Button
                title="확인"
                variant="primary"
                onPress={handleConfirm}
                fullWidth
              />
            )}
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
