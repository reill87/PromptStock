import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LLMConfig, LLMMode, LocalLLMConfig } from '@/types/llm';

const SETTINGS_KEY = '@portfolio_settings';

export type ImageQuality = 'low' | 'medium' | 'high';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  // Template settings
  defaultTemplateId: string | null;

  // Image settings
  imageQuality: ImageQuality;

  // Theme settings
  themeMode: ThemeMode;

  // App settings
  appVersion: string;

  // Feature flags (for future use)
  enableHaptics: boolean;
  enableAnalytics: boolean;

  // LLM settings (신규)
  llmConfig: LLMConfig;
  showBatteryWarning: boolean;
  showStorageWarning: boolean;
}

interface SettingsState extends AppSettings {
  // Actions
  setDefaultTemplate: (templateId: string | null) => Promise<void>;
  setImageQuality: (quality: ImageQuality) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setEnableHaptics: (enabled: boolean) => Promise<void>;
  setEnableAnalytics: (enabled: boolean) => Promise<void>;

  // LLM Actions (신규)
  setLLMMode: (mode: LLMMode) => Promise<void>;
  setLocalLLMConfig: (config: Partial<LocalLLMConfig>) => Promise<void>;
  setShowBatteryWarning: (show: boolean) => Promise<void>;
  setShowStorageWarning: (show: boolean) => Promise<void>;

  loadSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  defaultTemplateId: null,
  imageQuality: 'medium',
  themeMode: 'system',
  appVersion: '1.0.0',
  enableHaptics: true,
  enableAnalytics: false,

  // LLM 기본 설정
  llmConfig: {
    mode: 'clipboard', // 기본은 클립보드 모드
    localConfig: {
      modelType: 'llava-1.5-7b-q4',
      enableGPU: false,
      maxTokens: 512,
      temperature: 0.7,
      contextSize: 2048,
    },
  },
  showBatteryWarning: true,
  showStorageWarning: true,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,

  setDefaultTemplate: async (templateId) => {
    set({ defaultTemplateId: templateId });
    await saveSettings(get());
  },

  setImageQuality: async (quality) => {
    set({ imageQuality: quality });
    await saveSettings(get());
  },

  setThemeMode: async (mode) => {
    set({ themeMode: mode });
    await saveSettings(get());
  },

  setEnableHaptics: async (enabled) => {
    set({ enableHaptics: enabled });
    await saveSettings(get());
  },

  setEnableAnalytics: async (enabled) => {
    set({ enableAnalytics: enabled });
    await saveSettings(get());
  },

  // LLM Actions (신규)
  setLLMMode: async (mode) => {
    set((state) => ({
      llmConfig: { ...state.llmConfig, mode },
    }));
    await saveSettings(get());
  },

  setLocalLLMConfig: async (config) => {
    set((state) => ({
      llmConfig: {
        ...state.llmConfig,
        localConfig: { ...state.llmConfig.localConfig!, ...config },
      },
    }));
    await saveSettings(get());
  },

  setShowBatteryWarning: async (show) => {
    set({ showBatteryWarning: show });
    await saveSettings(get());
  },

  setShowStorageWarning: async (show) => {
    set({ showStorageWarning: show });
    await saveSettings(get());
  },

  loadSettings: async () => {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) {
        const settings = JSON.parse(data);
        set(settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  },

  resetSettings: async () => {
    set(DEFAULT_SETTINGS);
    await saveSettings(DEFAULT_SETTINGS);
  },
}));

// Helper function to save settings
async function saveSettings(settings: Partial<AppSettings>): Promise<void> {
  try {
    // Only save the settings data, not the actions
    const settingsToSave: AppSettings = {
      defaultTemplateId: settings.defaultTemplateId ?? DEFAULT_SETTINGS.defaultTemplateId,
      imageQuality: settings.imageQuality ?? DEFAULT_SETTINGS.imageQuality,
      themeMode: settings.themeMode ?? DEFAULT_SETTINGS.themeMode,
      appVersion: settings.appVersion ?? DEFAULT_SETTINGS.appVersion,
      enableHaptics: settings.enableHaptics ?? DEFAULT_SETTINGS.enableHaptics,
      enableAnalytics: settings.enableAnalytics ?? DEFAULT_SETTINGS.enableAnalytics,

      // LLM 설정 저장
      llmConfig: settings.llmConfig ?? DEFAULT_SETTINGS.llmConfig,
      showBatteryWarning: settings.showBatteryWarning ?? DEFAULT_SETTINGS.showBatteryWarning,
      showStorageWarning: settings.showStorageWarning ?? DEFAULT_SETTINGS.showStorageWarning,
    };

    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsToSave));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw new Error('설정 저장 중 오류가 발생했습니다');
  }
}
