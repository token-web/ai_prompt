import { doc, getDoc, getFirestore, onSnapshot, setDoc, writeBatch, type Firestore } from 'firebase/firestore';
import { AppData } from '../types';
import type { DataApi } from './dataApi';
import { MAX_DOC_BYTES, byteLength, isValidAppData, toPublic } from './dataModel';
import { codedError } from './dataErrors';
import { getFirebaseApp } from './firebaseApp';
import { uploadImagesInData } from './imageRefs';

// 서버 구조 (컬렉션/문서)
//  appData/public : 학생용 공개 데이터 (누구나 읽기, 관리자만 쓰기)
//  appData/full   : 관리자용 전체 데이터 — '숨김' 포함 (관리자만 읽기/쓰기)
//  images/{번호}  : 업로드한 사진 1장 = 문서 1개 (누구나 읽기, 관리자만 쓰기)
const MAX_IMAGE_CHARS = 950_000;
const TIMEOUT_MS = 20_000;

let cachedDb: Firestore | null = null;
function getDb(): Firestore | null {
  if (cachedDb) return cachedDb;
  const app = getFirebaseApp();
  if (!app) return null;
  cachedDb = getFirestore(app);
  return cachedDb;
}

function withTimeout<T>(p: Promise<T>, ms = TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(codedError('app/timeout')), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

function subscribe(
  docId: 'public' | 'full',
  cb: (d: AppData | null) => void,
  onError: (e: unknown) => void,
): () => void {
  const db = getDb();
  if (!db) {
    cb(null);
    return () => {};
  }
  return onSnapshot(
    doc(db, 'appData', docId),
    (snap) => {
      if (!snap.exists()) return cb(null);
      try {
        const parsed = JSON.parse(snap.data().json as string);
        cb(isValidAppData(parsed) ? parsed : null);
      } catch {
        cb(null);
      }
    },
    (err) => onError(err),
  );
}

export const firestoreDataApi: DataApi = {
  subscribePublic: (cb, onError) => subscribe('public', cb, onError),
  subscribeFull: (cb, onError) => subscribe('full', cb, onError),

  async save(data) {
    const db = getDb();
    if (!db) throw codedError('app/not-configured');

    const normalized = await uploadImagesInData(data, async (id, url) => {
      if (url.length > MAX_IMAGE_CHARS) throw codedError('app/image-too-large');
      await withTimeout(setDoc(doc(db, 'images', id), { data: url, savedAt: new Date().toISOString() }));
    });

    const stamped: AppData = { ...normalized, lastUpdated: new Date().toISOString() };
    const fullJson = JSON.stringify(stamped);
    const publicJson = JSON.stringify(toPublic(stamped));
    if (byteLength(fullJson) > MAX_DOC_BYTES) throw codedError('app/doc-too-large');

    const batch = writeBatch(db);
    batch.set(doc(db, 'appData', 'full'), { json: fullJson, updatedAt: stamped.lastUpdated });
    batch.set(doc(db, 'appData', 'public'), { json: publicJson, updatedAt: stamped.lastUpdated });
    await withTimeout(batch.commit());
    return stamped;
  },

  async getImage(id) {
    const db = getDb();
    if (!db) return null;
    const snap = await getDoc(doc(db, 'images', id));
    return snap.exists() ? ((snap.data().data as string) ?? null) : null;
  },
};
