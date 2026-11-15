import { describeConfigProblem } from './firebaseApp';

export function codedError(code: string, message = code): Error & { code: string } {
  return Object.assign(new Error(message), { code });
}

/** 서버 저장·불러오기 오류를 사람이 읽을 수 있는 문장으로 바꿉니다. */
export function explainDataError(e: unknown): string {
  const code = (e as { code?: string } | null)?.code || '';
  switch (code) {
    case 'permission-denied':
      return '서버에 저장할 권한이 없습니다. Firestore 규칙과 관리자 이메일을 확인해 주세요.';
    case 'app/timeout':
    case 'unavailable':
      return '서버에 연결되지 않았습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.';
    case 'not-found':
    case 'failed-precondition':
      return 'Firestore 데이터베이스가 아직 만들어지지 않았습니다. Firebase 콘솔에서 만들어 주세요.';
    case 'app/image-too-large':
      return '사진 용량이 너무 큽니다. 더 작은 사진을 사용해 주세요.';
    case 'app/doc-too-large':
      return '데이터가 서버 한도(1MB)에 가까워 저장할 수 없습니다. 안 쓰는 프롬프트를 정리해 주세요.';
    case 'app/not-configured':
      return describeConfigProblem() || 'Firebase 설정을 확인해 주세요.';
    default:
      return `서버 처리에 실패했습니다. (${code || '알 수 없는 오류'})`;
  }
}
