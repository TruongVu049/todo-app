export type Todo = {
    id: number
    todo: string
    completed: boolean
    userId: number
}

export type TodosResponse = {
    todos: Todo[]
    total: number
    skip: number
    limit: number
}

export type CreateTodoInput = {
    todo: string
    completed: boolean
    userId: number
}

export type UpdateTodoInput = {
    todo?: string
    completed?: boolean
}
