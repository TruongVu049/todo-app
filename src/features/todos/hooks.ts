import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@/components/ui/toast'

import * as api from './api'
import type { CreateTodoInput, UpdateTodoInput, Todo } from './types'

export const TODOS_QUERY_KEY = ['todos'] as const

export const useTodos = () => {
  return useQuery({ queryKey: TODOS_QUERY_KEY, queryFn: api.getTodos })
}

export const useCreateTodo = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTodoInput) => api.createTodo(input),
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: TODOS_QUERY_KEY })
      const previous = qc.getQueryData<Todo[]>(TODOS_QUERY_KEY)
      const temp = { id: Date.now(), ...input } as Todo
      qc.setQueryData<Todo[] | undefined>(TODOS_QUERY_KEY, (old) => [
        temp,
        ...(old ?? []),
      ])
      return { previous }
    },
    onError: (_err, _variables, context: any) => {
      qc.setQueryData(TODOS_QUERY_KEY, context.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
  })
}

export const useUpdateTodo = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTodoInput }) =>
      api.updateTodo(id, input),
    onMutate: async ({ id, input }) => {
      await qc.cancelQueries({ queryKey: TODOS_QUERY_KEY })
      const previous = qc.getQueryData<Todo[]>(TODOS_QUERY_KEY)
      qc.setQueryData<Todo[] | undefined>(TODOS_QUERY_KEY, (old) =>
        old ? old.map((t) => (t.id === id ? { ...t, ...input } : t)) : old,
      )
      return { previous }
    },
    onError: (_err, _variables, context: any) => {
      qc.setQueryData(TODOS_QUERY_KEY, context.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
  })
}

export const useDeleteTodo = () => {
  const qc = useQueryClient()
  const { error } = useToast()

  return useMutation({
    mutationFn: (id: number) => api.deleteTodo(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: TODOS_QUERY_KEY })
      const previous = qc.getQueryData<Todo[]>(TODOS_QUERY_KEY)
      qc.setQueryData<Todo[] | undefined>(TODOS_QUERY_KEY, (old) =>
        old ? old.filter((t) => t.id !== id) : old,
      )
      return { previous }
    },
    onError: (_err, _variables, context: any) => {
      qc.setQueryData(TODOS_QUERY_KEY, context.previous)
      error({
        title: 'Xóa thất bại',
        description: 'Không thể xóa todo — dữ liệu đã được hoàn tác.',
      })
    },
    onSettled: () => qc.invalidateQueries({ queryKey: TODOS_QUERY_KEY }),
  })
}
