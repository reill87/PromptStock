# 🧪 PromptStock 로컬 테스트 가이드

## 📋 목차
1. [개발 환경 설정](#개발-환경-설정)
2. [프로젝트 설치](#프로젝트-설치)
3. [개발 서버 실행](#개발-서버-실행)
4. [디바이스별 테스트](#디바이스별-테스트)
5. [기능 테스트](#기능-테스트)
6. [빌드](#빌드)
7. [트러블슈팅](#트러블슈팅)

---

## 🛠️ 개발 환경 설정

### 필수 요구사항

#### 1. Node.js
```bash
# Node.js 18.x 이상 권장
node --version  # v18.x.x 이상
npm --version   # 9.x.x 이상
```

**설치**: [Node.js 공식 사이트](https://nodejs.org/)

#### 2. Git
```bash
git --version
```

**설치**: [Git 공식 사이트](https://git-scm.com/)

### 플랫폼별 추가 설정

#### 🍎 iOS (macOS만 해당)

1. **Xcode 설치**
   ```bash
   # Xcode 15.0 이상 필요
   xcode-select --install
   ```
   - App Store에서 Xcode 설치
   - Xcode 실행 후 추가 컴포넌트 설치

2. **CocoaPods 설치**
   ```bash
   sudo gem install cocoapods
   pod --version
   ```

3. **iOS 시뮬레이터 확인**
   ```bash
   xcrun simctl list devices
   ```

#### 🤖 Android

1. **Android Studio 설치**
   - [Android Studio 다운로드](https://developer.android.com/studio)

2. **Android SDK 설정**
   - Android Studio > Settings > Android SDK
   - SDK Platforms: Android 13.0 (API 33) 이상
   - SDK Tools: Android SDK Build-Tools, Android Emulator, Android SDK Platform-Tools

3. **환경 변수 설정**

   **macOS/Linux** (~/.zshrc 또는 ~/.bashrc):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

   **Windows** (환경 변수):
   ```
   ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
   Path=%Path%;%ANDROID_HOME%\emulator;%ANDROID_HOME%\platform-tools
   ```

4. **에뮬레이터 생성**
   - Android Studio > Device Manager
   - Create Device > Pixel 5 또는 원하는 디바이스 선택
   - System Image: Android 13.0 (API 33) 이상

---

## 📦 프로젝트 설치

### 1. 저장소 클론
```bash
# HTTPS
git clone https://github.com/reill87/PromptStock.git
cd PromptStock/portfolio-prompt-helper

# 또는 SSH
git clone git@github.com:reill87/PromptStock.git
cd PromptStock/portfolio-prompt-helper
```

### 2. 브랜치 체크아웃
```bash
# 최신 개선사항이 포함된 브랜치로 전환
git checkout claude/performance-optimization-011CV3WR9MmbqdnLqso9VjSM
```

### 3. 의존성 설치
```bash
# npm 사용
npm install

# 또는 yarn 사용
yarn install
```

### 4. iOS Pod 설치 (macOS만)
```bash
cd ios
pod install
cd ..
```

---

## 🚀 개발 서버 실행

### Expo 개발 서버 시작
```bash
# Expo 개발 서버 실행
npm start

# 또는
npx expo start
```

실행 후 터미널에 QR 코드와 옵션이 표시됩니다:

```
 › Metro waiting on exp://192.168.x.x:8081
 › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

 › Press a │ open Android
 › Press i │ open iOS simulator
 › Press w │ open web

 › Press r │ reload app
 › Press m │ toggle menu
 › Press ? │ show all commands
```

---

## 📱 디바이스별 테스트

### 1️⃣ iOS 시뮬레이터 (macOS)

#### 방법 A: 터미널에서 실행
```bash
npm start
# 서버 실행 후 'i' 키 입력
```

#### 방법 B: 직접 실행
```bash
npm run ios
```

#### 특정 디바이스 지정
```bash
# iPhone 15 Pro
npx expo run:ios --device "iPhone 15 Pro"

# iPad
npx expo run:ios --device "iPad Pro (12.9-inch)"
```

### 2️⃣ Android 에뮬레이터

#### 사전 준비
```bash
# 에뮬레이터 목록 확인
emulator -list-avds

# 에뮬레이터 실행 (AVD 이름 사용)
emulator -avd Pixel_5_API_33
```

#### 방법 A: 터미널에서 실행
```bash
npm start
# 서버 실행 후 'a' 키 입력
```

#### 방법 B: 직접 실행
```bash
npm run android
```

### 3️⃣ 실제 디바이스 (Expo Go)

#### iOS
1. App Store에서 **Expo Go** 설치
2. 카메라 앱으로 터미널의 QR 코드 스캔
3. 자동으로 Expo Go에서 앱 실행

#### Android
1. Google Play에서 **Expo Go** 설치
2. Expo Go 앱에서 QR 코드 스캔
3. 앱 실행

**주의**: iOS와 Android가 같은 WiFi 네트워크에 연결되어 있어야 합니다.

### 4️⃣ 웹 브라우저
```bash
npm start
# 'w' 키 입력

# 또는
npm run web
```

브라우저에서 `http://localhost:8081` 자동 열림

---

## ✅ 기능 테스트

### 1. 성능 최적화 테스트

#### 이미지 최적화
1. **설정 화면** 이동
2. **이미지 설정** 섹션에서 품질 변경
   - 낮음 (0.5) / 보통 (0.7) / 높음 (0.9)
3. **홈 화면**으로 이동
4. 이미지 업로드 테스트
5. 파일 크기 및 로딩 속도 확인

**예상 결과**:
- 낮음: 빠른 처리, 작은 파일 크기
- 높음: 느린 처리, 큰 파일 크기

#### 히스토리 리스트 가상화
1. **히스토리 화면** 이동
2. 많은 항목 생성 (10개 이상)
3. 스크롤 성능 확인
   - 부드러운 스크롤
   - 빠른 렌더링

**테스트 방법**:
```bash
# React DevTools Profiler 사용
# Chrome DevTools 또는 React Native Debugger
```

### 2. 다크 모드 테스트

#### 수동 전환
1. **설정 화면** 이동
2. **테마 설정** 섹션
3. 라이트/다크/시스템 모드 전환
4. 전체 화면에서 테마 확인

#### 시스템 설정 테스트
1. 테마를 **시스템 설정**으로 변경
2. 디바이스 설정에서 다크 모드 토글
3. 앱이 자동으로 테마 변경되는지 확인

### 3. 반응형 디자인 테스트

#### 태블릿
```bash
# iPad 시뮬레이터 실행
npx expo run:ios --device "iPad Pro"

# Android 태블릿 에뮬레이터
emulator -avd Pixel_Tablet_API_33
```

**확인 사항**:
- 레이아웃이 큰 화면에 맞게 조정됨
- 여백 및 컴포넌트 크기 적절함

#### 가로 모드
1. 디바이스를 가로로 회전 (Cmd+Left/Right 또는 Ctrl+Left/Right)
2. 레이아웃 확인
3. 모든 기능 정상 작동 확인

### 4. 에러 처리 테스트

#### 권한 거부
1. **설정 앱**에서 카메라/갤러리 권한 거부
2. 앱에서 이미지 업로드 시도
3. 친절한 에러 메시지 표시 확인

#### 네트워크 에러 (해당시)
1. WiFi/데이터 끄기
2. 네트워크 요청 기능 테스트
3. 에러 메시지 및 재시도 버튼 확인

### 5. 애니메이션 테스트
- 화면 전환 시 부드러운 애니메이션
- 로딩 스켈레톤 표시
- 버튼 클릭 피드백

---

## 🏗️ 빌드

### 개발 빌드

#### iOS
```bash
# 시뮬레이터용
npx expo run:ios

# 실제 디바이스용 (개발자 인증서 필요)
npx expo run:ios --device
```

#### Android
```bash
# 에뮬레이터용
npx expo run:android

# 실제 디바이스용
npx expo run:android --device
```

### EAS 빌드 (클라우드)

#### 1. EAS CLI 설치
```bash
npm install -g eas-cli
```

#### 2. Expo 계정 로그인
```bash
eas login
```

#### 3. 프로젝트 설정
```bash
eas build:configure
```

#### 4. 빌드 실행

**개발 빌드**:
```bash
# iOS
eas build --platform ios --profile development

# Android
eas build --platform android --profile development
```

**프리뷰 빌드** (내부 테스트용):
```bash
# iOS
eas build --platform ios --profile preview

# Android
eas build --platform android --profile preview
```

**프로덕션 빌드**:
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

### 로컬 빌드

#### Android APK
```bash
cd android
./gradlew assembleRelease

# APK 위치: android/app/build/outputs/apk/release/app-release.apk
```

#### iOS (macOS만)
```bash
# Xcode에서 빌드
open ios/portfolioprompthelper.xcworkspace

# Archive > Distribute App
```

---

## 🧪 테스트 체크리스트

### 기능 테스트
- [ ] 이미지 업로드 (갤러리)
- [ ] 이미지 촬영 (카메라)
- [ ] 이미지 압축 설정 변경
- [ ] 프롬프트 생성
- [ ] 히스토리 저장
- [ ] 히스토리 검색
- [ ] 히스토리 필터링
- [ ] 히스토리 정렬
- [ ] 태그 관리
- [ ] 데이터 내보내기
- [ ] 데이터 가져오기
- [ ] 데이터 삭제

### UI/UX 테스트
- [ ] 다크 모드 전환
- [ ] 로딩 스켈레톤 표시
- [ ] 애니메이션 부드러움
- [ ] 에러 메시지 표시
- [ ] 버튼 피드백
- [ ] 스크롤 성능

### 반응형 테스트
- [ ] 폰 세로 모드
- [ ] 폰 가로 모드
- [ ] 태블릿 세로 모드
- [ ] 태블릿 가로 모드

### 성능 테스트
- [ ] 빠른 이미지 로딩
- [ ] 부드러운 리스트 스크롤
- [ ] 메모리 사용량 적정
- [ ] 배터리 소모 정상

---

## 🐛 트러블슈팅

### 일반적인 문제

#### 1. Metro Bundler 오류
```bash
# 캐시 삭제
npx expo start --clear

# 또는
rm -rf node_modules
npm install
```

#### 2. iOS 빌드 오류
```bash
# Pod 재설치
cd ios
pod deintegrate
pod install
cd ..

# Xcode 캐시 삭제
rm -rf ~/Library/Developer/Xcode/DerivedData
```

#### 3. Android 빌드 오류
```bash
# Gradle 캐시 삭제
cd android
./gradlew clean
cd ..

# 전역 Gradle 캐시
rm -rf ~/.gradle/caches
```

#### 4. "Unable to resolve module" 오류
```bash
# Watchman 캐시 삭제 (macOS)
watchman watch-del-all

# Metro 캐시 삭제
npx expo start --clear
```

#### 5. 디바이스가 연결되지 않음
```bash
# iOS
xcrun simctl list devices

# Android
adb devices

# 디바이스 재시작
adb kill-server
adb start-server
```

### 플랫폼별 문제

#### iOS
- **Xcode 버전**: Xcode 15.0 이상 필요
- **CocoaPods 오류**: `pod repo update` 실행
- **인증서 문제**: Apple Developer 계정 확인

#### Android
- **SDK 누락**: Android Studio에서 SDK 재설치
- **에뮬레이터 느림**: Hardware acceleration 활성화
- **ANDROID_HOME 미설정**: 환경 변수 재확인

### 성능 문제

#### 앱이 느림
1. **개발 모드 확인**: 프로덕션 빌드 테스트
2. **디바이스 성능**: 최신 디바이스에서 테스트
3. **이미지 품질**: 설정에서 품질 낮추기

#### 메모리 부족
1. **이미지 수 제한**: 최대 5개로 제한됨
2. **히스토리 정리**: 오래된 항목 삭제
3. **앱 재시작**: 메모리 초기화

---

## 📊 성능 측정

### React Native Debugger
```bash
# 설치
brew install --cask react-native-debugger

# 실행
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Flipper
```bash
# 설치
brew install --cask flipper

# 실행 후 디바이스 연결
```

### Profiling
```javascript
// React DevTools Profiler
// 1. Chrome에서 http://localhost:8081/debugger-ui 접근
// 2. React DevTools 설치
// 3. Profiler 탭에서 성능 측정
```

---

## 📞 도움말

### 커뮤니티
- **Expo 공식 문서**: https://docs.expo.dev
- **React Native 문서**: https://reactnative.dev
- **Stack Overflow**: `expo` 또는 `react-native` 태그

### 프로젝트 이슈
- **GitHub Issues**: https://github.com/reill87/PromptStock/issues
- **버그 리포트**: 재현 단계와 함께 이슈 등록

### 로그 확인
```bash
# 상세 로그
npx expo start --dev-client

# iOS 로그
xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "PromptStock"'

# Android 로그
adb logcat *:S ReactNative:V ReactNativeJS:V
```

---

## 🎉 테스트 완료!

모든 테스트가 통과하면 프로덕션 배포 준비 완료입니다!

**다음 단계**:
1. 버그 수정
2. 추가 기능 구현
3. 앱 스토어 제출 준비

**Happy Testing! 🚀**
