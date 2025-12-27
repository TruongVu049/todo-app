// src/api/auth.api.ts
export type LoginPayload = {
  username: string
  password: string
}

export type LoginResponse = {
  token: string
  id: number
  username: string
}

export const loginApi = async (
  payload: LoginPayload,
): Promise<LoginResponse> => {
  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error('Login failed')
  }

  return res.json()
}
