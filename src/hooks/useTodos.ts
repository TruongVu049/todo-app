import { useState, useCallback } from 'react'

import type { Todo } from '@/types/todos'
import { createNewTodo } from '@/utils/validation'
export const useTodos = (storedTodos: Todo[]) => {
  const [todos, setTodos] = useState<Todo[]>(storedTodos)

  const addTodo = useCallback((text: string) => {
    const newTodo = createNewTodo(text)
    setTodos((prevTodos) => [newTodo, ...prevTodos])
  }, [])

  const updateTodo = useCallback((id: number, text: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text, updateAt: Date.now() } : todo,
      ),
    )
  }, [])

  const deleteTodo = useCallback((id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }, [])

  const toggleTodo = useCallback((id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updateAt: Date.now() }
          : todo,
      ),
    )
  }, [])

  const deleteAll = useCallback(() => {
    setTodos([])
  }, [])

  const loadMockData = useCallback((mockTodos: Todo[]) => {
    setTodos(mockTodos)
  }, [])

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    deleteAll,
    loadMockData,
  }
}
