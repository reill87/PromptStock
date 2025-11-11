# Portfolio Prompt Helper - 구현 로드맵

## 📅 전체 일정: 4주 (28일)

**시작일**: TBD
**목표 완료일**: TBD
**일일 작업 시간**: 6-8시간 기준

---

## Week 1: 프로젝트 셋업 및 기본 구조 (Day 1-7)

### Day 1: Expo 프로젝트 생성 및 초기 설정
**목표**: Expo 프로젝트 생성 및 필수 패키지 설치

- [ ] 새 Expo 프로젝트 생성
```bash
npx create-expo-app@latest portfolio-prompt-helper --template tabs
cd portfolio-prompt-helper
```

- [ ] Git 초기화 및 첫 커밋
```bash
git init
git add .
git commit -m "Initial Expo project setup"
```

- [ ] 필수 Expo 패키지 설치
```bash
npx expo install expo-router expo-image-picker expo-image-manipulator expo-file-system expo-clipboard expo-haptics
npx expo install @react-native-async-storage/async-storage
npx expo install react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated
```

- [ ] 기존 패키지 설치
```bash
npm install zustand react-hook-form
```

- [ ] 개발 서버 실행 테스트
```bash
npx expo start --web
```

**완료 기준**: 웹에서 기본 Expo Tabs 앱이 정상 실행됨

---

### Day 2: NativeWind 설정 및 기본 스타일
**목표**: NativeWind 설정 완료 및 스타일 시스템 구축

- [ ] NativeWind 설치
```bash
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npx tailwindcss init
```

- [ ] `tailwind.config.js` 설정
```javascript
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
      },
    },
  },
  plugins: [],
};
```

- [ ] `metro.config.js` 생성
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' });
```

- [ ] `babel.config.js` 수정
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    ],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
```

- [ ] `global.css` 생성
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] `app/_layout.tsx`에 global.css import
```tsx
import '../global.css';
```

- [ ] 테스트: 간단한 컴포넌트에 NativeWind 클래스 적용해보기

**완료 기준**: Tailwind 클래스가 정상 적용됨 (웹/앱 모두)

---

### Day 3: 기존 타입 및 상수 마이그레이션
**목표**: 기존 타입 정의 및 템플릿 데이터 새 프로젝트로 이동

- [ ] `types/` 폴더 생성 및 파일 복사
  - [ ] `types/template.ts`
  - [ ] `types/analysis.ts`
  - [ ] `types/common.ts`
  - [ ] `types/index.ts`

- [ ] `constants/` 폴더 생성 및 파일 복사
  - [ ] `constants/templates.ts`
  - [ ] `constants/colors.ts` (새로 생성)

- [ ] Import 경로 검증

- [ ] TypeScript 컴파일 에러 확인
```bash
npx tsc --noEmit
```

**완료 기준**: 타입 에러 없이 컴파일 성공

---

### Day 4: 공통 컴포넌트 구현 (Part 1)
**목표**: Button, Card 등 기본 UI 컴포넌트 구현

- [ ] `components/common/Button.tsx` 구현
```tsx
import { Pressable, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

export function Button({ onPress, title, variant = 'primary', loading, disabled }: ButtonProps) {
  const baseClass = 'px-4 py-3 rounded-lg items-center justify-center';
  const variantClass = {
    primary: 'bg-blue-500 active:bg-blue-600',
    secondary: 'bg-gray-500 active:bg-gray-600',
    danger: 'bg-red-500 active:bg-red-600',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClass} ${variantClass[variant]} ${disabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white font-semibold">{title}</Text>
      )}
    </Pressable>
  );
}
```

- [ ] `components/common/Card.tsx` 구현
```tsx
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return (
    <View className="bg-white rounded-lg p-4 shadow-md" {...props}>
      {children}
    </View>
  );
}
```

- [ ] `components/common/index.ts` (export 정리)

**완료 기준**: Button과 Card 컴포넌트가 웹/앱에서 정상 렌더링

---

### Day 5: 공통 컴포넌트 구현 (Part 2)
**목표**: Toast, Modal 등 고급 UI 컴포넌트 구현

- [ ] `components/common/Toast.tsx` 구현 (Zustand 기반)

- [ ] `components/common/Modal.tsx` 구현

- [ ] `store/uiStore.ts` 생성 (Toast, Modal 상태 관리)

**완료 기준**: Toast와 Modal 동작 확인

---

### Day 6: Expo Router 라우팅 구조 설정
**목표**: 탭 네비게이션 및 스택 네비게이션 설정

- [ ] `app/_layout.tsx` 루트 레이아웃 설정
```tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="analysis" options={{ title: '새 분석' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
```

