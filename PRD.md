# PRD: 포트폴리오 AI 분석 도우미

## 1. 제품 개요

### 1.1 제품명
**Portfolio Prompt Helper** (가칭)

### 1.2 제품 설명
주식 포트폴리오 스크린샷을 업로드하면, 사용자가 선택한 분석 목적에 맞는 최적화된 프롬프트를 자동 생성해주는 웹 서비스. 사용자는 생성된 프롬프트를 복사해서 자신의 LLM(ChatGPT/Claude)에 붙여넣어 분석을 받을 수 있음.

### 1.3 핵심 가치
- **비용 제로**: 사용자가 자신의 무료 LLM 계정 활용
- **시간 절약**: 매번 프롬프트 작성하는 수고 제거
- **품질 보장**: 검증된 템플릿 사용으로 일관된 분석 품질
- **히스토리 관리**: 과거 분석 결과 저장 및 비교

### 1.4 타겟 유저
- 개인 투자자 (주식/ETF 보유자)
- LLM을 활용한 투자 분석에 관심 있는 사람
- 포트폴리오 관리/리밸런싱이 필요한 사람

---

## 2. 핵심 기능 (MVP)

### 2.1 포트폴리오 업로드
**기능 설명**
- 사용자가 증권 앱 스크린샷을 업로드
- 이미지 미리보기 제공
- 다중 이미지 업로드 지원 (최대 5장)

**기술 요구사항**
- 이미지 업로드 UI (드래그 앤 드롭 지원)
- 클라이언트 사이드 이미지 리사이징 (용량 최적화)
- 로컬 스토리지 또는 브라우저 캐시에 임시 저장
- 지원 포맷: JPG, PNG, WEBP (최대 10MB)

**UI/UX**
```
┌─────────────────────────────────┐
│  📸 포트폴리오 스크린샷 업로드   │
│                                 │
│  ┌─────────────────────────┐  │
│  │                         │  │
│  │   이미지를 드래그하거나  │  │
│  │      클릭해서 업로드     │  │
│  │                         │  │
│  └─────────────────────────┘  │
│                                 │
│  [업로드된 이미지 미리보기]     │
└─────────────────────────────────┘
```

---

### 2.2 분석 템플릿 선택
**기능 설명**
- 사전 정의된 분석 템플릿 카테고리 제공
- 각 템플릿 설명 및 예시 결과 표시
- 템플릿 검색 기능

**템플릿 카테고리 (MVP 버전)**

1. **위험도 분석**
   - 섹터별 집중도 체크
   - 변동성 높은 종목 식별
   - 분산투자 개선 포인트

2. **리밸런싱 제안**
   - 현재 비중 분석
   - 목표 포트폴리오와 비교
   - 매수/매도 추천

3. **종목별 체크리스트**
   - 각 종목별 최근 이슈
   - 실적 발표 일정
   - 확인해야 할 정보 리스트

4. **섹터 밸런스 분석**
   - 섹터별 비중 계산
   - 산업 트렌드 반영도
   - 편중 섹터 경고

5. **수익률 개선 분석**
   - 손실 종목 원인 분석
   - 수익 종목 추가 매수 고려사항
   - 손절/익절 타이밍 검토

**기술 요구사항**
- 템플릿 데이터 구조 (JSON)
- 템플릿 렌더링 컴포넌트
- 검색 필터링 로직

**UI/UX**
```
┌─────────────────────────────────┐
│  📋 분석 목적을 선택하세요       │
│                                 │
│  🔍 [검색...]                   │
│                                 │
│  ┌──────────────────────┐      │
│  │ 🎯 위험도 분석        │      │
│  │ 포트폴리오의 위험 요소 │      │
│  │ 및 분산투자 개선점    │      │
│  │         [선택하기] ───┼──→   │
│  └──────────────────────┘      │
│                                 │
│  ┌──────────────────────┐      │
│  │ ⚖️ 리밸런싱 제안      │      │
│  │ ...                  │      │
│  └──────────────────────┘      │
└─────────────────────────────────┘
```

---

### 2.3 프롬프트 자동 생성
**기능 설명**
- 선택한 템플릿 + 업로드한 이미지 기반으로 완성된 프롬프트 생성
- 생성된 프롬프트 미리보기
- 원클릭 복사 기능
- 프롬프트 커스터마이징 옵션

**프롬프트 구조**
```
[사용자 이미지]

{템플릿 기본 지시사항}

분석 항목:
1. {항목1}
2. {항목2}
3. {항목3}

출력 형식:
{원하는 출력 형식 (표, 리스트 등)}

추가 지시사항:
{사용자 커스텀 입력}
```

**기술 요구사항**
- 템플릿 엔진 (문자열 치환)
- 클립보드 API 연동
- 이미지 + 텍스트 복사 지원 (멀티파트)
- 프롬프트 프리뷰 컴포넌트

