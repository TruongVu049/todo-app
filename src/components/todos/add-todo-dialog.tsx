import { useState } from 'react'
import { useTodoStore } from '@/stores/todos'
import {
  Dialog,
  DialogTrigger,
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
import { Plus } from 'lucide-react'

interface AddTodoDialogProps {
  onSuccess?: () => void
}

export function AddTodoDialog({ onSuccess }: AddTodoDialogProps) {
  const [open, setOpen] = useState(false)
  const [todoText, setTodoText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const addTodo = useTodoStore((state) => state.addTodo)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!todoText.trim()) {
      setError('Vui lòng nhập công việc')
      return
    }

    setLoading(true)
    try {
      await addTodo({
        todo: todoText.trim(),
        completed: false,
        userId: 1,
      })
      setTodoText('')
      setError('')
      setOpen(false)
      // Don't refresh - just let the optimistic update work
      // onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Lỗi thêm công việc'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Thêm
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm Công Việc Mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FormLabel htmlFor="todo">Công Việc</FormLabel>
            <FormInput
              id="todo"
              type="text"
              placeholder="Bạn muốn làm gì?"
              value={todoText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTodoText(e.target.value)
                if (error) setError('')
              }}
              disabled={loading}
            />
            {error && <FormError message={error} />}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang thêm...' : 'Thêm Công Việc'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

