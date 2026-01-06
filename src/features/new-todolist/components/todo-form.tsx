import React, { useEffect, useRef, useState } from 'react'

type Props = {
  onAdd: (text: string) => void
  placeholder?: string
}

export const TodoForm: React.FC<Props> = ({
  onAdd,
  placeholder = 'Add a todo',
}) => {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const text = value.trim()
    if (text.length === 0) return setError('Todo cannot be empty')
    if (text.length < 3) return setError('Todo must be at least 3 characters')

    onAdd(text)
    setValue('')
    setError(null)
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <input
        ref={inputRef}
        className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Add todo"
      />
      <button
        type="submit"
        className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        Add
      </button>
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
    </form>
  )
}

export default TodoForm