**UI/UX**
```
┌─────────────────────────────────┐
│  ✨ 생성된 프롬프트              │
│                                 │
│  ┌─────────────────────────┐  │
│  │ [이미지 미리보기]        │  │
│  │                         │  │
│  │ 위 포트폴리오를 분석해서: │  │
│  │ 1. 섹터별 비중 계산      │  │
│  │ 2. 위험 요소 3가지      │  │
│  │ 3. 개선점 제안          │  │
│  │ ...                     │  │
│  └─────────────────────────┘  │
│                                 │
│  [✏️ 수정하기] [📋 복사하기]   │
│                                 │
│  💡 이 프롬프트를 ChatGPT나     │
│     Claude에 붙여넣으세요       │
└─────────────────────────────────┘
```

---

### 2.4 분석 히스토리 저장
**기능 설명**
- 생성한 프롬프트 및 분석 결과 저장
- 날짜별 히스토리 조회
- 태그 및 메모 추가
- 과거 분석과 비교 기능

**저장 데이터 구조**
```javascript
{
  id: "uuid",
  createdAt: "2025-10-23T10:30:00Z",
  images: ["base64_string_1", "base64_string_2"],
  templateId: "risk-analysis",
  templateName: "위험도 분석",
  generatedPrompt: "...",
  userNote: "10월 포트폴리오 분석",
  llmResponse: "사용자가 붙여넣은 LLM 응답 (선택사항)",
  tags: ["리밸런싱", "위험관리"]
}
```

**기술 요구사항**
- LocalStorage 또는 IndexedDB 사용
- 이미지 base64 인코딩/디코딩
- 날짜 필터링 및 정렬
- 태그 관리 시스템
- 데이터 내보내기 (JSON)

**UI/UX**
```
┌─────────────────────────────────┐
│  📚 분석 히스토리               │
│                                 │
│  [전체] [이번달] [태그별]       │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 📅 2025.10.23            │  │
│  │ 🏷️ 위험도 분석           │  │
│  │ 삼성전자, 네이버, SK하이닉스 │  │
│  │ [메모: 10월 리밸런싱]     │  │
│  │         [보기] [삭제]    │  │
│  └──────────────────────────┘  │
│                                 │
│  ┌──────────────────────────┐  │
│  │ 📅 2025.10.15            │  │
│  │ ...                      │  │
│  └──────────────────────────┘  │
└─────────────────────────────────┘
```

---

### 2.5 템플릿 커스터마이징
**기능 설명**
- 기본 템플릿 수정 가능
- 나만의 템플릿 생성
- 변수 치환 기능 (종목명, 수량 등 자동 추출 시)

**커스터마이징 옵션**
- 분석 항목 추가/삭제
- 출력 형식 변경 (표/리스트/단락)
- 추가 질문 입력
- 분석 깊이 조절 (간단/상세)

**기술 요구사항**
- 텍스트 에디터 컴포넌트
- 실시간 프리뷰
- 템플릿 유효성 검사
- 커스텀 템플릿 저장

**UI/UX**
```
┌─────────────────────────────────┐
│  ✏️ 프롬프트 커스터마이징        │
│                                 │
│  ┌─────────────────────────┐  │
│  │ 위 포트폴리오를 분석해서: │  │
│  │                         │  │
│  │ [편집 가능 영역]         │  │
│  │ 1. ________________     │  │
│  │ 2. ________________     │  │
│  │                         │  │
│  └─────────────────────────┘  │
│                                 │
│  [기본으로 리셋] [저장]         │
└─────────────────────────────────┘
```

---

## 3. 기술 스택

### 3.1 프론트엔드
- **프레임워크**: React 19 + Expo (웹/iOS/Android 통합)
- **언어**: TypeScript
- **스타일링**: NativeWind (Tailwind CSS for React Native)
- **상태관리**: Zustand (경량 상태관리)
- **라우팅**: Expo Router (파일 기반 라우팅)
- **폼 관리**: React Hook Form
- **이미지 처리**: Expo Image Manipulator

### 3.2 네이티브 기능
- **이미지 선택**: Expo Image Picker
- **클립보드**: Expo Clipboard
- **파일 시스템**: Expo File System
- **햅틱 피드백**: Expo Haptics
- **아이콘**: @expo/vector-icons

### 3.3 데이터 저장
- **로컬 스토리지**: AsyncStorage (설정, 간단한 데이터)
- **이미지 저장**: FileSystem + AsyncStorage
- **백업**: JSON 내보내기/가져오기

### 3.4 배포
- **웹 호스팅**: Vercel 또는 Netlify (무료 티어)
- **iOS**: App Store (EAS Build)
- **Android**: Google Play Store (EAS Build)
- **OTA 업데이트**: Expo Updates

### 3.5 개발 도구
- **번들러**: Metro (Expo 기본)
- **린터**: ESLint + Prettier
- **타입체킹**: TypeScript strict mode
- **빌드**: EAS Build (Expo Application Services)

---

## 4. 사용자 플로우

### 4.1 메인 플로우
```
1. 홈페이지 접속
   ↓
2. "새 분석 시작" 버튼 클릭
   ↓
3. 포트폴리오 스크린샷 업로드
   ↓
4. 분석 템플릿 선택
   ↓
5. 생성된 프롬프트 확인
   ↓
6. (선택) 프롬프트 수정
   ↓
7. 프롬프트 복사
   ↓
8. LLM(ChatGPT/Claude)에 붙여넣기
   ↓
9. (선택) 분석 결과를 히스토리에 저장
```

