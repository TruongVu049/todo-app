import React, { useCallback, memo } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card/Card'
import { Checkbox } from '@/components/ui/checkbox'
import { useSelectionActions } from '@/contexts/select-todos-context'
import type { Todo } from '@/types/todos'
import { formatRelativeDate } from '@/utils/helper'

type TodosItemsProps = {
  todo: Todo
  onDeleteTodo: (id: number) => void
  onToggleTodo: (id: number) => void
  onEditTodo: (todo: Todo) => void
  isSelected: boolean // Nhận từ parent để tối ưu
}

export const TodosItems: React.FC<TodosItemsProps> = memo(function TodosItems({
  todo,
  onDeleteTodo,
  onToggleTodo,
  onEditTodo,
  isSelected,
}) {
  const { toggleSelection } = useSelectionActions()

  const handleCheckSelection = useCallback(() => {
    toggleSelection(todo.id)
  }, [todo.id, toggleSelection])

  const handleToggle = useCallback(() => {
    onToggleTodo(todo.id)
  }, [todo.id, onToggleTodo])

  const handleEdit = useCallback(() => {
    onEditTodo(todo)
  }, [todo, onEditTodo])

  const handleDelete = useCallback(() => {
    onDeleteTodo(todo.id)
  }, [todo.id, onDeleteTodo])

  const handleContentClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.closest('button') ||
        target.closest('input[type="checkbox"]')
      ) {
        return
      }
      handleToggle()
    },
    [handleToggle],
  )

  return (
    <Card
      className={`group relative transition-all duration-300 border overflow-hidden
        ${
          isSelected
            ? 'ring-2 ring-[#00a85a]/50 bg-[#00a85a]/5 shadow-md border-[#00a85a]/30'
            : todo.completed
              ? 'bg-gray-50/50 border-gray-200'
              : 'bg-white hover:shadow-md border-gray-200 hover:border-gray-300'
        }
      `}
      role="article"
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${
          isSelected
            ? 'bg-[#00a85a]'
            : todo.completed
              ? 'bg-gray-300'
              : 'bg-transparent group-hover:bg-gray-200'
        }`}
      />

      <div className="flex items-center gap-3 pl-2">
        <div className="flex-shrink-0">
          <Checkbox
            checked={isSelected}
            onChange={handleCheckSelection}
            aria-label="Chọn công việc"
          />
        </div>

        <div
          className="flex-1 min-w-0 cursor-pointer py-1"
          onClick={handleContentClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleContentClick(e as any)
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {todo.completed && (
                <svg
                  className="w-4 h-4 text-[#00a85a] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}

              <p
                className={`text-sm font-medium transition-colors
                  ${
                    todo.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-800 group-hover:text-[#00a85a]'
                  }
                `}
              >
                {todo.text}
              </p>
            </div>

            <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
              {formatRelativeDate(todo.updateAt || todo.createAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-7 px-3 border-gray-300 text-gray-600 hover:bg-[#00a85a] hover:text-white hover:border-[#00a85a] transition-all text-xs"
          >
            Sửa
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="h-7 px-3 border-gray-300 text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all text-xs"
          >
            Xóa
          </Button>
        </div>
      </div>
    </Card>
  )
})
