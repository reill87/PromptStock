import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@portfolio_settings';

export type ImageQuality = 'low' | 'medium' | 'high';

export interface AppSettings {
  // Template settings
  defaultTemplateId: string | null;

  // Image settings
  imageQuality: ImageQuality;

  // App settings
  appVersion: string;

  // Feature flags (for future use)
  enableHaptics: boolean;
  enableAnalytics: boolean;
}

interface SettingsState extends AppSettings {
  // Actions
  setDefaultTemplate: (templateId: string | null) => Promise<void>;
  setImageQuality: (quality: ImageQuality) => Promise<void>;
  setEnableHaptics: (enabled: boolean) => Promise<void>;
  setEnableAnalytics: (enabled: boolean) => Promise<void>;
  loadSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  defaultTemplateId: null,
  imageQuality: 'medium',
  appVersion: '1.0.0',
  enableHaptics: true,
  enableAnalytics: false,
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

  setEnableHaptics: async (enabled) => {
    set({ enableHaptics: enabled });
    await saveSettings(get());
  },

  setEnableAnalytics: async (enabled) => {
    set({ enableAnalytics: enabled });
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
      appVersion: settings.appVersion ?? DEFAULT_SETTINGS.appVersion,
      enableHaptics: settings.enableHaptics ?? DEFAULT_SETTINGS.enableHaptics,
      enableAnalytics: settings.enableAnalytics ?? DEFAULT_SETTINGS.enableAnalytics,
    };

    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsToSave));
  } catch (error) {
    console.error('Error saving settings:', error);
    throw new Error('설정 저장 중 오류가 발생했습니다');
  }
}
