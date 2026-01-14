import React, { useMemo, useCallback, memo } from 'react'

import { TodosEmpty } from '@/components/todos/TodosEmpty'
import { TodosItems } from '@/components/todos/TodosItems'
import { Checkbox } from '@/components/ui/checkbox'
import { useTodosSelection } from '@/contexts/select-todos-context'
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
  const { selectAll, clearSelection, selectedIds, selectedCount } =
    useTodosSelection()

  const allSelected = useMemo(() => {
    return todos.length > 0 && todos.every((todo) => selectedIds.has(todo.id))
  }, [todos, selectedIds])

  const someSelected = useMemo(() => {
    return todos.some((todo) => selectedIds.has(todo.id)) && !allSelected
  }, [todos, selectedIds, allSelected])

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
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            onChange={handleSelectAll}
            aria-label="Chọn tất cả công việc"
          />
          <span className="text-sm text-gray-600">
            {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            {someSelected && ' (một số đã chọn)'}
          </span>
        </div>
        {selectedCount > 0 && (
          <span className="text-sm text-green-600 font-medium">
            Đã chọn {selectedCount}
          </span>
        )}
      </div>

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
})
