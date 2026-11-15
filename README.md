# AI 프롬프트 모음 (정한열 교수)

학생들이 보는 사이트: https://token-web.github.io/ai_prompt/

## 폴더 구성

| 위치 | 설명 |
|---|---|
| `index.html` | 사이트 본체 (빌드된 결과물 1개 파일) — GitHub Pages가 이 파일을 보여 줍니다 |
| `firebase-config.js` | 구글 로그인·서버 연결 설정 (Firebase 값 4개 + 관리자 이메일) |
| `images/` | 기본 프롬프트에 쓰인 비포/애프터 사진 |
| `firestore.rules` | Firestore 보안 규칙 사본 (관리자 이메일을 넣은 뒤 Firebase 콘솔에 붙여 넣어 사용) |
| `source/` | 앱 원본 코드 (수정·재빌드용. Claude에게 저장소 ZIP을 올리면 여기서 작업합니다) |

## 데이터는 어디에 저장되나요?

- 관리자가 로그인해서 저장한 프롬프트·사진은 **Firebase Firestore(서버)** 에 저장되고, 모든 방문자 화면에 **실시간** 반영됩니다.
- 서버에 연결되지 않을 때는 `source/src/data/prompts-data.json`의 기본 데이터가 보입니다.
- 관리자 화면의 **JSON 내보내기**는 백업용입니다 (사진 포함).

## 수정이 필요할 때

1. 프롬프트 내용 수정 → 사이트에서 관리자 로그인 후 바로 수정 (깃허브 작업 필요 없음)
2. 화면/기능 수정 → 이 저장소 ZIP을 Claude에게 올려 요청 → 받은 `index.html`로 교체
   (`firebase-config.js`는 이 ZIP에 들어 있지 않습니다. 저장소에 있는 기존 파일을 그대로 두세요)
