export interface SubTask {
  id: string
  text: string
  completed: boolean
}

export interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
  dueDate?: string
  project?: string
  priority?: 'high' | 'medium' | 'low'
  description?: string
  subTasks?: SubTask[]
  createdAt?: string
  reminderTime?: string
}

export interface TodosResponse {
  todos: Todo[]
  total: number
  skip: number
  limit: number
}

export interface CreateTodoRequest {
  todo: string
  completed: boolean
  userId: number
  dueDate?: string
  project?: string
  priority?: 'high' | 'medium' | 'low'
}

export type UpdateTodoRequest = Partial<Omit<Todo, 'id'>>
