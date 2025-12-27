import { create } from 'zustand'

import type { Todo } from './types'

interface LocalTodoMetadata {
  dueDate: 'today' | 'tomorrow' | string
  project: string
  priority: 'high' | 'medium' | 'low'
}

interface TodoStore {
  // Local metadata for todos (keyed by todo id)
  todoMetadata: Record<number, LocalTodoMetadata>

  // Local todos (created locally, not from API)
  localTodos: Todo[]

  // Order of all todo IDs (for drag & drop reordering)
  todoOrder: number[]

  // Overrides for API todos (to track completed status changes etc.)
  apiTodoOverrides: Record<number, Partial<Todo>>

  // Set metadata for a todo
  setTodoMetadata: (id: number, metadata: Partial<LocalTodoMetadata>) => void

  // Add a local todo
  addLocalTodo: (todo: Todo) => void

  // Update a local todo
  updateLocalTodo: (id: number, updates: Partial<Todo>) => void

  // Update any todo (local or API) - applies overrides for API todos
  updateAnyTodo: (id: number, updates: Partial<Todo>) => void

  // Get overrides for an API todo
  getApiTodoOverrides: (id: number) => Partial<Todo> | undefined

  // Delete a local todo
  deleteLocalTodo: (id: number) => void

  // Reorder local todos
  reorderLocalTodos: (oldIndex: number, newIndex: number) => void

  // Reorder any todos by ID
  reorderTodosById: (activeId: number, overId: number) => void

  // Set initial order for todos
  setTodoOrder: (ids: number[]) => void

  // Get metadata for a todo
  getTodoMetadata: (id: number) => LocalTodoMetadata | undefined
}

// Generate default metadata based on todo id (for API todos)
const getDefaultMetadata = (id: number): LocalTodoMetadata => {
  const projects = ['work', 'personal', 'shopping']
  const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low']
  const dueDates: ('today' | 'tomorrow')[] = ['today', 'tomorrow']

  return {
    project: projects[id % 3],
    priority: priorities[id % 3],
    dueDate: dueDates[id % 2],
  }
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todoMetadata: {},
  localTodos: [],
  todoOrder: [],
  apiTodoOverrides: {},

  setTodoMetadata: (id, metadata) => {
    set((state) => ({
      todoMetadata: {
        ...state.todoMetadata,
        [id]: {
          ...(state.todoMetadata[id] || getDefaultMetadata(id)),
          ...metadata,
        },
      },
    }))
  },

  addLocalTodo: (todo) => {
    set((state) => ({
      localTodos: [todo, ...state.localTodos],
      todoOrder: [todo.id, ...state.todoOrder],
      todoMetadata: {
        ...state.todoMetadata,
        [todo.id]: {
          dueDate: todo.dueDate || 'today',
          project: todo.project || 'personal',
          priority: todo.priority || 'medium',
        },
      },
    }))
  },

  updateLocalTodo: (id, updates) => {
    set((state) => ({
      localTodos: state.localTodos.map((t) =>
        t.id === id ? { ...t, ...updates } : t,
      ),
    }))
  },

  // Update any todo - for local todos update directly, for API todos store in overrides
  updateAnyTodo: (id, updates) => {
    const state = get()
    const isLocalTodo = state.localTodos.some((t) => t.id === id)

    if (isLocalTodo) {
      // Update local todo directly
      set((s) => ({
        localTodos: s.localTodos.map((t) =>
          t.id === id ? { ...t, ...updates } : t,
        ),
      }))
    } else {
      // Store override for API todo
      set((s) => ({
        apiTodoOverrides: {
          ...s.apiTodoOverrides,
          [id]: {
            ...(s.apiTodoOverrides[id] || {}),
            ...updates,
          },
        },
      }))
    }
  },

  getApiTodoOverrides: (id) => {
    return get().apiTodoOverrides[id]
  },

  deleteLocalTodo: (id) => {
    set((state) => ({
      localTodos: state.localTodos.filter((t) => t.id !== id),
      todoOrder: state.todoOrder.filter((i) => i !== id),
    }))
  },

  reorderLocalTodos: (oldIndex, newIndex) => {
    set((state) => {
      const newTodos = [...state.localTodos]
      const [removed] = newTodos.splice(oldIndex, 1)
      newTodos.splice(newIndex, 0, removed)
      return { localTodos: newTodos }
    })
  },

  reorderTodosById: (activeId, overId) => {
    set((state) => {
      const currentOrder = [...state.todoOrder]
      const oldIndex = currentOrder.indexOf(activeId)
      const newIndex = currentOrder.indexOf(overId)

      if (oldIndex === -1 || newIndex === -1) return state

      const [removed] = currentOrder.splice(oldIndex, 1)
      currentOrder.splice(newIndex, 0, removed)
      return { todoOrder: currentOrder }
    })
  },

  setTodoOrder: (ids) => {
    set({ todoOrder: ids })
  },

  getTodoMetadata: (id) => {
    const state = get()
    return state.todoMetadata[id] || getDefaultMetadata(id)
  },
}))

// Helper to get project info
export const getProjectInfo = (projectId: string) => {
  const projects: Record<string, { name: string; color: string }> = {
    work: {
      name: 'Công việc',
      color: 'bg-blue-500 text-blue-600 border-blue-200 bg-blue-50',
    },
    personal: {
      name: 'Cá nhân',
      color: 'bg-emerald-500 text-emerald-600 border-emerald-200 bg-emerald-50',
    },
    shopping: {
      name: 'Mua sắm',
      color: 'bg-purple-500 text-purple-600 border-purple-200 bg-purple-50',
    },
  }
  return (
    projects[projectId] || {
      name: projectId,
      color: 'bg-slate-500 text-slate-600 border-slate-200 bg-slate-50',
    }
  )
}