### 4.2 히스토리 조회 플로우
```
1. 히스토리 메뉴 클릭
   ↓
2. 과거 분석 목록 확인
   ↓
3. 특정 분석 클릭
   ↓
4. 당시 프롬프트 및 결과 확인
   ↓
5. (선택) 재사용 또는 비교 분석
```

---

## 5. 데이터 모델

### 5.1 Template (템플릿)
```typescript
interface Template {
  id: string;
  name: string;
  category: 'risk' | 'rebalance' | 'checklist' | 'sector' | 'profit';
  description: string;
  icon: string;
  promptTemplate: string;
  outputFormat: string;
  exampleResult?: string;
  variables: TemplateVariable[];
  isCustom: boolean;
  createdAt: string;
  usageCount: number;
}

interface TemplateVariable {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: string[];
  defaultValue?: string;
}
```

### 5.2 Analysis (분석 히스토리)
```typescript
interface Analysis {
  id: string;
  createdAt: string;
  updatedAt: string;
  templateId: string;
  templateName: string;
  images: string[]; // base64 or IndexedDB keys
  generatedPrompt: string;
  customPrompt?: string;
  llmResponse?: string;
  userNote?: string;
  tags: string[];
  metadata: {
    stockCount?: number;
    totalValue?: number;
    extractedData?: Record<string, any>;
  };
}
```

### 5.3 UserSettings (사용자 설정)
```typescript
interface UserSettings {
  defaultTemplate?: string;
  autoSave: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  preferredLLM: 'chatgpt' | 'claude' | 'other';
  customTemplates: Template[];
}
```

---

## 6. UI/UX 와이어프레임

### 6.1 홈 화면
```
┌─────────────────────────────────────────┐
│  Portfolio Prompt Helper          [메뉴] │
├─────────────────────────────────────────┤
│                                         │
│        📊 포트폴리오 AI 분석 도우미      │
│                                         │
│     스크린샷 올리고, 프롬프트 받고,     │
│        나만의 AI 비서로 분석하세요      │
│                                         │
│      [🚀 새 분석 시작하기]              │
│                                         │
│      [📚 히스토리 보기]                 │
│                                         │
├─────────────────────────────────────────┤
│  최근 분석                              │
│  • 10/23 - 위험도 분석                  │
│  • 10/20 - 리밸런싱 제안                │
│  • 10/15 - 섹터 밸런스                  │
└─────────────────────────────────────────┘
```

### 6.2 분석 생성 화면
```
┌─────────────────────────────────────────┐
│  [← 뒤로]  새 분석              [1/3]    │
├─────────────────────────────────────────┤
│                                         │
│  Step 1: 포트폴리오 업로드               │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │    📸 이미지를 드래그하거나        │ │
│  │         클릭해서 업로드           │ │
│  │                                   │ │
│  │    JPG, PNG (최대 10MB)          │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [업로드된 이미지 썸네일 표시]           │
│                                         │
│              [다음 단계 →]              │
│                                         │
└─────────────────────────────────────────┘
```

### 6.3 템플릿 선택 화면
```
┌─────────────────────────────────────────┐
│  [← 뒤로]  템플릿 선택          [2/3]    │
├─────────────────────────────────────────┤
│                                         │
│  어떤 분석이 필요하신가요?               │
│                                         │
│  🔍 [검색 템플릿...]                    │
│                                         │
│  ┌─────────────┐  ┌─────────────┐      │
│  │ 🎯 위험도   │  │ ⚖️ 리밸런싱 │      │
│  │   분석      │  │    제안     │      │
│  │             │  │             │      │
│  │ 사용 1,234회│  │ 사용 856회  │      │
│  │ [선택]      │  │ [선택]      │      │
│  └─────────────┘  └─────────────┘      │
│                                         │
│  ┌─────────────┐  ┌─────────────┐      │
│  │ 📋 체크리스트│  │ 📊 섹터     │      │
│  │             │  │   밸런스    │      │
│  └─────────────┘  └─────────────┘      │
│                                         │
└─────────────────────────────────────────┘
```

### 6.4 프롬프트 생성 화면
```
┌─────────────────────────────────────────┐
│  [← 뒤로]  프롬프트 확인        [3/3]    │
├─────────────────────────────────────────┤
│                                         │
│  ✨ 생성된 프롬프트                      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ [📸 이미지 미리보기]              │ │
│  │                                   │ │
│  │ 위 포트폴리오를 다음과 같이 분석: │ │
│  │                                   │ │
│  │ 1. 섹터별 비중 계산               │ │
│  │ 2. 위험 요소 3가지 식별           │ │
│  │ 3. 분산투자 개선 포인트           │ │
│  │                                   │ │
│  │ 출력 형식: 표로 정리              │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [✏️ 수정하기]  [📋 복사하기]          │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 💡 다음 단계                      │ │
│  │ 1. 위 프롬프트 복사               │ │
│  │ 2. ChatGPT/Claude 열기            │ │
│  │ 3. 프롬프트 붙여넣기              │ │
│  │ 4. 결과를 히스토리에 저장(선택)   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [💾 히스토리에 저장]  [🏠 홈으로]     │
│                                         │
└─────────────────────────────────────────┘
```

