import { apiClient } from './client'
import {
  LoginRequest,
  LoginResponse,
  AuthUser,
} from '@/types/api'

export const authApi = {
  login: (credentials: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', credentials),

  getMe: (token: string) =>
    apiClient.get<AuthUser>('/auth/me', { token }),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ token: string; refreshToken: string }>(
      '/auth/refresh',
      { refreshToken }
    ),
}
