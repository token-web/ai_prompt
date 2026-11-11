export interface PromptVersion {
  id: string;
  name: string; // e.g. "기본", "상세 연출", "초고화질"
  type: '이미지 생성' | '텍스트';
  photo: boolean; // 사진 필요 여부
  guideKo: string;
  guideEn: string;
  bodyKo: string;
  bodyEn: string;
  beforeImg?: string; // Data URL or Image URL or SVG
  afterImg?: string;
  beforeLabel?: string;
  afterLabel?: string;
  next?: string;
  hidden?: boolean;
}

export interface PromptGroup {
  id: string;
  cat: string;
  title: string;
  icon: string;
  tag: string;
  versions: PromptVersion[];
}

export interface Category {
  name: string;
  desc: string;
  icon?: string;
  accentColor?: string;
}

export interface AppData {
  categories: Category[];
  prompts: PromptGroup[];
  lastUpdated?: string;
  version?: string;
}