### 6.5 히스토리 화면
```
┌─────────────────────────────────────────┐
│  [← 뒤로]  분석 히스토리                 │
├─────────────────────────────────────────┤
│                                         │
│  🔍 [검색...]         [태그] [날짜]      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 📅 2025년 10월 23일               │ │
│  │ 🏷️  위험도 분석                   │ │
│  │                                   │ │
│  │ [썸네일]                          │ │
│  │                                   │ │
│  │ 분석 종목: 삼성전자, 네이버, ...   │ │
│  │ 메모: 10월 리밸런싱 참고          │ │
│  │                                   │ │
│  │ [상세보기] [재사용] [삭제]        │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 📅 2025년 10월 20일               │ │
│  │ 🏷️  리밸런싱 제안                 │ │
│  │ ...                               │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## 7. 구현 우선순위

### Phase 1 (MVP - Week 1-2)
- [x] 타입 정의 완료 (template, analysis, common)
- [x] 5개 기본 템플릿 데이터 작성
- [ ] Expo 프로젝트 셋업 (React Native + TypeScript + Metro)
- [ ] NativeWind 설정 및 기본 스타일
- [ ] Expo Router 라우팅 구조 (탭 네비게이션)
- [ ] 이미지 업로드 기능 (Expo Image Picker)
- [ ] 프롬프트 생성 로직
- [ ] 클립보드 복사 기능 (Expo Clipboard)

### Phase 2 (Week 3-4)
- [ ] AsyncStorage 히스토리 저장
- [ ] 히스토리 조회/삭제 UI (FlatList 사용)
- [ ] 템플릿 커스터마이징 기능
- [ ] 태그 시스템
- [ ] 웹/iOS/Android 반응형 디자인
- [ ] 햅틱 피드백 추가

### Phase 3 (Week 5-6)
- [ ] 이미지 저장 최적화 (FileSystem + AsyncStorage)
- [ ] 검색 필터링
- [ ] 데이터 내보내기/가져오기 (FileSystem)
- [ ] 사용자 설정 페이지
- [ ] 도움말/튜토리얼
- [ ] iOS/Android 빌드 테스트

### Phase 4 (배포 및 향후 개선)
- [ ] 웹 배포 (Vercel/Netlify)
- [ ] iOS 앱스토어 출시 (TestFlight → App Store)
- [ ] Android 플레이스토어 출시 (내부 테스트 → 프로덕션)
- [ ] OTA 업데이트 설정
- [ ] 커뮤니티 템플릿 마켓플레이스
- [ ] OCR로 종목명 자동 추출
- [ ] 프롬프트 체인 기능
- [ ] 다크모드
- [ ] 푸시 알림 (실적 발표 알림 등)

---

## 8. 템플릿 예시

### 8.1 위험도 분석 템플릿
```
위 포트폴리오 이미지를 보고 다음을 분석해주세요:

1. **섹터 분석**
   - 각 종목의 산업 섹터 분류
   - 섹터별 투자 비중 계산
   - 특정 섹터 집중도 (30% 이상이면 경고)

2. **위험 요소**
   - 변동성이 높은 종목 식별
   - 최근 3개월 내 큰 이슈가 있었던 종목
   - 상관관계가 높은 종목들 (분산투자 미흡)

3. **개선 제안**
   - 분산투자를 위해 추가하면 좋을 섹터
   - 비중 조절이 필요한 종목
   - 전체적인 포트폴리오 위험도 평가 (1-10점)

**출력 형식**:
- 섹터 분석은 표로 정리
- 위험 요소는 중요도 순으로 번호 매기기
- 개선 제안은 구체적인 액션 아이템으로 작성
```

### 8.2 리밸런싱 제안 템플릿
```
위 포트폴리오 이미지를 분석해서 리밸런싱 제안을 해주세요:

1. **현재 상태 분석**
   - 종목별 현재 비중 (%)
   - 시가총액 기준 대형주/중형주/소형주 분류
   - 성장주/가치주 비율

2. **목표 포트폴리오 제안**
   - 균형잡힌 섹터 배분 (권장 비중)
   - 위험 수준별 자산 배분 제안

3. **구체적 액션**
   - 비중 축소할 종목 및 목표 비중
   - 비중 확대할 종목 및 목표 비중
   - 신규 편입 고려 종목 (있다면)
   - 예상 거래 금액

**출력 형식**:
```
| 종목명 | 현재 비중 | 목표 비중 | 액션 | 거래금액 |
|--------|----------|----------|------|---------|
| ...    | ...      | ...      | ...  | ...     |
```

추가로 리밸런싱 이유를 3줄 이내로 요약해주세요.
```

### 8.3 종목별 체크리스트 템플릿
```
위 포트폴리오의 각 종목에 대해 다음 체크리스트를 작성해주세요:

