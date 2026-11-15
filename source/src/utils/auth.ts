import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
} from 'firebase/auth';
import { AuthApi, LoginResult, isAllowedAdmin, readAllowList } from './authCore';
import { describeConfigProblem, getFirebaseApp } from './firebaseApp';

let cachedAuth: Auth | null = null;
function getAuthInstance(): Auth | null {
  if (cachedAuth) return cachedAuth;
  const app = getFirebaseApp();
  if (!app) return null;
  cachedAuth = getAuth(app);
  return cachedAuth;
}

export const firebaseAuthApi: AuthApi = {
  subscribe(cb) {
    const auth = getAuthInstance();
    if (!auth) {
      cb(null);
      return () => {};
    }
    return onAuthStateChanged(auth, (u) => {
      if (u && isAllowedAdmin(u.email, u.emailVerified, readAllowList())) {
        cb({ email: u.email as string, name: u.displayName || (u.email as string) });
      } else {
        // 허용 목록에 없는 계정이 남아 있으면 즉시 로그아웃
        if (u) void signOut(auth);
        cb(null);
      }
    });
  },

  async login(): Promise<LoginResult> {
    const auth = getAuthInstance();
    if (!auth) return { ok: false, reason: 'not-configured', message: describeConfigProblem() };
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      const u = cred.user;
      if (!isAllowedAdmin(u.email, u.emailVerified, readAllowList())) {
        await signOut(auth);
        return { ok: false, reason: 'not-allowed', message: '관리자로 등록된 계정이 아닙니다.' };
      }
      return { ok: true, user: { email: u.email as string, name: u.displayName || (u.email as string) } };
    } catch (e) {
      const code = (e as { code?: string }).code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        return { ok: false, reason: 'cancelled', message: '' };
      }
      if (code === 'auth/popup-blocked') {
        return { ok: false, reason: 'popup-blocked', message: '팝업이 차단되었습니다. 팝업을 허용한 뒤 다시 눌러 주세요.' };
      }
      if (code === 'auth/unauthorized-domain') {
        return { ok: false, reason: 'error', message: 'Firebase 승인된 도메인에 token-web.github.io 를 추가해 주세요.' };
      }
      if (code === 'auth/operation-not-allowed') {
        return { ok: false, reason: 'error', message: 'Firebase에서 Google 로그인을 사용 설정해 주세요.' };
      }
      if (code === 'auth/invalid-api-key') {
        return { ok: false, reason: 'error', message: 'apiKey 값이 올바르지 않습니다. Firebase 콘솔의 값을 다시 확인해 주세요.' };
      }
      return { ok: false, reason: 'error', message: `로그인에 실패했습니다. (${code || '알 수 없는 오류'})` };
    }
  },

  async logout() {
    const auth = getAuthInstance();
    if (auth) await signOut(auth);
  },
};
