import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

import type { Todo } from '../types'

interface TodoContextType {
  todos: Todo[]
  isDeleteModalOpen: boolean
  todoToDelete: Todo | null

  todayCount: number
  tomorrowCount: number
  overdueCount: number
  completedCount: number
  totalCount: number

  addTodo: (text: string, date: string) => void
  updateTodo: (id: string, newText: string) => void
  toggleComplete: (id: string) => void
  deleteTodo: (id: string) => void
  openDeleteModal: (id: string) => void
  closeDeleteModal: () => void
  confirmDelete: () => void
}

const TodoContext = createContext<TodoContextType | null>(null)

const getLocalDateStr = (d: Date = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const MOCK_TODOS: Todo[] = [
  {
    id: '1',
    text: 'Học React cơ bản',
    completed: false,
    createdAt: Date.now() - 1000000,
    dueDate: 'today',
    priority: 'high',
    project: 'work',
  },
  {
    id: '2',
    text: 'Tìm hiểu về TypeScript',
    completed: true,
    createdAt: Date.now() - 500000,
    dueDate: 'today',
    priority: 'medium',
    project: 'personal',
  },
  {
    id: '3',
    text: 'Xây dựng Todo App',
    completed: false,
    createdAt: Date.now(),
    dueDate: 'tomorrow',
    priority: 'low',
    project: 'shopping',
  },
]

interface TodoProviderProps {
  children: ReactNode
}

export function TodoProvider({ children }: TodoProviderProps) {
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null)

  // Actions
  const addTodo = useCallback((text: string, date: string) => {
    const trimmed = text.trim()
    if (trimmed.length < 3) {
      alert('Nội dung phải có ít nhất 3 ký tự')
      return
    }

    const todayStr = getLocalDateStr()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = getLocalDateStr(tomorrow)

    let dueDate = date
    if (date === todayStr) dueDate = 'today'
    else if (date === tomorrowStr) dueDate = 'tomorrow'

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
      dueDate,
      project: 'personal',
      priority: 'medium',
    }

    setTodos((prev) => [newTodo, ...prev])
  }, [])

  const updateTodo = useCallback((id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, text: newText, updatedAt: Date.now() }
          : todo,
      ),
    )
  }, [])

  const toggleComplete = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const openDeleteModal = useCallback((id: string) => {
    setTodos((prev) => {
      const todo = prev.find((t) => t.id === id)
      if (todo) {
        setTodoToDelete(todo)
        setIsDeleteModalOpen(true)
      }
      return prev
    })
  }, [])

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false)
  }, [])

  const confirmDelete = useCallback(() => {
    if (todoToDelete) {
      setTodos((prev) => prev.filter((todo) => todo.id !== todoToDelete.id))
      setTodoToDelete(null)
    }
  }, [todoToDelete])

  // Computed values
  const todayCount = useMemo(() => {
    const today = getLocalDateStr()
    return todos.filter(
      (t) => !t.completed && (t.dueDate === 'today' || t.dueDate === today),
    ).length
  }, [todos])

  const tomorrowCount = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = getLocalDateStr(tomorrow)
    return todos.filter(
      (t) =>
        !t.completed && (t.dueDate === 'tomorrow' || t.dueDate === tomorrowStr),
    ).length
  }, [todos])

  const overdueCount = useMemo(() => {
    const today = getLocalDateStr()
    return todos.filter((t) => {
      if (t.completed || !t.dueDate) return false
      if (t.dueDate === 'today' || t.dueDate === 'tomorrow') return false
      return t.dueDate < today
    }).length
  }, [todos])

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  )

  const totalCount = todos.length

  const value = useMemo<TodoContextType>(
    () => ({
      todos,
      isDeleteModalOpen,
      todoToDelete,
      todayCount,
      tomorrowCount,
      overdueCount,
      completedCount,
      totalCount,
      addTodo,
      updateTodo,
      toggleComplete,
      deleteTodo,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
    }),
    [
      todos,
      isDeleteModalOpen,
      todoToDelete,
      todayCount,
      tomorrowCount,
      overdueCount,
      completedCount,
      totalCount,
      addTodo,
      updateTodo,
      toggleComplete,
      deleteTodo,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
    ],
  )

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
}

export function useTodo(): TodoContextType {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
}

export function useTodoActions() {
  const {
    addTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useTodo()
  return useMemo(
    () => ({
      addTodo,
      updateTodo,
      toggleComplete,
      deleteTodo,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
    }),
    [
      addTodo,
      updateTodo,
      toggleComplete,
      deleteTodo,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
    ],
  )
}

export function useTodoState() {
  const { todos, isDeleteModalOpen, todoToDelete } = useTodo()
  return { todos, isDeleteModalOpen, todoToDelete }
}

export function useTodoCounts() {
  const {
    todayCount,
    tomorrowCount,
    overdueCount,
    completedCount,
    totalCount,
  } = useTodo()
  return { todayCount, tomorrowCount, overdueCount, completedCount, totalCount }
}
