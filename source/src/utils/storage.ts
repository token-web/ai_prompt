import { AppData } from '../types';
import { dataApi } from './dataApi';
import { codedError } from './dataErrors';
import { isValidAppData } from './dataModel';
import { inlineImagesInData } from './imageRefs';

/** 백업용 JSON 파일로 내려받기 (서버에 올린 사진도 파일 안에 함께 담습니다). */
export async function exportDataAsJson(data: AppData): Promise<void> {
  const full = await inlineImagesInData(data, (id) => dataApi.getImage(id));
  const content = JSON.stringify(full, null, 2);
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai-prompts-data-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** JSON 파일 내용을 읽어 형식만 확인합니다. (저장은 App에서 서버로 합니다) */
export function importDataFromJson(jsonString: string): AppData {
  const parsed = JSON.parse(jsonString) as unknown;
  if (!isValidAppData(parsed)) {
    throw new Error('유효한 프롬프트 데이터 형식이 아닙니다 (categories, prompts 배열 필요).');
  }
  return parsed;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 읽지 못했습니다.'));
    };
    img.src = url;
  });
}

/** 서버 문서 한도(1MB)에 맞게 사진을 줄입니다. 용량이 충분히 작아질 때까지 크기·화질을 단계적으로 낮춥니다. */
const MAX_IMAGE_CHARS = 420_000;
const STEPS: Array<[number, number]> = [
  [1000, 0.78],
  [1000, 0.66],
  [800, 0.66],
  [800, 0.55],
  [640, 0.5],
  [480, 0.5],
];
export async function fileToCompressedDataUrl(file: File): Promise<string> {
  const img = await loadImage(file);
  for (const [maxDimension, quality] of STEPS) {
    const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('이미지를 처리할 수 없습니다.');
    ctx.fillStyle = '#ffffff'; // 투명 배경 PNG가 검게 나오지 않도록
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL('image/jpeg', quality);
    if (url.length <= MAX_IMAGE_CHARS) return url;
  }
  throw codedError('app/image-too-large');
}
