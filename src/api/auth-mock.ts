import type { LoginRequest, LoginResponse } from '@/types/auth'

export const mockLogin = async (
  payload: LoginRequest,
): Promise<LoginResponse> => {
  const username = payload.username.trim()
  const password = payload.password.trim()

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 400))

  if (username === 'kminchelle' && password === '0lelplR') {
    return {
      token: 'mock-token-abc123',
      id: 1,
      username: 'kminchelle',
      firstName: 'Mock',
      lastName: 'User',
    }
  }

  throw new Error('Invalid credentials')
}
