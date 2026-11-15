// 자동 테스트 전용 가짜 서버입니다. VITE_MOCK=true 로 빌드할 때만 사용됩니다.
// 브라우저 저장소를 '서버'처럼 쓰고, 같은 브라우저의 다른 탭에는 storage 이벤트로 실시간 전달합니다.
import { AppData } from '../types';
import type { DataApi } from './dataApi';
import { isValidAppData, toPublic } from './dataModel';
import { codedError } from './dataErrors';
import { uploadImagesInData } from './imageRefs';

const P = '__MOCK_SERVER__:';
const readDoc = (id: 'public' | 'full'): AppData | null => {
  try {
    const raw = localStorage.getItem(P + id);
    const d = raw ? JSON.parse(raw) : null;
    return isValidAppData(d) ? d : null;
  } catch {
    return null;
  }
};
const local = new Set<() => void>();

function subscribe(id: 'public' | 'full', cb: (d: AppData | null) => void, onError: (e: unknown) => void) {
  if (localStorage.getItem('__MOCK_DENY_READ__') === id) {
    setTimeout(() => onError(codedError('permission-denied')), 0);
    return () => {};
  }
  const fire = () => cb(readDoc(id));
  const onStorage = (e: StorageEvent) => {
    if (e.key === P + id) fire();
  };
  window.addEventListener('storage', onStorage);
  local.add(fire);
  setTimeout(fire, 0);
  return () => {
    window.removeEventListener('storage', onStorage);
    local.delete(fire);
  };
}

export const mockDataApi: DataApi = {
  subscribePublic: (cb, onError) => subscribe('public', cb, onError),
  subscribeFull: (cb, onError) => subscribe('full', cb, onError),
  async save(data) {
    if (localStorage.getItem('__MOCK_FAIL__') === 'permission') throw codedError('permission-denied');
    await new Promise((r) => setTimeout(r, 700)); // 서버 응답 시간 흉내
    const normalized = await uploadImagesInData(data, async (id, url) => {
      localStorage.setItem(P + 'img:' + id, url);
    });
    const stamped: AppData = { ...normalized, lastUpdated: new Date().toISOString() };
    localStorage.setItem(P + 'full', JSON.stringify(stamped));
    localStorage.setItem(P + 'public', JSON.stringify(toPublic(stamped)));
    local.forEach((f) => f());
    return stamped;
  },
  async getImage(id) {
    return localStorage.getItem(P + 'img:' + id);
  },
};
