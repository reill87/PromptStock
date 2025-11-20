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
          // 케이스 1: AsyncStorage에 정보 있음 → 파일 검증

          // 호환성 체크 제거 - LLaVA 1.5를 시도해봄
          // const isLLaVAModel = (currentModel.modelId as string).includes('llava');
          // if (isLLaVAModel) {
          //   console.warn('⚠️ LLaVA 모델은 llama.rn과 호환성 문제가 있어 제거합니다.');
          //   console.log('ℹ️ SmolVLM2 모델을 다운로드해주세요.');
          //   await setInstalledModel(null);
          //   return;
          // }

          const filesExist = await ModelManager.verifyModelFiles(currentModel);

          if (!filesExist) {
            console.warn('Model files not found, clearing installed model state');
            // 파일이 없으면 상태 초기화
            await setInstalledModel(null);
          } else {
            console.log('Model files verified successfully');
          }
        } else {
          // 케이스 2: AsyncStorage에 정보 없음 → 파일이 있는지 확인 (스크립트로 복사한 경우)
          console.log('No installed model in storage, checking for existing files...');

          const modelsDir = `${require('expo-file-system/legacy').documentDirectory}models/`;
          const modelPath = `${modelsDir}llava-v1.5-7b-q4.gguf`;
          const mmprojPath = `${modelsDir}llava-v1.5-7b-mmproj.gguf`;

          const FileSystem = require('expo-file-system/legacy');
          const modelInfo = await FileSystem.getInfoAsync(modelPath);
          const mmprojInfo = await FileSystem.getInfoAsync(mmprojPath);

          if (modelInfo.exists && mmprojInfo.exists) {
            console.log('Found existing model files! Auto-registering...');

            // 파일이 있으면 자동으로 등록
            const autoInstalledModel = {
              modelId: 'llava-1.5-7b-q4' as const,
              installedAt: new Date().toISOString(),
              version: '1.5',
              files: {
                modelPath,
                mmprojPath,
              },
              diskUsage: (modelInfo.size || 0) + (mmprojInfo.size || 0),
            };

            await setInstalledModel(autoInstalledModel);
            console.log('✅ Model auto-registered successfully!');
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
