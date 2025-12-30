import type { LoginRequest, LoginResponse, User } from './types'

const BASE_URL = 'https://dummyjson.com'

export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Invalid credentials')
  }

  return response.json()
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get current user')
  }

  return response.json()
}
