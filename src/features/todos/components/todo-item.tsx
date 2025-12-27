import { Edit, Trash } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ConfirmationDialog } from '@/components/ui/dialog/confirmation-dialog/confirmation-dialog'

import type { Todo } from '../types'

import { TodoForm } from './todo-form'

type Props = {
  todo: Todo
  onToggle: (id: number, completed: boolean) => void
  onUpdate: (id: number, data: Partial<Todo>) => void
  onDelete: (id: number) => void
}

export const TodoItem = ({ todo, onToggle, onUpdate, onDelete }: Props) => {
  const [isEditOpen, setEditOpen] = React.useState(false)

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border p-3">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, !todo.completed)}
          className="size-5"
          aria-label={`Toggle ${todo.todo}`}
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{todo.todo}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
              <Edit className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit todo</DialogTitle>
            </DialogHeader>

            <TodoForm
              initial={todo}
              onCancel={() => setEditOpen(false)}
              onSubmit={async (values) => {
                await onUpdate(todo.id, values)
                setEditOpen(false)
              }}
            />
          </DialogContent>
        </Dialog>

        <ConfirmationDialog
          triggerButton={
            <Button variant="ghost" size="sm">
              <Trash className="size-4" />
            </Button>
          }
          confirmButton={
            <Button variant="destructive" onClick={() => onDelete(todo.id)}>
              Delete
            </Button>
          }
          title={`Delete todo`}
          body={`Are you sure you want to delete "${todo.todo}"?`}
        />
      </div>
    </div>
  )
}
