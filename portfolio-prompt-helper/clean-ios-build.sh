#!/bin/bash

echo "🧹 Cleaning iOS build artifacts..."

# 1. iOS 빌드 폴더 삭제
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock

# 2. Derived Data 삭제 (Xcode 캐시)
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# 3. node_modules 캐시 삭제
rm -rf node_modules/.cache

# 4. CocoaPods 캐시 삭제
cd ios
pod cache clean --all
pod deintegrate

# 5. Pods 재설치
echo "📦 Reinstalling Pods..."
pod install --repo-update

cd ..
echo "✅ Clean completed! Now run: npx expo run:ios"
