import type { Todo } from '@/types/todos'

import { VALIDATION_RULES, MESSAGES } from './constants'

export const validateTodoText = (text: string): string | null => {
  //kiểm tra xem chuỗi có rỗng hay không nếu rỗng trả về thông báo lỗi
  if (!text || text.trim().length === 0) {
    return MESSAGES.TODO_REQUIRED
  }
  // kiểm tra xem độ dài chuỗi có nhỏ hơn MIN_LENGTH không
  if (text.trim().length < VALIDATION_RULES.MIN_LENGTH) {
    return MESSAGES.TODO_MIN_LENGTH
  }
  // kiểm tra xem độ dài chuỗi có lớn hơn MAX_LENGTH không
  if (text.trim().length > VALIDATION_RULES.MAX_LENGTH) {
    return MESSAGES.TODO_MAX_LENGTH
  }
  //
  return null
}

export const createNewTodo = (text: string): Todo => {
  const newTodo: Todo = {
    id: Date.now(),
    text: text.trim(),
    createAt: Date.now(),
  }
  return newTodo
}
