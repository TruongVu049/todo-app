export type Meta = {
  page: number
  totalPages: number
  total: number
  limit: number
}

// ============= Auth Types =============
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
}

export interface RegisterResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

// ============= Todo Types =============
export interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
  createdAt?: string // Add timestamp for filtering
}

export interface CreateTodoRequest {
  todo: string
  completed?: boolean
  userId: number
}

export interface UpdateTodoRequest {
  todo?: string
  completed?: boolean
}

export interface TodosResponse {
  todos: Todo[]
  total: number
  skip: number
  limit: number
}

// ============= Error Types =============
export interface ApiError {
  message: string
  status?: number
}
