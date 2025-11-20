#!/bin/bash

# iOS 시뮬레이터에 모델 파일 복사 스크립트
# 개발용: 한 번만 실행하면 리빌드해도 유지됨

set -e

echo "🔍 iOS 시뮬레이터 찾는 중..."

# 현재 부팅된 시뮬레이터 찾기
SIMULATOR_ID=$(xcrun simctl list devices | grep "(Booted)" | grep -oE '[A-F0-9-]{36}' | head -1)

if [ -z "$SIMULATOR_ID" ]; then
  echo "❌ 부팅된 시뮬레이터를 찾을 수 없습니다."
  echo "💡 먼저 iOS 시뮬레이터를 실행해주세요:"
  echo "   npx expo run:ios"
  exit 1
fi

echo "✅ 시뮬레이터 발견: $SIMULATOR_ID"

# 앱의 Bundle Identifier
BUNDLE_ID="com.promptstock.app"

# 시뮬레이터의 앱 데이터 디렉토리 찾기
APP_DATA_DIR=$(xcrun simctl get_app_container "$SIMULATOR_ID" "$BUNDLE_ID" data 2>/dev/null)

if [ -z "$APP_DATA_DIR" ]; then
  echo "❌ 앱을 찾을 수 없습니다. 앱이 설치되어 있나요?"
  echo "💡 먼저 앱을 실행해주세요:"
  echo "   npx expo run:ios"
  exit 1
fi

echo "✅ 앱 데이터 디렉토리: $APP_DATA_DIR"

# Documents/models 디렉토리 생성
MODELS_DIR="$APP_DATA_DIR/Documents/models"
mkdir -p "$MODELS_DIR"

echo "📁 모델 디렉토리 생성: $MODELS_DIR"
echo ""

# 로컬에 모델 파일이 있는지 확인
echo "💡 모델 파일을 어디서 가져올까요?"
echo "1. 로컬 파일 경로 지정 (이미 다운로드한 경우)"
echo "2. URL에서 다운로드 (시간 오래 걸림)"
echo ""
read -p "선택 (1/2): " choice

if [ "$choice" = "1" ]; then
  echo ""
  read -p "모델 파일(.gguf) 경로: " MODEL_PATH
  read -p "mmproj 파일(.gguf) 경로: " MMPROJ_PATH

  if [ ! -f "$MODEL_PATH" ]; then
    echo "❌ 모델 파일을 찾을 수 없습니다: $MODEL_PATH"
    exit 1
  fi

  if [ ! -f "$MMPROJ_PATH" ]; then
    echo "❌ mmproj 파일을 찾을 수 없습니다: $MMPROJ_PATH"
    exit 1
  fi

  echo "📋 파일 복사 중..."
  cp "$MODEL_PATH" "$MODELS_DIR/llava-v1.5-7b-q4.gguf"
  cp "$MMPROJ_PATH" "$MODELS_DIR/llava-v1.5-7b-mmproj.gguf"

elif [ "$choice" = "2" ]; then
  echo "⬇️ 모델 다운로드 중... (4GB+, 시간 오래 걸림)"
  echo "모델 URL: https://huggingface.co/mys/ggml_llava-v1.5-7b"

  curl -L -o "$MODELS_DIR/llava-v1.5-7b-q4.gguf" \
    "https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/ggml-model-q4_k.gguf"

  curl -L -o "$MODELS_DIR/llava-v1.5-7b-mmproj.gguf" \
    "https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/mmproj-model-f16.gguf"
else
  echo "❌ 잘못된 선택"
  exit 1
fi

echo ""
echo "✅ 모델 파일 복사 완료!"
echo ""
echo "📊 파일 크기:"
ls -lh "$MODELS_DIR"
echo ""
echo "🎉 이제 앱을 실행하면 모델이 자동으로 감지됩니다!"
echo "💡 리빌드해도 이 파일들은 유지됩니다."
