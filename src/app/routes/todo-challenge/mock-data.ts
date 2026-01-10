import { TodoLocal } from "@/types/todo";

export const initialTodos: TodoLocal[] = [
  { id: '1', text: 'Study React TypeScript', createdAt: Date.now() - 86400000 },
  { id: '2', text: 'Complete Todo Challenge', createdAt: Date.now() - 43200000 },
  { id: '3', text: 'Review Code With Team', createdAt: Date.now() - 36000000 },
  { id: '4', text: 'Write Unit Test', createdAt: Date.now() },
  { id: '5', text: 'End Lesson', createdAt: Date.now() },
];
