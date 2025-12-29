import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { authApi } from '@/api/auth'
import { paths } from '@/config/paths'
import { clearAuth, setToken, setUser } from '@/lib/auth'
import type { LoginRequest } from '@/types/api'

export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      setToken(data.token)
      setUser(
        JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          image: data.image,
        }),
      )
      navigate(paths.todos.getHref(), { replace: true })
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()

  return () => {
    clearAuth()
    navigate(paths.login.getHref(), { replace: true })
  }
}
