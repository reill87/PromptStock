import { useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore, ThemeMode } from '@/store/settingsStore';
import { colorScheme } from 'nativewind';

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const { themeMode, setThemeMode } = useSettingsStore();

  // Get actual theme based on mode (system/light/dark)
  const activeTheme = useCallback(() => {
    if (themeMode === 'system') {
      return systemColorScheme || 'light';
    }
    return themeMode;
  }, [themeMode, systemColorScheme]);

  // Apply theme to NativeWind
  useEffect(() => {
    const theme = activeTheme();
    colorScheme.set(theme);
  }, [activeTheme]);

  // Toggle theme function
  const toggleTheme = useCallback(async () => {
    const newMode: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    await setThemeMode(newMode);
  }, [themeMode, setThemeMode]);

  // Set specific theme
  const setTheme = useCallback(
    async (mode: ThemeMode) => {
      await setThemeMode(mode);
    },
    [setThemeMode]
  );

  return {
    themeMode,
    activeTheme: activeTheme(),
    isDark: activeTheme() === 'dark',
    toggleTheme,
    setTheme,
  };
}
