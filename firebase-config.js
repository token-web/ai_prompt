/*
 * ──────────────────────────────────────────────────────────────
 *  관리자 구글 로그인 설정 파일  (index.html 과 같은 위치에 두세요)
 * ──────────────────────────────────────────────────────────────
 *  1) Firebase 콘솔에서 만든 웹 앱의 설정값을 아래 "여기에 ..." 자리에 붙여 넣습니다.
 *     (이 값들은 원래 공개되어도 되는 값입니다. 보안은 아래 '관리자 이메일'과 구글 로그인이 담당합니다.)
 *  2) 관리자로 허용할 구글 이메일을 적습니다. 여러 명이면 쉼표로 구분합니다.
 *  3) 저장(커밋)하면 1~2분 뒤 사이트에 반영됩니다.
 */
window.__FIREBASE_CONFIG__ = {
  apiKey: "AIzaSyBnG9srfGDHLMcQ9wqyFSG1_iAhy3rREpc",
  authDomain: "ai-prompt-b5c6c.firebaseapp.com",
  projectId: "ai-prompt-b5c6c",
  storageBucket: "ai-prompt-b5c6c.firebasestorage.app",
  messagingSenderId: "932020643030",
  appId: "1:932020643030:web:fb5a53e2e846ba69539577"
};

// 관리자로 허용할 구글 이메일 (소문자로 정확히)
window.__ADMIN_EMAILS__ = ["aiinsightlabkr@gmail.com"];