- [ ] `app/(tabs)/_layout.tsx` 탭 레이아웃 설정
```tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: '히스토리',
          tabBarIcon: ({ color }) => <Ionicons name="time" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
```

- [ ] 각 탭 화면 기본 구조 생성
  - [ ] `app/(tabs)/index.tsx` (홈)
  - [ ] `app/(tabs)/history.tsx` (히스토리)
  - [ ] `app/(tabs)/settings.tsx` (설정)

- [ ] `app/analysis/new.tsx` 생성

- [ ] `app/+not-found.tsx` 생성

- [ ] 네비게이션 테스트 (탭 전환, 화면 이동)

**완료 기준**: 모든 탭과 화면 간 네비게이션 정상 작동

---

### Day 7: Week 1 정리 및 테스트
**목표**: Week 1 마일스톤 검증 및 문서화

- [ ] 웹 빌드 테스트
```bash
npx expo export:web
```

- [ ] iOS 시뮬레이터 테스트 (Mac만)
```bash
npx expo start --ios
```

- [ ] Android 에뮬레이터 테스트
```bash
npx expo start --android
```

- [ ] 코드 리뷰 및 리팩토링

- [ ] Git 커밋 정리
```bash
git add .
git commit -m "Week 1: Complete project setup and basic structure"
```

- [ ] 진행 상황 문서화 (README 업데이트)

**완료 기준**: 웹/iOS/Android 모두에서 기본 앱 구조 동작 확인

---

## Week 2: 핵심 기능 구현 (Day 8-14)

### Day 8: 이미지 업로드 - Expo Image Picker 구현
**목표**: 갤러리 선택 및 카메라 촬영 기능 구현

- [ ] `hooks/useImageUpload.ts` 구현
```tsx
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export function useImageUpload() {
  const [loading, setLoading] = useState(false);

  const pickImages = async (): Promise<string[]> => {
    setLoading(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('권한이 필요합니다');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      });

      if (result.canceled) return [];

      // 이미지 압축 및 리사이즈
      const compressedImages = await Promise.all(
        result.assets.map(async (asset) => {
          const manipulated = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 1920 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
          return manipulated.uri;
        })
      );

      return compressedImages;
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    setLoading(true);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('카메라 권한이 필요합니다');
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: false,
      });

      if (result.canceled) return null;

      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1920 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      return manipulated.uri;
    } finally {
      setLoading(false);
    }
  };

  return { pickImages, takePhoto, loading };
}
```

- [ ] `components/upload/ImageUploader.tsx` 구현

- [ ] `components/upload/ImagePreview.tsx` 구현

- [ ] 권한 처리 (iOS Info.plist, Android permissions)

**완료 기준**: 갤러리 선택 및 카메라 촬영 정상 작동

---

### Day 9: 이미지 업로드 UI 완성
**목표**: 드래그 앤 드롭 (웹), 이미지 미리보기, 삭제 기능

- [ ] 웹 브라우저 드래그 앤 드롭 지원

- [ ] 이미지 미리보기 그리드 레이아웃

- [ ] 이미지 삭제 버튼

- [ ] 최대 5장 제한 로직

- [ ] 파일 크기 검증

**완료 기준**: 최대 5장까지 업로드 및 미리보기 동작

---

### Day 10: 템플릿 선택 UI
**목표**: 템플릿 카드 및 리스트 구현

- [ ] `components/template/TemplateCard.tsx` 구현
```tsx
import { Pressable, Text, View } from 'react-native';
import { Template } from '@/types';

interface TemplateCardProps {
  template: Template;
  onSelect: () => void;
  selected?: boolean;
}

export function TemplateCard({ template, onSelect, selected }: TemplateCardProps) {
  return (
    <Pressable
      onPress={onSelect}
      className={`p-4 rounded-lg border-2 ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
    >
      <Text className="text-4xl mb-2">{template.icon}</Text>
      <Text className="text-lg font-bold mb-1">{template.name}</Text>
      <Text className="text-sm text-gray-600">{template.description}</Text>
      <Text className="text-xs text-gray-400 mt-2">
        사용 {template.usageCount}회
      </Text>
    </Pressable>
  );
}
```

- [ ] `components/template/TemplateList.tsx` 구현 (FlatList 사용)

- [ ] 템플릿 검색 기능

- [ ] 카테고리 필터

**완료 기준**: 템플릿 선택 및 검색 정상 작동

---

### Day 11: 프롬프트 생성 로직
**목표**: 템플릿 + 이미지 → 프롬프트 생성

- [ ] `utils/promptGenerator.ts` 구현
```typescript
import { Template } from '@/types';

