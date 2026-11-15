import { MOCK } from '../config';
import { AuthApi } from './authCore';
import { firebaseAuthApi } from './auth';
import { mockAuthApi } from './authMock';

export const authApi: AuthApi = MOCK ? mockAuthApi : firebaseAuthApi;
