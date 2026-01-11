'use client'

import { useState, useRef, useEffect, memo } from 'react'

import { Todo } from './types'

interface Props {
  todo: Todo
  onUpdate: (id: string, text: string) => void
  onDelete: (id: string) => void
}

const TodoItem = memo(function TodoItem({ todo, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const handleSave = () => {
    const trimmed = editText.trim()
    if (trimmed.length < 3) {
      setError('Nội dung phải có ít nhất 3 ký tự')
      return
    }
    setError('')
    onUpdate(todo.id, trimmed)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(todo.text)
    setError('')
    setIsEditing(false)
  }

  return (
    <li className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      {isEditing ? (
        <>
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className="flex-1">{todo.text}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </>
      )}
    </li>
  )
})

export default TodoItem
