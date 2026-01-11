import React, { useEffect, useState, useMemo } from 'react'

import { TodosList, TodosForm } from '@/components/todos'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SimpleConfirmationDialog } from '@/components/ui/dialog/simple-confirmation-dialog'
import { Pagination } from '@/components/ui/pagination'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useTodos } from '@/hooks/useTodos'
import type { Todo } from '@/types/todos'
import { MOCK_TODOS } from '@/utils/constants'

export const TodoPage: React.FC = () => {
  const [storedTodos, setStoredTodos] = useLocalStorage('todos', MOCK_TODOS)
  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    deleteAll,
    loadMockData,
  } = useTodos(storedTodos)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { paginatedTodos, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return {
      paginatedTodos: todos.slice(startIndex, endIndex),
      totalPages: Math.ceil(todos.length / itemsPerPage),
    }
  }, [todos, currentPage])

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

  const handleDeleteAllConfirm = () => {
    deleteAll()
    setShowDeleteAllDialog(false)
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setIsFormOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Todo Management
          </h1>
          <p className="text-gray-600 text-lg">Quản lý công việc của bạn</p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Tổng: <span className="font-bold">{todos.length}</span> công việc
            {' • '}
            <span className="font-bold text-green-600">
              {todos.filter((t) => t.completed).length}
            </span>{' '}
            đã hoàn thành
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-800 text-white shadow-sm hover:shadow-md transition-all duration-200 font-semibold"
            >
              + Thêm công việc
            </Button>
            {todos.length === 0 && (
              <Button
                onClick={() => loadMockData(MOCK_TODOS)}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-200"
              >
                Tải dữ liệu mẫu
              </Button>
            )}
            {todos.length > 0 && (
              <Button
                onClick={() => setShowDeleteAllDialog(true)}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
              >
                Xóa tất cả
              </Button>
            )}
          </div>
        </div>

        <div className="min-h-[800px]">
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-white rounded-xl shadow-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
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
        open={showDeleteAllDialog}
        onClose={() => setShowDeleteAllDialog(false)}
        onConfirm={handleDeleteAllConfirm}
        title="Xóa tất cả công việc"
        description="Bạn có chắc chắn muốn xóa tất cả công việc không? Hành động này không thể hoàn tác."
        confirmText="Xóa tất cả"
        isDangerous
      />
    </div>
  )
}
