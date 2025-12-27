import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { useDisclosure } from '@/hooks/use-disclosure'

import { EmptyState } from './components/empty-state'
import { TodoForm } from './components/todo-form'
import { TodoList } from './components/todo-list'
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from './hooks'

export const TodoContainer = () => {
  const { data: todos, isLoading, isError, refetch } = useTodos()
  const createTodo = useCreateTodo()
  const updateTodo = useUpdateTodo()
  const deleteTodo = useDeleteTodo()

  const {
    isOpen: isCreateOpen,
    open: openCreate,
    close: closeCreate,
  } = useDisclosure()

  const handleCreate = async (values: any) => {
    try {
      await createTodo.mutateAsync(values)
      closeCreate()
    } catch (err) {
      // error handled by createTodo.onError
    }
  }

  const handleDelete = async (id: number) => {
    await deleteTodo.mutateAsync(id)
  }

  const handleUpdate = async (id: number, data: any) => {
    await updateTodo.mutateAsync({ id, input: data })
  }

  const handleToggle = async (id: number, completed: boolean) => {
    await updateTodo.mutateAsync({ id, input: { completed } })
  }

  return (
    <div className="mx-auto max-w-3xl py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Todo List</h2>

        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => (open ? openCreate() : closeCreate())}
        >
          <DialogTrigger asChild>
            <Button onClick={openCreate}>New</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New todo</DialogTitle>
            </DialogHeader>
            <TodoForm onCancel={() => closeCreate()} onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p>Unable to load todos</p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {todos && todos.length === 0 && <EmptyState message="No todos yet" />}

      {todos && todos.length > 0 && (
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
