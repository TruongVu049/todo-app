export interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export type CreateTodoInput = Pick<Todo, 'todo' | 'completed' | 'userId'>
export type UpdateTodoInput = Partial<
  Pick<Todo, 'todo' | 'completed' | 'userId'>
>
