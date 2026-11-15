import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

// 설정은 index.html 옆의 firebase-config.js 파일에 적습니다 (코드를 다시 빌드할 필요 없음).
declare global {
  interface Window {
    __FIREBASE_CONFIG__?: Record<string, string>;
    __ADMIN_EMAILS__?: string[];
  }
}

const REQUIRED = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;

function isFilled(v: unknown): boolean {
  return typeof v === 'string' && v.trim() !== '' && !/^(YOUR|여기)/i.test(v.trim());
}

/** 설정이 정상이면 빈 문자열, 문제가 있으면 사람이 읽을 수 있는 안내 문구를 돌려줍니다. */
export function describeConfigProblem(): string {
  const c = typeof window !== 'undefined' ? window.__FIREBASE_CONFIG__ : undefined;
  if (!c || typeof c !== 'object') {
    return 'firebase-config.js 파일을 읽지 못했습니다. index.html 옆에 파일이 있는지 확인해 주세요.';
  }
  const missing = REQUIRED.filter((k) => !isFilled(c[k]));
  if (missing.length === 0) return '';
  return `firebase-config.js에 ${missing.join(', ')} 값이 비어 있습니다. Firebase 콘솔의 설정값을 그대로 붙여 넣어 주세요.`;
}

let cachedApp: FirebaseApp | null = null;
export function getFirebaseApp(): FirebaseApp | null {
  if (cachedApp) return cachedApp;
  if (describeConfigProblem()) return null;
  const cfg = window.__FIREBASE_CONFIG__ as Record<string, string>;
  cachedApp = getApps().length ? getApps()[0] : initializeApp(cfg);
  return cachedApp;
}
