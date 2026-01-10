import React, { memo, useMemo, useState, useCallback } from 'react'

import { cn } from '@/utils/cn'

import { useTodoActions } from '../context'
import type { Todo } from '../types'

interface CalendarViewProps {
  todos: Todo[]
  onToggleComplete?: (id: string) => void
}

const getLocalDateStr = (d: Date = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const MONTH_NAMES = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
]

const DAY_NAMES = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export const CalendarView: React.FC<CalendarViewProps> = memo(
  ({ todos, onToggleComplete }) => {
    const { toggleComplete } = useTodoActions()
    const handleToggle = useCallback(
      (id: string) => {
        onToggleComplete?.(id) ?? toggleComplete(id)
      },
      [onToggleComplete, toggleComplete],
    )

    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDayPopup, setSelectedDayPopup] = useState<{
      dateStr: string
      dateDisplay: string
      todos: Todo[]
    } | null>(null)

    const todayStr = useMemo(() => getLocalDateStr(), [])

    const tomorrowStr = useMemo(() => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return getLocalDateStr(tomorrow)
    }, [])

    const calendarDays = useMemo(() => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      const days: { date: Date; dateStr: string; isCurrentMonth: boolean }[] =
        []

      const startDayOfWeek = firstDay.getDay()
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month, -i)
        days.push({
          date,
          dateStr: getLocalDateStr(date),
          isCurrentMonth: false,
        })
      }

      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day)
        days.push({
          date,
          dateStr: getLocalDateStr(date),
          isCurrentMonth: true,
        })
      }

      const remainingDays = 7 - (days.length % 7)
      if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
          const date = new Date(year, month + 1, i)
          days.push({
            date,
            dateStr: getLocalDateStr(date),
            isCurrentMonth: false,
          })
        }
      }

      return days
    }, [currentDate])

    const todosByDate = useMemo(() => {
      const map: Record<string, Todo[]> = {}

      todos.forEach((todo) => {
        let dateKey = todo.dueDate || ''

        if (dateKey === 'today') dateKey = todayStr
        else if (dateKey === 'tomorrow') dateKey = tomorrowStr

        if (dateKey) {
          if (!map[dateKey]) map[dateKey] = []
          map[dateKey].push(todo)
        }
      })

      return map
    }, [todos, todayStr, tomorrowStr])

    const goToPreviousMonth = useCallback(() => {
      setCurrentDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
      )
    }, [])

    const goToNextMonth = useCallback(() => {
      setCurrentDate(
        (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
      )
    }, [])

    const goToToday = useCallback(() => {
      setCurrentDate(new Date())
    }, [])

    const closePopup = useCallback(() => {
      setSelectedDayPopup(null)
    }, [])

    const handlePopupKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') closePopup()
      },
      [closePopup],
    )

    const headerText = useMemo(
      () =>
        `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
      [currentDate],
    )

    const completedInPopup = useMemo(
      () => selectedDayPopup?.todos.filter((t) => t.completed).length ?? 0,
      [selectedDayPopup],
    )

    return (
      <div className="bg-white dark:bg-[#1e2736] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_left
              </span>
            </button>
            <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white min-w-[120px] md:min-w-[150px] text-center">
              {headerText}
            </h3>
            <button
              type="button"
              onClick={goToNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_right
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
          >
            Hôm nay
          </button>
        </div>

        {}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
          {DAY_NAMES.map((day, i) => (
            <div
              key={day}
              className={cn(
                'py-2 text-center text-[10px] md:text-xs font-semibold uppercase tracking-wider',
                i === 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400',
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayTodos = todosByDate[day.dateStr] || []
            const isToday = day.dateStr === todayStr
            const isPast = day.dateStr < todayStr
            const hasOverdue = isPast && dayTodos.some((t) => !t.completed)

            return (
              <div
                key={index}
                className={cn(
                  'min-h-[70px] md:min-h-[100px] p-1 md:p-2 border-b border-r border-slate-100 dark:border-slate-700/50',
                  !day.isCurrentMonth && 'bg-slate-50 dark:bg-slate-800/30',
                  isToday && 'bg-primary/5',
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      'text-xs md:text-sm font-medium',
                      !day.isCurrentMonth
                        ? 'text-slate-300 dark:text-slate-600'
                        : isToday
                          ? 'text-primary font-bold'
                          : isPast
                            ? 'text-slate-400'
                            : 'text-slate-700 dark:text-slate-300',
                    )}
                  >
                    {day.date.getDate()}
                  </span>
                  {hasOverdue && (
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500" />
                  )}
                </div>

                <div className="space-y-0.5 md:space-y-1">
                  {dayTodos.slice(0, 3).map((todo) => (
                    <button
                      key={todo.id}
                      type="button"
                      onClick={() => handleToggle(todo.id)}
                      className={cn(
                        'w-full text-left px-1 md:px-1.5 py-0.5 rounded text-[9px] md:text-[11px] truncate font-medium transition-all hover:scale-[1.02]',
                        todo.completed
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 line-through opacity-60'
                          : isPast
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-primary/10 text-primary dark:bg-primary/20',
                      )}
                      title={`${todo.text} (Click để ${todo.completed ? 'bỏ hoàn thành' : 'hoàn thành'})`}
                    >
                      {todo.text}
                    </button>
                  ))}
                  {dayTodos.length > 3 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDayPopup({
                          dateStr: day.dateStr,
                          dateDisplay: `${day.date.getDate()}/${day.date.getMonth() + 1}/${day.date.getFullYear()}`,
                          todos: dayTodos,
                        })
                      }
                      className="text-[9px] md:text-[10px] text-primary hover:text-primary/80 pl-1 font-medium hover:underline"
                    >
                      +{dayTodos.length - 3} khác
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Day Tasks Popup Modal */}
        {selectedDayPopup && (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-title"
            tabIndex={-1}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={closePopup}
            onKeyDown={handlePopupKeyDown}
          >
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <div
              role="document"
              tabIndex={-1}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-[90%] max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h3
                    id="popup-title"
                    className="font-semibold text-slate-900 dark:text-white"
                  >
                    📅 Ngày {selectedDayPopup.dateDisplay}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedDayPopup.todos.length} công việc
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closePopup}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
                {selectedDayPopup.todos.map((todo) => (
                  <button
                    key={todo.id}
                    type="button"
                    onClick={() => handleToggle(todo.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:scale-[1.01] flex items-center gap-2',
                      todo.completed
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : selectedDayPopup.dateStr < todayStr
                          ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-slate-50 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
                    )}
                  >
                    <span
                      className={cn(
                        'material-symbols-outlined text-[18px]',
                        todo.completed ? 'text-emerald-500' : 'text-slate-400',
                      )}
                    >
                      {todo.completed
                        ? 'check_circle'
                        : 'radio_button_unchecked'}
                    </span>
                    <span
                      className={cn(
                        todo.completed && 'line-through opacity-70',
                      )}
                    >
                      {todo.text}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  ✅ {completedInPopup} / {selectedDayPopup.todos.length} hoàn
                  thành
                </span>
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  },
)

CalendarView.displayName = 'CalendarView'
