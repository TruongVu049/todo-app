import React, { useState } from 'react'

import type { Todo } from '../types'

type Props = {
  todo: Todo
  onUpdate: (id: string, text: string) => void
  onDelete: (id: string) => void
}

export const TodoItem: React.FC<Props> = ({ todo, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(todo.text)
  const [error, setError] = useState<string | null>(null)

  const startEdit = () => {
    setText(todo.text)
    setError(null)
    setEditing(true)
  }

  const cancel = () => {
    setText(todo.text)
    setError(null)
    setEditing(false)
  }

  const save = () => {
    const newText = text.trim()
    if (newText.length === 0) return setError('Todo cannot be empty')
    if (newText.length < 3)
      return setError('Todo must be at least 3 characters')

    onUpdate(todo.id, newText)
    setEditing(false)
  }

  const handleDelete = () => {
    if (confirm('Delete this todo?')) {
      onDelete(todo.id)
    }
  }

  return (
    <div className="flex w-full items-start justify-between gap-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex-1">
        <div className="mb-2 text-sm text-slate-500">
          {new Date(todo.createdAt).toLocaleString()}
        </div>

        {editing ? (
          <div>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {error ? (
              <div className="mt-1 text-sm text-red-600">{error}</div>
            ) : null}
          </div>
        ) : (
          <div className="text-base font-medium">{todo.text}</div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        {editing ? (
          <div className="flex gap-2">
            <button
              className="rounded bg-emerald-600 px-3 py-1 text-sm text-white"
              onClick={save}
            >
              Save
            </button>
            <button
              className="rounded border px-3 py-1 text-sm"
              onClick={cancel}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              className="rounded border px-3 py-1 text-sm"
              onClick={startEdit}
            >
              Edit
            </button>
            <button
              className="rounded bg-red-600 px-3 py-1 text-sm text-white"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoItem
