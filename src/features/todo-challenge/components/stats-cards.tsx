import React, { memo, useMemo } from 'react'

import type { Todo } from '../types'

interface StatsCardsProps {
  todos?: Todo[]
  todayCount?: number
  overdueCount?: number
  tomorrowCount?: number
}

export const StatsCards: React.FC<StatsCardsProps> = memo(
  ({
    todos = [],
    todayCount: propsTodayCount,
    overdueCount: propsOverdueCount,
    tomorrowCount: propsTomorrowCount,
  }) => {
    // Luôn tính toán số lượng công việc chưa hoàn thành (pending) trong useMemo
    const pendingCount = useMemo(
      () => todos.filter((t) => !t.completed).length,
      [todos],
    )

    // Ưu tiên sử dụng giá trị count truyền từ props (đã được tính toán ở context)
    // Nếu không có props thì dùng giá trị pendingCount tính tại chỗ
    const displayTodayCount = useMemo(
      () => (propsTodayCount !== undefined ? propsTodayCount : pendingCount),
      [propsTodayCount, pendingCount],
    )

    const displayOverdueCount = useMemo(
      () => (propsOverdueCount !== undefined ? propsOverdueCount : 0),
      [propsOverdueCount],
    )

    const displayTomorrowCount = useMemo(
      () => (propsTomorrowCount !== undefined ? propsTomorrowCount : 0),
      [propsTomorrowCount],
    )

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Thẻ hiển thị công việc hôm nay */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#1e2736] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-[130px] group hover:border-primary/40 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500">
              <span className="material-symbols-outlined text-[22px]">
                event_available
              </span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Hôm nay
            </span>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
              {displayTodayCount}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Việc cần làm
            </p>
          </div>
        </div>

        {/* Thẻ hiển thị công việc khẩn cấp (quá hạn) */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#1e2736] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-[130px] group hover:border-red-300 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500">
              <span className="material-symbols-outlined text-[22px]">
                warning
              </span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Khẩn cấp
            </span>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">
              {displayOverdueCount}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Quá hạn
            </p>
          </div>
        </div>

        {/* Thẻ hiển thị công việc dự kiến ngày mai */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#1e2736] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between h-[130px] group hover:border-orange-300 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <span className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-500">
              <span className="material-symbols-outlined text-[22px]">
                event
              </span>
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Ngày mai
            </span>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
              {displayTomorrowCount}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Việc cần làm
            </p>
          </div>
        </div>
      </div>
    )
  },
)

StatsCards.displayName = 'StatsCards'
