import { create } from 'zustand'
import { todosApi } from '@/api/todos'
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '@/types/api'

export interface TodoState {
  todos: Todo[]
  loading: boolean
  error: string | null
  
  fetchTodos: () => Promise<void>
  addTodo: (data: CreateTodoRequest) => Promise<void>
  updateTodo: (id: number, data: UpdateTodoRequest) => Promise<void>
  deleteTodo: (id: number) => Promise<void>
  toggleTodo: (id: number) => Promise<void>
  setTodos: (todos: Todo[]) => void
  clearError: () => void
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true, error: null })
    try {
      const response = await todosApi.getAll()
      if (Array.isArray(response.todos)) {
        set({ todos: response.todos, loading: false })
      } else {
        set({ todos: [], error: 'Định dạng dữ liệu không hợp lệ', loading: false })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi tải danh sách công việc'
      set({ error: message, loading: false, todos: [] })
    }
  },

  addTodo: async (data: CreateTodoRequest) => {
    set({ error: null })
    try {
      const newTodo = await todosApi.create(data)
      set((state) => ({
        todos: [newTodo, ...state.todos],
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi thêm công việc'
      set({ error: message })
      throw error
    }
  },

  updateTodo: async (id: number, data: UpdateTodoRequest) => {
    set({ error: null })
    try {
      const updated = await todosApi.update(id, data)
      set((state) => ({
        todos: state.todos.map((t) => (t.id === id ? updated : t)),
      }))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi cập nhật công việc'
      set({ error: message })
      throw error
    }
  },

  deleteTodo: async (id: number) => {
    const previousTodos = get().todos
    
    // Optimistic delete
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
      error: null,
    }))
    
    try {
      await todosApi.delete(id)
    } catch (error) {
      // Revert on error
      set({ todos: previousTodos })
      const message = error instanceof Error ? error.message : 'Lỗi xóa công việc'
      set({ error: message })
      throw error
    }
  },

  toggleTodo: async (id: number) => {
    const todo = get().todos.find((t) => t.id === id)
    if (!todo) return

    const originalCompleted = todo.completed
    const newCompleted = !originalCompleted

    // Optimistic update
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id ? { ...t, completed: newCompleted } : t
      ),
    }))

    try {
      await todosApi.update(id, { completed: newCompleted })
    } catch (error) {
      // Revert on error
      set((state) => ({
        todos: state.todos.map((t) =>
          t.id === id ? { ...t, completed: originalCompleted } : t
        ),
      }))
      const message = error instanceof Error ? error.message : 'Lỗi cập nhật trạng thái'
      set({ error: message })
      throw error
    }
  },

  setTodos: (todos) => set({ todos }),

  clearError: () => set({ error: null }),
}))
