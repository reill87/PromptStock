# Portfolio Prompt Helper

> 포트폴리오 스크린샷으로 AI 분석 프롬프트를 자동 생성하는 웹 서비스

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)

## 프로젝트 소개

**Portfolio Prompt Helper**는 주식 포트폴리오 스크린샷을 업로드하면, 사용자가 선택한 분석 목적에 맞는 최적화된 프롬프트를 자동으로 생성해주는 무료 웹 서비스입니다.

생성된 프롬프트를 복사해서 ChatGPT나 Claude 같은 LLM에 붙여넣기만 하면, 전문적인 포트폴리오 분석을 받을 수 있습니다.

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

## 기술 스택

### Frontend
- **React 18** - UI 프레임워크
- **TypeScript** - 타입 안정성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Zustand** - 상태 관리
- **React Router v6** - 라우팅
- **React Hook Form** - 폼 관리
- **browser-image-compression** - 이미지 최적화

### Storage
- **LocalStorage** - 설정 및 간단한 데이터
- **IndexedDB** - 대용량 이미지 저장

### Deployment
- **Vercel / Netlify** - 호스팅

## 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/reill87/PromptStock.git
cd PromptStock

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버가 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 프로젝트 구조

```
portfolio-prompt-helper/
├── public/                    # 정적 파일
│   └── templates/            # 기본 템플릿 JSON
├── src/
│   ├── components/           # React 컴포넌트
│   │   ├── common/          # 공통 컴포넌트
│   │   ├── upload/          # 이미지 업로드
│   │   ├── template/        # 템플릿 선택
│   │   ├── prompt/          # 프롬프트 생성
│   │   └── history/         # 히스토리
│   ├── pages/               # 페이지 컴포넌트
│   ├── hooks/               # 커스텀 훅
│   ├── store/               # Zustand 상태 관리
│   ├── utils/               # 유틸리티 함수
│   ├── types/               # TypeScript 타입
│   └── constants/           # 상수 및 템플릿
├── PRD.md                   # 제품 요구사항 문서
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
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

## 로드맵

### Phase 1: MVP (Week 1-2) ✅
- [x] 프로젝트 셋업
- [x] PRD 작성
- [ ] 기본 라우팅 구조
- [ ] 이미지 업로드 기능
- [ ] 5개 기본 템플릿 구현
- [ ] 프롬프트 생성 로직
- [ ] 클립보드 복사 기능

### Phase 2: 히스토리 및 고급 기능 (Week 3-4)
- [ ] LocalStorage 히스토리 저장
- [ ] 히스토리 조회/삭제 UI
- [ ] 템플릿 커스터마이징
- [ ] 태그 시스템
- [ ] 반응형 디자인

### Phase 3: 최적화 및 배포 (Week 5-6)
- [ ] IndexedDB 마이그레이션
- [ ] 검색 필터링
- [ ] 데이터 내보내기/가져오기
- [ ] 성능 최적화
- [ ] 배포 및 모니터링

### Phase 4: 향후 개선
- [ ] 커뮤니티 템플릿 마켓플레이스
- [ ] OCR 종목명 자동 추출
- [ ] 프롬프트 체인 기능
- [ ] 다크모드
- [ ] PWA 지원

## 기여하기

기여를 환영합니다! 자세한 내용은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참조하세요.

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 문의

- 이슈: [GitHub Issues](https://github.com/reill87/PromptStock/issues)
- 이메일: [프로젝트 관리자 이메일]

## 참고 문서

- [PRD (Product Requirements Document)](PRD.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

**만든이**: reill87
**최종 업데이트**: 2025-10-23
