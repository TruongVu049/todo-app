import type {
  Todo,
  TodosResponse,
  CreateTodoRequest,
  UpdateTodoRequest,
} from './types'

const BASE_URL = 'https://dummyjson.com'

export async function getTodos(): Promise<TodosResponse> {
  const response = await fetch(`${BASE_URL}/todos?limit=30`)
  if (!response.ok) {
    throw new Error('Failed to fetch todos')
  }
  return response.json()
}

export async function createTodo(data: CreateTodoRequest): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/todos/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create todo')
  }
  return response.json()
}

export async function updateTodo(
  id: number,
  data: UpdateTodoRequest,
): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to update todo')
  }
  return response.json()
}

export async function deleteTodo(id: number): Promise<Todo> {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Failed to delete todo')
  }
  return response.json()
}
