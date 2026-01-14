import React, { memo } from 'react'

import { TodosForm } from '@/components/todos/TodosForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SimpleConfirmationDialog } from '@/components/ui/dialog/simple-confirmation-dialog'
import type { Todo } from '@/types/todos'

type TodosDialogsProps = {
  isFormOpen: boolean
  onFormClose: () => void
  editingTodo: Todo | null
  onSubmitForm: (text: string) => void

  deletingId: number | null
  onCancelDelete: () => void
  onConfirmDelete: () => void

  showDeleteSelectedDialog: boolean
  selectedCount: number
  onCancelDeleteSelected: () => void
  onConfirmDeleteSelected: () => void
}

export const TodosDialogs: React.FC<TodosDialogsProps> = memo(
  function TodosDialogs({
    isFormOpen,
    onFormClose,
    editingTodo,
    onSubmitForm,
    deletingId,
    onCancelDelete,
    onConfirmDelete,
    showDeleteSelectedDialog,
    selectedCount,
    onCancelDeleteSelected,
    onConfirmDeleteSelected,
  }) {
    return (
      <>
        <Dialog open={isFormOpen} onOpenChange={onFormClose}>
          <DialogContent className="bg-white rounded-xl shadow-2xl border border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {editingTodo ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
              </DialogTitle>
            </DialogHeader>
            <TodosForm
              onAddTodo={onSubmitForm}
              initialValue={editingTodo?.text}
            />
          </DialogContent>
        </Dialog>

        <SimpleConfirmationDialog
          open={deletingId !== null}
          onClose={onCancelDelete}
          onConfirm={onConfirmDelete}
          title="Xóa công việc"
          description="Bạn có chắc chắn muốn xóa công việc này không? Hành động này không thể hoàn tác."
          confirmText="Xóa"
          isDangerous
        />

        <SimpleConfirmationDialog
          open={showDeleteSelectedDialog}
          onClose={onCancelDeleteSelected}
          onConfirm={onConfirmDeleteSelected}
          title="Xóa công việc đã chọn"
          description={`Bạn có chắc chắn muốn xóa ${selectedCount} công việc đã chọn không? Hành động này không thể hoàn tác.`}
          confirmText="Xóa đã chọn"
          isDangerous
        />
      </>
    )
  },
)
