import React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useFocus } from '@/hooks/useFocus'
import { validateTodoText } from '@/utils/validation'

type TodosFormProps = {
  onAddTodo: (text: string) => void
  initialValue?: string
}
export const TodosForm: React.FC<TodosFormProps> = ({
  onAddTodo,
  initialValue = '',
}) => {
  const [text, setText] = React.useState(initialValue)
  const [error, setError] = React.useState<string | null>(null)
  const [inputRef, setInputFocus] = useFocus<HTMLInputElement>()

  React.useEffect(() => {
    setText(initialValue)
  }, [initialValue])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateTodoText(text)
    if (validationError) {
      setError(validationError)
      return
    }
    onAddTodo(text)
    setText('')
    setError(null)
    setInputFocus()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập công việc..."
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-sm hover:shadow-md transition-all duration-200 font-semibold"
      >
        {initialValue ? 'Cập nhật' : 'Thêm Công Việc'}
      </Button>
    </form>
  )
}
