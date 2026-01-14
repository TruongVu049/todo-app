import React, { useCallback, memo } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card/Card'
import { Checkbox } from '@/components/ui/checkbox'
import { useTodosSelection } from '@/contexts/select-todos-context'
import type { Todo } from '@/types/todos'
import { formatRelativeDate } from '@/utils/helper'

type TodosItemsProps = {
  todo: Todo
  onDeleteTodo: (id: number) => void
  onToggleTodo: (id: number) => void
  onEditTodo: (todo: Todo) => void
}

export const TodosItems: React.FC<TodosItemsProps> = memo(function TodosItems({
  todo,
  onDeleteTodo,
  onToggleTodo,
  onEditTodo,
}) {
  const { isSelected, toggleSelection } = useTodosSelection()
  const selected = isSelected(todo.id)

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('input') ||
        target.closest('button') ||
        target.closest('[role="checkbox"]')
      ) {
        return
      }
      toggleSelection(todo.id)
    },
    [todo.id, toggleSelection],
  )

  const handleToggle = useCallback(() => {
    onToggleTodo(todo.id)
  }, [todo.id, onToggleTodo])

  const handleEdit = useCallback(() => {
    onEditTodo(todo)
  }, [todo, onEditTodo])

  const handleDelete = useCallback(() => {
    onDeleteTodo(todo.id)
  }, [todo.id, onDeleteTodo])

  return (
    <Card
      className={`group cursor-pointer transition-all duration-200 ease-out border
        ${
          selected
            ? 'ring-2 ring-green-500 bg-gradient-to-r from-green-50 to-emerald-50 scale-[1.01] shadow-md border-green-200'
            : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50 hover:shadow-lg hover:-translate-y-1 border-gray-200'
        }
        active:scale-[0.99]
      `}
      onClick={handleCardClick}
      role="article"
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <Checkbox
            checked={todo.completed || false}
            onChange={handleToggle}
            aria-label={`Đánh dấu ${todo.text} là ${todo.completed ? 'chưa' : 'đã'} hoàn thành`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-3">
            <p
              className={`text-base leading-relaxed
                ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}
              `}
            >
              {todo.text}
            </p>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatRelativeDate(todo.updateAt || todo.createAt)}
            </span>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="text-xs px-2 py-1 h-7 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all duration-150 hover:scale-105 active:scale-95"
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-xs px-2 py-1 h-7 border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all duration-150 hover:scale-105 active:scale-95"
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
})
