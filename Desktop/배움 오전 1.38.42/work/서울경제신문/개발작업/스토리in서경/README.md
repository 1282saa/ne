# 스토리IN서경 - 서울경제신문 뉴스 앱

본 프로젝트는 서울경제신문의 뉴스 콘텐츠를 제공하는 모바일 앱입니다. React Native와 Expo를 기반으로 개발되었으며, 사용자가 경제 관련 키워드로 뉴스를 검색하고 읽을 수 있는 기능을 제공합니다.

## 프로젝트 구조

```
스토리IN서경/
│
├── App.tsx                  # 앱 진입점
├── app.json                 # 앱 설정 파일 (폰트 설정 포함)
├── package.json             # 패키지 관리
├── README.md                # 프로젝트 설명 문서
│
├── assets/                  # 정적 자산 폴더
│   ├── fonts/               # 폰트 파일들
│   └── images/              # 이미지 파일들
│
└── src/                     # 소스 코드
    ├── components/          # 재사용 가능한 컴포넌트
    │   └── CardItem.tsx     # 카드 형태의 뉴스 아이템 컴포넌트
    │
    ├── screens/             # 화면 컴포넌트
    │   ├── HomeScreen.tsx             # 메인 홈 화면
    │   ├── StoryResultScreen.tsx      # 검색 결과 화면
    │   ├── NewsDetailScreen.tsx       # 뉴스 상세 화면
    │   ├── AspenHomeScreen.tsx        # 디자인 샘플 홈 화면
    │   └── AspenDetailScreen.tsx      # 디자인 샘플 상세 화면
    │
    ├── services/            # API 및 서비스 로직
    │   └── newsService.ts   # 뉴스 API 서비스
    │
    ├── hooks/               # 커스텀 훅
    │   └── useDebounce.ts   # 디바운스 기능 제공 훅
    │
    ├── types/               # 타입 정의
    │   ├── index.ts         # 공통 타입 정의
    │   └── navigation.ts    # 네비게이션 관련 타입 정의
    │
    └── utils/               # 유틸리티 함수
        └── formatDate.ts    # 날짜 포맷팅 유틸리티
```

## 주요 기능

1. **키워드 검색**: 사용자는 경제 관련 키워드를 입력하여 관련 뉴스를 검색할 수 있습니다.
2. **추천 키워드**: 메인 화면에서 추천 키워드를 제공하여 쉽게 뉴스를 검색할 수 있습니다.
3. **뉴스 상세 보기**: 검색 결과에서 뉴스를 선택하여 상세 내용을 볼 수 있습니다.
4. **뉴스 공유**: 뉴스 상세 화면에서 뉴스를 공유할 수 있습니다.
5. **UI/UX 디자인 샘플**: Anima에서 변환된 디자인 샘플을 제공합니다.

## 타입 시스템

프로젝트는 TypeScript를 사용하여 강력한 타입 시스템을 구축했습니다:

1. **네비게이션 타입**:

   - `src/types/navigation.ts`에 중앙화된 네비게이션 타입 시스템이 구현되어 있습니다.
   - `RootStackParamList` 타입이 모든 화면의 라우트 파라미터를 정의하고 있습니다.
   - 이를 통해 화면 간 이동 시 타입 안정성을 보장합니다.

2. **데이터 모델 타입**:
   - `src/types/index.ts`에 `NewsItem`과 같은 데이터 모델 타입이 정의되어 있습니다.
   - 컴포넌트와 서비스 전반에 걸쳐 일관된 데이터 구조를 유지합니다.

## 컴포넌트 설명

### 화면 컴포넌트

1. **HomeScreen**:

   - 앱의 메인 화면으로, 키워드 검색 기능과 추천 키워드, 추천 스토리를 제공합니다.
   - 사용자는 이 화면에서 검색하거나 샘플 디자인 화면으로 이동할 수 있습니다.

2. **StoryResultScreen**:

   - 검색 결과를 표시하는 화면입니다.
   - 검색 키워드와 관련된 뉴스 목록을 카드 형태로 보여줍니다.

3. **NewsDetailScreen**:

   - 선택한 뉴스의 상세 내용을 보여주는 화면입니다.
   - 뉴스 제목, 내용, 발행일을 표시하고 공유 기능을 제공합니다.

4. **AspenHomeScreen** & **AspenDetailScreen**:
   - Anima에서 변환된 디자인 샘플 화면입니다.
   - 실제 앱의 디자인 방향을 보여주는 참고용 화면입니다.

### 재사용 컴포넌트

- **CardItem**:
  - 뉴스 아이템을 카드 형태로 표시하는 재사용 가능한 컴포넌트입니다.
  - 제목, 설명, 날짜, 선택적으로 이미지를 표시합니다.

### 서비스 및 유틸리티

- **newsService**:

  - 뉴스 검색 및 상세 내용을 가져오는 API 서비스입니다.
  - 현재는 테스트용 더미 데이터를 사용하며, 추후 실제 API 연동이 필요합니다.

- **formatDate**:

  - 날짜 문자열을 다양한 형식(YYYY-MM-DD, 한국어 형식, 상대 시간)으로 변환하는 유틸리티 함수입니다.

- **useDebounce**:
  - 입력값의 디바운싱을 제공하는 커스텀 훅으로, 검색 입력 최적화에 사용됩니다.

## 설치 및 실행 방법

1. 의존성 패키지 설치:

```bash
npm install
```

2. Expo 개발 서버 실행:

```bash
npm start
```

3. Expo Go 앱을 통해 실행하거나, iOS/Android 시뮬레이터에서 실행:

```bash
npm run ios     # iOS 시뮬레이터에서 실행
npm run android # Android 에뮬레이터에서 실행
```

## 폰트 설정

앱에서는 다음 폰트를 사용합니다:

- Montserrat (Regular, Medium, SemiBold, Bold)
- CircularXX (Book, Regular, Medium, Bold)

폰트 파일은 `assets/fonts/` 폴더에 위치해야 하며, `app.json`에 등록되어 있습니다.

## 향후 개발 사항

1. 실제 서울경제신문 API 연동
2. 이미지 및 폰트 파일 추가
3. 사용자 인증 기능 추가
4. 푸시 알림 기능 추가
5. 성능 최적화 및 테스트
