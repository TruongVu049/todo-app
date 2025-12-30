import { useState, useEffect } from 'react'

import { getTodos, createTodo, updateTodo, deleteTodo } from '@/api/todos'
import { APP_CONFIG, MESSAGES } from '@/constants'
import type { Todo } from '@/types/api'

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadTodos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getTodos(APP_CONFIG.DEFAULT_TODOS_LIMIT)
      setTodos([...response.todos])
    } catch (err) {
      setError(MESSAGES.errors.loadTodosFailed)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const handleCreateTodo = async (data: {
    todo: string
    completed: boolean
  }) => {
    try {
      setIsSubmitting(true)
      const newTodo = await createTodo({
        ...data,
        userId: APP_CONFIG.DEFAULT_USER_ID,
      })
      setTodos([newTodo, ...todos])
      setIsFormOpen(false)
    } catch (err) {
      setError(MESSAGES.errors.createTodoFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTodo = async (data: {
    todo: string
    completed: boolean
  }) => {
    if (!editingTodo) return

    try {
      setIsSubmitting(true)

      if (editingTodo.id < 255) {
        const updated = await updateTodo(editingTodo.id, data)
        setTodos(todos.map((t) => (t.id === updated.id ? updated : t)))
      } else {
        setTodos(
          todos.map((t) => (t.id === editingTodo.id ? { ...t, ...data } : t)),
        )
      }

      setIsFormOpen(false)
      setEditingTodo(null)
    } catch (err) {
      setError(MESSAGES.errors.updateTodoFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleTodo = async (id: number, completed: boolean) => {
    const previousTodos = [...todos]
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed } : t)))

    try {
      if (id < 255) {
        await updateTodo(id, { completed })
      }
    } catch (err) {
      setTodos(previousTodos)
      setError(MESSAGES.errors.updateTodoFailed)
    }
  }

  const handleDeleteTodo = async () => {
    if (!deletingId) return

    const previousTodos = [...todos]
    setTodos(todos.filter((t) => t.id !== deletingId))

    try {
      if (deletingId < 255) {
        await deleteTodo(deletingId)
      }
      setDeletingId(null)
    } catch (err) {
      setTodos(previousTodos)
      setError(MESSAGES.errors.deleteTodoFailed)
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTodo(null)
  }

  const openCreateForm = () => {
    setEditingTodo(null)
    setIsFormOpen(true)
  }

  const setDeletingTodoId = (id: number | null) => {
    setDeletingId(id)
  }

  return {
    //state
    todos,
    isLoading,
    error,
    isFormOpen,
    editingTodo,
    isSubmitting,
    deletingId,
    loadTodos,
    //actions
    handleCreateTodo,
    handleUpdateTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleEdit,
    handleCloseForm,
    openCreateForm,
    setDeletingTodoId,
  }
}
