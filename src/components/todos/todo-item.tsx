import { motion } from 'framer-motion'
import { Trash2, Edit } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Todo } from '@/types/api'
import { cn } from '@/utils/cn'

type TodoItemProps = {
  todo: Todo
  onToggle: (id: number, completed: boolean) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: number) => void
}

export const TodoItem = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
}: TodoItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group flex items-center justify-between gap-4 p-4 bg-white rounded-lg border transition-all',
        todo.completed
          ? 'bg-green-50 border-green-200'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm',
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Checkbox
          checked={todo.completed}
          onChange={(checked) => onToggle(todo.id, checked)}
          aria-label={
            todo.completed ? 'Mark as incomplete' : 'Mark as complete'
          }
        />
        <span
          className={cn(
            'text-base font-medium truncate transition-all duration-200',
            todo.completed ? 'line-through text-gray-500' : 'text-gray-800',
          )}
        >
          {todo.todo}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(todo)}
          className="px-3 hover:bg-gray-50"
        >
          <Edit className="w-4 h-4 text-gray-600" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(todo.id)}
          className="px-3 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    </motion.div>
  )
}
