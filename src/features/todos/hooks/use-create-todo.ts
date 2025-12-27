import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'

import { createTodo } from '../api'
import type { Todo, TodosResponse } from '../types'

import { todosQueryKey } from './use-todos'

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodoData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todosQueryKey })

      // Snapshot previous value
      const previousTodos =
        queryClient.getQueryData<TodosResponse>(todosQueryKey)

      // Optimistically add new todo with temporary ID
      const tempTodo: Todo = {
        id: parseInt(nanoid().replace(/\D/g, '').slice(0, 8) || '999999'),
        todo: newTodoData.todo,
        completed: newTodoData.completed,
        userId: newTodoData.userId,
      }

      queryClient.setQueryData<TodosResponse>(todosQueryKey, (old) => {
        if (!old) return { todos: [tempTodo], total: 1, skip: 0, limit: 30 }
        return {
          ...old,
          todos: [tempTodo, ...old.todos],
          total: old.total + 1,
        }
      })

      return { previousTodos, tempTodo }
    },
    onError: (_err, _newTodo, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(todosQueryKey, context.previousTodos)
      }
    },
    onSuccess: (data, _variables, context) => {
      // Replace temp todo with real one from server
      queryClient.setQueryData<TodosResponse>(todosQueryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          todos: old.todos.map((todo) =>
            todo.id === context?.tempTodo.id ? { ...data, id: data.id } : todo,
          ),
        }
      })
    },
  })
}
