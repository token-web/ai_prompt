export interface AdminUser {
  email: string;
  name: string;
}

export type LoginResult =
  | { ok: true; user: AdminUser }
  | {
      ok: false;
      reason: 'not-configured' | 'not-allowed' | 'cancelled' | 'popup-blocked' | 'error';
      message: string;
    };

export interface AuthApi {
  /** 로그인 상태가 바뀔 때마다 알려 줍니다. 해제 함수를 돌려줍니다. */
  subscribe(cb: (user: AdminUser | null) => void): () => void;
  login(): Promise<LoginResult>;
  logout(): Promise<void>;
}

/** 허용된 관리자 이메일인지 확인 (대소문자 무시, 구글에서 인증된 이메일만 인정) */
export function isAllowedAdmin(
  email: string | null | undefined,
  emailVerified: boolean | null | undefined,
  allowList: readonly string[] | null | undefined,
): boolean {
  if (!email || !emailVerified || !allowList) return false;
  const e = email.trim().toLowerCase();
  return allowList.some((a) => typeof a === 'string' && a.trim().toLowerCase() === e && e.length > 0);
}

export function readAllowList(): string[] {
  const w = (typeof window !== 'undefined' ? window : undefined) as
    | { __ADMIN_EMAILS__?: unknown }
    | undefined;
  const list = w?.__ADMIN_EMAILS__;
  return Array.isArray(list) ? list.filter((x): x is string => typeof x === 'string') : [];
}