각 종목별로:
1. **최근 이슈** (1개월 내)
   - 주요 공시 사항
   - 언론에 보도된 이슈
   - 주가 영향을 줄 만한 뉴스

2. **확인 필요 사항**
   - 다음 실적 발표일
   - 배당 기준일/지급일
   - 주요 이벤트 (IR, 신제품 출시 등)

3. **체크 포인트**
   - 최근 증권사 리포트 변화 (컨센서스 상향/하향)
   - 기관/외국인 수급 변화
   - 기술적 지표 (52주 최고가 대비 현재가)

**출력 형식**: 종목별로 구분해서 정리, 중요도 높은 항목은 ⚠️ 표시
```

### 8.4 섹터 밸런스 템플릿
```
위 포트폴리오의 섹터 밸런스를 분석해주세요:

1. **섹터 분류 및 비중**
```
| 섹터 | 종목수 | 투자비중 | 산업 전망 |
|------|--------|----------|-----------|
| IT   | X개    | XX%      | ...       |
| ...  | ...    | ...      | ...       |
```

2. **섹터별 평가**
   - 각 섹터의 현재 산업 사이클 (상승/정체/하락)
   - 글로벌 트렌드 반영도
   - 국내 경기 민감도

3. **밸런스 진단**
   - 과도하게 집중된 섹터 (30% 이상)
   - 부족한 섹터 (방어적 섹터 등)
   - 경기 사이클별 분산 정도

4. **개선 제안**
   - 추가하면 좋을 섹터 및 이유
   - 줄이면 좋을 섹터 및 이유
   - 밸런스 점수 (100점 만점)

**출력 형식**: 표와 함께 핵심 요약 3줄
```

### 8.5 수익률 개선 분석 템플릿
```
위 포트폴리오의 수익률을 개선하기 위한 분석을 해주세요:

1. **수익 현황**
   - 수익 상위 3종목 및 수익률
   - 손실 상위 3종목 및 손실률
   - 전체 포트폴리오 수익률 (추정)

2. **손실 종목 분석**
   각 손실 종목별로:
   - 손실 원인 (기업 실적? 산업 침체? 시장 전반?)
   - 회복 가능성 판단
   - 액션: 손절 vs 추가 매수 vs 홀딩 (근거 포함)

3. **수익 종목 분석**
   각 수익 종목별로:
   - 수익 지속 가능성
   - 추가 상승 여력
   - 액션: 익절 vs 추가 매수 vs 홀딩 (근거 포함)

4. **포트폴리오 최적화**
   - 성과 좋은 종목의 공통점
   - 성과 나쁜 종목의 공통점
   - 향후 투자 전략 제안 (3가지)

