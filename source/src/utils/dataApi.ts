import { AppData } from '../types';
import { MOCK } from '../config';
import { firestoreDataApi } from './firestoreApi';
import { mockDataApi } from './mockDataApi';

export interface DataApi {
  /** 학생(일반 방문자)용 공개 데이터를 실시간으로 받습니다. 서버에 데이터가 없으면 null. */
  subscribePublic(cb: (d: AppData | null) => void, onError: (e: unknown) => void): () => void;
  /** 관리자용 전체 데이터(숨김 포함)를 실시간으로 받습니다. */
  subscribeFull(cb: (d: AppData | null) => void, onError: (e: unknown) => void): () => void;
  /** 사진을 서버에 올리고 데이터를 저장합니다. 사진 주소가 'fs:번호'로 바뀐 데이터를 돌려줍니다. */
  save(data: AppData): Promise<AppData>;
  /** 서버에 올린 사진(base64 주소)을 가져옵니다. */
  getImage(id: string): Promise<string | null>;
}

export const dataApi: DataApi = MOCK ? mockDataApi : firestoreDataApi;
