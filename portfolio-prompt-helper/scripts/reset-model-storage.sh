#!/bin/bash

# AsyncStorage 초기화 스크립트
# 잘못된 모델 정보를 삭제하고 다시 감지하도록 함

echo "🔄 AsyncStorage 초기화 중..."
echo ""
echo "이 스크립트는 다음을 수행합니다:"
echo "1. AsyncStorage에서 모델 정보 삭제"
echo "2. 앱 재시작 시 파일을 다시 감지하여 자동 등록"
echo ""
echo "💡 시뮬레이터에서 앱을 재시작하세요 (Cmd+R)"
echo ""

# iOS 시뮬레이터 찾기
SIMULATOR_ID=$(xcrun simctl list devices | grep "(Booted)" | grep -oE '[A-F0-9-]{36}' | head -1)

if [ -z "$SIMULATOR_ID" ]; then
  echo "❌ 부팅된 시뮬레이터를 찾을 수 없습니다."
  echo "대신 앱에서 직접 초기화하세요:"
  echo ""
  echo "1. 앱 실행"
  echo "2. 개발자 메뉴 (Cmd+D 또는 Shake)"
  echo "3. 'Debug' → 'Open React Native Dev Menu'"
  echo "4. Console에서 실행:"
  echo "   AsyncStorage.removeItem('@installed_model')"
  exit 1
fi

BUNDLE_ID="com.promptstock.app"
APP_DATA_DIR=$(xcrun simctl get_app_container "$SIMULATOR_ID" "$BUNDLE_ID" data 2>/dev/null)

if [ -z "$APP_DATA_DIR" ]; then
  echo "❌ 앱을 찾을 수 없습니다."
  exit 1
fi

echo "✅ 시뮬레이터 발견: $SIMULATOR_ID"
echo "✅ 앱 데이터 디렉토리: $APP_DATA_DIR"
echo ""

# AsyncStorage 디렉토리 찾기 및 모델 정보 삭제
ASYNC_STORAGE_DIR="$APP_DATA_DIR/Library/RCTAsyncLocalStorage_V1"

if [ -d "$ASYNC_STORAGE_DIR" ]; then
  echo "📁 AsyncStorage 찾음: $ASYNC_STORAGE_DIR"

  # @installed_model 키를 포함하는 파일 찾기 및 삭제
  find "$ASYNC_STORAGE_DIR" -type f -exec grep -l "@installed_model" {} \; | while read file; do
    echo "🗑️  삭제: $file"
    rm "$file"
  done

  echo ""
  echo "✅ AsyncStorage 초기화 완료!"
else
  echo "⚠️  AsyncStorage 디렉토리를 찾을 수 없습니다."
  echo "   앱이 아직 AsyncStorage를 사용하지 않았을 수 있습니다."
fi

echo ""
echo "🎉 완료! 이제 앱을 재시작하세요:"
echo "   1. 시뮬레이터에서 Cmd+R (또는 R 키)"
echo "   2. 모델 파일이 자동으로 감지되고 올바른 ID로 등록됩니다!"