**출력 형식**: 종목별 액션 아이템을 명확히 구분
```

---

## 9. 성공 지표

### 9.1 사용자 지표
- DAU (Daily Active Users): 목표 100명 (3개월 내)
- 프롬프트 생성 수: 목표 1,000회/월
- 히스토리 저장률: 목표 60%
- 재방문율: 목표 40% (주간)

### 9.2 품질 지표
- 페이지 로딩 속도: < 2초
- 이미지 업로드 성공률: > 95%
- 클립보드 복사 성공률: > 98%
- 모바일 반응형 지원: 100%

### 9.3 사용자 피드백
- 사용 후 설문: "도움이 되었나요?" > 80% 긍정
- 가장 많이 사용된 템플릿 TOP 3 추적
- 평균 프롬프트 커스터마이징 비율

---

## 10. 리스크 및 대응

### 10.1 기술적 리스크
| 리스크 | 영향 | 대응 방안 |
|--------|------|-----------|
| 브라우저 호환성 | 중 | Polyfill 적용, 크로스 브라우저 테스트 |
| 이미지 용량 이슈 | 중 | 자동 리사이징, 용량 제한 안내 |
| LocalStorage 한계 | 중 | IndexedDB로 마이그레이션, 주기적 정리 |
| 모바일 성능 | 중 | 레이지 로딩, 코드 스플리팅 |

### 10.2 사용자 경험 리스크
| 리스크 | 영향 | 대응 방안 |
|--------|------|-----------|
| 프롬프트 품질 저하 | 고 | 템플릿 지속 개선, 사용자 피드백 수집 |
| 사용법 혼란 | 중 | 인터랙티브 튜토리얼, 툴팁 |
| 히스토리 관리 불편 | 중 | 검색/필터 고도화, 자동 태깅 |

### 10.3 경쟁 리스크
| 리스크 | 영향 | 대응 방안 |
|--------|------|-----------|
| 유사 서비스 출현 | 중 | 빠른 기능 개선, 커뮤니티 구축 |
| LLM 직접 지원 | 고 | 차별화 (히스토리, 비교 분석) |

---

## 11. 추가 아이디어 (Future)

### 11.1 커뮤니티 기능
- 사용자가 만든 템플릿 공유
- 템플릿 평점 및 리뷰
- 베스트 프롬프트 순위

### 11.2 고급 기능
- OCR로 종목명/수량 자동 추출
- 과거 분석 간 비교 뷰
- 프롬프트 체인 (1차 분석 → 2차 심화 분석)
- PDF 리포트 자동 생성

### 11.3 통합 기능
- 증권 앱 API 연동 (실시간 데이터)
- 캘린더 연동 (실적 발표일 알림)
- 유튜브 API (관련 분석 영상 추천)

### 11.4 모바일 앱 전용 기능
- 카메라 직접 촬영 (증권 앱 화면 바로 찍기)
- 푸시 알림 (실적 발표일, 배당 기준일 등)
- 위젯 (최근 분석 결과 요약)
- 앱 아이콘 뱃지 (새로운 이벤트 알림)
- Face ID/Touch ID 보안
- 오프라인 모드 (네트워크 없이도 프롬프트 생성)

### 11.5 수익화 (훗날)
- 프리미엄 템플릿 판매
- 고급 분석 기능 구독제
- 광고 (증권사 제휴)
- 앱 내 구매 (추가 스토리지, 무제한 히스토리)

---

## 12. 개발 일정 (예상)

### Week 1-2: 프로젝트 셋업 및 핵심 기능
- Day 1-2: 프로젝트 초기화, 라우팅 구조
- Day 3-5: 이미지 업로드 UI/UX
- Day 6-8: 템플릿 시스템 구현
- Day 9-10: 프롬프트 생성 로직
- Day 11-14: 클립보드 복사, 기본 스타일링

### Week 3-4: 히스토리 및 고급 기능
- Day 15-17: LocalStorage 히스토리 저장
- Day 18-20: 히스토리 UI (조회/삭제)
- Day 21-23: 템플릿 커스터마이징
- Day 24-26: 태그 시스템
- Day 27-28: 버그 수정 및 테스트

### Week 5-6: 최적화 및 배포
- Day 29-31: 성능 최적화
- Day 32-34: 반응형 디자인 완성
- Day 35-37: 크로스 브라우저 테스트
- Day 38-40: 배포 및 모니터링 설정
- Day 41-42: 문서화 및 런칭

---

## 13. 프로젝트 구조

```
portfolio-prompt-helper/
├── app/                          # Expo Router (파일 기반 라우팅)
│   ├── (tabs)/                   # 탭 네비게이션 그룹
│   │   ├── _layout.tsx          # 탭 레이아웃 설정
│   │   ├── index.tsx            # 홈 화면 (/)
│   │   ├── history.tsx          # 히스토리 (/history)
│   │   └── settings.tsx         # 설정 (/settings)
│   ├── analysis/
│   │   └── new.tsx              # 새 분석 (/analysis/new)
│   ├── _layout.tsx              # 루트 레이아웃
│   └── +not-found.tsx           # 404 페이지
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   └── Card.tsx
│   ├── upload/
│   │   ├── ImageUploader.tsx   # Expo Image Picker 사용
│   │   └── ImagePreview.tsx
│   ├── template/
│   │   ├── TemplateCard.tsx
│   │   ├── TemplateList.tsx
│   │   └── TemplateEditor.tsx
│   ├── prompt/
│   │   ├── PromptPreview.tsx
│   │   └── CopyButton.tsx      # Expo Clipboard 사용
│   └── history/
│       ├── HistoryList.tsx
│       ├── HistoryItem.tsx
│       └── HistoryDetail.tsx
├── hooks/
│   ├── useImageUpload.ts       # Expo APIs 활용
│   ├── useTemplates.ts
│   ├── useHistory.ts           # AsyncStorage 활용
│   └── useClipboard.ts         # Expo Clipboard 활용
├── store/
│   ├── analysisStore.ts
│   ├── templateStore.ts
│   └── settingsStore.ts
├── utils/
│   ├── imageCompression.ts     # Expo Image Manipulator
│   ├── promptGenerator.ts
│   ├── storage.ts              # AsyncStorage 래퍼
│   └── dateFormatter.ts
├── types/
│   ├── template.ts
│   ├── analysis.ts
│   └── common.ts
├── constants/
│   ├── templates.ts
│   └── colors.ts
├── assets/                      # 이미지, 폰트 등
│   ├── images/
│   │   ├── icon.png
│   │   ├── splash.png
│   │   └── adaptive-icon.png
│   └── fonts/
├── app.json                     # Expo 설정
├── metro.config.js             # Metro bundler 설정
├── babel.config.js             # Babel 설정
├── global.css                  # NativeWind 스타일
├── tailwind.config.js          # NativeWind 설정
├── tsconfig.json
└── package.json
```

---

## 14. Expo 구현 가이드

### 14.1 시작 명령어
```bash
# Expo 프로젝트 생성 (Tabs 템플릿)
npx create-expo-app@latest portfolio-prompt-helper --template tabs
cd portfolio-prompt-helper

# 필수 Expo 패키지 설치
npx expo install expo-router expo-image-picker expo-image-manipulator expo-file-system expo-clipboard expo-haptics

# AsyncStorage 설치
npx expo install @react-native-async-storage/async-storage

# NativeWind 설치
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npx tailwindcss init

