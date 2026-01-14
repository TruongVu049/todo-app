import React, { useMemo, useCallback, memo } from 'react'

import { TodosEmpty } from '@/components/todos/TodosEmpty'
import { TodosItems } from '@/components/todos/TodosItems'
import { Checkbox } from '@/components/ui/checkbox'
import {
  useSelectionState,
  useSelectionActions,
} from '@/contexts/select-todos-context'
import type { Todo } from '@/types/todos'

type TodosListProps = {
  todos: Todo[]
  onDeleteTodo: (id: number) => void
  onToggleTodo: (id: number) => void
  onEditTodo: (todo: Todo) => void
}

export const TodosList: React.FC<TodosListProps> = memo(function TodosList({
  todos,
  onDeleteTodo,
  onToggleTodo,
  onEditTodo,
}) {
  const { selectedIds, selectedCount } = useSelectionState()
  const { selectAll, clearSelection, isSelected } = useSelectionActions()

  const allSelected = useMemo(() => {
    return todos.length > 0 && todos.every((todo) => selectedIds.has(todo.id))
  }, [todos, selectedIds])

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      clearSelection()
    } else {
      selectAll(todos.map((todo) => todo.id))
    }
  }, [allSelected, clearSelection, selectAll, todos])

  if (todos.length === 0) {
    return <TodosEmpty />
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            onChange={handleSelectAll}
            aria-label="Chọn tất cả công việc"
          />
          <span className="text-sm text-gray-600">
            {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
          </span>
        </div>
        {selectedCount > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-[#00a85a] rounded-full"></div>
            <span className="text-sm text-[#00a85a] font-medium">
              {selectedCount}
            </span>
          </div>
        )}
      </div>

      {todos.map((todo) => (
        <TodosItems
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          onToggleTodo={onToggleTodo}
          onEditTodo={onEditTodo}
          isSelected={isSelected(todo.id)}
        />
      ))}
    </div>
  )
})
