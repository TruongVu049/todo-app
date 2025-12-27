import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteTodo } from '../api'
import type { TodosResponse } from '../types'

import { todosQueryKey } from './use-todos'

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (todoId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todosQueryKey })

      // Snapshot previous value
      const previousTodos =
        queryClient.getQueryData<TodosResponse>(todosQueryKey)

      // Optimistically remove
      queryClient.setQueryData<TodosResponse>(todosQueryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          todos: old.todos.filter((todo) => todo.id !== todoId),
          total: old.total - 1,
        }
      })

      return { previousTodos }
    },
    onError: (_err, _todoId, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(todosQueryKey, context.previousTodos)
      }
    },
  })
}
