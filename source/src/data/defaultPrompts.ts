import { Category, PromptGroup } from '../types';
import promptsData from './prompts-data.json';

// 서버에 데이터가 없거나 서버에 연결되지 않을 때 보여주는 '기본 데이터'입니다.
// (평소에는 서버(Firestore)의 데이터가 우선합니다.)
// 사진은 저장소의 images 폴더 파일을 './images/파일명' 경로로 참조합니다.
export const defaultCategories: Category[] = promptsData.categories as Category[];
export const defaultPrompts: PromptGroup[] = promptsData.prompts as PromptGroup[];
