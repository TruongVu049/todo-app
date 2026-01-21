'use client'

import { useState, useCallback, useMemo } from 'react'

import { mockTodos } from './mock'
import TodoForm from './todo-form'
import TodoItem from './todo-item'
import { Todo } from './types'

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos)
  const [tab, setTab] = useState<'all' | 'completed' | 'active'>('all')

  const handleAdd = useCallback((text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      selected: false,
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

  const handleToggleSelected = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t)),
    )
  }, [])

  const handleSelectAll = useCallback(() => {
    setTodos((prev) => prev.map((t) => ({ ...t, selected: true })))
  }, [])

  const handleUnselectAll = useCallback(() => {
    setTodos((prev) => prev.map((t) => ({ ...t, selected: false })))
  }, [])

  const handleDeleteSelected = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.selected))
  }, [])

  const handleMarkSelectedCompleted = useCallback(() => {
    setTodos((prev) =>
      prev.map((t) => (t.selected ? { ...t, completed: true } : t)),
    )
  }, [])

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => b.createdAt - a.createdAt)
  }, [todos])

  const filteredTodos = useMemo(() => {
    if (tab === 'completed') return sortedTodos.filter((t) => t.completed)
    if (tab === 'active') return sortedTodos.filter((t) => !t.completed)
    return sortedTodos
  }, [sortedTodos, tab])

  const totalCount = todos.length
  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = totalCount - completedCount
  const selectedCount = todos.filter((t) => t.selected).length

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">New Todo List</h1>

      <TodoForm onAdd={handleAdd} />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 rounded ${
              tab === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTab('completed')}
            className={`px-4 py-2 rounded ${
              tab === 'completed' ? 'bg-gray-900 text-white' : 'bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setTab('active')}
            className={`px-4 py-2 rounded ${
              tab === 'active' ? 'bg-gray-900 text-white' : 'bg-gray-200'
            }`}
          >
            Active
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Total: {totalCount} | Completed: {completedCount} | Active:{' '}
          {activeCount}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Select all
        </button>
        <button
          onClick={handleUnselectAll}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Unselect all
        </button>
        <button
          onClick={handleMarkSelectedCompleted}
          disabled={selectedCount === 0}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Mark selected as completed
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedCount === 0}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
        >
          Delete selected
        </button>
      </div>

      {filteredTodos.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Chua co todo nao</p>
      ) : (
        <ul className="space-y-4">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onToggleSelected={handleToggleSelected}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
