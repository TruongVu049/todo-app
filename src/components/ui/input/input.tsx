import { InputHTMLAttributes, forwardRef } from 'react'

import { cn } from '@/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition-all',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 focus-visible:border-green-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'placeholder:text-gray-400',
            error &&
              'border-red-400 focus-visible:ring-red-400 focus-visible:border-red-400',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'
