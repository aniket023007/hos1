export type Role = 'student' | 'warden';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  profile: Record<string, any>;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: { message: string; details?: unknown };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
