// src/api/todo.api.ts

const BASE_URL = 'https://dummyjson.com/todos'

// GET todos
export const getTodos = async () => {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

// ADD todo
export const addTodo = async (title: string) => {
  const res = await fetch(`${BASE_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      todo: title,
      completed: false,
      userId: 1,
    }),
  })

  if (!res.ok) throw new Error('Failed to add todo')
  return res.json()
}

// UPDATE todo
export const updateTodo = async ({
  id,
  completed,
}: {
  id: number
  completed: boolean
}) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  })

  if (!res.ok) throw new Error('Failed to update todo')
  return res.json()
}

// DELETE todo
export const deleteTodo = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) throw new Error('Failed to delete todo')
  return res.json()
}
