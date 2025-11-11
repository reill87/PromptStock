# Expo + React Native Web 마이그레이션 계획

## 📋 프로젝트 개요

**목표**: 기존 React + Vite 웹 프로젝트를 Expo + React Native Web 기반으로 전환하여 웹/iOS/Android를 단일 코드베이스로 지원

**예상 기간**: 3-4주
**현재 진행률**: 15% (타입 정의 + 템플릿 데이터만 완료)

---

## 🎯 마이그레이션 전략

### Phase 1: 프로젝트 재구성 (Week 1)
기존 React 프로젝트를 Expo 구조로 마이그레이션

### Phase 2: 핵심 기능 구현 (Week 2)
Expo API를 활용한 이미지 업로드, 프롬프트 생성, 클립보드 복사

### Phase 3: 고급 기능 (Week 3)
히스토리 저장, 검색, 태그 관리

### Phase 4: 최적화 및 배포 (Week 4)
성능 최적화, 웹/iOS/Android 빌드 및 배포

---

## 📦 패키지 마이그레이션 매트릭스

### 제거할 패키지 ❌

| 패키지 | 이유 | 대체 패키지 |
|--------|------|------------|
| `vite` | Metro bundler 사용 | `expo` |
| `@vitejs/plugin-react` | Metro bundler 사용 | `expo` |
| `tailwindcss` | React Native 미지원 | `nativewind` |
| `postcss` | NativeWind가 처리 | `nativewind` |
| `autoprefixer` | NativeWind가 처리 | `nativewind` |
| `react-router-dom` | 파일 기반 라우팅 사용 | `expo-router` |
| `browser-image-compression` | 브라우저 전용 API | `expo-image-manipulator` |

### 추가할 패키지 ✅

#### Expo 핵심
```json
{
  "expo": "^52.0.0",
  "expo-router": "^4.0.0",
  "expo-status-bar": "~2.0.0",
  "expo-constants": "~17.0.0",
  "expo-linking": "~7.0.0",
  "expo-splash-screen": "~0.29.0"
}
```

#### 네이티브 기능
```json
{
  "expo-image-picker": "~16.0.0",
  "expo-image-manipulator": "~13.0.0",
  "expo-file-system": "~18.0.0",
  "expo-clipboard": "~7.0.0",
  "expo-media-library": "~17.0.0",
  "@react-native-async-storage/async-storage": "~2.0.0"
}
```

#### UI & Navigation
```json
{
  "nativewind": "^4.1.23",
  "tailwindcss": "^3.4.0",
  "react-native-safe-area-context": "~5.0.0",
  "react-native-screens": "~4.3.0",
  "react-native-gesture-handler": "~2.20.0",
  "react-native-reanimated": "~3.16.0"
}
```

#### 유틸리티
```json
{
  "expo-haptics": "~14.0.0",
  "expo-blur": "~14.0.0",
  "react-native-svg": "~15.8.0",
  "@react-native-community/datetimepicker": "~8.2.0"
}
```

