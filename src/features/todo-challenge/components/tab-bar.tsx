import React, { memo, useMemo } from 'react'

import { cn } from '@/utils/cn'

import { useTodoCounts } from '../context'
import { useSelection } from '../context/selection-context'

// Thanh tab để lọc danh sách: All / Completed / Active
// Sử dụng SelectionContext để quản lý state của tab đang active
export const TabBar: React.FC<{ className?: string }> = memo(
  ({ className }) => {
    const { activeTab, setActiveTab } = useSelection()
    const { totalCount, completedCount } = useTodoCounts()

    // Tính số lượng active (chưa hoàn thành)
    const activeCount = useMemo(
      () => totalCount - completedCount,
      [totalCount, completedCount],
    )

    // Cấu hình cho 3 tab
    const tabs = useMemo(
      () => [
        { id: 'all' as const, label: 'Tất cả', count: totalCount },
        {
          id: 'completed' as const,
          label: 'Hoàn thành',
          count: completedCount,
        },
        { id: 'active' as const, label: 'Chưa xong', count: activeCount },
      ],
      [totalCount, completedCount, activeCount],
    )

    return (
      <div
        className={cn(
          'flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl',
          className,
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all',
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                'text-xs px-1.5 py-0.5 rounded-full',
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400',
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>
    )
  },
)

TabBar.displayName = 'TabBar'
