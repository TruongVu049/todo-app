import axios from "axios"
import { Todo } from "../types/todo"

const api = axios.create({
    baseURL: "https://dummyjson.com",
})

export const getTodos = async (): Promise<Todo[]> => {
    const res = await api.get("/todos")
    return res.data.todos
}

export const createTodo = async (text: string): Promise<Todo> => {
    const res = await api.post("/todos/add", {
        todo: text,
        completed: false,
        userId: 1,
    })
    return res.data
}

export const updateTodo = async (todo: Todo): Promise<Todo> => {
    const res = await api.put(`/todos/${todo.id}`, todo)
    return res.data
}

export const deleteTodo = async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`)
}
