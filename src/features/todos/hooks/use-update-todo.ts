import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateTodo } from '../api'
import type { TodosResponse, UpdateTodoRequest } from '../types'

import { todosQueryKey } from './use-todos'

interface UpdateTodoVariables {
  id: number
  data: UpdateTodoRequest
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateTodoVariables) => updateTodo(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: todosQueryKey })

      // Snapshot previous value
      const previousTodos =
        queryClient.getQueryData<TodosResponse>(todosQueryKey)

      // Optimistically update
      queryClient.setQueryData<TodosResponse>(todosQueryKey, (old) => {
        if (!old) return old
        return {
          ...old,
          todos: old.todos.map((todo) =>
            todo.id === id ? { ...todo, ...data } : todo,
          ),
        }
      })

      return { previousTodos }
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousTodos) {
        queryClient.setQueryData(todosQueryKey, context.previousTodos)
      }
    },
  })
}