# 기존 패키지 설치
npm install zustand react-hook-form

# 필수 네비게이션 패키지
npx expo install react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated

# 개발 서버 실행
npx expo start

# 웹으로 실행
npx expo start --web

# iOS 시뮬레이터 (Mac만 가능)
npx expo start --ios

# Android 에뮬레이터
npx expo start --android
```

### 14.2 구현 순서
1. **Step 1**: NativeWind 설정 (`tailwind.config.js`, `metro.config.js`, `global.css`)
2. **Step 2**: `types/` 폴더에 타입 정의 파일 생성 (기존 유지)
3. **Step 3**: `constants/templates.ts`에 5개 기본 템플릿 데이터 작성 (기존 유지)
4. **Step 4**: `app/(tabs)/_layout.tsx`에 탭 네비게이션 설정
5. **Step 5**: `components/upload/ImageUploader.tsx` - Expo Image Picker 사용
6. **Step 6**: `components/template/TemplateList.tsx` - NativeWind 스타일링
7. **Step 7**: `components/prompt/PromptPreview.tsx` - NativeWind 스타일링
8. **Step 8**: `app/(tabs)/index.tsx` - 홈 화면 구현
9. **Step 9**: `app/analysis/new.tsx` - 새 분석 플로우 구현
10. **Step 10**: `utils/storage.ts` - AsyncStorage 히스토리 기능
11. **Step 11**: `app/(tabs)/history.tsx` - 히스토리 화면 구현
12. **Step 12**: `app/(tabs)/settings.tsx` - 설정 화면 구현

### 14.3 주요 함수 시그니처
```typescript
// utils/promptGenerator.ts
export function generatePrompt(
  template: Template,
  images: string[],
  customInputs?: Record<string, string>
): string;

// utils/storage.ts (AsyncStorage 사용)
export async function saveAnalysis(analysis: Analysis): Promise<void>;
export async function getAnalyses(): Promise<Analysis[]>;
export async function deleteAnalysis(id: string): Promise<void>;

// utils/imageCompression.ts (Expo Image Manipulator 사용)
export async function compressImage(
  uri: string,
  maxWidth: number
): Promise<string>; // returns base64

// hooks/useClipboard.ts (Expo Clipboard 사용)
export function useClipboard(): {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
};

// hooks/useImageUpload.ts (Expo Image Picker 사용)
export function useImageUpload(): {
  pickImages: () => Promise<string[]>;
  takePhoto: () => Promise<string | null>;
  loading: boolean;
};
```

### 14.4 플랫폼별 빌드
```bash
# EAS CLI 설치 (처음 한 번만)
npm install -g eas-cli

# EAS 로그인
eas login

# 빌드 설정 생성
eas build:configure

# 웹 빌드 및 배포
npx expo export:web

# iOS 빌드 (TestFlight)
eas build --platform ios

# Android 빌드 (내부 테스트)
eas build --platform android

