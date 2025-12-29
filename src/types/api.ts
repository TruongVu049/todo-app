export type Meta = {
  page: number
  totalPages: number
  total: number
  limit: number
}

export type Todo = {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export type TodosResponse = {
  todos: Todo[]
  total: number
  skip: number
  limit: number
}

export type CreateTodoRequest = {
  todo: string
  completed: boolean
  userId: number
}

export type UpdateTodoRequest = {
  todo?: string
  completed?: boolean
}

// Auth types
export type LoginRequest = {
  username: string
  password: string
}

export type User = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export type LoginResponse = {
  token: string
  refreshToken: string
} & User
