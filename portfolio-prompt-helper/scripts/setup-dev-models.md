# 개발용 모델 설정 가이드

개발 중 매번 모델을 다운로드하지 않고, **한 번만 설정**하면 계속 사용할 수 있는 방법들입니다.

## 🎯 방법 1: 시뮬레이터에 직접 복사 (권장)

### 장점
- ✅ 리빌드해도 모델 유지됨
- ✅ Git에 포함 안 됨 (깔끔)
- ✅ 앱 크기 증가 없음

### 단계

#### 1. 앱 실행 (시뮬레이터 부팅)
```bash
cd /Users/kakao/PromptStock/portfolio-prompt-helper
npx expo run:ios
```

#### 2. 스크립트 실행
```bash
./scripts/copy-models-to-simulator.sh
```

#### 3. 모델 경로 지정
이미 모델을 다운로드했다면:
```
선택 (1/2): 1
모델 파일(.gguf) 경로: /Users/kakao/Downloads/llava-v1.5-7b-q4.gguf
mmproj 파일(.gguf) 경로: /Users/kakao/Downloads/llava-v1.5-7b-mmproj.gguf
```

또는 자동 다운로드:
```
선택 (1/2): 2
```

#### 4. 완료!
앱을 재시작하면 모델이 자동으로 감지됩니다.

### 어디에 저장되나요?
```
~/Library/Developer/CoreSimulator/Devices/
  └── [SIMULATOR_ID]/
      └── data/Containers/Data/Application/
          └── [APP_ID]/
              └── Documents/models/
                  ├── llava-v1.5-7b-q4.gguf
                  └── llava-v1.5-7b-mmproj.gguf
```

---

## 🎯 방법 2: 수동으로 복사

### 1. 시뮬레이터 경로 찾기
```bash
# 앱 실행 후
xcrun simctl get_app_container booted com.promptstock.app data
```

출력 예시:
```
/Users/kakao/Library/Developer/CoreSimulator/Devices/.../Data/Application/.../
```

### 2. 모델 파일 복사
```bash
MODELS_DIR="<위에서 나온 경로>/Documents/models"
mkdir -p "$MODELS_DIR"

cp ~/Downloads/llava-v1.5-7b-q4.gguf "$MODELS_DIR/"
cp ~/Downloads/llava-v1.5-7b-mmproj.gguf "$MODELS_DIR/"
```

### 3. 앱 재시작
Metro 서버 재시작:
```bash
npx expo start --dev-client
```

---

## 🎯 방법 3: AsyncStorage도 미리 설정

모델 파일 복사 후, 앱을 한 번 실행하면 자동으로 AsyncStorage에 저장됩니다.

또는 수동으로:
```javascript
// AsyncStorage에 직접 설정 (개발용)
import AsyncStorage from '@react-native-async-storage/async-storage';

const modelInfo = {
  modelId: "llava-v1.5-7b-q4",
  installedAt: new Date().toISOString(),
  version: "1.5",
  files: {
    modelPath: "/path/to/documents/models/llava-v1.5-7b-q4.gguf",
    mmprojPath: "/path/to/documents/models/llava-v1.5-7b-mmproj.gguf"
  },
  diskUsage: 4500000000
};

await AsyncStorage.setItem('@installed_model', JSON.stringify(modelInfo));
```

---

## 📝 모델 다운로드 링크

### Hugging Face
```
https://huggingface.co/mys/ggml_llava-v1.5-7b/tree/main
```

필요한 파일:
- `ggml-model-q4_k.gguf` (약 4.2GB) → `llava-v1.5-7b-q4.gguf`로 이름 변경
- `mmproj-model-f16.gguf` (약 573MB) → `llava-v1.5-7b-mmproj.gguf`로 이름 변경

---

## 🔄 리빌드 시 주의사항

### 유지되는 경우
```bash
# Metro 재시작만
npx expo start --dev-client  ✅ 모델 유지됨
```

### 삭제되는 경우
```bash
# 완전 리빌드
npx expo run:ios  ❌ 모델 삭제됨 (새 샌드박스)

# 해결: 스크립트 다시 실행
./scripts/copy-models-to-simulator.sh
```

---

## 💡 팀 공유 방법

Git에는 모델 파일을 올리지 않고, 팀원들이 각자 설정:

### .gitignore에 추가
```gitignore
# 로컬 개발용 모델 파일
local-models/
*.gguf
```

### README에 안내
```markdown
## 개발 환경 설정

1. 모델 다운로드: [Hugging Face 링크]
2. 스크립트 실행: `./scripts/copy-models-to-simulator.sh`
```

---

## 🎉 결과

- ✅ 한 번만 설정하면 계속 사용 가능
- ✅ Metro 재시작해도 모델 유지
- ✅ Git 저장소 깔끔하게 유지
- ⚠️ 완전 리빌드 시만 재설정 필요