### 유지할 패키지 ✅

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-hook-form": "^7.66.0",
  "zustand": "^5.0.8",
  "typescript": "~5.9.3",
  "@types/react": "^19.1.16"
}
```

---

## 🏗️ 프로젝트 구조 변경

### 기존 구조 (Vite)
```
portfolio-prompt-helper/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── store/
│   ├── utils/
│   ├── types/
│   ├── constants/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
└── package.json
```

### 새 구조 (Expo)
```
portfolio-prompt-helper/
├── app/                          # Expo Router (파일 기반 라우팅)
│   ├── (tabs)/                   # 탭 네비게이션
│   │   ├── _layout.tsx          # 탭 레이아웃
│   │   ├── index.tsx            # 홈 (/)
│   │   ├── history.tsx          # 히스토리 (/history)
│   │   └── settings.tsx         # 설정 (/settings)
│   ├── analysis/
│   │   └── new.tsx              # 새 분석 (/analysis/new)
│   ├── _layout.tsx              # 루트 레이아웃
│   └── +not-found.tsx           # 404
├── components/                   # 공통 컴포넌트
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── upload/
│   │   ├── ImageUploader.tsx
│   │   └── ImagePreview.tsx
│   ├── template/
│   │   ├── TemplateCard.tsx
│   │   ├── TemplateList.tsx
│   │   └── TemplateEditor.tsx
│   ├── prompt/
│   │   ├── PromptPreview.tsx
│   │   └── CopyButton.tsx
│   └── history/
│       ├── HistoryList.tsx
│       ├── HistoryItem.tsx
│       └── HistoryDetail.tsx
├── hooks/
│   ├── useImageUpload.ts
│   ├── useTemplates.ts
│   ├── useHistory.ts
│   └── useClipboard.ts
├── store/
│   ├── analysisStore.ts
│   ├── templateStore.ts
│   └── settingsStore.ts
├── utils/
│   ├── imageCompression.ts
│   ├── promptGenerator.ts
│   ├── storage.ts
│   └── dateFormatter.ts
├── types/
│   ├── template.ts
│   ├── analysis.ts
│   └── common.ts
├── constants/
│   ├── templates.ts
│   └── colors.ts
├── assets/                       # 이미지, 폰트 등
│   ├── images/
│   └── fonts/
├── app.json                      # Expo 설정
├── metro.config.js              # Metro bundler 설정
├── tailwind.config.js           # NativeWind 설정
├── tsconfig.json
└── package.json
```

---

## 🔧 주요 코드 변경 사항

### 1. 라우팅: React Router → Expo Router

**Before (React Router):**
```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NewAnalysis from './pages/NewAnalysis';
import History from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analysis/new" element={<NewAnalysis />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**After (Expo Router):**
```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack />;
}

// app/(tabs)/_layout.tsx
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
    </Tabs>
  );
}

// app/(tabs)/index.tsx - 자동으로 "/" 경로
export default function HomeScreen() {
  return <View>...</View>;
}
```

### 2. 스타일링: Tailwind CSS → NativeWind

**Before (Web Tailwind):**
```tsx
import './App.css';

function Button() {
  return (
    <div className="flex items-center justify-center p-4 bg-gray-100">
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-lg">
        업로드
      </button>
    </div>
  );
}
```

**After (NativeWind):**
```tsx
import { View, Text, Pressable } from 'react-native';

function Button() {
  return (
    <View className="flex items-center justify-center p-4 bg-gray-100">
      <Pressable className="bg-blue-500 active:bg-blue-600 py-2 px-4 rounded shadow-lg">
        <Text className="text-white font-bold">업로드</Text>
      </Pressable>
    </View>
  );
}
```

**주요 차이점:**
- `div` → `View`
- `button` → `Pressable` (또는 `TouchableOpacity`)
- 모든 텍스트는 `Text` 컴포넌트로 감싸기
- `hover:` → `active:` (모바일에선 hover 없음)
- `onClick` → `onPress`

### 3. 이미지 업로드: File API → Expo Image Picker

**Before (Web):**
```tsx
import imageCompression from 'browser-image-compression';

async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
  });

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target?.result as string;
    // 저장
  };
  reader.readAsDataURL(compressed);
}

return <input type="file" accept="image/*" onChange={handleUpload} />;
```

**After (Expo):**
```tsx
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

async function handleUpload() {
  // 권한 요청
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('권한이 필요합니다');
    return;
  }

  // 이미지 선택
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.8,
    allowsEditing: false,
  });

  if (result.canceled) return;

  // 이미지 압축 및 리사이즈
  const manipulated = await ImageManipulator.manipulateAsync(
    result.assets[0].uri,
    [{ resize: { width: 1920 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  // Base64 변환
  const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // 저장
}

return (
  <Pressable onPress={handleUpload}>
    <Text>이미지 업로드</Text>
  </Pressable>
);
```

### 4. 스토리지: LocalStorage → AsyncStorage

**Before (LocalStorage):**
```typescript
// utils/storage.ts
export function saveAnalysis(analysis: Analysis): void {
  const analyses = getAnalyses();
  analyses.push(analysis);
  localStorage.setItem('analyses', JSON.stringify(analyses));
}

export function getAnalyses(): Analysis[] {
  const data = localStorage.getItem('analyses');
  return data ? JSON.parse(data) : [];
}

export function deleteAnalysis(id: string): void {
  const analyses = getAnalyses().filter(a => a.id !== id);
  localStorage.setItem('analyses', JSON.stringify(analyses));
}
```

