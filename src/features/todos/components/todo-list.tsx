import {
  DndContext,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import type { ViewMode, ProjectFilter } from '@/types/common'
import { cn } from '@/utils/cn'

import { useTodoStore } from '../store'
import type { Todo } from '../types'

import { DroppableColumn } from './board-drag-drop'
import { SortableTodoItem } from './sortable-todo-item'

interface TodoListProps {
  todos?: Todo[]
  viewMode?: ViewMode
  collapsedSections?: Record<string, boolean>
  onToggleSection?: (section: string) => void
  projectFilter?: ProjectFilter
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  refetch?: () => void
}

export function TodoList({
  todos = [],
  viewMode = 'list',
  collapsedSections = {},
  onToggleSection,
  projectFilter = 'none',
  isLoading = false,
  isError = false,
  error = null,
  refetch,
}: TodoListProps) {
  const { getTodoMetadata, reorderTodosById, setTodoMetadata, updateAnyTodo } =
    useTodoStore()

  // Calendar month navigation state (must be at top level for hooks rules)
  const [monthOffset, setMonthOffset] = React.useState(0)
  // Selected day for popup (shows all tasks for that day)
  const [selectedDayPopup, setSelectedDayPopup] = React.useState<{
    dateStr: string
    dateDisplay: string
    todos: typeof todos
  } | null>(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Use todos directly from props (already merged in Home page)
  const allTodos = todos

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner size="lg" className="text-primary" />
        <p className="mt-4 text-sm text-slate-500">Đang tải...</p>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 py-12">
        <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
          <span className="material-symbols-outlined text-3xl text-red-500">
            error
          </span>
        </div>
        <h3 className="mt-4 font-semibold text-red-600 dark:text-red-400">
          Không thể tải dữ liệu
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {error?.message || 'Có lỗi xảy ra'}
        </p>
        {refetch && (
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-4 rounded-lg"
          >
            Thử lại
          </Button>
        )}
      </div>
    )
  }

  // Empty state
  if (allTodos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4">
          <span className="material-symbols-outlined text-3xl text-slate-400">
            {projectFilter !== 'none' ? 'folder_open' : 'checklist'}
          </span>
        </div>
        <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
          {projectFilter !== 'none' ? 'Dự án trống' : 'Chưa có công việc'}
        </h3>
        <p className="mt-1 text-sm text-slate-500 text-center">
          {projectFilter !== 'none'
            ? 'Thêm công việc mới để bắt đầu với dự án này!'
            : 'Thêm công việc đầu tiên để bắt đầu!'}
        </p>
      </div>
    )
  }

  // Get due date for a todo
  const getTodoDueDate = (todo: Todo): string => {
    return todo.dueDate || getTodoMetadata(todo.id)?.dueDate || 'today'
  }

  // Get project for a todo
  const getTodoProject = (todo: Todo) => {
    return todo.project || getTodoMetadata(todo.id)?.project || 'personal'
  }

  // Board View with Drag & Drop
  if (viewMode === 'board') {
    const tomorrowTodos = allTodos.filter(
      (t) => !t.completed && getTodoDueDate(t) === 'tomorrow',
    )
    const todayTodos = allTodos.filter(
      (t) => !t.completed && getTodoDueDate(t) === 'today',
    )
    const completedTodos = allTodos.filter((t) => t.completed)

    console.log(
      'Board view - Total allTodos:',
      allTodos.length,
      'Completed:',
      completedTodos.length,
      completedTodos.map((t) => ({ id: t.id, completed: t.completed })),
    )

    // Handle dropping a task on a column to change its due date or completed status
    const handleBoardDragEnd = (event: DragEndEvent) => {
      const { active, over } = event

      console.log('Board drag end:', { activeId: active.id, overId: over?.id })

      if (!over) return

      // Ensure todoId is a number
      const todoId =
        typeof active.id === 'string'
          ? parseInt(active.id, 10)
          : (active.id as number)
      const targetColumn = String(over.id)
      const currentTodo = allTodos.find((t) => t.id === todoId)

      console.log('Processing:', {
        todoId,
        targetColumn,
        foundTodo: !!currentTodo,
      })

      if (!currentTodo) return

      // Handle drop to Completed column
      if (targetColumn === 'completed-column') {
        console.log(
          'Dropping to completed. Current status:',
          currentTodo.completed,
        )
        if (!currentTodo.completed) {
          console.log('Calling updateAnyTodo for completed')
          updateAnyTodo(todoId, { completed: true })
        }
        return
      }

      // Handle drop to Today/Tomorrow columns
      let newDueDate: 'today' | 'tomorrow' | null = null

      if (targetColumn === 'tomorrow-column') {
        newDueDate = 'tomorrow'
      } else if (targetColumn === 'today-column') {
        newDueDate = 'today'
      }

      if (newDueDate) {
        // If task was completed, mark it as not completed when moving to active columns
        if (currentTodo.completed) {
          updateAnyTodo(todoId, { completed: false })
        }

        // Update due date if different
        const currentDueDate = getTodoDueDate(currentTodo)
        if (currentDueDate !== newDueDate) {
          setTodoMetadata(todoId, { dueDate: newDueDate })
        }
      }
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragEnd={handleBoardDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tomorrow Column */}
          <DroppableColumn
            id="tomorrow-column"
            title="Ngày mai"
            todos={tomorrowTodos}
            getTodoProject={getTodoProject}
            color={{
              bg: 'bg-slate-50 dark:bg-slate-800/50',
              dot: 'bg-yellow-500',
              badge:
                'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
              border: 'border-slate-200 dark:border-slate-700',
            }}
            emptyText="Kéo thả task vào đây"
          />

          {/* Today Column */}
          <DroppableColumn
            id="today-column"
            title="Hôm nay"
            todos={todayTodos}
            getTodoProject={getTodoProject}
            color={{
              bg: 'bg-blue-50 dark:bg-blue-900/20',
              dot: 'bg-blue-500',
              badge:
                'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
              border: 'border-blue-200 dark:border-blue-800',
            }}
            emptyText="Kéo thả task vào đây"
          />

          {/* Completed Column */}
          <DroppableColumn
            id="completed-column"
            title="Hoàn thành"
            todos={completedTodos.slice(0, 10)}
            totalCount={completedTodos.length}
            getTodoProject={getTodoProject}
            color={{
              bg: 'bg-emerald-50 dark:bg-emerald-900/20',
              dot: 'bg-emerald-500',
              badge:
                'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
              border: 'border-emerald-200 dark:border-emerald-800',
            }}
            emptyText="Kéo task vào để hoàn thành"
          />
        </div>
      </DndContext>
    )
  }

  // Calendar View - Monthly with interaction
  if (viewMode === 'calendar') {
    const today = new Date()
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    const monthNames = [
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

    // Helper to get local date string YYYY-MM-DD
    const getLocalDateStr = (d: Date = new Date()) => {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const todayStr = getLocalDateStr(today)
    const tomorrowDate = new Date(today)
    tomorrowDate.setDate(today.getDate() + 1)
    const tomorrowStr = getLocalDateStr(tomorrowDate)

    // Get current month based on offset
    const currentMonth = new Date(
      today.getFullYear(),
      today.getMonth() + monthOffset,
      1,
    )
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    // Get calendar days for current month
    const getCalendarDays = () => {
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      const calendarDays: {
        date: Date
        dateStr: string
        isCurrentMonth: boolean
      }[] = []

      // Add days from previous month to fill first week
      const startDayOfWeek = firstDay.getDay()
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month, -i)
        calendarDays.push({
          date,
          dateStr: getLocalDateStr(date),
          isCurrentMonth: false,
        })
      }

      // Add days of current month
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(year, month, day)
        calendarDays.push({
          date,
          dateStr: getLocalDateStr(date),
          isCurrentMonth: true,
        })
      }

      // Add days from next month to complete last week
      const remainingDays = 7 - (calendarDays.length % 7)
      if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
          const date = new Date(year, month + 1, i)
          calendarDays.push({
            date,
            dateStr: getLocalDateStr(date),
            isCurrentMonth: false,
          })
        }
      }

      return calendarDays
    }

    const calendarDays = getCalendarDays()

    // Map todos by date
    const getTodosByDate = () => {
      const map: Record<string, typeof allTodos> = {}

      allTodos.forEach((todo) => {
        let dateKey = getTodoDueDate(todo) || ''

        // Convert 'today'/'tomorrow' to actual date strings
        if (dateKey === 'today') dateKey = todayStr
        else if (dateKey === 'tomorrow') dateKey = tomorrowStr

        if (dateKey) {
          if (!map[dateKey]) map[dateKey] = []
          map[dateKey].push(todo)
        }
      })

      return map
    }

    const todosByDate = getTodosByDate()

    // Calculate stats for the month
    const monthTodos = calendarDays
      .filter((d) => d.isCurrentMonth)
      .flatMap((d) => todosByDate[d.dateStr] || [])
    const monthCompleted = monthTodos.filter((t) => t.completed).length
    const monthTotal = monthTodos.length

    // Handle toggle complete
    const handleToggleComplete = (todoId: number) => {
      const todo = allTodos.find((t) => t.id === todoId)
      if (todo) {
        updateAnyTodo(todoId, { completed: !todo.completed })
      }
    }

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Header with navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 md:p-4 border-b border-slate-200 dark:border-slate-700 gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMonthOffset((o: number) => o - 1)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
              title="Tháng trước"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_left
              </span>
            </button>
            <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white min-w-[120px] md:min-w-[150px] text-center">
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={() => setMonthOffset((o: number) => o + 1)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
              title="Tháng sau"
            >
              <span className="material-symbols-outlined text-[20px]">
                chevron_right
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Month stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <span className="text-lg">📋</span>
                <span>{monthTotal} công việc</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="text-lg">✅</span>
                <span>{monthCompleted} hoàn thành</span>
              </div>
            </div>

            {monthOffset !== 0 && (
              <button
                onClick={() => setMonthOffset(0)}
                className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
              >
                Hôm nay
              </button>
            )}
          </div>
        </div>

        {/* Days header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          {days.map((day, i) => (
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

        {/* Calendar grid */}
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
                {/* Day Number */}
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

                {/* Todos for this day */}
                <div className="space-y-0.5 md:space-y-1">
                  {dayTodos.slice(0, 3).map((todo) => (
                    <button
                      key={todo.id}
                      onClick={() => handleToggleComplete(todo.id)}
                      className={cn(
                        'w-full text-left px-1 md:px-1.5 py-0.5 rounded text-[9px] md:text-[11px] truncate font-medium transition-all hover:scale-[1.02]',
                        todo.completed
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 line-through opacity-60'
                          : isPast
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-primary/10 text-primary dark:bg-primary/20',
                      )}
                      title={`${todo.todo} (Click để ${todo.completed ? 'bỏ hoàn thành' : 'hoàn thành'})`}
                    >
                      {todo.todo}
                    </button>
                  ))}
                  {dayTodos.length > 3 && (
                    <button
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
            onClick={() => setSelectedDayPopup(null)}
            onKeyDown={(e) => e.key === 'Escape' && setSelectedDayPopup(null)}
          >
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <div
              role="document"
              tabIndex={-1}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-[90%] max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    📅 Ngày {selectedDayPopup.dateDisplay}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedDayPopup.todos.length} công việc
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDayPopup(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    close
                  </span>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
                {selectedDayPopup.todos.map((todo) => (
                  <button
                    key={todo.id}
                    onClick={() => handleToggleComplete(todo.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:scale-[1.01] flex items-center gap-2',
                      todo.completed
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : selectedDayPopup.dateStr < getLocalDateStr(today)
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
                      {todo.todo}
                    </span>
                  </button>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  ✅ {selectedDayPopup.todos.filter((t) => t.completed).length}{' '}
                  / {selectedDayPopup.todos.length} hoàn thành
                </span>
                <button
                  onClick={() => setSelectedDayPopup(null)}
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
  }

  // List View (default)
  const todayStr = new Date().toISOString().split('T')[0]

  const overdueTodos = allTodos.filter((t) => {
    if (t.completed) return false
    const dueDate = getTodoDueDate(t)
    if (dueDate === 'today' || dueDate === 'tomorrow') return false
    return dueDate < todayStr
  })

  const todayTodos = allTodos.filter(
    (t) => !t.completed && getTodoDueDate(t) === 'today',
  )
  const tomorrowTodos = allTodos.filter(
    (t) => !t.completed && getTodoDueDate(t) === 'tomorrow',
  )
  const completedTodos = allTodos.filter((t) => t.completed)

  const renderSection = (
    title: string,
    sectionTodos: Todo[],
    icon: string,
    iconColor: string,
    sectionKey: string,
  ) => {
    if (sectionTodos.length === 0) return null

    const isCollapsed = collapsedSections[sectionKey]

    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={() => onToggleSection?.(sectionKey)}
          className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider hover:text-primary w-fit group"
        >
          <span
            className={cn(
              'material-symbols-outlined text-[18px]',
              iconColor,
              isCollapsed && '-rotate-90',
            )}
          >
            {isCollapsed ? 'chevron_right' : icon}
          </span>
          {title}{' '}
          <span className="text-slate-400 font-normal ml-1">
            ({sectionTodos.length})
          </span>
        </button>

        {!isCollapsed && (
          <SortableContext
            items={sectionTodos.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2 pl-6">
              {sectionTodos.map((todo) => (
                <SortableTodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    )
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const activeId = active.id as number
      const overId = over.id as number
      reorderTodosById(activeId, overId)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-6">
        {renderSection(
          'Quá hạn',
          overdueTodos,
          'warning',
          'text-red-500',
          'overdue',
        )}
        {renderSection(
          'Hôm nay',
          todayTodos,
          'expand_more',
          'text-primary',
          'today',
        )}
        {renderSection(
          'Ngày mai',
          tomorrowTodos,
          'event',
          'text-orange-500',
          'tomorrow',
        )}
        {renderSection(
          'Đã hoàn thành',
          completedTodos,
          'check_circle',
          'text-emerald-500',
          'completed',
        )}
      </div>
    </DndContext>
  )
}
