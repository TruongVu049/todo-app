import { env } from '@/config/env'

import * as mock from './mock'
import type { Todo, CreateTodoInput, UpdateTodoInput } from './types'

const base = env.API_URL.replace(/\/$/, '')

const shouldMock = Boolean(env.ENABLE_API_MOCKING)

export const getTodos = async (): Promise<Todo[]> => {
  if (shouldMock) return mock.mockGetTodos(`${base}/todos`)

  const res = await fetch(`${base}/todos`)
  if (!res.ok) throw new Error(`Failed to fetch todos: ${res.status}`)
  const data = await res.json()
  // dummyjson returns { todos: Todo[], total, skip, limit }
  return data.todos as Todo[]
}

export const createTodo = async (input: CreateTodoInput): Promise<Todo> => {
  if (shouldMock) return mock.mockCreateTodo(input)

  const res = await fetch(`${base}/todos/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`Failed to create todo: ${res.status}`)
  return (await res.json()) as Todo
}

export const updateTodo = async (
  id: number,
  input: UpdateTodoInput,
): Promise<Todo> => {
  if (shouldMock) return mock.mockUpdateTodo(id, input)

  const res = await fetch(`${base}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`Failed to update todo: ${res.status}`)
  return (await res.json()) as Todo
}

export const deleteTodo = async (id: number): Promise<void> => {
  if (shouldMock) return mock.mockDeleteTodo(id)

  return
}
