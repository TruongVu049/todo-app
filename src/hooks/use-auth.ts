import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, ApiError } from '@/types/api'

// Hook for login mutation
export const useLogin = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const setError = useAuthStore((state) => state.setError)

  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      // Save user data and tokens
      const user = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      }
      // Use accessToken instead of token
      setAuth(user, data.accessToken, data.refreshToken)
      // Navigate to home page
      navigate('/')
    },
    onError: (error) => {
      setError(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
    },
  })
}

// Hook for logout
export const useLogout = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return { logout: handleLogout }
}

// Hook for register mutation
export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation<RegisterResponse, ApiError, RegisterRequest>({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      // Navigate to login page after successful registration
      navigate('/login')
    },
  })
}

// Hook to check authentication status
export const useAuth = () => {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const error = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.setError)

  return {
    user,
    token,
    isAuthenticated,
    error,
    clearError: () => clearError(null),
  }
}
