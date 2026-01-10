import { TodoLocal } from "@/types/todo";
import { TodoItem } from "./todo-item";

type TodoListProps = {
  todos: TodoLocal[];
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
};

export function TodoList({ todos, onEdit, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 bg-white rounded-lg border border-gray-200">
        No todos
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
