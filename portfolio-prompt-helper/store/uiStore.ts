import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface UIState {
  // Toast state
  toasts: ToastMessage[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
  clearToasts: () => void;

  // Modal state
  modal: ModalState;
  showModal: (
    title: string,
    content: React.ReactNode,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => void;
  hideModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Toast state
  toasts: [],

  showToast: (type, message, duration = 3000) => {
    const id = Date.now().toString();
    const toast: ToastMessage = { id, type, message, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  hideToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  // Modal state
  modal: {
    isOpen: false,
  },

  showModal: (title, content, onConfirm, onCancel) => {
    set({
      modal: {
        isOpen: true,
        title,
        content,
        onConfirm,
        onCancel,
      },
    });
  },

  hideModal: () => {
    set({
      modal: {
        isOpen: false,
        title: undefined,
        content: undefined,
        onConfirm: undefined,
        onCancel: undefined,
      },
    });
  },
}));
