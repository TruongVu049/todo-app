import { useQuery } from '@tanstack/react-query'

import { getTodos } from '../api'

export const todosQueryKey = ['todos'] as const

export function useTodos() {
  return useQuery({
    queryKey: todosQueryKey,
    queryFn: getTodos,
  })
}
