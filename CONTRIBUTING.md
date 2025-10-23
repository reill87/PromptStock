# Contributing to Portfolio Prompt Helper

Portfolio Prompt Helper에 기여해주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 행동 강령

이 프로젝트와 관련된 모든 활동에서 존중과 포용성을 유지해주세요. 모든 기여자는 환영받으며, 차별이나 괴롭힘은 용납되지 않습니다.

## 기여 방법

### 1. 이슈 보고

버그를 발견하거나 새로운 기능을 제안하고 싶으시다면:

1. [Issues](https://github.com/reill87/PromptStock/issues)에서 이미 등록된 이슈가 있는지 확인
2. 없다면 새로운 이슈 생성
3. 다음 정보를 포함:
   - **버그 리포트**: 재현 단계, 예상 결과, 실제 결과, 환경 정보
   - **기능 제안**: 기능 설명, 사용 사례, 기대 효과

### 2. Pull Request 제출

#### 시작하기

```bash
# 저장소 포크
# GitHub에서 "Fork" 버튼 클릭

# 포크한 저장소 클론
git clone https://github.com/YOUR_USERNAME/PromptStock.git
cd PromptStock

# 원본 저장소를 upstream으로 추가
git remote add upstream https://github.com/reill87/PromptStock.git

# 의존성 설치
npm install
```

#### 브랜치 생성

```bash
# 최신 코드 가져오기
git checkout main
git pull upstream main

# 새 브랜치 생성
git checkout -b feature/your-feature-name
# 또는
git checkout -b fix/your-bug-fix-name
```

브랜치 네이밍 컨벤션:
- `feature/기능명` - 새로운 기능
- `fix/버그명` - 버그 수정
- `docs/문서명` - 문서 수정
- `refactor/리팩토링명` - 코드 리팩토링
- `test/테스트명` - 테스트 추가/수정
- `style/스타일명` - 코드 스타일 변경

#### 코드 작성

1. **코드 스타일 준수**
   ```bash
   # 린트 실행
   npm run lint

   # 포맷팅 실행
   npm run format
   ```

2. **타입 체크**
   ```bash
   npm run type-check
   ```

3. **테스트 작성 및 실행**
   ```bash
   npm run test
   ```

#### 커밋 메시지 작성

커밋 메시지는 다음 형식을 따릅니다:

```
<type>: <subject>

<body>

<footer>
```

**Type**:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 스타일 변경 (기능 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스 또는 도구 변경

**예시**:
```
feat: Add risk analysis template

- Add new template for portfolio risk analysis
- Include sector concentration check
- Add volatility detection logic

Closes #123
```

#### Pull Request 생성

```bash
# 변경사항 커밋
git add .
git commit -m "feat: Add your feature"

# 포크한 저장소에 푸시
git push origin feature/your-feature-name
```

1. GitHub에서 포크한 저장소로 이동
2. "Compare & pull request" 버튼 클릭
3. PR 템플릿에 따라 내용 작성
4. PR 생성

### 3. 코드 리뷰

- 모든 PR은 최소 1명의 리뷰어 승인이 필요합니다
- 리뷰어의 피드백에 적극적으로 대응해주세요
- 필요시 추가 커밋으로 수정사항 반영

## 개발 가이드라인

### 코드 스타일

- **TypeScript**: strict mode 사용
- **React**: Functional Components + Hooks
- **Naming**:
  - 컴포넌트: PascalCase (예: `ImageUploader`)
  - 함수/변수: camelCase (예: `handleUpload`)
  - 상수: UPPER_SNAKE_CASE (예: `MAX_IMAGE_SIZE`)
  - 파일명: kebab-case 또는 PascalCase (컴포넌트)

### 컴포넌트 작성

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-primary"
    >
      {label}
    </button>
  );
};

// ❌ Bad
export default function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### 상태 관리

- **Zustand**: 전역 상태 관리
- **useState**: 로컬 컴포넌트 상태
- **useEffect**: 사이드 이펙트 처리

```typescript
// store/analysisStore.ts
import { create } from 'zustand';

interface AnalysisState {
  images: string[];
  addImage: (image: string) => void;
  clearImages: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  images: [],
  addImage: (image) => set((state) => ({
    images: [...state.images, image]
  })),
  clearImages: () => set({ images: [] }),
}));
```

### 에러 처리

```typescript
// ✅ Good
try {
  await compressImage(file);
} catch (error) {
  console.error('Image compression failed:', error);
  toast.error('이미지 압축에 실패했습니다.');
}

// ❌ Bad
try {
  await compressImage(file);
} catch (error) {
  // 에러 무시
}
```

### 접근성 (a11y)

- 모든 이미지에 `alt` 속성 추가
- 버튼에 명확한 레이블 제공
- 키보드 네비게이션 지원
- 적절한 ARIA 속성 사용

```typescript
// ✅ Good
<button
  aria-label="프롬프트 복사"
  onClick={handleCopy}
>
  <CopyIcon />
</button>

// ❌ Bad
<div onClick={handleCopy}>
  <CopyIcon />
</div>
```

## 프로젝트 구조

```
src/
├── components/         # React 컴포넌트
│   ├── common/        # 공통 컴포넌트 (Button, Modal 등)
│   ├── upload/        # 이미지 업로드 관련
│   ├── template/      # 템플릿 선택 관련
│   ├── prompt/        # 프롬프트 생성 관련
│   └── history/       # 히스토리 관련
├── pages/             # 페이지 컴포넌트
├── hooks/             # 커스텀 훅
├── store/             # Zustand 스토어
├── utils/             # 유틸리티 함수
├── types/             # TypeScript 타입 정의
└── constants/         # 상수 및 템플릿 데이터
```

## 테스트

### 단위 테스트

```typescript
// utils/__tests__/promptGenerator.test.ts
import { generatePrompt } from '../promptGenerator';

describe('generatePrompt', () => {
  it('should generate prompt with template and images', () => {
    const template = { /* ... */ };
    const images = ['image1.jpg'];
    const result = generatePrompt(template, images);

    expect(result).toContain('위 포트폴리오');
  });
});
```

### 통합 테스트

```typescript
// components/__tests__/NewAnalysis.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { NewAnalysis } from '../NewAnalysis';

describe('NewAnalysis', () => {
  it('should upload image and show preview', async () => {
    render(<NewAnalysis />);

    const file = new File(['image'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText('이미지 업로드');

    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByAltText('업로드된 이미지')).toBeInTheDocument();
  });
});
```

## 버전 관리

프로젝트는 [Semantic Versioning](https://semver.org/)을 따릅니다:

- **MAJOR**: 호환되지 않는 API 변경
- **MINOR**: 하위 호환되는 기능 추가
- **PATCH**: 하위 호환되는 버그 수정

## 릴리스 프로세스

1. 변경사항 문서화 (CHANGELOG.md)
2. 버전 번호 업데이트 (package.json)
3. 태그 생성 및 푸시
4. 릴리스 노트 작성

## 도움이 필요하신가요?

- 이슈에 질문 남기기
- 디스커션에서 토론하기
- 이메일 문의

## 기여자 인증

모든 기여자는 README.md의 기여자 섹션에 추가됩니다.

---

다시 한번 기여해주셔서 감사합니다! 🙏
