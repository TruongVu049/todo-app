import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Todo, TodosResponse, CreateTodoInput, UpdateTodoInput } from '@/types/todo'

const API_BASE = 'https://dummyjson.com'
const TODOS_KEY = ['todos']

const api = {
    getTodos: async (): Promise<TodosResponse> => {
        const res = await fetch(`${API_BASE}/todos?limit=20`)
        if (!res.ok) throw new Error('Failed to fetch todos')
        return res.json()
    },

    createTodo: async (input: CreateTodoInput): Promise<Todo> => {
        const res = await fetch(`${API_BASE}/todos/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        })
        if (!res.ok) throw new Error('Failed to create todo')
        return res.json()
    },

    updateTodo: async (id: number, input: UpdateTodoInput): Promise<Todo> => {
        const res = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        })
        if (!res.ok) throw new Error('Failed to update todo')
        return res.json()
    },

    deleteTodo: async (id: number): Promise<Todo> => {
        const res = await fetch(`${API_BASE}/todos/${id}`, {
            method: 'DELETE',
        })
        if (!res.ok) throw new Error('Failed to delete todo')
        return res.json()
    },
}

export const useTodos = () => {
    const queryClient = useQueryClient()

    const todosQuery = useQuery({
        queryKey: TODOS_KEY,
        queryFn: api.getTodos,
    })

    const createMutation = useMutation({
        mutationFn: api.createTodo,
        onMutate: async (newTodo) => {
            await queryClient.cancelQueries({ queryKey: TODOS_KEY })
            const previous = queryClient.getQueryData<TodosResponse>(TODOS_KEY)

            queryClient.setQueryData<TodosResponse>(TODOS_KEY, (old) => {
                if (!old) return old
                const optimisticTodo: Todo = {
                    id: Date.now(),
                    ...newTodo,
                }
                return { ...old, todos: [optimisticTodo, ...old.todos] }
            })
            return { previous }
        },
        onError: (_, __, context) => {
            if (context?.previous) {
                queryClient.setQueryData(TODOS_KEY, context.previous)
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTodoInput }) =>
            api.updateTodo(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: TODOS_KEY })
            const previous = queryClient.getQueryData<TodosResponse>(TODOS_KEY)

            queryClient.setQueryData<TodosResponse>(TODOS_KEY, (old) => {
                if (!old) return old
                return {
                    ...old,
                    todos: old.todos.map((t) => (t.id === id ? { ...t, ...data } : t)),
                }
            })
            return { previous }
        },
        onError: (_, __, context) => {
            if (context?.previous) {
                queryClient.setQueryData(TODOS_KEY, context.previous)
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
    })

    const deleteMutation = useMutation({
        mutationFn: api.deleteTodo,
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: TODOS_KEY })
            const previous = queryClient.getQueryData<TodosResponse>(TODOS_KEY)

            queryClient.setQueryData<TodosResponse>(TODOS_KEY, (old) => {
                if (!old) return old
                return { ...old, todos: old.todos.filter((t) => t.id !== id) }
            })
            return { previous }
        },
        onError: (_, __, context) => {
            if (context?.previous) {
                queryClient.setQueryData(TODOS_KEY, context.previous)
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: TODOS_KEY }),
    })

    return { todosQuery, createMutation, updateMutation, deleteMutation }
}
