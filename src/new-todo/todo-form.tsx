'use client'

import { useState, useRef } from 'react'

interface Props {
  onAdd: (text: string) => void
}

export default function TodoForm({ onAdd }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmed = input.trim()
    if (trimmed.length < 3) {
      setError('Nội dung phải có ít nhất 3 ký tự')
      return
    }

    setError('')
    onAdd(trimmed)
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 flex flex-col sm:flex-row gap-4"
    >
      <div className="flex-1">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập việc cần làm..."
          className="w-full px-5 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <button
        type="submit"
        className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700"
      >
        Add Todo
      </button>
    </form>
  )
}
