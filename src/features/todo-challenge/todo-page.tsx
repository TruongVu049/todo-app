import React, { memo, useMemo, useCallback } from 'react'

import { DashboardLayout } from '@/components/layout'
import { Head } from '@/components/seo'
import type { ViewMode } from '@/types/common'
import { cn } from '@/utils/cn'

import { DeleteConfirmModal } from './components/delete-confirm-modal'
import { GreetingHeader } from './components/greeting-header'
import { SelectionToolbar } from './components/selection-toolbar'
import { StatsCards } from './components/stats-cards'
import { TabBar } from './components/tab-bar'
import { TodoForm } from './components/todo-form'
import { TodoList } from './components/todo-list'
import { TodoProvider, useTodo, useTodoCounts } from './context'
import { SearchProvider, useSearch } from './context/search-context'
import { SelectionProvider, useSelection } from './context/selection-context'
import { useDebouncedSearch } from './hooks/use-debounce'

// Tải component CalendarView chỉ khi cần thiết (Lazy Loading) để giảm dung lượng file bundle ban đầu
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

  const { searchQuery, setSearchQuery } = useSearch() // Lấy state tìm kiếm từ SearchContext riêng biệt
  const { activeTab, selectedCount } = useSelection() // Lấy tab đang active và số lượng đang chọn từ SelectionContext

  // useDeferredValue: Tạo một bản sao của searchQuery nhưng trì hoãn việc cập nhật
  // khi xử lý nặng để dành tài nguyên cho các tác vụ ưu tiên (như gõ phím mượt mà)
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

  // useDebouncedSearch: Tự quản lý input tạm thời và chỉ gọi setSearchQuery sau 500ms không gõ
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
      result = result.filter(
        (t) => t.dueDate === 'today' || t.dueDate === today,
      )
    } else if (navFilter === 'upcoming') {
      result = result.filter(
        (t) =>
          t.dueDate === 'tomorrow' ||
          t.dueDate === tomorrowStr ||
          (t.dueDate &&
            t.dueDate !== 'today' &&
            t.dueDate !== 'tomorrow' &&
            t.dueDate > today),
      )
    } else if (navFilter === 'overdue') {
      result = result.filter((t) => {
        if (!t.dueDate || t.dueDate === 'today' || t.dueDate === 'tomorrow')
          return false
        return t.dueDate < today
      })
    }

    // Apply tab filter (All/Completed/Active)
    if (activeTab === 'completed') {
      result = result.filter((t) => t.completed)
    } else if (activeTab === 'active') {
      result = result.filter((t) => !t.completed)
    }
    // 'all' - không lọc gì thêm

    return result
  }, [todos, navFilter, deferredSearchQuery, activeTab])

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

  // Lấy danh sách tất cả ID để hỗ trợ Select All
  const allTodoIds = useMemo(
    () => filteredTodos.map((t) => t.id),
    [filteredTodos],
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

        {/* Tab Bar: All / Completed / Active */}
        <TabBar className="mt-2" />

        {/* Selection Toolbar: Hiển thị khi có item được chọn */}
        <SelectionToolbar allTodoIds={allTodoIds} />

        {/* Wrapper với padding-bottom khi toolbar hiển thị */}
        <div className={selectedCount > 0 ? 'pb-20' : ''}>
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
        </div>
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
        <SelectionProvider>
          <TodoPageContent />
        </SelectionProvider>
      </SearchProvider>
    </TodoProvider>
  )
}

export const TodoPage = memo(TodoPageComponent)
TodoPage.displayName = 'TodoPage'

export default TodoPage
