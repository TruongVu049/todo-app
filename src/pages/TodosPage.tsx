import React, { useEffect, useState, useMemo } from 'react'

import { Header } from '@/components/layout'
import { TodosList, TodosForm, TodosTab } from '@/components/todos'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SimpleConfirmationDialog } from '@/components/ui/dialog/simple-confirmation-dialog'
import { Pagination } from '@/components/ui/pagination'
import {
  TodosSelectionProvider,
  useTodosSelection,
} from '@/contexts/select-todos-context'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTodos } from '@/hooks/useTodos'
import type { Todo } from '@/types/todos'
import { MOCK_TODOS } from '@/utils/constants'

const TodoPageContent: React.FC = () => {
  const [storedTodos, setStoredTodos] = useLocalStorage('todos', MOCK_TODOS)
  const {
    todos,
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
  const [filter, setFilter] = useState<'all' | 'completed' | 'active'>('all')
  const itemsPerPage = 10

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'completed':
        return todos.filter((todo) => todo.completed)
      case 'active':
        return todos.filter((todo) => !todo.completed)
      default:
        return todos
    }
  }, [todos, filter])

  const { paginatedTodos, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return {
      paginatedTodos: filteredTodos.slice(startIndex, endIndex),
      totalPages: Math.ceil(filteredTodos.length / itemsPerPage),
    }
  }, [filteredTodos, currentPage])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  useEffect(() => {
    setStoredTodos(todos)
  }, [todos, setStoredTodos])

  const handleAddTodo = (text: string) => {
    addTodo(text)
    setIsFormOpen(false)
  }

  const handleUpdateTodo = (id: number, text: string) => {
    updateTodo(id, text)
    setEditingTodo(null)
    setIsFormOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (deletingId !== null) {
      deleteTodo(deletingId)
      setDeletingId(null)
    }
  }

  const handleDeleteSelectedConfirm = () => {
    deleteSelected(Array.from(selectedIds))
    setShowDeleteSelectedDialog(false)
    clearSelection()
  }

  const handleMarkSelectedAsCompleted = () => {
    markSelectedAsCompleted(Array.from(selectedIds))
    clearSelection()
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-green-50">
      <Header />

      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 space-y-4">
            {/* Main Toolbar */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block w-1 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                  <TodosTab
                    filter={filter}
                    onFilterChange={(newFilter) => {
                      setFilter(newFilter)
                      setCurrentPage(1)
                    }}
                    totalCount={todos.length}
                    completedCount={todos.filter((t) => t.completed).length}
                    activeCount={todos.filter((t) => !t.completed).length}
                  />
                </div>

                <div className="flex gap-2">
                  {todos.length === 0 && (
                    <Button
                      onClick={() => loadMockData(MOCK_TODOS)}
                      variant="outline"
                      className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all"
                    >
                      Tải dữ liệu mẫu
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-sm hover:shadow-md transition-all"
                  >
                    + Thêm công việc
                  </Button>
                </div>
              </div>
            </div>

            {/* Selection Actions Bar */}
            {hasSelection && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm animate-in slide-in-from-top duration-300">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-blue-800 font-semibold">
                      Đã chọn {selectedCount} công việc
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleMarkSelectedAsCompleted}
                      variant="outline"
                      className="border-blue-400 text-blue-700 hover:bg-blue-100 bg-white shadow-sm hover:shadow transition-all font-medium"
                    >
                      ✓ Hoàn thành
                    </Button>
                    <Button
                      onClick={() => setShowDeleteSelectedDialog(true)}
                      variant="outline"
                      className="border-red-400 text-red-700 hover:bg-red-100 bg-white shadow-sm hover:shadow transition-all font-medium"
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Todos List Container */}
          <div className="min-h-[400px] bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <TodosList
              todos={paginatedTodos}
              onDeleteTodo={setDeletingId}
              onToggleTodo={toggleTodo}
              onEditTodo={handleEdit}
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-white rounded-xl shadow-2xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingTodo ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
            </DialogTitle>
          </DialogHeader>
          <TodosForm
            onAddTodo={
              editingTodo
                ? (text) => handleUpdateTodo(editingTodo.id, text)
                : handleAddTodo
            }
            initialValue={editingTodo?.text}
          />
        </DialogContent>
      </Dialog>

      <SimpleConfirmationDialog
        open={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title="Xóa công việc"
        description="Bạn có chắc chắn muốn xóa công việc này không? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        isDangerous
      />

      <SimpleConfirmationDialog
        open={showDeleteSelectedDialog}
        onClose={() => setShowDeleteSelectedDialog(false)}
        onConfirm={handleDeleteSelectedConfirm}
        title="Xóa công việc đã chọn"
        description={`Bạn có chắc chắn muốn xóa ${selectedCount} công việc đã chọn không? Hành động này không thể hoàn tác.`}
        confirmText="Xóa đã chọn"
        isDangerous
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
