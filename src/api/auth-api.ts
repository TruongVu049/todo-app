import { env } from '@/config/env'
import { LoginRequest, LoginResponse } from '@/types/auth'

import { mockLogin } from './auth-mock'

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  // Ensure no accidental leading/trailing whitespace
  const body = {
    username: payload.username.trim(),
    password: payload.password.trim(),
  }

  // Dev mock support for reliable local testing
  if (env.ENABLE_API_MOCKING) {
    return mockLogin(body)
  }

  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    // Try to extract useful error info for debugging and user feedback
    const text = await res.text()
    let message = `Login failed (${res.status} ${res.statusText})`

    try {
      const json = JSON.parse(text)
      message = json?.message || JSON.stringify(json)
    } catch (e) {
      if (text) message = text
    }

    throw new Error(message)
  }

  const data = (await res.json()) as LoginResponse
  return data
}
