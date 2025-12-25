import { useState, useEffect } from 'react'
import { useTodoStore } from '@/stores/todos'
import { Todo } from '@/types/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  FormLabel,
  FormInput,
  FormError,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

interface EditTodoDialogProps {
  todo: Todo
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditTodoDialog({ todo, open, onOpenChange }: EditTodoDialogProps) {
  const [todoText, setTodoText] = useState(todo.todo)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const updateTodo = useTodoStore((state) => state.updateTodo)

  // Update text when todo changes
  useEffect(() => {
    setTodoText(todo.todo)
  }, [todo.todo])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!todoText.trim()) {
      setError('Vui lòng nhập công việc')
      return
    }

    if (todoText.trim() === todo.todo) {
      // No changes
      onOpenChange(false)
      return
    }

    setLoading(true)
    try {
      await updateTodo(todo.id, {
        todo: todoText.trim(),
      })
      setError('')
      onOpenChange(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi cập nhật công việc'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Công Việc</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FormLabel htmlFor="edit-todo">Công Việc</FormLabel>
            <FormInput
              id="edit-todo"
              type="text"
              placeholder="Bạn muốn làm gì?"
              value={todoText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTodoText(e.target.value)
                if (error) setError('')
              }}
              disabled={loading}
              autoFocus
            />
            {error && <FormError message={error} />}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
