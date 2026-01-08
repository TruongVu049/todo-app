import React, { useState, useRef, useEffect, useMemo } from 'react'

import { DashboardLayout } from '@/components/layout'
import { Head } from '@/components/seo'
import type { ViewMode } from '@/types/common'
import { cn } from '@/utils/cn'

import { CalendarView } from './components/calendar-view'
import { DeleteConfirmModal } from './components/delete-confirm-modal'
import { GreetingHeader } from './components/greeting-header'
import { StatsCards } from './components/stats-cards'
import { TodoItem } from './components/todo-item'
import { Todo } from './types'

const MOCK_TODOS: Todo[] = [
  {
    id: '1',
    text: 'Học React cơ bản',
    completed: false,
    createdAt: Date.now() - 1000000,
    dueDate: 'today',
    priority: 'high',
    project: 'work',
  },
  {
    id: '2',
    text: 'Tìm hiểu về TypeScript',
    completed: true,
    createdAt: Date.now() - 500000,
    dueDate: 'today',
    priority: 'medium',
    project: 'personal',
  },
  {
    id: '3',
    text: 'Xây dựng Todo App',
    completed: false,
    createdAt: Date.now(),
    dueDate: 'tomorrow',
    priority: 'low',
    project: 'shopping',
  },
]

export const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(MOCK_TODOS)
  const [inputText, setInputText] = useState('')
  const [inputDate, setInputDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [navFilter, setNavFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Helper to get local date string YYYY-MM-DD
  const getLocalDateStr = (d: Date = new Date()) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleAdd = () => {
    const trimmed = inputText.trim()
    if (trimmed.length < 3) {
      alert('Nội dung phải có ít nhất 3 ký tự')
      return
    }

    const todayStr = getLocalDateStr()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = getLocalDateStr(tomorrow)

    let dueDate = inputDate
    if (inputDate === todayStr) dueDate = 'today'
    else if (inputDate === tomorrowStr) dueDate = 'tomorrow'

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
      dueDate,
      project: 'personal',
      priority: 'medium',
    }

    setTodos([newTodo, ...todos])
    setInputText('')
    inputRef.current?.focus()
  }

  const handleUpdate = (id: string, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, text: newText, updatedAt: Date.now() }
          : todo,
      ),
    )
  }

  const handleToggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const handleDeleteClick = (id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (todo) {
      setTodoToDelete(todo)
      setIsDeleteModalOpen(true)
    }
  }

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      setTodos(todos.filter((todo) => todo.id !== todoToDelete.id))
      setTodoToDelete(null)
    }
  }

  // Calculate counts for StatsCards and DashboardLayout
  const todayCount = useMemo(() => {
    const today = getLocalDateStr()
    return todos.filter(
      (t) => !t.completed && (t.dueDate === 'today' || t.dueDate === today),
    ).length
  }, [todos])

  const tomorrowCount = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = getLocalDateStr(tomorrow)
    return todos.filter(
      (t) =>
        !t.completed && (t.dueDate === 'tomorrow' || t.dueDate === tomorrowStr),
    ).length
  }, [todos])

  const overdueCount = useMemo(() => {
    const today = getLocalDateStr()
    return todos.filter((t) => {
      if (t.completed || !t.dueDate) return false
      if (t.dueDate === 'today' || t.dueDate === 'tomorrow') return false
      return t.dueDate < today
    }).length
  }, [todos])

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  )
  const totalCount = todos.length

  // Filtering logic
  const filteredTodos = useMemo(() => {
    const today = getLocalDateStr()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = getLocalDateStr(tomorrow)

    if (navFilter === 'today') {
      return todos.filter((t) => t.dueDate === 'today' || t.dueDate === today)
    }
    if (navFilter === 'upcoming') {
      return todos.filter(
        (t) =>
          t.dueDate === 'tomorrow' ||
          t.dueDate === tomorrowStr ||
          (t.dueDate &&
            t.dueDate !== 'today' &&
            t.dueDate !== 'tomorrow' &&
            t.dueDate > today), // Include everything in future
      )
    }
    if (navFilter === 'overdue') {
      return todos.filter((t) => {
        if (!t.dueDate || t.dueDate === 'today' || t.dueDate === 'tomorrow')
          return false
        return t.dueDate < today
      })
    }
    return todos
  }, [todos, navFilter])

  console.log('RENDER')

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
        onNavFilterChange={(f) => setNavFilter(f)}
      >
        <GreetingHeader
          viewMode={viewMode}
          onViewModeChange={(mode) => setViewMode(mode)}
        />

        <StatsCards
          todos={todos as any}
          todayCount={todayCount}
          overdueCount={overdueCount}
          tomorrowCount={tomorrowCount}
        />

        <div className="bg-white dark:bg-[#1e2736] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Nhập nội dung công việc..."
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <input
                type="date"
                className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 dark:text-white text-sm"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
              />
            </div>
            <button
              onClick={handleAdd}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Todo View */}
        {viewMode === 'calendar' ? (
          <CalendarView todos={todos} onToggleComplete={handleToggleComplete} />
        ) : (
          <div
            className={cn(
              'space-y-3',
              viewMode === 'board' &&
                'space-y-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
            )}
          >
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-[#1e2736] rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-500">No todos</p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  viewMode={viewMode}
                  onUpdate={handleUpdate}
                  onDelete={handleDeleteClick}
                  onToggleComplete={handleToggleComplete}
                />
              ))
            )}
          </div>
        )}
      </DashboardLayout>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        todoText={todoToDelete?.text || ''}
      />
    </>
  )
}

export default TodoPage
