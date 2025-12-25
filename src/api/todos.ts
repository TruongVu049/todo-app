import { apiClient } from './client'
import {
  Todo,
  TodosResponse,
  CreateTodoRequest,
  UpdateTodoRequest,
} from '@/types/api'

export const todosApi = {
  getAll: (limit = 30, skip = 0) =>
    apiClient.get<TodosResponse>(
      `/todos?limit=${limit}&skip=${skip}`
    ),

  getByUserId: (userId: number) =>
    apiClient.get<TodosResponse>(
      `/todos/user/${userId}`
    ),

  getById: (id: number) =>
    apiClient.get<Todo>(`/todos/${id}`),

  create: (data: CreateTodoRequest) =>
    apiClient.post<Todo>('/todos/add', data),

  update: (id: number, data: UpdateTodoRequest) =>
    apiClient.put<Todo>(`/todos/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<{ isDeleted: boolean; id: number }>(
      `/todos/${id}`
    ),
}


