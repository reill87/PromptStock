# ⚡ PromptStock 빠른 시작 가이드

5분 안에 PromptStock을 실행해보세요!

---

## 🎯 가장 빠른 방법: Expo Go 사용

### 1단계: Expo Go 설치
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 2단계: 프로젝트 클론 및 실행
```bash
# 저장소 클론
git clone https://github.com/reill87/PromptStock.git
cd PromptStock/portfolio-prompt-helper

# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

### 3단계: QR 코드 스캔
- **iOS**: 카메라 앱으로 터미널의 QR 코드 스캔
- **Android**: Expo Go 앱에서 QR 코드 스캔

**완료!** 🎉 이제 앱이 실행됩니다!

---

## 💻 시뮬레이터/에뮬레이터에서 실행

### iOS 시뮬레이터 (macOS만)
```bash
# Xcode가 설치되어 있어야 함
npm run ios
```

### Android 에뮬레이터
```bash
# Android Studio가 설치되어 있어야 함
# 에뮬레이터를 먼저 실행한 후:
npm run android
```

### 웹 브라우저
```bash
npm run web
```

---

## 🎮 기본 사용법

### 1. 프롬프트 생성하기
1. **홈 화면**에서 시작
2. 📸 **이미지 추가** 버튼 클릭
3. 갤러리에서 선택 또는 카메라로 촬영
4. 📝 **템플릿 선택**
5. 🎨 **프롬프트 생성** 버튼 클릭

### 2. 히스토리 확인하기
1. **히스토리 탭** 이동 (하단 두 번째 아이콘)
2. 생성된 프롬프트 목록 확인
3. 항목 클릭하여 상세 보기
4. 🔍 검색 및 필터 사용

### 3. 설정 변경하기
1. **설정 탭** 이동 (하단 세 번째 아이콘)
2. 이미지 품질 조정
3. 다크 모드 활성화
4. 기본 템플릿 설정

---

## 🛠️ 문제 해결

### "Metro Bundler failed to start" 오류
```bash
npx expo start --clear
```

### 이미지가 로드되지 않음
```bash
# 권한 확인 (설정 > 앱 > PromptStock > 권한)
# 카메라와 사진 접근 권한 허용
```

### 앱이 느림
```bash
# 캐시 삭제
rm -rf node_modules
npm install
npx expo start --clear
```

---

## 📚 더 알아보기

- **상세 테스트 가이드**: [TESTING.md](TESTING.md)
- **개선사항 목록**: [IMPROVEMENTS.md](IMPROVEMENTS.md)
- **프로젝트 문서**: [README.md](README.md)

---

## 🆘 도움이 필요하신가요?

- 🐛 **버그 리포트**: [GitHub Issues](https://github.com/reill87/PromptStock/issues)
- 💬 **질문**: [GitHub Discussions](https://github.com/reill87/PromptStock/discussions)
- 📖 **Expo 문서**: [docs.expo.dev](https://docs.expo.dev)

---

**Happy Coding! 🚀**
