import { useMemo } from 'react'

import type { ViewMode } from '@/types/common'
import { cn } from '@/utils/cn'

import { useAuthStore } from '../../auth/store'

interface GreetingHeaderProps {
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
}

export function GreetingHeader({
  viewMode = 'list',
  onViewModeChange,
}: GreetingHeaderProps) {
  const user = useAuthStore((state) => state.user)
  const { greeting, dateString } = useMemo(() => {
    const now = new Date()
    const hour = now.getHours()

    let greet = 'Chào buổi sáng'
    if (hour >= 12 && hour < 17) {
      greet = 'Chào buổi chiều'
    } else if (hour >= 17) {
      greet = 'Chào buổi tối'
    }

    const days = [
      'Chủ nhật',
      'Thứ hai',
      'Thứ ba',
      'Thứ tư',
      'Thứ năm',
      'Thứ sáu',
      'Thứ bảy',
    ]

    const dayName = days[now.getDay()]
    const date = now.getDate()
    const month = now.getMonth() + 1

    return {
      greeting: greet,
      dateString: `${dayName}, ngày ${date} tháng ${month}`,
    }
  }, [])

  const handleViewChange = (mode: ViewMode) => {
    onViewModeChange?.(mode)
  }

  return (
    <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
      <div>
        <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">
          {greeting}, {user?.firstName || 'Bạn'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[15px]">
          {dateString}
        </p>
      </div>

      {/* View Toggles */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => handleViewChange('list')}
          className={cn(
            'px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5',
            viewMode === 'list'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
          )}
        >
          <span className="material-symbols-outlined text-[16px]">
            format_list_bulleted
          </span>
          Danh sách
        </button>
        <button
          onClick={() => handleViewChange('board')}
          className={cn(
            'px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5',
            viewMode === 'board'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
          )}
        >
          <span className="material-symbols-outlined text-[16px]">
            view_kanban
          </span>
          Bảng
        </button>
        <button
          onClick={() => handleViewChange('calendar')}
          className={cn(
            'px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5',
            viewMode === 'calendar'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
          )}
        >
          <span className="material-symbols-outlined text-[16px]">
            calendar_month
          </span>
          Lịch
        </button>
      </div>
    </div>
  )
}
