/** 자동 테스트 전용(실제 배포 빌드에서는 항상 false): 가짜 로그인·가짜 서버로 동작 */
export const MOCK: boolean = import.meta.env.VITE_MOCK === 'true';
