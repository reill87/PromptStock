# 📱 PromptStock (Portfolio Prompt Helper)

> 포트폴리오 스크린샷으로 AI 분석 프롬프트를 자동 생성하는 크로스 플랫폼 모바일 애플리케이션

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Expo](https://img.shields.io/badge/Expo-54.0.23-000020?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)

## 프로젝트 소개

**PromptStock (Portfolio Prompt Helper)**는 주식 포트폴리오 스크린샷을 업로드하면, 사용자가 선택한 분석 목적에 맞는 최적화된 프롬프트를 자동으로 생성해주는 **크로스 플랫폼 모바일 애플리케이션**입니다.

생성된 프롬프트를 복사해서 ChatGPT나 Claude 같은 LLM에 붙여넣기만 하면, 전문적인 포트폴리오 분석을 받을 수 있습니다.

**Expo 기반으로 개발되어 iOS, Android, Web 모두 지원합니다.**

### 핵심 가치

- **비용 제로**: 사용자의 무료 LLM 계정을 활용
- **시간 절약**: 매번 프롬프트를 작성하는 수고 제거
- **품질 보장**: 검증된 템플릿으로 일관된 분석 품질
- **히스토리 관리**: 과거 분석 결과 저장 및 비교

## 주요 기능

### 1. 포트폴리오 업로드
- 증권 앱 스크린샷 드래그 앤 드롭 업로드
- 다중 이미지 지원 (최대 5장)
- 실시간 이미지 미리보기

### 2. 분석 템플릿 (5종)
- **위험도 분석**: 섹터 집중도, 변동성, 분산투자 개선점
- **리밸런싱 제안**: 현재 비중 분석 및 매수/매도 추천
- **종목별 체크리스트**: 최근 이슈, 실적 발표일, 확인 사항
- **섹터 밸런스**: 섹터별 비중 계산 및 산업 트렌드 반영도
- **수익률 개선**: 손실/수익 종목 분석 및 전략 제안

### 3. 프롬프트 자동 생성
- 템플릿 + 이미지 기반 완성된 프롬프트 생성
- 원클릭 복사 기능
- 프롬프트 커스터마이징 옵션

### 4. 분석 히스토리
- 과거 분석 프롬프트 및 결과 저장 (LocalStorage/IndexedDB)
- 날짜별 조회 및 태그 관리
- 분석 비교 기능

### 5. 템플릿 커스터마이징
- 기본 템플릿 수정
- 나만의 템플릿 생성
- 실시간 프리뷰

### 6. 로컬 AI 분석 (NEW! 🎉)
- **온디바이스 Vision LLM**: 인터넷 없이 포트폴리오 이미지 분석
- **클립보드 / 로컬 AI 모드**: 사용자가 선택 가능
- **LLaVA 1.5 7B 모델**: 4GB/8GB 양자화 모델 지원
- **실시간 진행 상태**: 초기화 → 이미지 처리 → 응답 생성 단계별 표시
- **고급 설정**: Temperature, Max Tokens, Context Size 조정
- **자동 메모리 관리**: 앱 백그라운드 시 자동 cleanup
- **iOS/Android 전용**: 웹 플랫폼 제외

## 기술 스택

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

### AI & Machine Learning
- **llama.rn** 0.8.1 - React Native용 llama.cpp 바인딩
- **LLaVA 1.5 7B** - Vision Language Model (Q4/Q8 양자화)
- **react-native-device-info** 15.0.1 - 디바이스 호환성 체크

### Deployment
- **Expo Application Services (EAS)** - 빌드 및 배포
- **Expo Go** - 개발 및 테스트

## 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- **iOS**: macOS + Xcode 15.0 이상
- **Android**: Android Studio + SDK 33 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/reill87/PromptStock.git
cd PromptStock/portfolio-prompt-helper

# 의존성 설치
npm install

# iOS Pod 설치 (macOS만 해당)
cd ios && pod install && cd ..
```

### 실행

```bash
# 개발 서버 시작 (QR 코드 표시)
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

### 빌드

```bash
# 개발 빌드
eas build --platform ios --profile development
eas build --platform android --profile development

# 프로덕션 빌드
eas build --platform ios --profile production
eas build --platform android --profile production
```

자세한 설치 및 테스트 가이드는 [portfolio-prompt-helper/TESTING.md](portfolio-prompt-helper/TESTING.md)를 참고하세요.

## 프로젝트 구조

```
PromptStock/
├── portfolio-prompt-helper/        # 메인 애플리케이션
│   ├── app/                        # Expo Router 페이지
│   │   ├── (tabs)/                # 탭 네비게이션 그룹
│   │   │   ├── index.tsx         # 홈 화면 (프롬프트 생성)
│   │   │   ├── two.tsx           # 히스토리 화면
│   │   │   ├── settings.tsx      # 설정 화면
│   │   │   └── _layout.tsx       # 탭 레이아웃
│   │   ├── custom-templates.tsx  # 커스텀 템플릿 관리
│   │   ├── _layout.tsx           # 루트 레이아웃
│   │   ├── modal.tsx             # 모달 화면
│   │   └── +not-found.tsx        # 404 페이지
│   ├── components/               # React 컴포넌트
│   │   ├── common/              # 공통 컴포넌트 (Button, Card, Toast 등)
│   │   ├── upload/              # 이미지 업로드
│   │   ├── template/            # 템플릿 선택 및 편집
│   │   ├── prompt/              # 프롬프트 생성
│   │   └── history/             # 히스토리 관리
│   ├── hooks/                   # 커스텀 훅
│   │   ├── useImageUpload.ts
│   │   ├── useHistory.ts
│   │   ├── useTheme.ts
│   │   └── useClipboard.ts
│   ├── store/                   # Zustand 상태 관리
│   │   ├── analysisStore.ts
│   │   ├── settingsStore.ts
│   │   └── uiStore.ts
│   ├── utils/                   # 유틸리티 함수
│   │   ├── storage.ts
│   │   ├── promptGenerator.ts
│   │   └── dataManagement.ts
│   ├── types/                   # TypeScript 타입
│   │   ├── analysis.ts
│   │   └── template.ts
│   ├── constants/              # 상수 및 템플릿
│   │   ├── templates.ts       # 5개 기본 템플릿
│   │   └── Colors.ts
│   ├── assets/                 # 정적 파일
│   ├── app.json               # Expo 설정
│   ├── eas.json               # EAS 빌드 설정
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
├── PRD.md                      # 제품 요구사항 문서
├── IMPLEMENTATION_ROADMAP.md   # 구현 로드맵
└── README.md                   # 이 파일
```

## 사용 방법

### 1. 새 분석 시작

1. 홈페이지에서 "새 분석 시작" 버튼 클릭
2. 포트폴리오 스크린샷 업로드 (드래그 앤 드롭 또는 클릭)
3. 원하는 분석 템플릿 선택
4. 생성된 프롬프트 확인 및 필요시 수정
5. "복사하기" 버튼으로 클립보드에 복사
6. ChatGPT/Claude에 붙여넣기

### 2. 히스토리 관리

1. 메뉴에서 "히스토리 보기" 클릭
2. 과거 분석 목록에서 원하는 항목 선택
3. 프롬프트 및 결과 확인
4. 재사용 또는 삭제

### 3. 커스텀 템플릿 생성

1. 프롬프트 생성 화면에서 "수정하기" 클릭
2. 분석 항목 추가/삭제 및 형식 변경
3. "저장" 버튼으로 나만의 템플릿 저장

### 4. 로컬 AI 분석 사용하기 (iOS/Android 전용)

#### 초기 설정

1. 홈 화면 > "Step 3. 분석 방식 선택"에서 "로컬 AI 분석" 선택
2. 모델 다운로드 버튼 클릭
3. 모델 선택 (LLaVA 1.5 7B Q4 권장, 약 4.2GB)
4. 다운로드 완료 대기 (Wi-Fi 권장)

#### 분석 실행

1. 포트폴리오 이미지 업로드 (Step 1)
2. 분석 템플릿 선택 (Step 2)
3. "로컬 AI 분석" 모드 확인 (Step 3)
4. "AI 분석 시작" 버튼 클릭
5. 진행 상태 확인:
   - 📥 모델 파일 확인 중
   - ⚙️ 모델 로딩 중
   - 🖼️ 이미지 처리 중
   - ✨ 응답 생성 중
6. AI 분석 결과 확인 (Step 4)
7. 필요시 히스토리에 저장

#### 고급 설정 (설정 > 로컬 AI 설정)

- **Temperature** (0.0 - 1.0): 응답 창의성 조절
  - 낮음 (0.0-0.3): 일관성 있는 응답
  - 보통 (0.4-0.7): 균형잡힌 응답 (권장)
  - 높음 (0.8-1.0): 창의적인 응답

- **Max Tokens** (128 - 2048): 최대 응답 길이
  - 512: 짧은 분석 (권장)
  - 1024: 중간 길이 분석
  - 2048: 상세한 분석 (느림)

- **Context Size** (1024/2048/4096): 컨텍스트 창 크기
  - 2048: 권장 (메모리와 성능 균형)
  - 4096: 더 긴 프롬프트 지원 (메모리 많이 사용)

#### 시스템 요구사항

**최소 사양:**
- **RAM**: 4GB 이상 (6GB 권장)
- **저장 공간**: 5GB 여유 공간 (Q4 모델 기준)
- **OS**: iOS 15.0+ / Android 6.0+ (API 24)

**권장 사양:**
- **RAM**: 6GB 이상
- **저장 공간**: 10GB 여유 공간
- **프로세서**: 64비트 ARM
- **배터리**: 50% 이상

**참고사항:**
- 로컬 AI는 인터넷 연결이 필요 없습니다
- 첫 실행 시 모델 로딩에 1-2분 소요
- 분석 시간은 디바이스 성능에 따라 30초~5분 소요
- 배터리 소모가 있을 수 있습니다 (충전 중 사용 권장)
- Web 플랫폼에서는 로컬 AI 사용 불가

## 로드맵

### Phase 1: MVP (Week 1-2) ✅ **완료**
- [x] 프로젝트 셋업 (Expo + React Native)
- [x] PRD 작성
- [x] 기본 라우팅 구조 (Expo Router 기반)
- [x] 이미지 업로드 기능 (갤러리/카메라, 압축)
- [x] 5개 기본 템플릿 구현
- [x] 프롬프트 생성 로직
- [x] 클립보드 복사 기능

### Phase 2: 히스토리 및 고급 기능 (Week 3-4) ✅ **완료**
- [x] AsyncStorage 히스토리 저장
- [x] 히스토리 조회/삭제 UI (상세 모달 포함)
- [x] 템플릿 커스터마이징 (생성/편집/삭제)
- [x] 태그 시스템 (추가, 필터링)
- [x] 반응형 디자인 (NativeWind)

### Phase 3: 최적화 및 배포 (Week 5-6) 🚧 **진행 중**
- [x] AsyncStorage 사용 (IndexedDB 대신, 모바일 환경에 적합)
- [x] 검색 필터링 (검색, 태그, 날짜, 카테고리, 정렬)
- [x] 데이터 내보내기/가져오기 (JSON 백업)
- [x] 성능 최적화 (이미지 압축, FlatList 최적화, 메모이제이션)
- [x] 다크모드 (라이트/다크/시스템)
- [ ] 앱 스토어 배포 (iOS/Android)
- [ ] 모니터링 시스템 구축

### Phase 4: 로컬 AI 기능 (Week 7-8) ✅ **완료**
- [x] llama.rn 통합 (Vision LLM 지원)
- [x] LLaVA 1.5 7B 모델 다운로드 시스템
- [x] 디바이스 호환성 체크 (RAM, 저장공간, OS)
- [x] 클립보드/로컬 AI 모드 전환
- [x] 실시간 진행 상태 표시
- [x] 고급 설정 (Temperature, Max Tokens, Context Size)
- [x] 히스토리에 AI 응답 저장
- [x] 자동 메모리 관리 및 cleanup
- [x] 에러 처리 및 타임아웃 로직
- [x] 설정 화면 UI 통합

### Phase 5: 향후 개선 📋 **계획**
- [ ] 커뮤니티 템플릿 마켓플레이스
- [ ] OCR 종목명 자동 추출
- [ ] ChatGPT/Claude API 연동 (클라우드 옵션)
- [ ] 프롬프트 체인 기능
- [ ] 클라우드 동기화
- [ ] 다국어 지원 (영어, 일본어)
- [ ] 프리미엄 기능 (더 큰 모델, 클라우드 동기화)

## 지원 플랫폼

| 플랫폼 | 상태 | 최소 버전 |
|--------|------|-----------|
| iOS | ✅ 지원 | iOS 13.0+ |
| Android | ✅ 지원 | Android 6.0+ (API 23) |
| 웹 | ✅ 지원 | 모던 브라우저 (Chrome, Safari, Firefox) |

### 디바이스 지원
- 📱 스마트폰 (세로/가로 모드)
- 📲 태블릿 (iPad, Android 태블릿)
- 💻 데스크톱 (웹 버전)

## 주요 문서

- **[TESTING.md](portfolio-prompt-helper/TESTING.md)** - 로컬 테스트 및 설치 가이드
- **[IMPROVEMENTS.md](portfolio-prompt-helper/IMPROVEMENTS.md)** - 성능 개선 및 기능 상세
- **[QUICKSTART.md](portfolio-prompt-helper/QUICKSTART.md)** - 빠른 시작 가이드
- **[PRD.md](PRD.md)** - 제품 요구사항 문서
- **[IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)** - 구현 로드맵

## 기여하기

기여를 환영합니다! 다음 방법으로 참여해주세요:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참조하세요.

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 문의

- 🐛 이슈: [GitHub Issues](https://github.com/reill87/PromptStock/issues)
- 💬 토론: [GitHub Discussions](https://github.com/reill87/PromptStock/discussions)
- 📧 이메일: [프로젝트 관리자 이메일]

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요! ⭐**

Made with ❤️ by reill87

**최종 업데이트**: 2025-11-19

</div>
