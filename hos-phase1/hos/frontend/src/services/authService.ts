import { api } from './api';
import { ApiResponse, AuthUser, Role } from '../types';

interface LoginPayload {
  token: string;
  user: AuthUser;
}

export async function login(role: Role, email: string, password: string): Promise<LoginPayload> {
  const path = role === 'student' ? '/auth/student/login' : '/auth/warden/login';
  const res = await api.post<ApiResponse<LoginPayload>>(path, { email, password });
  if (!res.data.success) {
    throw new Error(res.data.error.message);
  }
  return res.data.data;
}
