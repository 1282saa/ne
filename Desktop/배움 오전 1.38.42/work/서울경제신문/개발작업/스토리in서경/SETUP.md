# 스토리IN서경 앱 설치 및 개발 환경 설정 가이드

이 문서는 스토리IN서경 앱을 개발하기 위한 환경 설정 및 실행 방법을 안내합니다.

## 개발 환경 요구사항

- Node.js 14.0 이상
- npm 6.0 이상 또는 yarn 1.22 이상
- iOS 개발을 위한 MacOS 및 Xcode 12 이상 (선택사항)
- Android 개발을 위한 Android Studio 및 JDK 11 이상 (선택사항)

## 초기 설정

1. 프로젝트 클론 후 의존성 패키지 설치:

```bash
git clone <repository-url>
cd 스토리in서경
npm install
```

2. 폰트 파일 설치:

Montserrat 및 CircularXX 폰트 파일을 `assets/fonts/` 디렉토리에 복사합니다.

- Montserrat 폰트는 [Google Fonts](https://fonts.google.com/specimen/Montserrat)에서 다운로드할 수 있습니다.
- CircularXX 폰트는 라이선스를 확인 후 구매하거나, 대체 폰트를 사용할 수 있습니다.

필요한 폰트 파일:

```
assets/fonts/Montserrat-Regular.ttf
assets/fonts/Montserrat-Medium.ttf
assets/fonts/Montserrat-SemiBold.ttf
assets/fonts/Montserrat-Bold.ttf
assets/fonts/CircularXX-Book.ttf
assets/fonts/CircularXX-Regular.ttf
assets/fonts/CircularXX-Medium.ttf
assets/fonts/CircularXX-Bold.ttf
```

3. 이미지 파일 추가:

앱에서 사용하는 이미지 파일을 `assets/images/` 디렉토리에 복사합니다.

## 개발 환경 실행

### Expo 개발 서버 실행

```bash
npm start
```

이 명령어를 실행하면 Expo 개발 서버가 시작되고 QR 코드가 표시됩니다.

### iOS 시뮬레이터에서 실행 (MacOS 전용)

```bash
npm run ios
```

### Android 에뮬레이터에서 실행

```bash
npm run android
```

### Expo Go 앱에서 실행

1. 스마트폰에 Expo Go 앱을 설치합니다.
2. iOS에서는 카메라 앱으로, Android에서는 Expo Go 앱에서 QR 코드를 스캔합니다.
3. 개발 서버에 연결되면 앱이 실행됩니다.

## 개발 주의사항

### 린터 오류 해결

프로젝트에서 다음과 같은 모듈 관련 린터 오류가 표시될 수 있습니다:

```
'react-native' 모듈 또는 해당 형식 선언을 찾을 수 없습니다.
'@react-navigation/native' 모듈 또는 해당 형식 선언을 찾을 수 없습니다.
'@expo/vector-icons' 모듈 또는 해당 형식 선언을 찾을 수 없습니다.
```

이러한 오류는 패키지가 설치되었지만 TypeScript가 타입 정의를 찾지 못할 때 발생할 수 있습니다. 해결 방법:

1. 모든 의존성 패키지가 설치되었는지 확인합니다:

```bash
npm install
```

2. TypeScript 정의 파일이 누락된 경우 수동으로 설치합니다:

```bash
npm install --save-dev @types/react-native
```

3. TypeScript 설정을 확인합니다. 프로젝트 루트의 `tsconfig.json` 파일에서 올바른 경로가 설정되어 있는지 확인합니다.

4. VS Code를 사용하는 경우, VS Code를 재시작하거나 TypeScript 서버를 재시작합니다 (명령 팔레트에서 "TypeScript: Restart TS Server" 명령 실행).

### 이미지 관련 오류

`assets/images/` 디렉토리에 필요한 이미지가 없을 경우, 앱에서 오류가 발생할 수 있습니다. AspenHomeScreen.tsx와 AspenDetailScreen.tsx 파일에 있는 이미지 임포트를 확인하고, 이미지 파일이 있는지 확인하세요.

이미지 파일이 없는 경우, 임시로 주석 처리된 코드를 사용하도록 되어 있습니다.

## 빌드 및 배포

### Expo 빌드

Expo로 앱을 빌드하려면:

```bash
expo build:android  # Android 앱 빌드
expo build:ios      # iOS 앱 빌드
```

### EAS 빌드 (Expo Application Services)

최신 Expo 버전에서는 EAS Build를 사용할 수 있습니다:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android  # Android 앱 빌드
eas build -p ios      # iOS 앱 빌드
```

## 문제 해결

### "Cannot find module 'X'" 오류

필요한 모듈이 설치되지 않았거나, 잘못된 버전이 설치되었을 수 있습니다. 다음 명령어로 의존성을 재설치하세요:

```bash
rm -rf node_modules
npm install
```

### 폰트 로딩 문제

폰트가 로드되지 않는 경우, 다음을 확인하세요:

1. `assets/fonts/` 디렉토리에 필요한 폰트 파일이 존재하는지 확인
2. `app.json` 파일에 올바른 폰트 정보가 등록되어 있는지 확인
3. App.tsx에서 폰트 로딩 부분이 올바르게 구현되어 있는지 확인

### Expo 서버 연결 문제

Expo 개발 서버에 연결할 수 없는 경우:

1. 개발 PC와 모바일 기기가 같은 네트워크에 연결되어 있는지 확인
2. 방화벽 설정 확인
3. `expo start --tunnel`을 사용하여 터널링을 통해 연결 시도
