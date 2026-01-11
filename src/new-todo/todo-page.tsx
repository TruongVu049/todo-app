'use client'

import { useState, useCallback, useMemo } from 'react'

import { mockTodos } from './mock'
import TodoForm from './todo-form'
import TodoItem from './todo-item'
import { Todo } from './types'

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos)

  const handleAdd = useCallback((text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
    }
    setTodos((prev) => [newTodo, ...prev])
  }, [])

  const handleUpdate = useCallback((id: string, text: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text, updatedAt: Date.now() } : t,
      ),
    )
  }, [])

  const handleDelete = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => b.createdAt - a.createdAt)
  }, [todos])

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">New Todo List</h1>

      <TodoForm onAdd={handleAdd} />

      {sortedTodos.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Chưa có todo nào 🐣</p>
      ) : (
        <ul className="space-y-4">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
