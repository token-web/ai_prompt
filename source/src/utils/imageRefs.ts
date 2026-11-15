import type { AppData } from '../types';

/** 서버에 올린 사진은 'fs:<번호>' 형태로 데이터에 기록합니다. */
export const FS_PREFIX = 'fs:';
export const isFsRef = (s?: string): s is string => !!s && s.startsWith(FS_PREFIX);
export const fsId = (ref: string): string => ref.slice(FS_PREFIX.length);
/** 사진 파일(JPEG/PNG/WEBP/GIF)을 base64로 담은 주소인지 (SVG 샘플은 제외) */
export const isUploadableDataUrl = (s?: string): s is string =>
  !!s && /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(s);

export async function hashString(s: string): Promise<string> {
  const bytes = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(buf))
    .slice(0, 12)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export type UploadFn = (id: string, dataUrl: string) => Promise<void>;
export type FetchFn = (id: string) => Promise<string | null>;

/** 데이터 속 사진(base64)을 서버에 올리고 'fs:번호'로 바꿔 돌려줍니다. 같은 사진은 한 번만 올립니다. */
export async function uploadImagesInData(data: AppData, upload: UploadFn): Promise<AppData> {
  const out: AppData = JSON.parse(JSON.stringify(data));
  const done = new Map<string, string>();
  const convert = async (src?: string): Promise<string | undefined> => {
    if (!isUploadableDataUrl(src)) return src;
    const cached = done.get(src);
    if (cached) return cached;
    const id = await hashString(src);
    await upload(id, src);
    const ref = FS_PREFIX + id;
    done.set(src, ref);
    return ref;
  };
  for (const p of out.prompts) {
    for (const v of p.versions) {
      v.beforeImg = await convert(v.beforeImg);
      v.afterImg = await convert(v.afterImg);
      if (v.beforeImg === undefined) delete v.beforeImg;
      if (v.afterImg === undefined) delete v.afterImg;
    }
  }
  return out;
}

/** 백업(JSON 내보내기)용: 'fs:번호'를 실제 사진(base64)으로 되돌립니다. */
export async function inlineImagesInData(data: AppData, fetchImage: FetchFn): Promise<AppData> {
  const out: AppData = JSON.parse(JSON.stringify(data));
  const cache = new Map<string, string | undefined>();
  const convert = async (src?: string): Promise<string | undefined> => {
    if (!isFsRef(src)) return src;
    if (cache.has(src)) return cache.get(src);
    const url = (await fetchImage(fsId(src))) ?? undefined;
    cache.set(src, url);
    return url;
  };
  for (const p of out.prompts) {
    for (const v of p.versions) {
      v.beforeImg = await convert(v.beforeImg);
      v.afterImg = await convert(v.afterImg);
      if (v.beforeImg === undefined) delete v.beforeImg;
      if (v.afterImg === undefined) delete v.afterImg;
    }
  }
  return out;
}
