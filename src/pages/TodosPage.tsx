import React, { useState, useMemo, useEffect, useCallback } from 'react'

import { Header } from '@/components/layout'
import {
  TodosList,
  TodosToolbar,
  TodosSelectionBar,
  TodosDialogs,
} from '@/components/todos'
import { Pagination } from '@/components/ui/pagination'
import {
  TodosSelectionProvider,
  useTodosSelection,
} from '@/contexts/select-todos-context'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTodos } from '@/hooks/useTodos'
import type { Todo } from '@/types/todos'
import { MOCK_TODOS } from '@/utils/constants'

export type FilterType = 'all' | 'completed' | 'active'

const TodoPageContent: React.FC = () => {
  const [storedTodos, setStoredTodos] = useLocalStorage('todos', MOCK_TODOS)
  const {
    todos: allTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    deleteSelected,
    markSelectedAsCompleted,
    loadMockData,
  } = useTodos(storedTodos)

  const { selectedIds, clearSelection, hasSelection, selectedCount } =
    useTodosSelection()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [showDeleteSelectedDialog, setShowDeleteSelectedDialog] =
    useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<FilterType>('all')
  const itemsPerPage = 10

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'completed':
        return allTodos.filter((todo) => todo.completed)
      case 'active':
        return allTodos.filter((todo) => !todo.completed)
      default:
        return allTodos
    }
  }, [allTodos, filter])

  const { paginatedTodos, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return {
      paginatedTodos: filteredTodos.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredTodos.length / itemsPerPage),
    }
  }, [filteredTodos, currentPage])

  const todoStats = useMemo(
    () => ({
      total: allTodos.length,
      completed: allTodos.filter((t) => t.completed).length,
      active: allTodos.filter((t) => !t.completed).length,
    }),
    [allTodos],
  )

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  useEffect(() => {
    setStoredTodos(allTodos)
  }, [allTodos, setStoredTodos])

  const handleOpenAddForm = useCallback(() => {
    setEditingTodo(null)
    setIsFormOpen(true)
  }, [])

  const handleOpenEditForm = useCallback((todo: Todo) => {
    setEditingTodo(todo)
    setIsFormOpen(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false)
    setEditingTodo(null)
  }, [])

  const handleSubmitForm = useCallback(
    (text: string) => {
      if (editingTodo) {
        updateTodo(editingTodo.id, text)
      } else {
        addTodo(text)
      }
      handleCloseForm()
    },
    [editingTodo, addTodo, updateTodo, handleCloseForm],
  )

  const handleOpenDeleteDialog = useCallback((id: number) => {
    setDeletingId(id)
  }, [])

  const handleCancelDelete = useCallback(() => {
    setDeletingId(null)
  }, [])

  const handleConfirmDelete = useCallback(() => {
    if (deletingId !== null) {
      deleteTodo(deletingId)
      setDeletingId(null)
    }
  }, [deletingId, deleteTodo])

  const handleOpenDeleteSelectedDialog = useCallback(() => {
    setShowDeleteSelectedDialog(true)
  }, [])

  const handleCancelDeleteSelected = useCallback(() => {
    setShowDeleteSelectedDialog(false)
  }, [])

  const handleConfirmDeleteSelected = useCallback(() => {
    deleteSelected(Array.from(selectedIds))
    setShowDeleteSelectedDialog(false)
    clearSelection()
  }, [selectedIds, deleteSelected, clearSelection])

  const handleMarkSelectedAsCompleted = useCallback(() => {
    markSelectedAsCompleted(Array.from(selectedIds))
    clearSelection()
  }, [selectedIds, markSelectedAsCompleted, clearSelection])

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }, [])

  const handleLoadMockData = useCallback(() => {
    loadMockData(MOCK_TODOS)
  }, [loadMockData])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-green-50">
      <Header />

      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 space-y-4">
            <TodosToolbar
              filter={filter}
              onFilterChange={handleFilterChange}
              totalCount={todoStats.total}
              completedCount={todoStats.completed}
              activeCount={todoStats.active}
              onAddTodo={handleOpenAddForm}
              onLoadMockData={handleLoadMockData}
              showLoadMockButton={allTodos.length === 0}
            />

            {hasSelection && (
              <TodosSelectionBar
                selectedCount={selectedCount}
                onMarkCompleted={handleMarkSelectedAsCompleted}
                onDelete={handleOpenDeleteSelectedDialog}
              />
            )}
          </div>

          <div className="min-h-[400px] bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <TodosList
              todos={paginatedTodos}
              onDeleteTodo={handleOpenDeleteDialog}
              onToggleTodo={toggleTodo}
              onEditTodo={handleOpenEditForm}
            />
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        </div>
      </div>

      <TodosDialogs
        isFormOpen={isFormOpen}
        onFormClose={handleCloseForm}
        editingTodo={editingTodo}
        onSubmitForm={handleSubmitForm}
        deletingId={deletingId}
        onCancelDelete={handleCancelDelete}
        onConfirmDelete={handleConfirmDelete}
        showDeleteSelectedDialog={showDeleteSelectedDialog}
        selectedCount={selectedCount}
        onCancelDeleteSelected={handleCancelDeleteSelected}
        onConfirmDeleteSelected={handleConfirmDeleteSelected}
      />
    </div>
  )
}

export const TodoPage: React.FC = () => {
  return (
    <TodosSelectionProvider>
      <TodoPageContent />
    </TodosSelectionProvider>
  )
}
