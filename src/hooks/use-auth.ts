import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { login } from '@/api/auth-api'
import type { LoginRequest, LoginResponse } from '@/types/auth'

const TOKEN_KEY = 'token'

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY)

export const setToken = (token: string) =>
  localStorage.setItem(TOKEN_KEY, token)

export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const useAuth = () => {
  const navigate = useNavigate()

  const loginMutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.token)
      navigate('/todos')
    },
  })

  const logout = () => {
    clearToken()
    navigate('/login')
  }

  const isAuthenticated = Boolean(getToken())

  return {
    loginMutation,
    login: (payload: LoginRequest) => loginMutation.mutate(payload),
    loginAsync: (payload: LoginRequest) => loginMutation.mutateAsync(payload),
    logout,
    isAuthenticated,
    TOKEN_KEY,
  }
}
