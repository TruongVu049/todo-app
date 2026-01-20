import React, { memo, useMemo, useCallback } from 'react'

import { useAuthStore } from '@/features/auth/store'
import type { ViewMode } from '@/types/common'
import { cn } from '@/utils/cn'

interface GreetingHeaderProps {
  viewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
}

export const GreetingHeader: React.FC<GreetingHeaderProps> = memo(
  ({ viewMode = 'list', onViewModeChange }) => {
    const user = useAuthStore((state) => state.user) // Lấy thông tin user từ global store

    // useMemo: Tính toán lời chào và ngày tháng dựa trên thời gian thực tế
    const { greeting, dateString } = useMemo(() => {
      const now = new Date()
      const hour = now.getHours()

      // Xác định lời chào tùy theo khung giờ trong ngày
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

    // Các hàm xử lý chuyển đổi giao diện (List/Board/Calendar)
    const handleListView = useCallback(() => {
      onViewModeChange?.('list')
    }, [onViewModeChange])

    const handleBoardView = useCallback(() => {
      onViewModeChange?.('board')
    }, [onViewModeChange])

    const handleCalendarView = useCallback(() => {
      onViewModeChange?.('calendar')
    }, [onViewModeChange])

    // Ưu tiên hiển thị tên người dùng nếu có, nếu không thì gọi là "Bạn"
    const userName = useMemo(() => user?.firstName || 'Bạn', [user?.firstName])

    // useMemo cho các class CSS của nút chuyển đổi để tránh tính toán lại dư thừa
    const listButtonClass = useMemo(
      () =>
        cn(
          'px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5',
          viewMode === 'list'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold' // Style cho nút đang active
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
        ),
      [viewMode],
    )

    const boardButtonClass = useMemo(
      () =>
        cn(
          'px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5',
          viewMode === 'board'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
        ),
      [viewMode],
    )

    const calendarButtonClass = useMemo(
      () =>
        cn(
          'px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5',
          viewMode === 'calendar'
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
        ),
      [viewMode],
    )

    return (
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight">
            {greeting}, {userName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[15px]">
            {dateString}
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            type="button"
            onClick={handleListView}
            className={listButtonClass}
          >
            <span className="material-symbols-outlined text-[16px]">
              format_list_bulleted
            </span>
            Danh sách
          </button>
          <button
            type="button"
            onClick={handleBoardView}
            className={boardButtonClass}
          >
            <span className="material-symbols-outlined text-[16px]">
              view_kanban
            </span>
            Thẻ
          </button>
          <button
            type="button"
            onClick={handleCalendarView}
            className={calendarButtonClass}
          >
            <span className="material-symbols-outlined text-[16px]">
              calendar_month
            </span>
            Lịch
          </button>
        </div>
      </div>
    )
  },
)

GreetingHeader.displayName = 'GreetingHeader'
