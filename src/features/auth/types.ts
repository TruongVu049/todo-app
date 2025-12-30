// Auth Types

export interface LoginRequest {
  username: string
  password: string
}

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}
