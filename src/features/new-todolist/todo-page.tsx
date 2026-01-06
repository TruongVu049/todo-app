import React, { useState } from 'react'

import { TodoForm } from './components/todo-form'
import { TodoItem } from './components/todo-item'
import { initialTodos } from './mock'
import type { Todo } from './types'

export const TodoPage = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      text,
      createdAt: Date.now(),
    }
    setTodos((p) => [newTodo, ...p])
  }

  const updateTodo = (id: string, text: string) => {
    setTodos((p) =>
      p.map((t) => (t.id === id ? { ...t, text, updatedAt: Date.now() } : t)),
    )
  }

  const deleteTodo = (id: string) => {
    setTodos((p) => p.filter((t) => t.id !== id))
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">New Todo List</h1>

      <TodoForm onAdd={addTodo} />

      {todos.length === 0 ? (
        <div className="text-center text-slate-500">No todos</div>
      ) : (
        <div className="grid gap-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TodoPage
