import { useState } from 'react'
import { useTodoStore } from '@/stores/todos'
import { Todo } from '@/types/api'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { TrashIcon, PencilIcon } from 'lucide-react'
import { ConfirmDeleteDialog } from './confirm-delete-dialog'
import { EditTodoDialog } from './edit-todo-dialog'

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const deleteTodo = useTodoStore((state) => state.deleteTodo)
  const toggleSelect = useTodoStore((state) => state.toggleSelect)

  const handleToggle = async () => {
    if (isToggling) return
    
    setIsToggling(true)
    try {
      await toggleTodo(todo.id)
    } catch (error) {
      console.error('Toggle error:', error)
    } finally {
      setIsToggling(false)
    }
  }

  const handleDelete = async () => {
    if (isDeleting) return
    
    setIsDeleting(true)
    try {
      await deleteTodo(todo.id)
      setDeleteConfirmOpen(false)
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className={`flex items-center gap-4 p-2 rounded-lg transition-colors ${
        todo.selected ? 'bg-blue-50' : ''
      }`}>
        {/* Checkbox for multi-select */}
        <input
          type="checkbox"
          checked={todo.selected || false}
          onChange={() => toggleSelect(todo.id)}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />

        <Switch
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={isToggling}
        />

        <span
          className={`flex-1 text-lg ${
            todo.completed
              ? 'line-through text-gray-400'
              : 'text-gray-900'
          }`}
        >
          {todo.todo}
        </span>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditDialogOpen(true)}
            disabled={isDeleting}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Chỉnh sửa"
          >
            <PencilIcon className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteConfirmOpen(true)}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Xóa"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <EditTodoDialog
        todo={todo}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <ConfirmDeleteDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </>
  )
}
