import { apiClient } from './client'
import {
  LoginRequest,
  LoginResponse,
  AuthUser,
  RegisterRequest,
  RegisterResponse,
} from '@/types/api'

export const authApi = {
  login: (credentials: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', credentials),

  register: (data: RegisterRequest) =>
    apiClient.post<RegisterResponse>('/users/add', data),

  getMe: (token: string) =>
    apiClient.get<AuthUser>('/auth/me', { token }),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ token: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken }
    ),
}
