import { useState, useEffect } from 'react'

import { getTodos, createTodo, updateTodo, deleteTodo } from '@/api/todos'
import { Todo } from '@/types/api'

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getTodos(30)
      setTodos(response.todos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTodo = async (data: {
    todo: string
    completed: boolean
  }) => {
    try {
      setIsSubmitting(true)
      const newTodo = await createTodo({
        ...data,
        userId: 1,
      })
      setTodos((prev) => [newTodo, ...prev])
      setIsFormOpen(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create todo')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTodo = async (data: {
    todo: string
    completed: boolean
  }) => {
    if (!editingTodo) return

    setTodos((prev) =>
      prev.map((t) => (t.id === editingTodo.id ? { ...t, ...data } : t)),
    )
    setIsFormOpen(false)
    setEditingTodo(null)

    try {
      setIsSubmitting(true)
      await updateTodo(editingTodo.id, data)
    } catch (err) {
      console.warn('Update on server failed (demo API):', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleTodo = async (id: number, completed: boolean) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)))

    try {
      await updateTodo(id, { completed })
    } catch (err) {
      console.warn('Toggle on server failed (demo API):', err)
    }
  }

  const handleDeleteTodo = async () => {
    if (!deletingId) return

    setTodos((prev) => prev.filter((t) => t.id !== deletingId))
    setDeletingId(null)

    try {
      await deleteTodo(deletingId)
    } catch (err) {
      console.warn('Delete on server failed (demo API):', err)
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
    setIsFormOpen(true)
  }

  const setDeletingTodoId = (id: number | null) => {
    setDeletingId(id)
  }

  return {
    // State
    todos,
    isLoading,
    error,
    isFormOpen,
    editingTodo,
    isSubmitting,
    deletingId,
    // Actions
    loadTodos,
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