export function generatePrompt(
  template: Template,
  imageCount: number,
  customInputs?: Record<string, string>
): string {
  let prompt = template.promptTemplate;

  // 변수 치환
  if (template.variables.length > 0 && customInputs) {
    template.variables.forEach((variable) => {
      const value = customInputs[variable.key] || variable.defaultValue || '';
      prompt = prompt.replace(`{{${variable.key}}}`, value);
    });
  }

  // 이미지 개수 표시
  const imageText = imageCount > 1
    ? `위 ${imageCount}개의 포트폴리오 이미지를 보고`
    : '위 포트폴리오 이미지를 보고';

  prompt = prompt.replace(/위 포트폴리오 이미지를 보고/g, imageText);

  return prompt;
}
```

- [ ] `components/prompt/PromptPreview.tsx` 구현

- [ ] 프롬프트 수정 기능 (TextInput)

**완료 기준**: 프롬프트가 정확히 생성됨

---

### Day 12: 클립보드 복사 기능
**목표**: Expo Clipboard 활용한 복사 기능

- [ ] `hooks/useClipboard.ts` 구현
```typescript
import { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string): Promise<boolean> => {
    try {
      await Clipboard.setStringAsync(text);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }
  };

  return { copy, copied };
}
```

- [ ] `components/prompt/CopyButton.tsx` 구현

- [ ] Toast 알림 연동

**완료 기준**: 클립보드 복사 성공 시 Toast 표시

---

### Day 13: 새 분석 플로우 구현
**목표**: 3단계 플로우 (업로드 → 템플릿 → 프롬프트) 완성

- [ ] `app/analysis/new.tsx` 메인 로직 구현

- [ ] Step 1: 이미지 업로드 화면

- [ ] Step 2: 템플릿 선택 화면

- [ ] Step 3: 프롬프트 확인 화면

- [ ] 단계 간 네비게이션 (이전/다음)

- [ ] 진행 상태 표시 (1/3, 2/3, 3/3)

**완료 기준**: 처음부터 끝까지 플로우 완주 가능

---

### Day 14: Week 2 정리 및 통합 테스트
**목표**: Week 2 마일스톤 검증

- [ ] 전체 플로우 테스트 (이미지 업로드 → 템플릿 선택 → 프롬프트 복사)

- [ ] 에러 핸들링 개선

- [ ] UI/UX 개선 (로딩 상태, 에러 메시지)

- [ ] 코드 리팩토링

- [ ] Git 커밋
```bash
git add .
git commit -m "Week 2: Complete core features (upload, template, prompt)"
```

**완료 기준**: 핵심 기능 정상 작동 (웹/iOS/Android)

---

## Week 3: 히스토리 및 고급 기능 (Day 15-21)

### Day 15: AsyncStorage 스토리지 구현
**목표**: 분석 히스토리 저장/조회 기능

- [ ] `utils/storage.ts` 구현
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Analysis } from '@/types';

const STORAGE_KEY = '@portfolio_analyses';

export async function saveAnalysis(analysis: Analysis): Promise<void> {
  try {
    const analyses = await getAnalyses();
    analyses.push(analysis);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
  } catch (error) {
    throw new Error('분석 저장 실패');
  }
}

export async function getAnalyses(): Promise<Analysis[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

export async function deleteAnalysis(id: string): Promise<void> {
  try {
    const analyses = await getAnalyses();
    const filtered = analyses.filter((a) => a.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    throw new Error('분석 삭제 실패');
  }
}

export async function getAnalysisById(id: string): Promise<Analysis | null> {
  const analyses = await getAnalyses();
  return analyses.find((a) => a.id === id) || null;
}
```

- [ ] `hooks/useHistory.ts` 구현

- [ ] Zustand store 연동 (`store/analysisStore.ts`)

**완료 기준**: 분석 저장 및 조회 정상 작동

---

### Day 16: 히스토리 목록 UI
**목표**: FlatList 기반 히스토리 목록 구현

- [ ] `components/history/HistoryList.tsx` 구현 (FlatList)

- [ ] `components/history/HistoryItem.tsx` 구현

- [ ] 날짜순 정렬 (최신순)

- [ ] 무한 스크롤 또는 페이지네이션

**완료 기준**: 히스토리 목록 정상 표시

---

### Day 17: 히스토리 상세 및 삭제
**목표**: 히스토리 상세보기, 재사용, 삭제 기능

- [ ] `components/history/HistoryDetail.tsx` 구현

- [ ] 상세보기 모달 또는 전체 화면

- [ ] 재사용 버튼 (프롬프트 복사)

- [ ] 삭제 버튼 (확인 다이얼로그)

