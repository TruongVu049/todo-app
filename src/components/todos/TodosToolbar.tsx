import React, { memo } from 'react'

import { TodosTab, type FilterType } from '@/components/todos/TodosTab'
import { Button } from '@/components/ui/button'

type TodosToolbarProps = {
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  totalCount: number
  completedCount: number
  activeCount: number
  onAddTodo: () => void
  onLoadMockData?: () => void
  showLoadMockButton?: boolean
}

export const TodosToolbar: React.FC<TodosToolbarProps> = memo(
  function TodosToolbar({
    filter,
    onFilterChange,
    totalCount,
    completedCount,
    activeCount,
    onAddTodo,
    onLoadMockData,
    showLoadMockButton = false,
  }) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            <TodosTab
              filter={filter}
              onFilterChange={onFilterChange}
              totalCount={totalCount}
              completedCount={completedCount}
              activeCount={activeCount}
            />
          </div>

          <div className="flex gap-2">
            {showLoadMockButton && onLoadMockData && (
              <Button
                onClick={onLoadMockData}
                variant="outline"
                className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                Tải dữ liệu mẫu
              </Button>
            )}
            <Button
              onClick={onAddTodo}
              className="bg-[#00a85a] hover:bg-[#00a85a]/90 text-white shadow-sm hover:shadow-md transition-all h-10 px-4"
            >
              + Thêm công việc
            </Button>
          </div>
        </div>
      </div>
    )
  },
)
