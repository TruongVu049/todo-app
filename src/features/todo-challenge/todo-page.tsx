import React, { memo, useMemo, useCallback } from 'react'

import { DashboardLayout } from '@/components/layout'
import { Head } from '@/components/seo'
import type { ViewMode } from '@/types/common'
import { cn } from '@/utils/cn'

import { DeleteConfirmModal } from './components/delete-confirm-modal'
import { GreetingHeader } from './components/greeting-header'
import { StatsCards } from './components/stats-cards'
import { TodoForm } from './components/todo-form'
import { TodoList } from './components/todo-list'
import { TodoProvider, useTodo, useTodoCounts } from './context'
import { SearchProvider, useSearch } from './context/search-context'
import { useDebouncedSearch } from './hooks/use-debounce'

const CalendarView = React.lazy(() =>
  import('./components/calendar-view').then((m) => ({
    default: m.CalendarView,
  })),
)

const getLocalDateStr = (d: Date = new Date()) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const TodoPageContent: React.FC = memo(() => {
  const {
    todos,
    isDeleteModalOpen,
    todoToDelete,
    addTodo,
    closeDeleteModal,
    confirmDelete,
  } = useTodo()

  const { searchQuery, setSearchQuery } = useSearch()
  const deferredSearchQuery = React.useDeferredValue(searchQuery)

  const {
    todayCount,
    tomorrowCount,
    overdueCount,
    completedCount,
    totalCount,
  } = useTodoCounts()

  const [navFilter, setNavFilter] = React.useState<string>('all')
  const [viewMode, setViewMode] = React.useState<ViewMode>('list')

  const initialDate = React.useMemo(() => getLocalDateStr(), [])

  const { inputValue: searchInputValue, handleChange: handleSearchChange } =
    useDebouncedSearch({
      delay: 500, // 0.5 giây
      onSearch: setSearchQuery,
    })

  const handleNavFilterChange = useCallback((f: string) => {
    setNavFilter(f)
  }, [])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
  }, [])

  const filteredTodos = useMemo(() => {
    const today = getLocalDateStr()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = getLocalDateStr(tomorrow)

    let result = todos

    // Apply search filter first
    if (deferredSearchQuery.trim()) {
      const query = deferredSearchQuery.toLowerCase().trim()
      result = result.filter((t) => t.text.toLowerCase().includes(query))
    }

    // Then apply nav filter
    if (navFilter === 'today') {
      return result.filter((t) => t.dueDate === 'today' || t.dueDate === today)
    }
    if (navFilter === 'upcoming') {
      return result.filter(
        (t) =>
          t.dueDate === 'tomorrow' ||
          t.dueDate === tomorrowStr ||
          (t.dueDate &&
            t.dueDate !== 'today' &&
            t.dueDate !== 'tomorrow' &&
            t.dueDate > today),
      )
    }
    if (navFilter === 'overdue') {
      return result.filter((t) => {
        if (!t.dueDate || t.dueDate === 'today' || t.dueDate === 'tomorrow')
          return false
        return t.dueDate < today
      })
    }
    return result
  }, [todos, navFilter, deferredSearchQuery])

  const todoListClassName = useMemo(
    () =>
      cn(
        'space-y-3',
        viewMode === 'board' &&
          'space-y-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
      ),
    [viewMode],
  )

  const todoToDeleteText = useMemo(
    () => todoToDelete?.text || '',
    [todoToDelete],
  )

  return (
    <>
      <Head
        title="Todo Challenge - Premium"
        description="Giao diện chuyên nghiệp cho bài tập Todo"
      />
      <DashboardLayout
        completedCount={completedCount}
        totalCount={totalCount}
        todayCount={todayCount}
        tomorrowCount={tomorrowCount}
        overdueCount={overdueCount}
        navFilter={navFilter as any}
        onNavFilterChange={handleNavFilterChange}
        searchQuery={searchInputValue}
        onSearchChange={handleSearchChange}
      >
        <GreetingHeader
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />

        <StatsCards
          todos={todos}
          todayCount={todayCount}
          overdueCount={overdueCount}
          tomorrowCount={tomorrowCount}
        />

        <TodoForm
          initialDate={initialDate}
          onSubmit={(text, date) => addTodo(text, date || initialDate)}
        />

        {viewMode === 'calendar' ? (
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center p-12 text-slate-400">
                Loading Calendar...
              </div>
            }
          >
            <CalendarView todos={todos} />
          </React.Suspense>
        ) : (
          <TodoList
            todos={filteredTodos}
            viewMode={viewMode}
            className={todoListClassName}
          />
        )}
      </DashboardLayout>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        todoText={todoToDeleteText}
      />
    </>
  )
})

TodoPageContent.displayName = 'TodoPageContent'

const TodoPageComponent: React.FC = () => {
  return (
    <TodoProvider>
      <SearchProvider>
        <TodoPageContent />
      </SearchProvider>
    </TodoProvider>
  )
}

export const TodoPage = memo(TodoPageComponent)
TodoPage.displayName = 'TodoPage'

export default TodoPage
