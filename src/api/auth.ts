import { apiClient } from '@/lib/api-client'
import type { LoginRequest, LoginResponse } from '@/types/api'

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const requestBody = {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 30,
    }

    return apiClient.post<LoginResponse>('/auth/login', requestBody)
  },
}
