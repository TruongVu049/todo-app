import * as React from 'react'

import { DashboardLayout } from '@/components/layout'
import type { FilterOptions } from '@/components/modals'
import { Head } from '@/components/seo'
import { UndoToast } from '@/components/ui/toast'
import {
  AddTodoForm,
  TodoList,
  StatsCards,
  GreetingHeader,
  useTodos,
  useTodoStore,
  useHistoryStore,
} from '@/features/todos'
import { useNotifications } from '@/services/notification'

export type ViewMode = 'list' | 'board' | 'calendar'
export type NavFilter = 'all' | 'today' | 'upcoming' | 'overdue'
export type ProjectFilter = string

const Home = () => {
  const { data, isLoading, isError, error, refetch } = useTodos()
  const { localTodos, getTodoMetadata } = useTodoStore()

  const apiTodos = React.useMemo(() => data?.todos || [], [data?.todos])

  // Get setTodoOrder and todoOrder for drag & drop reordering
  const { setTodoOrder, todoOrder } = useTodoStore()

  // Initialize todoOrder once when todos are loaded, using a flag to prevent re-runs
  const initializedRef = React.useRef(false)

  React.useEffect(() => {
    // Only initialize once when we have todos and order is empty
    if (initializedRef.current) return

    const localIds = localTodos.map((t) => t.id)
    const apiIds = apiTodos.map((t) => t.id)
    const allIds = [...localIds, ...apiIds]

    // Only initialize if we have todos and todoOrder is empty
    if (allIds.length > 0 && todoOrder.length === 0) {
      setTodoOrder(allIds)
      initializedRef.current = true
    }
  }, [localTodos.length, apiTodos.length, todoOrder.length, setTodoOrder])

  // When new todos are added, add them to the order
  React.useEffect(() => {
    if (!initializedRef.current) return

    const localIds = localTodos.map((t) => t.id)
    const apiIds = apiTodos.map((t) => t.id)
    const allIds = [...localIds, ...apiIds]

    // Find any IDs not in the current order
    const newIds = allIds.filter((id) => !todoOrder.includes(id))

    if (newIds.length > 0) {
      setTodoOrder([...newIds, ...todoOrder])
    }
  }, [localTodos.length, apiTodos.length]) // Only check when counts change

  // Get apiTodoOverrides for merging
  const { apiTodoOverrides } = useTodoStore()

  // Sort allTodos by todoOrder and apply overrides
  const allTodos = React.useMemo(() => {
    console.log('allTodos useMemo running, apiTodoOverrides:', apiTodoOverrides)
    // Apply overrides to API todos
    const mergedApiTodos = apiTodos.map((todo) => {
      const overrides = apiTodoOverrides[todo.id]
      return overrides ? { ...todo, ...overrides } : todo
    })

    const combined = [...localTodos, ...mergedApiTodos]
    if (todoOrder.length === 0) return combined

    return combined.sort((a, b) => {
      const indexA = todoOrder.indexOf(a.id)
      const indexB = todoOrder.indexOf(b.id)
      // Put items not in order at the end
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }, [localTodos, apiTodos, todoOrder, apiTodoOverrides])

  // Enable notification monitoring for todos
  useNotifications(allTodos)

  const completedCount = allTodos.filter((t) => t.completed).length
  const totalCount = allTodos.length

  const inputRef = React.useRef<HTMLInputElement>(null)

  // Default to 'all' so user can see all tasks organized by sections
  const [viewMode, setViewMode] = React.useState<ViewMode>('list')
  const [navFilter, setNavFilter] = React.useState<NavFilter>('all')
  const [projectFilter, setProjectFilter] =
    React.useState<ProjectFilter>('none')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [collapsedSections, setCollapsedSections] = React.useState<
    Record<string, boolean>
  >({})
  const [customProjects, setCustomProjects] = React.useState<string[]>([])
  const [advancedFilters, setAdvancedFilters] = React.useState<FilterOptions>({
    status: 'all',
    priority: 'all',
    dateRange: 'all',
  })

  const handleNewTask = React.useCallback(() => {
    inputRef.current?.focus()
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [])

  const toggleSection = React.useCallback((section: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }, [])

  const handleAddProject = React.useCallback((projectId: string) => {
    setCustomProjects((prev) => [...prev, projectId])
  }, [])

  // Undo functionality
  const { addLocalTodo } = useTodoStore()
  const { showUndoToast, lastAction, undo, dismissToast } = useHistoryStore()

  const handleUndo = React.useCallback(() => {
    const action = undo()
    if (action && action.type === 'delete' && action.previousState) {
      // Restore the deleted todo
      addLocalTodo(action.previousState)
    }
  }, [undo, addLocalTodo])

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z = Undo
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      // Ctrl+N = New task
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        handleNewTask()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleNewTask])

  // Helper functions
  const getTodoDueDate = React.useCallback(
    (todo: (typeof allTodos)[0]) => {
      return todo.dueDate || getTodoMetadata(todo.id)?.dueDate || 'today'
    },
    [getTodoMetadata],
  )

  const getTodoProject = React.useCallback(
    (todo: (typeof allTodos)[0]) => {
      return todo.project || getTodoMetadata(todo.id)?.project || 'personal'
    },
    [getTodoMetadata],
  )

  const getTodoPriority = React.useCallback(
    (todo: (typeof allTodos)[0]) => {
      return todo.priority || getTodoMetadata(todo.id)?.priority || 'medium'
    },
    [getTodoMetadata],
  )

  // Calculate counts for sidebar
  const todayCount = React.useMemo(() => {
    return allTodos.filter((t) => !t.completed && getTodoDueDate(t) === 'today')
      .length
  }, [allTodos, getTodoDueDate])

  const tomorrowCount = React.useMemo(() => {
    return allTodos.filter(
      (t) => !t.completed && getTodoDueDate(t) === 'tomorrow',
    ).length
  }, [allTodos, getTodoDueDate])

  const overdueCount = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return allTodos.filter((t) => {
      if (t.completed) return false
      const dueDate = getTodoDueDate(t)
      if (dueDate === 'today' || dueDate === 'tomorrow') return false
      return dueDate < today
    }).length
  }, [allTodos, getTodoDueDate])

  // Filter todos
  const filteredTodos = React.useMemo(() => {
    let result = allTodos
    const today = new Date().toISOString().split('T')[0]

    // Filter by nav - 'all' shows everything (organized by sections in TodoList)
    if (navFilter === 'today') {
      result = result.filter(
        (t) => !t.completed && getTodoDueDate(t) === 'today',
      )
    } else if (navFilter === 'upcoming') {
      result = result.filter(
        (t) => !t.completed && getTodoDueDate(t) === 'tomorrow',
      )
    } else if (navFilter === 'overdue') {
      result = result.filter((t) => {
        if (t.completed) return false
        const dueDate = getTodoDueDate(t)
        if (dueDate === 'today' || dueDate === 'tomorrow') return false
        return dueDate < today
      })
    }
    // 'all' - no date filter, shows all tasks organized by sections

    // Filter by project
    if (projectFilter !== 'none') {
      result = result.filter((t) => getTodoProject(t) === projectFilter)
    }

    // Apply advanced filters
    if (advancedFilters.status !== 'all') {
      if (advancedFilters.status === 'pending') {
        result = result.filter((t) => !t.completed)
      } else if (advancedFilters.status === 'completed') {
        result = result.filter((t) => t.completed)
      }
    }

    if (advancedFilters.priority !== 'all') {
      result = result.filter(
        (t) => getTodoPriority(t) === advancedFilters.priority,
      )
    }

    if (advancedFilters.dateRange !== 'all') {
      result = result.filter(
        (t) => getTodoDueDate(t) === advancedFilters.dateRange,
      )
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((t) => t.todo.toLowerCase().includes(query))
    }

    return result
  }, [
    allTodos,
    navFilter,
    projectFilter,
    searchQuery,
    advancedFilters,
    getTodoDueDate,
    getTodoProject,
    getTodoPriority,
  ])

  return (
    <>
      <Head
        title="TaskDash - Quản lý công việc"
        description="Ứng dụng quản lý công việc hiện đại với cập nhật tức thời"
      />
      <DashboardLayout
        completedCount={completedCount}
        totalCount={totalCount}
        todayCount={todayCount}
        tomorrowCount={tomorrowCount}
        onNewTask={handleNewTask}
        navFilter={navFilter}
        onNavFilterChange={setNavFilter}
        projectFilter={projectFilter}
        onProjectFilterChange={setProjectFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddProject={handleAddProject}
        customProjects={customProjects}
        advancedFilters={advancedFilters}
        onAdvancedFiltersChange={setAdvancedFilters}
        overdueCount={overdueCount}
      >
        <GreetingHeader viewMode={viewMode} onViewModeChange={setViewMode} />

        <StatsCards
          todos={filteredTodos}
          todayCount={todayCount}
          overdueCount={overdueCount}
          tomorrowCount={tomorrowCount}
        />

        <AddTodoForm
          inputRef={inputRef}
          currentProject={projectFilter !== 'none' ? projectFilter : undefined}
        />

        <TodoList
          todos={filteredTodos}
          viewMode={viewMode}
          collapsedSections={collapsedSections}
          onToggleSection={toggleSection}
          projectFilter={projectFilter}
          isLoading={isLoading}
          isError={isError}
          error={error}
          refetch={refetch}
        />

        <div className="h-16"></div>
      </DashboardLayout>

      {/* Undo Toast */}
      <UndoToast
        show={showUndoToast}
        message={
          lastAction?.type === 'delete' ? 'Đã xóa công việc' : 'Đã cập nhật'
        }
        onUndo={handleUndo}
        onDismiss={dismissToast}
      />
    </>
  )
}

export default Home