**After (AsyncStorage):**
```typescript
// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveAnalysis(analysis: Analysis): Promise<void> {
  const analyses = await getAnalyses();
  analyses.push(analysis);
  await AsyncStorage.setItem('analyses', JSON.stringify(analyses));
}

export async function getAnalyses(): Promise<Analysis[]> {
  const data = await AsyncStorage.getItem('analyses');
  return data ? JSON.parse(data) : [];
}

export async function deleteAnalysis(id: string): Promise<void> {
  const analyses = await getAnalyses();
  const filtered = analyses.filter(a => a.id !== id);
  await AsyncStorage.setItem('analyses', JSON.stringify(filtered));
}
```

**주요 차이점:**
- 모든 함수가 `async/await` 사용
- 반환 타입이 `Promise<T>`로 변경

### 5. 클립보드: Clipboard API → Expo Clipboard

**Before (Web):**
```typescript
// hooks/useClipboard.ts
import { useState } from 'react';

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      return false;
    }
  };

  return { copy, copied };
}
```

**After (Expo):**
```typescript
// hooks/useClipboard.ts
import { useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      return false;
    }
  };

  return { copy, copied };
}
```

### 6. 네비게이션: Link 컴포넌트

**Before (React Router):**
```tsx
import { Link, useNavigate } from 'react-router-dom';

function HomeButton() {
  const navigate = useNavigate();

  return (
    <div>
      <Link to="/analysis/new">새 분석</Link>
      <button onClick={() => navigate('/history')}>히스토리</button>
    </div>
  );
}
```

**After (Expo Router):**
```tsx
import { Link, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

function HomeButton() {
  const router = useRouter();

  return (
    <>
      <Link href="/analysis/new" asChild>
        <Pressable>
          <Text>새 분석</Text>
        </Pressable>
      </Link>

      <Pressable onPress={() => router.push('/history')}>
        <Text>히스토리</Text>
      </Pressable>
    </>
  );
}
```

---

## 📝 설정 파일 생성

### 1. app.json (Expo 설정)
```json
{
  "expo": {
    "name": "Portfolio Prompt Helper",
    "slug": "portfolio-prompt-helper",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.portfolioprompthelper",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "포트폴리오 이미지를 업로드하기 위해 갤러리 접근이 필요합니다.",
        "NSCameraUsageDescription": "포트폴리오를 촬영하기 위해 카메라 접근이 필요합니다."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.portfolioprompthelper",
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "CAMERA"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      [
        "expo-image-picker",
        {
          "photosPermission": "포트폴리오 이미지를 업로드하기 위해 갤러리 접근이 필요합니다."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "scheme": "portfolio-prompt-helper"
  }
}
```

### 2. metro.config.js
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
```

### 3. tailwind.config.js (NativeWind)
```javascript
/** @type {import('tailwindcss').Config} */
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

### 4. global.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. babel.config.js
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

---

## ✅ 마이그레이션 체크리스트

### Phase 1: 프로젝트 초기화 (Day 1-3)

- [ ] 새로운 Expo 프로젝트 생성
```bash
npx create-expo-app portfolio-prompt-helper --template tabs
cd portfolio-prompt-helper
```

- [ ] NativeWind 설치 및 설정
```bash
npm install nativewind
npm install --save-dev tailwindcss
npx tailwindcss init
```

- [ ] 필수 Expo 패키지 설치
```bash
npx expo install expo-router expo-image-picker expo-image-manipulator expo-file-system expo-clipboard @react-native-async-storage/async-storage
```

- [ ] 기존 타입 정의 마이그레이션
  - [ ] `types/template.ts` 복사
  - [ ] `types/analysis.ts` 복사
  - [ ] `types/common.ts` 복사
  - [ ] `types/index.ts` 복사

- [ ] 기존 상수 마이그레이션
  - [ ] `constants/templates.ts` 복사

- [ ] Zustand 스토어 설정
```bash
npm install zustand
```

### Phase 2: 컴포넌트 마이그레이션 (Day 4-7)

- [ ] 공통 컴포넌트 생성
  - [ ] `components/common/Button.tsx`
  - [ ] `components/common/Modal.tsx`
  - [ ] `components/common/Toast.tsx`
  - [ ] `components/common/Card.tsx`

- [ ] 업로드 컴포넌트 구현
  - [ ] `components/upload/ImageUploader.tsx` (Expo Image Picker 사용)
  - [ ] `components/upload/ImagePreview.tsx`

- [ ] 템플릿 컴포넌트 구현
  - [ ] `components/template/TemplateCard.tsx`
  - [ ] `components/template/TemplateList.tsx`
  - [ ] `components/template/TemplateEditor.tsx`