**완료 기준**: 히스토리 상세, 재사용, 삭제 정상 작동

---

### Day 18: 검색 및 필터링
**목표**: 히스토리 검색 및 필터 기능

- [ ] 검색 바 UI

- [ ] 텍스트 검색 (템플릿명, 메모)

- [ ] 날짜 필터 (오늘, 이번 주, 이번 달)

- [ ] 태그 필터

**완료 기준**: 검색 및 필터링 정상 작동

---

### Day 19: 태그 시스템
**목표**: 태그 추가, 수정, 삭제 기능

- [ ] 태그 입력 UI

- [ ] 태그 자동완성

- [ ] 태그별 색상

- [ ] 태그 관리 화면

**완료 기준**: 태그 기능 정상 작동

---

### Day 20: 설정 페이지
**목표**: 사용자 설정 UI 및 로직

- [ ] `app/(tabs)/settings.tsx` 구현

- [ ] 기본 템플릿 선택

- [ ] 이미지 품질 설정

- [ ] 선호 LLM 선택

- [ ] 데이터 내보내기/가져오기

- [ ] 앱 정보 (버전, 라이선스)

**완료 기준**: 설정 저장 및 불러오기 정상 작동

---

### Day 21: Week 3 정리 및 테스트
**목표**: Week 3 마일스톤 검증

- [ ] 전체 기능 통합 테스트

- [ ] 에러 핸들링 개선

- [ ] UI/UX 폴리싱

- [ ] Git 커밋
```bash
git add .
git commit -m "Week 3: Complete history and advanced features"
```

**완료 기준**: 모든 주요 기능 완성 (MVP 달성)

---

## Week 4: 최적화, 테스트 및 배포 (Day 22-28)

### Day 22: 성능 최적화
**목표**: 앱 성능 개선

- [ ] FlatList 최적화 (initialNumToRender, maxToRenderPerBatch)

- [ ] 이미지 레이지 로딩

- [ ] React.memo 적용

- [ ] useMemo, useCallback 최적화

- [ ] 번들 크기 분석
```bash
npx expo export:web --dump-assetmap
```

**완료 기준**: 부드러운 스크롤, 빠른 화면 전환

---

### Day 23: 반응형 디자인
**목표**: 태블릿 및 다양한 화면 크기 지원

- [ ] 태블릿 레이아웃 (iPad, Android Tablet)

- [ ] 가로/세로 모드 대응

- [ ] 웹 반응형 (모바일/태블릿/데스크톱)

- [ ] 폰트 크기 조정 (접근성)

**완료 기준**: 모든 화면 크기에서 정상 표시

---

### Day 24: 플랫폼별 테스트
**목표**: 웹/iOS/Android 크로스 플랫폼 테스트

- [ ] 웹 브라우저 테스트 (Chrome, Safari, Firefox)

- [ ] iOS 시뮬레이터 테스트

- [ ] iOS 실기기 테스트

- [ ] Android 에뮬레이터 테스트

- [ ] Android 실기기 테스트

- [ ] 버그 수정

**완료 기준**: 모든 플랫폼에서 주요 기능 정상 작동

---

### Day 25: 웹 배포
**목표**: Vercel 또는 Netlify에 웹 배포

- [ ] 웹 빌드
```bash
npx expo export:web
```

- [ ] Vercel 배포
```bash
npm install -g vercel
vercel
```

- [ ] 커스텀 도메인 설정 (선택)

- [ ] 환경변수 설정 (필요시)

- [ ] 배포 확인 및 테스트

**완료 기준**: 웹 앱 공개 URL 접속 가능

---

### Day 26: iOS 빌드 및 TestFlight
**목표**: iOS 앱 빌드 및 TestFlight 배포

- [ ] EAS CLI 설정
```bash
npm install -g eas-cli
eas login
eas build:configure
```

- [ ] `app.json` 설정 확인
  - [ ] Bundle Identifier
  - [ ] Version
  - [ ] Build Number
  - [ ] Permissions

- [ ] iOS 빌드
```bash
eas build --platform ios
```

- [ ] TestFlight 제출
```bash
eas submit --platform ios
```

- [ ] 테스터 초대 및 피드백 수집

**완료 기준**: TestFlight에서 앱 다운로드 및 테스트 가능

---

### Day 27: Android 빌드 및 내부 테스트
**목표**: Android 앱 빌드 및 Google Play 내부 테스트

- [ ] `app.json` 설정 확인
  - [ ] Package name
  - [ ] Version code
  - [ ] Permissions

- [ ] Android 빌드
```bash
eas build --platform android
```

- [ ] Google Play Console 제출
```bash
eas submit --platform android
```

