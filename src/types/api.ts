export type Meta = {
  readonly page: number
  readonly totalPages: number
  readonly total: number
  readonly limit: number
}

export type Todo = {
  readonly id: number
  readonly todo: string
  readonly completed: boolean
  readonly userId: number
}

export type TodosResponse = {
  readonly todos: readonly Todo[]
  readonly total: number
  readonly skip: number
  readonly limit: number
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
  readonly id: number
  readonly username: string
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly gender: string
  readonly image: string
}

export type LoginResponse = {
  readonly token: string
  readonly refreshToken: string
} & User
