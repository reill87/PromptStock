# 패키지 마이그레이션 체크리스트

## 📦 제거할 패키지

### Vite 관련
- [ ] `vite` ❌
- [ ] `@vitejs/plugin-react` ❌
- [ ] `vite-plugin-pwa` (사용 중이었다면) ❌

### Tailwind CSS (웹 전용)
- [ ] `tailwindcss` → 유지하되 버전 변경 (^4.x → ^3.3.2)
- [ ] `postcss` ❌
- [ ] `autoprefixer` ❌

### React Router
- [ ] `react-router-dom` ❌

### 브라우저 전용 라이브러리
- [ ] `browser-image-compression` ❌

---

## ✅ 추가할 패키지

### Expo 핵심
```bash
npm install expo@^52.0.0
npx expo install expo-router expo-status-bar expo-constants expo-linking expo-splash-screen
```

- [ ] `expo`
- [ ] `expo-router`
- [ ] `expo-status-bar`
- [ ] `expo-constants`
- [ ] `expo-linking`
- [ ] `expo-splash-screen`

### 네이티브 기능
```bash
npx expo install expo-image-picker expo-image-manipulator expo-file-system expo-clipboard expo-haptics
```

- [ ] `expo-image-picker`
- [ ] `expo-image-manipulator`
- [ ] `expo-file-system`
- [ ] `expo-clipboard`
- [ ] `expo-haptics`

### 스토리지
```bash
npx expo install @react-native-async-storage/async-storage
```

- [ ] `@react-native-async-storage/async-storage`

### NativeWind
```bash
npm install nativewind@^4.1.23
npm install --save-dev tailwindcss@3.3.2
```

- [ ] `nativewind`
- [ ] `tailwindcss@3.3.2` (다운그레이드)

### 네비게이션 필수
```bash
npx expo install react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated
```

- [ ] `react-native-safe-area-context`
- [ ] `react-native-screens`
- [ ] `react-native-gesture-handler`
- [ ] `react-native-reanimated`

### 아이콘
```bash
npx expo install @expo/vector-icons
```

- [ ] `@expo/vector-icons`

### 유틸리티 (선택)
```bash
npx expo install expo-blur react-native-svg
```

- [ ] `expo-blur` (블러 효과)
- [ ] `react-native-svg` (SVG 지원)

---

## 🔄 유지할 패키지

```bash
npm install zustand react-hook-form
```

- [x] `react` (이미 설치됨)
- [x] `react-dom` (이미 설치됨)
- [ ] `zustand`
- [ ] `react-hook-form`
- [x] `typescript` (이미 설치됨)
- [x] `@types/react` (이미 설치됨)

---

## 📝 package.json 최종 버전

### dependencies
```json
{
  "dependencies": {
    "expo": "^52.0.0",
    "expo-router": "^4.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-constants": "~17.0.0",
    "expo-linking": "~7.0.0",
    "expo-splash-screen": "~0.29.0",
    "expo-image-picker": "~16.0.0",
    "expo-image-manipulator": "~13.0.0",
    "expo-file-system": "~18.0.0",
    "expo-clipboard": "~7.0.0",
    "expo-haptics": "~14.0.0",
    "@react-native-async-storage/async-storage": "~2.0.0",
    "nativewind": "^4.1.23",
    "react-native-safe-area-context": "~5.0.0",
    "react-native-screens": "~4.3.0",
    "react-native-gesture-handler": "~2.20.0",
    "react-native-reanimated": "~3.16.0",
    "@expo/vector-icons": "^14.0.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-native": "^0.76.0",
    "react-native-web": "~0.19.12",
    "zustand": "^5.0.8",
    "react-hook-form": "^7.66.0"
  }
}
```

### devDependencies
```json
{
  "devDependencies": {
    "@babel/core": "^7.25.0",
    "@types/react": "^19.1.16",
    "@types/react-dom": "^19.1.9",
    "tailwindcss": "^3.3.2",
    "typescript": "~5.9.3"
  }
}
```

---

## 🛠️ 설치 명령어 (순서대로)

### Step 1: Expo 프로젝트 생성
```bash
npx create-expo-app@latest portfolio-prompt-helper --template tabs
cd portfolio-prompt-helper
```

### Step 2: 필수 Expo 패키지 설치
```bash
npx expo install expo-router expo-image-picker expo-image-manipulator expo-file-system expo-clipboard expo-haptics
```

### Step 3: AsyncStorage 설치
```bash
npx expo install @react-native-async-storage/async-storage
```

### Step 4: NativeWind 설치
```bash
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npx tailwindcss init
```

### Step 5: 네비게이션 필수 패키지
```bash
npx expo install react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated
```

### Step 6: 기존 패키지 설치
```bash
npm install zustand react-hook-form
```

### Step 7: 선택 패키지 (필요시)
```bash
npx expo install expo-blur react-native-svg
```

---

## ✅ 설치 완료 확인

### 1. package.json 확인
```bash
cat package.json
```

다음 패키지들이 있는지 확인:
- [x] expo
- [x] expo-router
- [x] expo-image-picker
- [x] nativewind
- [x] @react-native-async-storage/async-storage
- [x] zustand
- [x] react-hook-form

### 2. 개발 서버 실행 테스트
```bash
npx expo start
```

오류 없이 실행되는지 확인

### 3. 웹 실행 테스트
```bash
npx expo start --web
```

웹 브라우저에서 정상 실행되는지 확인

### 4. TypeScript 컴파일 확인
```bash
npx tsc --noEmit
```

타입 에러 없는지 확인

---

## 🚨 트러블슈팅

### 문제 1: Metro bundler 캐시 에러
```bash
npx expo start -c
```

### 문제 2: node_modules 충돌
```bash
rm -rf node_modules package-lock.json
npm install
```

### 문제 3: Expo CLI 버전 문제
```bash
npm install -g expo-cli@latest
```

### 문제 4: peer dependencies 경고
```bash
npm install --legacy-peer-deps
```

---

## 📊 패키지 용량 비교

### Before (Vite)
- Total: ~350MB
- 주요 패키지: vite, react-router-dom, tailwindcss

### After (Expo)
- Total: ~450MB (+100MB)
- 주요 패키지: expo, react-native, metro
- 증가 이유: 네이티브 모듈, iOS/Android 빌드 도구

**참고**: node_modules 크기는 증가하지만, 웹/iOS/Android를 단일 코드베이스로 지원하는 장점이 있음

---

## 🎯 마이그레이션 완료 체크리스트

### 패키지 설치
- [ ] Expo 핵심 패키지 설치 완료
- [ ] 네이티브 기능 패키지 설치 완료
- [ ] NativeWind 설치 완료
- [ ] 기존 패키지 (zustand, react-hook-form) 설치 완료

### 설정 파일
- [ ] `app.json` 생성
- [ ] `metro.config.js` 생성
- [ ] `babel.config.js` 수정
- [ ] `tailwind.config.js` 수정 (NativeWind용)
- [ ] `global.css` 생성

### 실행 테스트
- [ ] 웹 실행 성공
- [ ] iOS 시뮬레이터 실행 성공 (Mac만)
- [ ] Android 에뮬레이터 실행 성공
- [ ] TypeScript 컴파일 성공

### 문서
- [ ] README.md 업데이트
- [ ] package.json scripts 업데이트

---

**문서 버전**: 1.0
**최종 수정일**: 2025-11-11
**작성자**: Tech Lead