- [ ] 프롬프트 컴포넌트 구현
  - [ ] `components/prompt/PromptPreview.tsx`
  - [ ] `components/prompt/CopyButton.tsx` (Expo Clipboard 사용)

### Phase 3: 페이지/화면 구현 (Day 8-12)

- [ ] 탭 네비게이션 설정
  - [ ] `app/(tabs)/_layout.tsx`
  - [ ] 홈, 히스토리, 설정 탭 아이콘

- [ ] 홈 화면
  - [ ] `app/(tabs)/index.tsx`
  - [ ] 최근 분석 목록 표시
  - [ ] "새 분석 시작" 버튼

- [ ] 새 분석 플로우
  - [ ] `app/analysis/new.tsx`
  - [ ] Step 1: 이미지 업로드
  - [ ] Step 2: 템플릿 선택
  - [ ] Step 3: 프롬프트 확인 및 복사

- [ ] 히스토리 화면
  - [ ] `app/(tabs)/history.tsx`
  - [ ] 분석 히스토리 목록
  - [ ] 검색 및 필터링
  - [ ] 상세보기 모달

- [ ] 설정 화면
  - [ ] `app/(tabs)/settings.tsx`
  - [ ] 사용자 설정 옵션

### Phase 4: 비즈니스 로직 (Day 13-16)

- [ ] Hooks 구현
  - [ ] `hooks/useImageUpload.ts` (Expo APIs 사용)
  - [ ] `hooks/useTemplates.ts`
  - [ ] `hooks/useHistory.ts` (AsyncStorage 사용)
  - [ ] `hooks/useClipboard.ts` (Expo Clipboard 사용)

- [ ] Zustand Store 구현
  - [ ] `store/analysisStore.ts`
  - [ ] `store/templateStore.ts`
  - [ ] `store/settingsStore.ts`

- [ ] Utils 구현
  - [ ] `utils/imageCompression.ts` (ImageManipulator 사용)
  - [ ] `utils/promptGenerator.ts`
  - [ ] `utils/storage.ts` (AsyncStorage 사용)
  - [ ] `utils/dateFormatter.ts`

### Phase 5: 고급 기능 (Day 17-20)

- [ ] 히스토리 기능
  - [ ] 분석 저장
  - [ ] 분석 조회
  - [ ] 분석 삭제
  - [ ] 태그 관리

- [ ] 템플릿 커스터마이징
  - [ ] 템플릿 수정
  - [ ] 나만의 템플릿 생성
  - [ ] 템플릿 삭제

- [ ] 검색 및 필터
  - [ ] 히스토리 검색
  - [ ] 날짜 필터
  - [ ] 태그 필터

### Phase 6: 최적화 및 테스트 (Day 21-25)

- [ ] 성능 최적화
  - [ ] 이미지 로딩 최적화
  - [ ] 리스트 가상화 (FlatList)
  - [ ] 메모이제이션 (React.memo, useMemo)

- [ ] 플랫폼별 테스트
  - [ ] 웹 테스트 (localhost)
  - [ ] iOS 테스트 (Simulator)
  - [ ] Android 테스트 (Emulator)
  - [ ] 실기기 테스트

- [ ] 반응형 디자인
  - [ ] 태블릿 레이아웃
  - [ ] 가로/세로 모드
  - [ ] 다양한 화면 크기

### Phase 7: 배포 준비 (Day 26-28)

- [ ] 웹 배포
  - [ ] Vercel/Netlify 설정
  - [ ] 환경변수 설정
  - [ ] 빌드 및 배포
```bash
npx expo export:web
```

- [ ] iOS 빌드 (EAS Build)
```bash
npm install -g eas-cli
eas build --platform ios
```

- [ ] Android 빌드 (EAS Build)
```bash
eas build --platform android
```

- [ ] 앱스토어 제출 준비
  - [ ] 앱 아이콘 (1024x1024)
  - [ ] 스플래시 스크린
  - [ ] 스크린샷 (다양한 사이즈)
  - [ ] 앱 설명 작성

---

## 🚀 단계별 실행 명령어

### 1. 프로젝트 생성
```bash
# 새 Expo 프로젝트 생성 (Tabs 템플릿)
npx create-expo-app@latest portfolio-prompt-helper --template tabs

cd portfolio-prompt-helper
```