- [ ] 내부 테스트 트랙 배포

- [ ] 테스터 초대 및 피드백 수집

**완료 기준**: Google Play 내부 테스트에서 앱 다운로드 가능

---

### Day 28: 최종 점검 및 문서화
**목표**: 프로젝트 완료 및 문서 작성

- [ ] README.md 작성
  - [ ] 프로젝트 소개
  - [ ] 기능 목록
  - [ ] 설치 방법
  - [ ] 개발 가이드
  - [ ] 라이선스

- [ ] CHANGELOG.md 작성

- [ ] 스크린샷 및 데모 GIF 생성

- [ ] 앱스토어 제출 준비
  - [ ] 앱 아이콘
  - [ ] 스크린샷 (다양한 사이즈)
  - [ ] 앱 설명 작성
  - [ ] 키워드 선정

- [ ] Git 최종 커밋
```bash
git add .
git commit -m "v1.0.0: Initial release"
git tag v1.0.0
```

- [ ] GitHub 릴리즈 생성

**완료 기준**: 프로젝트 완료, 웹/iOS/Android 모두 출시 준비 완료

---

## 🎯 마일스톤 요약

| Week | 마일스톤 | 완료 기준 |
|------|---------|----------|
| Week 1 | 프로젝트 셋업 및 기본 구조 | 웹/iOS/Android 기본 앱 실행 |
| Week 2 | 핵심 기능 구현 | 이미지 업로드 → 템플릿 선택 → 프롬프트 복사 |
| Week 3 | 히스토리 및 고급 기능 | 분석 저장/조회, 검색, 태그 |
| Week 4 | 최적화 및 배포 | 웹/iOS/Android 출시 |

---

## 📊 진행 상황 추적

### 체크리스트

#### Week 1
- [ ] Day 1: Expo 프로젝트 생성
- [ ] Day 2: NativeWind 설정
- [ ] Day 3: 타입 및 상수 마이그레이션
- [ ] Day 4: 공통 컴포넌트 (Part 1)
- [ ] Day 5: 공통 컴포넌트 (Part 2)
- [ ] Day 6: 라우팅 구조
- [ ] Day 7: Week 1 정리

#### Week 2
- [ ] Day 8: 이미지 업로드 (Expo Image Picker)
- [ ] Day 9: 이미지 업로드 UI
- [ ] Day 10: 템플릿 선택 UI
- [ ] Day 11: 프롬프트 생성 로직
- [ ] Day 12: 클립보드 복사
- [ ] Day 13: 새 분석 플로우
- [ ] Day 14: Week 2 정리

#### Week 3
- [ ] Day 15: AsyncStorage 구현
- [ ] Day 16: 히스토리 목록 UI
- [ ] Day 17: 히스토리 상세 및 삭제
- [ ] Day 18: 검색 및 필터링
- [ ] Day 19: 태그 시스템
- [ ] Day 20: 설정 페이지
- [ ] Day 21: Week 3 정리

#### Week 4
- [ ] Day 22: 성능 최적화
- [ ] Day 23: 반응형 디자인
- [ ] Day 24: 플랫폼별 테스트
- [ ] Day 25: 웹 배포
- [ ] Day 26: iOS 빌드
- [ ] Day 27: Android 빌드
- [ ] Day 28: 최종 점검

---

## 🚨 리스크 관리

### 예상 리스크 및 대응책

| 리스크 | 확률 | 영향 | 대응책 |
|--------|------|------|--------|
| Expo 버전 호환성 문제 | 중 | 중 | 특정 버전 고정, 공식 문서 참조 |
| iOS 빌드 실패 | 중 | 고 | EAS Build 로그 확인, 커뮤니티 지원 |
| Android 권한 문제 | 중 | 중 | app.json 권한 설정 재확인 |
| 성능 이슈 (대량 이미지) | 고 | 중 | 이미지 압축, FlatList 최적화 |
| 앱스토어 리젝 | 중 | 고 | 가이드라인 숙지, 충분한 테스트 |

---

## 📝 일일 작업 로그

### 사용법
매일 작업 종료 후 아래 템플릿을 사용해 진행 상황 기록

```markdown
### Day X: YYYY-MM-DD

**목표**: [당일 목표]

**완료 항목**:
- [ ] 항목 1
- [ ] 항목 2

**미완료 항목**:
- [ ] 항목 3 (사유: ...)

**블로커**:
- 없음 / [블로커 설명]

**다음 작업**:
- Day X+1 작업 미리보기

**총 작업 시간**: X시간
```

---

**문서 버전**: 1.0
**최종 수정일**: 2025-11-11
**작성자**: Tech Lead
