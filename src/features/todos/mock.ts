import { env } from '@/config/env'

import type { CreateTodoInput, UpdateTodoInput, Todo } from './types'

const STORAGE_KEY = 'todos:v1'

const load = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Todo[]
  } catch (e) {
    console.error('Failed to load todos from localStorage', e)
    return []
  }
}

const save = (todos: Todo[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch (e) {
    console.error('Failed to save todos to localStorage', e)
  }
}

export const mockInit = async (seedUrl?: string) => {
  const current = load()
  if (current.length > 0) return current
  if (!seedUrl) return []

  try {
    const res = await fetch(seedUrl)
    if (!res.ok) return []
    const data = await res.json()
    const todos = (data.todos || []).map((t: any) => ({
      id: t.id,
      todo: t.todo,
      completed: t.completed,
      userId: t.userId ?? 1,
    })) as Todo[]
    save(todos)
    return todos
  } catch (e) {
    console.error('Failed to seed todos', e)
    return []
  }
}

export const mockGetTodos = async (seedUrl?: string): Promise<Todo[]> => {
  // Ensure seeded at first call
  await mockInit(seedUrl)
  return load()
}

export const mockCreateTodo = async (input: CreateTodoInput): Promise<Todo> => {
  const todos = load()
  const newTodo: Todo = { id: Date.now(), ...input }
  todos.unshift(newTodo)
  save(todos)
  return newTodo
}

export const mockUpdateTodo = async (
  id: number,
  input: UpdateTodoInput,
): Promise<Todo> => {
  const todos = load()
  const idx = todos.findIndex((t) => t.id === id)
  if (idx === -1) throw new Error('Not found')
  const updated = { ...todos[idx], ...input }
  todos[idx] = updated
  save(todos)
  return updated
}

export const mockDeleteTodo = async (id: number): Promise<void> => {
  // Allow controlled failures for testing rollback. Set VITE_APP_MOCK_DELETE_FAIL_RATE to a number between 0 and 1.
  const rate = Number(env.MOCK_DELETE_FAIL_RATE ?? 0)
  if (rate > 0 && Math.random() < rate) {
    throw new Error('Mock delete failure')
  }

  const todos = load().filter((t) => t.id !== id)
  save(todos)
}
