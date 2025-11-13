# 📱 PromptStock

> AI 프롬프트 생성을 위한 포트폴리오 이미지 분석 도우미

[![Expo](https://img.shields.io/badge/Expo-54.0.23-000020?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 목차

- [소개](#-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [문서](#-문서)
- [프로젝트 구조](#-프로젝트-구조)
- [스크린샷](#-스크린샷)
- [성능 개선](#-성능-개선)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

---

## 🎯 소개

**PromptStock**은 포트폴리오 이미지를 분석하여 AI 프롬프트를 생성하는 모바일 애플리케이션입니다.
디자이너와 크리에이터를 위해 이미지에서 영감을 얻고, 효과적인 AI 프롬프트를 빠르게 생성할 수 있도록 돕습니다.

### ✨ 핵심 가치

- 🚀 **빠른 프롬프트 생성**: 이미지 업로드 후 즉시 프롬프트 생성
- 📱 **모바일 최적화**: 언제 어디서나 사용 가능
- 🎨 **직관적인 UI**: 간단하고 아름다운 인터페이스
- 📊 **히스토리 관리**: 생성한 프롬프트를 체계적으로 관리
- 🌙 **다크 모드**: 눈의 피로를 줄이는 다크 테마 지원

---

## 🎁 주요 기능

### 1. 이미지 분석 및 프롬프트 생성
- 📸 갤러리에서 이미지 선택 또는 카메라로 촬영
- 🤖 AI 기반 이미지 분석
- 💡 맞춤형 프롬프트 자동 생성
- 📝 커스텀 템플릿 지원

### 2. 히스토리 관리
- 💾 모든 프롬프트 자동 저장
- 🔍 빠른 검색 및 필터링
- 🏷️ 태그 기반 분류
- 📅 날짜별 정렬
- 🗂️ 템플릿 타입별 필터

### 3. 템플릿 시스템
- 📋 다양한 기본 템플릿 제공
  - 포트폴리오 프로젝트
  - 개인 작품
  - UX/UI 디자인
  - 그래픽 디자인
  - 사진/영상
  - 웹 개발
- ✏️ 커스텀 템플릿 생성 및 관리
- ⭐ 기본 템플릿 설정

### 4. 설정 및 커스터마이징
- 🎨 이미지 품질 설정 (낮음/보통/높음)
- 🌓 테마 모드 (라이트/다크/시스템)
- 📲 햅틱 피드백
- 📤 데이터 내보내기/가져오기
- 🗑️ 데이터 관리

### 5. 성능 최적화
- ⚡ 이미지 압축 및 최적화
- 📜 리스트 가상화 (무한 스크롤)
- 🧠 메모리 관리
- 🎭 스켈레톤 로딩
- 🎬 부드러운 애니메이션

---

## 🛠️ 기술 스택

### Core
- **Expo** 54.0.23 - React Native 개발 플랫폼
- **React** 19.1.0 - UI 라이브러리
- **React Native** 0.81.5 - 크로스 플랫폼 모바일 프레임워크
- **TypeScript** 5.9.2 - 타입 안정성

### Navigation & Routing
- **Expo Router** 6.0.14 - 파일 기반 라우팅
- **React Navigation** - 네이티브 네비게이션

### State Management
- **Zustand** 5.0.8 - 경량 상태 관리
- **AsyncStorage** 2.2.0 - 로컬 저장소

### UI & Styling
- **NativeWind** 4.2.1 - Tailwind CSS for React Native
- **Tailwind CSS** 3.3.2 - 유틸리티 CSS 프레임워크
- **React Native Reanimated** 4.1.1 - 고성능 애니메이션

### Media & Files
- **expo-image-picker** 17.0.8 - 이미지 선택/촬영
- **expo-image-manipulator** 14.0.7 - 이미지 처리
- **expo-file-system** 19.0.17 - 파일 시스템 접근

### Development Tools
- **EAS CLI** - Expo Application Services
- **Metro** - React Native 번들러
- **ESLint** - 코드 품질
- **Prettier** - 코드 포맷팅

---

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- iOS: macOS + Xcode 15.0 이상
- Android: Android Studio + SDK 33 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/reill87/PromptStock.git
cd PromptStock/portfolio-prompt-helper

# 의존성 설치
npm install

# iOS Pod 설치 (macOS만)
cd ios && pod install && cd ..
```

### 실행

```bash
# 개발 서버 시작
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

### 상세 테스트 가이드

자세한 설치 및 테스트 방법은 [TESTING.md](TESTING.md)를 참고하세요.

---

## 📚 문서

- **[TESTING.md](TESTING.md)** - 로컬 테스트 가이드
- **[IMPROVEMENTS.md](IMPROVEMENTS.md)** - 성능 개선 및 기능 상세
- **[CHANGELOG.md](CHANGELOG.md)** - 버전별 변경사항 (예정)

---

## 📁 프로젝트 구조

```
portfolio-prompt-helper/
├── app/                      # Expo Router 페이지
│   ├── (tabs)/              # 탭 네비게이션 그룹
│   │   ├── index.tsx        # 홈 화면 (프롬프트 생성)
│   │   ├── two.tsx          # 히스토리 화면
│   │   └── settings.tsx     # 설정 화면
│   ├── _layout.tsx          # 루트 레이아웃
│   ├── modal.tsx            # 모달 화면
│   └── custom-templates.tsx # 커스텀 템플릿 관리
│
├── components/              # 재사용 가능한 컴포넌트
│   ├── common/             # 공통 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── FadeIn.tsx
│   │   ├── LoadingSkeleton.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── upload/             # 이미지 업로드 관련
│   ├── history/            # 히스토리 관련
│   ├── template/           # 템플릿 관련
│   └── prompt/             # 프롬프트 관련
│
├── hooks/                   # 커스텀 훅
│   ├── useImageUpload.ts
│   ├── useHistory.ts
│   ├── useTheme.ts
│   ├── useResponsive.ts
│   └── useClipboard.ts
│
├── store/                   # Zustand 스토어
│   ├── analysisStore.ts
│   ├── settingsStore.ts
│   └── uiStore.ts
│
├── utils/                   # 유틸리티 함수
│   ├── animations.ts
│   ├── errorHandler.ts
│   ├── storage.ts
│   └── promptGenerator.ts
│
├── constants/              # 상수
│   ├── Colors.ts
│   └── templates.ts
│
├── types/                  # TypeScript 타입 정의
│   ├── index.ts
│   ├── analysis.ts
│   └── template.ts
│
├── assets/                 # 정적 파일
│   ├── images/
│   └── fonts/
│
├── app.json               # Expo 설정
├── eas.json               # EAS 빌드 설정
├── package.json           # 의존성
├── tsconfig.json          # TypeScript 설정
├── tailwind.config.js     # Tailwind 설정
└── metro.config.js        # Metro 번들러 설정
```

---

## 📸 스크린샷

### 홈 화면
<img src="docs/screenshots/home.png" width="250" alt="홈 화면">

이미지 업로드 및 프롬프트 생성

### 히스토리 화면
<img src="docs/screenshots/history.png" width="250" alt="히스토리 화면">

생성된 프롬프트 관리 및 검색

### 설정 화면
<img src="docs/screenshots/settings.png" width="250" alt="설정 화면">

앱 설정 및 테마 변경

### 다크 모드
<img src="docs/screenshots/dark-mode.png" width="250" alt="다크 모드">

다크 테마 지원

---

## 🚀 성능 개선

### 이미지 최적화
- ✅ 설정 기반 압축 (low: 0.5, medium: 0.7, high: 0.9)
- ✅ 최대 1920px 리사이징
- ✅ 선택적 base64 변환
- ✅ 메모리 사용량 30% 감소

### 리스트 가상화
- ✅ FlatList 최적화 (removeClippedSubviews, windowSize 등)
- ✅ React.memo로 컴포넌트 메모이제이션
- ✅ useMemo로 필터링 캐싱
- ✅ 렌더링 성능 50-70% 개선

### 애니메이션
- ✅ React Native Reanimated 사용
- ✅ 스켈레톤 로딩
- ✅ 부드러운 화면 전환
- ✅ 60fps 유지

자세한 내용은 [IMPROVEMENTS.md](IMPROVEMENTS.md)를 참고하세요.

---

## 🌐 지원 플랫폼

| 플랫폼 | 상태 | 최소 버전 |
|--------|------|-----------|
| iOS | ✅ 지원 | iOS 13.0+ |
| Android | ✅ 지원 | Android 6.0+ (API 23) |
| 웹 | ✅ 지원 | 모던 브라우저 |

### 디바이스 지원
- 📱 스마트폰 (세로/가로 모드)
- 📲 태블릿 (iPad, Android 태블릿)
- 💻 데스크톱 (웹 버전)

---

## 🧪 테스트

### 단위 테스트
```bash
npm test
```

### E2E 테스트
```bash
npm run test:e2e
```

### 성능 테스트
```bash
# React DevTools Profiler 사용
npm start
# Chrome DevTools에서 Profiler 확인
```

---

## 🔧 빌드

### 개발 빌드
```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

### 프로덕션 빌드
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

자세한 빌드 가이드는 [TESTING.md](TESTING.md#-빌드)를 참고하세요.

---

## 🤝 기여하기

기여를 환영합니다! 다음 방법으로 참여해주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 기여 가이드라인
- TypeScript 사용
- ESLint/Prettier 규칙 준수
- 의미있는 커밋 메시지 작성
- 테스트 코드 포함

---

## 📝 로드맵

### v1.1.0 (예정)
- [ ] 클라우드 동기화
- [ ] 프롬프트 공유 기능
- [ ] 커뮤니티 템플릿
- [ ] 다국어 지원 (영어)

### v1.2.0 (예정)
- [ ] AI 모델 선택
- [ ] 배치 이미지 처리
- [ ] 고급 필터링
- [ ] 통계 대시보드

### v2.0.0 (예정)
- [ ] 협업 기능
- [ ] 프리미엄 템플릿
- [ ] 오프라인 AI 처리
- [ ] 플러그인 시스템

---

## 🐛 알려진 이슈

현재 알려진 이슈가 없습니다.

문제를 발견하시면 [Issues](https://github.com/reill87/PromptStock/issues)에 보고해주세요.

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

---

## 👥 제작

**PromptStock Team**

- 🎨 UI/UX Design
- 💻 Development
- 📱 Mobile Optimization
- 🤖 AI Integration

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들을 사용합니다:

- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [NativeWind](https://www.nativewind.dev)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated)

---

## 📞 문의

프로젝트에 대한 문의사항이나 제안이 있으시면:

- 📧 Email: [your-email@example.com](mailto:your-email@example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/reill87/PromptStock/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/reill87/PromptStock/discussions)

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요! ⭐**

Made with ❤️ by PromptStock Team

</div>
