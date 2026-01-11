import React from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card/Card'
import { Checkbox } from '@/components/ui/checkbox'
import type { Todo } from '@/types/todos'
import { formatRelativeDate } from '@/utils/helper'

type TodosItemsProps = {
  todo: Todo
  onDeleteTodo: (id: number) => void
  onToggleTodo: (id: number) => void
  onEditTodo: (todo: Todo) => void
}

export const TodosItems: React.FC<TodosItemsProps> = ({
  todo,
  onDeleteTodo,
  onToggleTodo,
  onEditTodo,
}) => {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed || false}
          onChange={() => onToggleTodo(todo.id)}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p
              className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
            >
              {todo.text}
            </p>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formatRelativeDate(todo.updateAt || todo.createAt)}
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditTodo(todo)}
              className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-200"
            >
              Chỉnh Sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteTodo(todo.id)}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
