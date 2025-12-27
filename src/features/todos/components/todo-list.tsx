import * as React from 'react'

import type { Todo } from '../types'

import { TodoItem } from './todo-item'

type Props = {
  todos: Todo[]
  onToggle: (id: number, completed: boolean) => void
  onUpdate: (id: number, data: Partial<Todo>) => void
  onDelete: (id: number) => void
}

export const TodoList = ({ todos, onToggle, onUpdate, onDelete }: Props) => {
  return (
    <div className="space-y-2">
      {todos.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
