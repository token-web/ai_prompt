// 자동 테스트 전용 가짜 로그인입니다. VITE_AUTH_MOCK=true 로 빌드할 때만 사용됩니다.
import { AuthApi, isAllowedAdmin, readAllowList } from './authCore';

const KEY = '__MOCK_AUTH_EMAIL__';
const listeners = new Set<(u: { email: string; name: string } | null) => void>();
const current = () => {
  const email = sessionStorage.getItem(KEY);
  return email && isAllowedAdmin(email, true, readAllowList()) ? { email, name: email } : null;
};

export const mockAuthApi: AuthApi = {
  subscribe(cb) {
    listeners.add(cb);
    cb(current());
    return () => listeners.delete(cb);
  },
  async login() {
    const pick = (window as unknown as { __MOCK_PICK__?: string }).__MOCK_PICK__ || '';
    if (!pick) return { ok: false, reason: 'cancelled', message: '' };
    if (!isAllowedAdmin(pick, true, readAllowList())) {
      return { ok: false, reason: 'not-allowed', message: '관리자로 등록된 계정이 아닙니다.' };
    }
    sessionStorage.setItem(KEY, pick);
    const u = current();
    listeners.forEach((l) => l(u));
    return { ok: true, user: { email: pick, name: pick } };
  },
  async logout() {
    sessionStorage.removeItem(KEY);
    listeners.forEach((l) => l(null));
  },
};
