import { motion } from 'framer-motion'
import { Plus, AlertCircle, LogOut } from 'lucide-react'
import { useState } from 'react'

import { Head } from '@/components/seo'
import { TodoList, TodoForm } from '@/components/todos'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SimpleConfirmationDialog } from '@/components/ui/dialog/simple-confirmation-dialog'
import { colors } from '@/config/colors'
import { useLogout } from '@/hooks/use-auth'
import { useTodos } from '@/hooks/use-todos'

const TodosPage = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const logout = useLogout()
  const {
    todos,
    isLoading,
    error,
    isFormOpen,
    editingTodo,
    isSubmitting,
    deletingId,
    loadTodos,
    handleCreateTodo,
    handleUpdateTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleEdit,
    handleCloseForm,
    openCreateForm,
    setDeletingTodoId,
  } = useTodos()

  return (
    <>
      <Head title="Todo List" description="Manage your todos" />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-4xl font-bold text-gray-900">
                  Danh sách công việc
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                  {todos.length}{' '}
                  {todos.length === 1 ? 'công việc' : 'công việc'} •{' '}
                  {todos.filter((t) => t.completed).length} đã hoàn thành
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-2"
              >
                <Button
                  onClick={() => setShowLogoutDialog(true)}
                  variant="outline"
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </Button>
                <Button
                  onClick={openCreateForm}
                  className="gap-2 text-white shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: colors.brand.primary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      colors.brand.primaryHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      colors.brand.primary)
                  }
                >
                  <Plus className="w-5 h-5" />
                  Thêm công việc
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">
                  Lỗi khi tải danh sách công việc
                </p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadTodos}
                  className="mt-2"
                >
                  Thử lại
                </Button>
              </div>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <TodoList
              todos={todos}
              isLoading={isLoading}
              onToggle={handleToggleTodo}
              onEdit={handleEdit}
              onDelete={setDeletingTodoId}
            />
          </motion.div>
        </div>

        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => !open && handleCloseForm()}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTodo ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
              </DialogTitle>
            </DialogHeader>
            <TodoForm
              todo={editingTodo}
              onSubmit={editingTodo ? handleUpdateTodo : handleCreateTodo}
              onCancel={handleCloseForm}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        <SimpleConfirmationDialog
          open={!!deletingId}
          onClose={() => setDeletingTodoId(null)}
          onConfirm={handleDeleteTodo}
          title="Xóa công việc"
          description="Bạn có chắc chắn muốn xóa công việc này không? Hành động này không thể hoàn tác."
          confirmText="Xóa"
          isDangerous
        />

        <SimpleConfirmationDialog
          open={showLogoutDialog}
          onClose={() => setShowLogoutDialog(false)}
          onConfirm={() => {
            setShowLogoutDialog(false)
            logout()
          }}
          title="Đăng xuất"
          description="Bạn có chắc chắn muốn đăng xuất không? Bạn cần đăng nhập lại để truy cập danh sách việc cần làm của mình.
"
          confirmText="Đăng xuất"
          isDangerous
        />
      </div>
    </>
  )
}

export default TodosPage
