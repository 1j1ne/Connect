# connect — Google Play 배포 가이드

## 📁 앱 구조
```
connect-app/
├── index.html          # 앱 진입점
├── manifest.json       # PWA 매니페스트
├── sw.js               # 서비스 워커 (오프라인 지원)
├── src/
│   ├── app.css         # 전체 스타일
│   └── app.js          # 전체 앱 로직
└── icons/              # 앱 아이콘 (48~512px)
```

---

## 🚀 Google Play 배포 방법 (TWA — Trusted Web Activity)

PWA를 Play Store에 올리는 가장 쉬운 방법은 **TWA**입니다.
별도의 Android 개발 없이 웹앱을 네이티브처럼 패키징합니다.

### 1단계 — 웹 호스팅
Netlify, Vercel, Firebase Hosting 중 하나에 이 폴더를 업로드하세요.
예: https://connect-app.netlify.app

```bash
# Netlify CLI 사용 시
npm install -g netlify-cli
netlify deploy --prod --dir .
```

### 2단계 — Bubblewrap 설치 (Google 공식 TWA 도구)
```bash
npm install -g @bubblewrap/cli
mkdir connect-twa && cd connect-twa
bubblewrap init --manifest https://YOUR_DOMAIN/manifest.json
```

bubblewrap이 물어보는 값들:
- **Package ID**: `com.connectapp.dating`
- **App name**: `connect`
- **Version**: `1`
- **Version name**: `1.0.0`
- **Signing key**: 새로 생성하거나 기존 키 사용

### 3단계 — assetlinks.json 설정
호스팅 서버의 `/.well-known/assetlinks.json`에 아래 파일을 추가해야
TWA가 Chrome 주소창 없이 실행됩니다.

bubblewrap이 `assetlinks.json` 내용을 출력해줍니다. 그걸 그대로 사용하세요.

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.connectapp.dating",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FROM_BUBBLEWRAP"]
  }
}]
```

### 4단계 — APK/AAB 빌드
```bash
bubblewrap build
```
→ `app-release-signed.aab` 파일 생성됩니다.

### 5단계 — Google Play Console 업로드
1. [play.google.com/console](https://play.google.com/console) 접속
2. 새 앱 만들기 → **앱 이름**: connect
3. **내부 테스트** → AAB 업로드
4. 스토어 정보 입력:
   - **카테고리**: 소셜
   - **콘텐츠 등급**: 만 18세 이상 (매칭 앱)
   - **간단한 설명**: 말하지 못한 마음을 이어드립니다
5. **출시** → 검토 제출 (보통 1~3일)

---

## 📱 스크린샷 준비 (Play Store 필수)
Phone 스크린샷 최소 2장 필요 (1080×1920 권장):
- 스플래시 화면
- 홈 화면
- 우편함 화면
- 우체통 공개 화면

Chrome DevTools → 기기 에뮬레이션 → Pixel 7 → 스크린샷으로 촬영하세요.

---

## ⚙️ 백엔드 연동 (실 서비스 시)
현재 앱은 프론트엔드 데모입니다. 실제 서비스를 위해서는:

| 기능 | 권장 기술 |
|------|-----------|
| 회원가입/인증 | Firebase Auth (전화번호 인증 지원) |
| 데이터베이스 | Firebase Firestore or Supabase |
| 매칭 로직 | Cloud Functions (일요일 자동 실행) |
| 결제 | Google Play Billing API |
| 푸시 알림 | Firebase Cloud Messaging (FCM) |

---

## 🔑 키스토어 백업
```bash
# bubblewrap이 생성한 키스토어를 반드시 안전한 곳에 백업하세요!
# 잃어버리면 앱 업데이트가 불가능합니다
cp android.keystore ~/backup/connect-keystore.jks
```

---

## 📋 체크리스트
- [ ] 도메인 구매 및 HTTPS 설정
- [ ] `manifest.json`의 `start_url` 도메인 변경
- [ ] `assetlinks.json` 서버에 배포
- [ ] 개인정보처리방침 페이지 (Play Store 필수)
- [ ] Google Play 개발자 계정 ($25 일회성)
- [ ] 앱 아이콘 512×512 최종 확인
- [ ] 스크린샷 최소 2장 준비

---

## 💡 빠른 테스트
로컬에서 바로 테스트하려면:
```bash
npx serve .
# → http://localhost:3000 으로 접속
# Chrome → 주소창 오른쪽 "설치" 버튼으로 PWA 설치 가능
```
