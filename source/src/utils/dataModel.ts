import type { AppData } from '../types';

/** 서버 문서 크기 한도(1MB)에 여유를 둔 안전선 (바이트) */
export const MAX_DOC_BYTES = 900_000;

export function isValidAppData(d: unknown): d is AppData {
  const x = d as AppData | null;
  return !!x && Array.isArray(x.prompts) && Array.isArray(x.categories);
}

/** 학생(일반 방문자)에게 공개할 데이터: '숨김' 버전과 그것을 가리키는 '다음 단계' 링크를 뺍니다. */
export function toPublic(data: AppData): AppData {
  const out: AppData = JSON.parse(JSON.stringify(data));
  for (const p of out.prompts) p.versions = p.versions.filter((v) => !v.hidden);
  const removed = new Set(out.prompts.filter((p) => p.versions.length === 0).map((p) => p.title));
  out.prompts = out.prompts.filter((p) => p.versions.length > 0);
  for (const p of out.prompts) for (const v of p.versions) if (v.next && removed.has(v.next)) v.next = '';
  return out;
}

export function byteLength(s: string): number {
  return new TextEncoder().encode(s).length;
}
