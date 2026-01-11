import React from 'react'

import { TodosEmpty } from '@/components/todos/TodosEmpty'
import { TodosItems } from '@/components/todos/TodosItems'
import type { Todo } from '@/types/todos'

type TodosListProps = {
  todos: Todo[]
  onDeleteTodo: (id: number) => void
  onToggleTodo: (id: number) => void
  onEditTodo: (todo: Todo) => void
}

export const TodosList: React.FC<TodosListProps> = ({
  todos,
  onDeleteTodo,
  onToggleTodo,
  onEditTodo,
}) => {
  if (todos.length === 0) {
    return <TodosEmpty />
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodosItems
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          onToggleTodo={onToggleTodo}
          onEditTodo={onEditTodo}
        />
      ))}
    </div>
  )
}
