import '../global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { ToastContainer } from '@/components/common/Toast';
import { Modal } from '@/components/common/Modal';
import { useModelStore } from '@/store/modelStore';
import { ModelManager } from '@/services/model/ModelManager';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const loadInstalledModel = useModelStore((state) => state.loadInstalledModel);
  const installedModel = useModelStore((state) => state.installedModel);
  const setInstalledModel = useModelStore((state) => state.setInstalledModel);

  // 앱 시작 시 저장된 모델 정보 로드 및 검증
  useEffect(() => {
    const initializeModel = async () => {
      try {
        // AsyncStorage에서 모델 정보 로드
        await loadInstalledModel();

        // 모델 정보가 있다면 파일 존재 여부 확인
        const currentModel = useModelStore.getState().installedModel;
        if (currentModel) {
          const filesExist = await ModelManager.verifyModelFiles(currentModel);

          if (!filesExist) {
            console.warn('Model files not found, clearing installed model state');
            // 파일이 없으면 상태 초기화
            await setInstalledModel(null);
          } else {
            console.log('Model files verified successfully');
          }
        }
      } catch (error) {
        console.error('Failed to initialize model on startup:', error);
      }
    };

    initializeModel();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <ToastContainer />
      <Modal />
    </ThemeProvider>
  );
}
