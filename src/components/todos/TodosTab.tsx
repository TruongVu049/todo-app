import React, { memo, useCallback } from 'react'

export type FilterType = 'all' | 'completed' | 'active'

type FilterOption = {
  value: FilterType
  label: string
  count: number
}

type TodosFilterProps = {
  filter: FilterType
  onFilterChange: (filter: FilterType) => void
  totalCount: number
  completedCount: number
  activeCount: number
}

export const TodosTab: React.FC<TodosFilterProps> = memo(function TodosTab({
  filter,
  onFilterChange,
  totalCount,
  completedCount,
  activeCount,
}) {
  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'Tất cả', count: totalCount },
    { value: 'active', label: 'Chưa xong', count: activeCount },
    { value: 'completed', label: 'Hoàn thành', count: completedCount },
  ]

  const handleFilterClick = useCallback(
    (value: FilterType) => {
      onFilterChange(value)
    },
    [onFilterChange],
  )

  return (
    <div
      className="inline-flex rounded-lg bg-gray-100 p-1 gap-1"
      role="tablist"
      aria-label="Lọc công việc"
    >
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleFilterClick(option.value)}
          role="tab"
          aria-selected={filter === option.value}
          aria-controls={`${option.value}-panel`}
          className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium 
              transition-all duration-200 hover:scale-105 active:scale-95
              ${
                filter === option.value
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }
            `}
        >
          <span>{option.label}</span>
          <span
            className={`text-xs ${filter === option.value ? 'text-green-500' : 'text-gray-400'}`}
          >
            ({option.count})
          </span>
        </button>
      ))}
    </div>
  )
})
