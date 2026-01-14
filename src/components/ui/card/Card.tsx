import React, { memo } from 'react'

type CardProps = {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
  role?: string
  'aria-selected'?: boolean
}

export const Card: React.FC<CardProps> = memo(function Card({
  children,
  className = '',
  onClick,
  role,
  'aria-selected': ariaSelected,
}) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 p-3 
        transition-all duration-300 ease-out
        ${className}
      `}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
        }
      }}
      role={role}
      aria-selected={ariaSelected}
    >
      {children}
    </div>
  )
})
