import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { paths } from '@/config/paths'

import { loginApi } from '../api'
import { useAuthStore } from '../store'
import type { LoginRequest, User } from '../types'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (data: LoginRequest) => loginApi(data),
    onSuccess: (response) => {
      const user: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        gender: response.gender,
        image: response.image,
      }

      setAuth(user, response.accessToken, response.refreshToken)
      navigate(paths.dashboard.getHref())
    },
  })
}
