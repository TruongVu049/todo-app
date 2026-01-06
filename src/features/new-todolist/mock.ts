import type { Todo } from './types'

// 3 initial todos (seed data)
export const initialTodos: Todo[] = [
  {
    id: '1',
    text: 'Buy groceries',
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // yesterday
  },
  {
    id: '2',
    text: 'Walk the dog',
    createdAt: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
  },
  {
    id: '3',
    text: 'Read a chapter of a book',
    createdAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
  },
]
