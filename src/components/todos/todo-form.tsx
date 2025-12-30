import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Todo } from '@/types/api'

type TodoFormProps = {
  todo?: Todo | null
  onSubmit: (data: { todo: string; completed: boolean }) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export const TodoForm = ({
  todo,
  onSubmit,
  onCancel,
  isSubmitting,
}: TodoFormProps) => {
  const [todoText, setTodoText] = useState('')
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (todo) {
      setTodoText(todo.todo)
      setCompleted(todo.completed)
    } else {
      setTodoText('')
      setCompleted(false)
    }
  }, [todo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (todoText.trim()) {
      onSubmit({ todo: todoText.trim(), completed })
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6 p-1"
    >
      <Input
        label="Mô tả công việc"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
        placeholder="What do you need to do?"
        required
        disabled={isSubmitting}
      />

      {todo && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            disabled={isSubmitting}
            className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer"
          />
          <label
            htmlFor="completed"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Đánh dấu là đã hoàn thành
          </label>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !todoText.trim()}
          className="text-white px-6 shadow-lg hover:shadow-xl transition-all duration-200 bg-brand-primary hover:bg-brand-primary-hover"
        >
          {isSubmitting
            ? 'Đang lưu...'
            : todo
              ? 'Cập nhật công việc'
              : 'Tạo công việc mới'}
        </Button>
      </div>
    </motion.form>
  )
}