# 모두 빌드
eas build --platform all
```

---

## 15. 테스트 시나리오

### 15.1 기본 플로우 테스트
1. 홈페이지 접속 → "새 분석 시작" 클릭
2. 이미지 파일 드래그 앤 드롭
3. "위험도 분석" 템플릿 선택
4. 생성된 프롬프트 확인
5. "복사하기" 버튼 클릭
6. 클립보드에 복사되었는지 확인
7. "히스토리에 저장" 클릭
8. 히스토리 페이지에서 방금 저장한 분석 확인

### 15.2 엣지 케이스 테스트
- 이미지 없이 다음 단계 진행 시도 (에러 처리)
- 10MB 초과 이미지 업로드 (에러 메시지)
- 지원하지 않는 파일 형식 업로드 (에러 메시지)
- 프롬프트 수정 후 원본 복원
- 히스토리 100개 이상 저장 후 성능 확인
- 모바일 브라우저에서 클립보드 복사

### 15.3 브라우저 호환성 테스트
- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)
- 모바일 Safari (iOS)
- 모바일 Chrome (Android)

---

## 16. FAQ

### Q1: 왜 백엔드 없이 프론트엔드만 구현하나요?
A: 비용을 최소화하고, 사용자의 데이터를 서버에 저장하지 않아 프라이버시를 보장하기 위함입니다. 모든 데이터는 사용자의 디바이스에만 저장됩니다 (AsyncStorage).

### Q2: Expo를 선택한 이유는?
A: 하나의 코드베이스로 웹, iOS, Android를 모두 지원할 수 있어 개발 효율이 높습니다. 또한 이미지 처리, 파일 시스템, 클립보드 등 네이티브 API를 쉽게 사용할 수 있으며, EAS Build로 간편하게 앱스토어 배포가 가능합니다.

### Q3: 이미지를 AsyncStorage에 저장하면 용량 문제가 있지 않나요?
A: AsyncStorage는 대용량 데이터 저장에 적합하지 않아, 이미지는 Expo FileSystem을 사용해 디바이스 파일 시스템에 저장하고, AsyncStorage에는 파일 경로만 저장합니다. 이를 통해 수백 MB의 이미지도 관리할 수 있습니다.

### Q4: 프롬프트 품질을 어떻게 보장하나요?
A: 실제 사용자 피드백을 기반으로 템플릿을 지속적으로 개선합니다. 또한 커뮤니티에서 검증된 템플릿을 추가할 예정입니다.

### Q5: 다른 언어 지원 계획은?
A: MVP는 한국어만 지원하며, 추후 영어 등 다국어 지원을 고려할 수 있습니다. Expo는 i18n 라이브러리와 쉽게 통합 가능합니다.

### Q6: 모바일 앱 출시 일정은?
A: Week 4에 웹/iOS/Android 동시 출시를 목표로 합니다. iOS는 TestFlight 베타 테스트 후 App Store, Android는 내부 테스트 후 Google Play Store에 출시할 예정입니다.

### Q7: NativeWind와 기존 Tailwind CSS의 차이는?
A: NativeWind는 Tailwind CSS의 문법을 React Native에서 사용할 수 있게 해주는 라이브러리입니다. 대부분의 Tailwind 클래스를 그대로 사용할 수 있지만, `hover:`는 `active:`로 사용하고, 모든 텍스트는 `<Text>` 컴포넌트로 감싸야 합니다.

### Q8: 앱 업데이트는 어떻게 하나요?
A: 코드 변경은 Expo OTA(Over-The-Air) 업데이트로 앱스토어 심사 없이 즉시 배포할 수 있습니다. 네이티브 코드 변경이나 앱 설정 변경 시에만 앱스토어 재배포가 필요합니다.

---

## 17. 참고 자료

### 17.1 유사 서비스
- ChatGPT Prompts for Investing
- AI Stock Analysis Tools
- Portfolio Management Apps

### 17.2 기술 문서

#### Expo
- Expo 공식 문서: https://docs.expo.dev
- Expo Router: https://docs.expo.dev/router/introduction/
- Expo Image Picker: https://docs.expo.dev/versions/latest/sdk/imagepicker/
- Expo Image Manipulator: https://docs.expo.dev/versions/latest/sdk/imagemanipulator/
- Expo Clipboard: https://docs.expo.dev/versions/latest/sdk/clipboard/
- Expo File System: https://docs.expo.dev/versions/latest/sdk/filesystem/
- EAS Build: https://docs.expo.dev/build/introduction/

#### React Native & 스타일링
- React Native 공식 문서: https://reactnative.dev
- NativeWind: https://www.nativewind.dev
- Tailwind CSS: https://tailwindcss.com
- AsyncStorage: https://react-native-async-storage.github.io/async-storage/

#### 상태관리 & 유틸리티
- Zustand: https://zustand-demo.pmnd.rs
- React Hook Form: https://react-hook-form.com
- React 공식 문서: https://react.dev

### 17.3 디자인 참고
- Dribbble - Portfolio Dashboard
- Behance - Financial Apps
- Material Design - Data Visualization
- iOS Human Interface Guidelines
- Material Design 3 (Android)

---

## 부록 A: 초기 템플릿 전체 데이터

```typescript
// src/constants/templates.ts
export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'risk-analysis',
    name: '위험도 분석',
    category: 'risk',
    description: '포트폴리오의 위험 요소를 식별하고 분산투자 개선점을 제안합니다.',
    icon: '🎯',
    promptTemplate: `위 포트폴리오 이미지를 보고 다음을 분석해주세요:

1. **섹터 분석**
   - 각 종목의 산업 섹터 분류
   - 섹터별 투자 비중 계산
   - 특정 섹터 집중도 (30% 이상이면 경고)

2. **위험 요소**
   - 변동성이 높은 종목 식별
   - 최근 3개월 내 큰 이슈가 있었던 종목
   - 상관관계가 높은 종목들 (분산투자 미흡)

3. **개선 제안**
   - 분산투자를 위해 추가하면 좋을 섹터
   - 비중 조절이 필요한 종목
   - 전체적인 포트폴리오 위험도 평가 (1-10점)

**출력 형식**:
- 섹터 분석은 표로 정리
- 위험 요소는 중요도 순으로 번호 매기기
- 개선 제안은 구체적인 액션 아이템으로 작성`,
    outputFormat: 'table',
    variables: [],
    isCustom: false,
    createdAt: new Date().toISOString(),
    usageCount: 0
  },
  // ... (나머지 템플릿들)
];
```

---

**문서 버전**: 2.0 (Expo + React Native Web 전환)
**최종 수정일**: 2025-11-11
**작성자**: Product Owner
**검토자**: Tech Lead

## 주요 변경사항 (v2.0)
- ✅ Vite → Expo + Metro bundler 전환
- ✅ React Router → Expo Router (파일 기반 라우팅)
- ✅ Tailwind CSS → NativeWind
- ✅ LocalStorage → AsyncStorage
- ✅ browser-image-compression → Expo Image Manipulator
- ✅ 웹/iOS/Android 단일 코드베이스 지원
- ✅ EAS Build 배포 프로세스 추가
- ✅ 네이티브 앱 기능 추가 (카메라, 햅틱, 푸시 알림)
