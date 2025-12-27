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

  // Calendar week navigation state (must be at top level for hooks rules)
  const [weekOffset, setWeekOffset] = React.useState(0)

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

  // Calendar View
  if (viewMode === 'calendar') {
    const today = new Date()
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

    const getWeekDates = (offset: number) => {
      const dates = []
      const startOfWeek = new Date(today)
      startOfWeek.setDate(today.getDate() - today.getDay() + offset * 7)

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek)
        date.setDate(startOfWeek.getDate() + i)
        dates.push(date)
      }
      return dates
    }

    const weekDates = getWeekDates(weekOffset)

    // Get month/year for header based on week dates
    const weekMonth = weekDates[3].toLocaleDateString('vi-VN', {
      month: 'long',
      year: 'numeric',
    })

    const getTodosForDay = (date: Date) => {
      const checkToday = new Date(today)
      checkToday.setHours(0, 0, 0, 0)
      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)

      const tomorrow = new Date(checkToday)
      tomorrow.setDate(checkToday.getDate() + 1)

      return allTodos.filter((todo) => {
        const dueDate = getTodoDueDate(todo)
        if (dueDate === 'today' && checkDate.getTime() === checkToday.getTime())
          return true
        if (
          dueDate === 'tomorrow' &&
          checkDate.getTime() === tomorrow.getTime()
        )
          return true
        return false
      })
    }

    // Calculate stats for the week
    const weekTodos = weekDates.flatMap((date) => getTodosForDay(date))
    const weekCompleted = weekTodos.filter((t) => t.completed).length
    const weekTotal = weekTodos.length

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Header with navigation */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setWeekOffset((o) => o - 1)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
              title="Tuần trước"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h3 className="font-semibold text-slate-900 dark:text-white capitalize min-w-[180px] text-center">
              {weekMonth}
            </h3>
            <button
              onClick={() => setWeekOffset((o) => o + 1)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
              title="Tuần sau"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            {weekOffset !== 0 && (
              <button
                onClick={() => setWeekOffset(0)}
                className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                Hôm nay
              </button>
            )}
          </div>

          {/* Week stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <span className="text-lg">📋</span>
              <span>{weekTotal} công việc</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <span className="text-lg">✅</span>
              <span>{weekCompleted} hoàn thành</span>
            </div>
          </div>
        </div>

        {/* Days header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          {days.map((day, i) => (
            <div
              key={day}
              className={cn(
                'p-2 text-center text-xs font-semibold border-r border-slate-200 dark:border-slate-700 last:border-r-0',
                i === 0 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400',
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {weekDates.map((date, i) => {
            const isToday = date.toDateString() === today.toDateString()
            const tomorrow = new Date(today)
            tomorrow.setDate(today.getDate() + 1)
            const isTomorrow = date.toDateString() === tomorrow.toDateString()
            const isPast = date < today && !isToday
            const dayTodos = getTodosForDay(date)
            const completedCount = dayTodos.filter((t) => t.completed).length
            const pendingCount = dayTodos.length - completedCount

            return (
              <div
                key={i}
                className={cn(
                  'min-h-[140px] p-2 border-r border-slate-200 dark:border-slate-700 last:border-r-0 transition-colors',
                  isToday && 'bg-primary/5 dark:bg-primary/10',
                  isTomorrow && 'bg-orange-50/50 dark:bg-orange-900/10',
                  isPast && 'bg-slate-50/30 dark:bg-slate-900/20',
                )}
              >
                {/* Day header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <div
                      className={cn(
                        'text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-all',
                        isToday
                          ? 'bg-primary text-white shadow-md'
                          : isPast
                            ? 'text-slate-400'
                            : 'text-slate-700 dark:text-slate-300',
                      )}
                    >
                      {date.getDate()}
                    </div>
                    {isToday && (
                      <span className="text-[10px] text-primary font-semibold animate-pulse">
                        Hôm nay
                      </span>
                    )}
                    {isTomorrow && (
                      <span className="text-[10px] text-orange-500 font-medium">
                        Ngày mai
                      </span>
                    )}
                  </div>
                  {dayTodos.length > 0 && (
                    <div className="flex gap-1">
                      {pendingCount > 0 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
                          {pendingCount}
                        </span>
                      )}
                      {completedCount > 0 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓{completedCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Tasks list */}
                <div className="space-y-1">
                  {dayTodos.slice(0, 4).map((todo) => (
                    <div
                      key={todo.id}
                      className={cn(
                        'text-[11px] px-2 py-1 rounded-md truncate transition-all cursor-pointer hover:scale-[1.02]',
                        todo.completed
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 line-through opacity-70'
                          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30',
                      )}
                      title={todo.todo}
                    >
                      {todo.todo.length > 18
                        ? todo.todo.substring(0, 18) + '...'
                        : todo.todo}
                    </div>
                  ))}
                  {dayTodos.length > 4 && (
                    <button className="w-full text-[10px] text-slate-400 hover:text-primary text-center py-0.5 transition-colors">
                      +{dayTodos.length - 4} công việc khác
                    </button>
                  )}
                  {dayTodos.length === 0 && !isPast && (
                    <p className="text-[10px] text-slate-300 dark:text-slate-600 text-center py-4 italic">
                      Trống
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
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
