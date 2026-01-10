import { useState } from 'react';
import { nanoid } from 'nanoid';
import { TodoLocal } from '@/types/todo';
import { TodoForm, TodoList } from '@/components/todo-challenge';
import { Head } from '@/components/seo';
import { initialTodos } from './mock-data';

const TodoChallengePage = () => {
  const [todos, setTodos] = useState<TodoLocal[]>(initialTodos);

  const handleAdd = (text: string) => {
    const newTodo: TodoLocal = {
      id: nanoid(),
      text,
      createdAt: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const handleEdit = (id: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text, updatedAt: Date.now() } : todo
      )
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <>
      <Head description="Todo Challenge - Quản lý công việc" />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Todo Challenge
        </h1>
        <TodoForm onSubmit={handleAdd} />
        <TodoList todos={todos} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </>
  );
};

export default TodoChallengePage;