### 2. 필수 패키지 설치
```bash
# Expo 패키지
npx expo install expo-router expo-image-picker expo-image-manipulator expo-file-system expo-clipboard expo-haptics

# AsyncStorage
npx expo install @react-native-async-storage/async-storage

# NativeWind
npm install nativewind
npm install --save-dev tailwindcss@3.3.2

# 기존 패키지 (유지)
npm install zustand react-hook-form

# Navigation 필수
npx expo install react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated
```

### 3. 개발 서버 실행
```bash
# 웹
npx expo start --web

# iOS (Mac만 가능)
npx expo start --ios

# Android
npx expo start --android

# 모두 동시에
npx expo start
```

### 4. 빌드 (프로덕션)
```bash
# 웹 빌드
npx expo export:web

# EAS 설정 (처음 한 번만)
npm install -g eas-cli
eas login
eas build:configure

# iOS 빌드
eas build --platform ios

# Android 빌드
eas build --platform android

# 모두 빌드
eas build --platform all
```

---

## 📊 예상 일정

| Week | 작업 내용 | 마일스톤 |
|------|----------|---------|
| **Week 1** | 프로젝트 셋업, 기본 컴포넌트, 라우팅 | 앱 구조 완성 |
| **Week 2** | 이미지 업로드, 템플릿 선택, 프롬프트 생성 | 핵심 기능 완성 |
| **Week 3** | 히스토리 저장, 검색, 태그 관리 | MVP 완성 |
| **Week 4** | 최적화, 테스트, 배포 | 웹/앱 출시 |

---

## 🎯 마이그레이션 후 검증 체크리스트

### 기능 검증
- [ ] 이미지 업로드 (웹/iOS/Android)
- [ ] 템플릿 선택
- [ ] 프롬프트 생성
- [ ] 클립보드 복사 (텍스트)
- [ ] 히스토리 저장
- [ ] 히스토리 조회
- [ ] 히스토리 삭제
- [ ] 검색 기능
- [ ] 태그 관리

### 플랫폼 검증
- [ ] 웹 브라우저 (Chrome, Safari, Firefox)
- [ ] iOS 시뮬레이터
- [ ] iOS 실기기
- [ ] Android 에뮬레이터
- [ ] Android 실기기

### 성능 검증
- [ ] 앱 시작 시간 < 3초
- [ ] 이미지 업로드 < 2초
- [ ] 화면 전환 부드러움 (60fps)
- [ ] 메모리 사용량 안정적
- [ ] 배터리 소모 정상

---

## 📚 참고 자료

### Expo 공식 문서
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Expo Clipboard](https://docs.expo.dev/versions/latest/sdk/clipboard/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

### NativeWind
- [NativeWind v4 Docs](https://www.nativewind.dev/)
- [NativeWind Setup](https://www.nativewind.dev/getting-started/expo-router)

### EAS Build
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Submit to App Store](https://docs.expo.dev/submit/introduction/)

---

## 🆘 트러블슈팅

### 문제 1: Metro bundler 에러
```bash
# 캐시 클리어
npx expo start -c
```

### 문제 2: iOS 시뮬레이터 연결 안됨
```bash
# Xcode 설치 확인
xcode-select --install

# 시뮬레이터 재시작
xcrun simctl shutdown all
```

### 문제 3: Android 에뮬레이터 느림
```bash
# Gradle 캐시 클리어
cd android && ./gradlew clean
```

### 문제 4: NativeWind 스타일 적용 안됨
```javascript
// tailwind.config.js content 경로 확인
content: [
  './app/**/*.{js,jsx,ts,tsx}',
  './components/**/*.{js,jsx,ts,tsx}',
]
```

---

## 📈 성공 지표

### 개발 단계
- [ ] Week 1 마일스톤 달성
- [ ] Week 2 마일스톤 달성
- [ ] Week 3 마일스톤 달성
- [ ] Week 4 마일스톤 달성

### 품질 지표
- [ ] 코드 커버리지 > 70%
- [ ] 제로 크리티컬 버그
- [ ] 플랫폼 3개 모두 정상 작동

### 배포 지표
- [ ] 웹 배포 완료
- [ ] iOS TestFlight 배포
- [ ] Android 내부 테스트 배포

---

**문서 버전**: 1.0
**최종 수정일**: 2025-11-11
**작성자**: Tech Lead
