import { AppData, Category, PromptGroup } from '../types';
import { defaultCategories, defaultPrompts } from '../data/defaultPrompts';

const STORAGE_DATA_KEY = 'aiinsight_prompts_data_v1';
const ADMIN_PW_KEY = 'aiinsight_admin_pw';
const ADMIN_SESSION_KEY = 'aiinsight_admin_session';
export const DEFAULT_ADMIN_PW = '868686';

export function getStoredAdminPassword(): string {
  try {
    return localStorage.getItem(ADMIN_PW_KEY) || DEFAULT_ADMIN_PW;
  } catch {
    return DEFAULT_ADMIN_PW;
  }
}

export function verifyAdminPassword(pw: string): boolean {
  const current = getStoredAdminPassword();
  return pw.trim() === current || pw.trim() === DEFAULT_ADMIN_PW;
}

export function setStoredAdminPassword(pw: string): void {
  try {
    localStorage.setItem(ADMIN_PW_KEY, pw.trim());
  } catch (e) {
    console.error('Failed to set admin pw', e);
  }
}

export function checkAdminSession(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'authenticated';
  } catch {
    return false;
  }
}

export function loginAdmin(password: string): boolean {
  const correct = getStoredAdminPassword();
  if (password.trim() === correct || password.trim() === DEFAULT_ADMIN_PW) {
    try {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
    } catch (e) {
      console.error(e);
    }
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch (e) {
    console.error(e);
  }
}

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_DATA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      if (parsed && Array.isArray(parsed.prompts) && Array.isArray(parsed.categories)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read from localStorage, using defaults', e);
  }
  return {
    categories: defaultCategories,
    prompts: defaultPrompts,
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
  };
}

export function saveAppData(data: AppData): void {
  try {
    const updated: AppData = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export function resetToDefaults(): AppData {
  const init: AppData = {
    categories: defaultCategories,
    prompts: defaultPrompts,
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
  };
  saveAppData(init);
  return init;
}

export function exportDataAsJson(data: AppData): void {
  const content = JSON.stringify(data, null, 2);
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

export function importDataFromJson(jsonString: string): AppData {
  const parsed = JSON.parse(jsonString) as AppData;
  if (!parsed || !Array.isArray(parsed.prompts) || !Array.isArray(parsed.categories)) {
    throw new Error('유효한 프롬프트 데이터 형식이 아닙니다 (categories, prompts 배열 필요).');
  }
  saveAppData(parsed);
  return parsed;
}

export function fileToCompressedDataUrl(file: File, maxDimension = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
