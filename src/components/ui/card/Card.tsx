import React from 'react'

type CardProps = {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-4 
        hover:shadow-lg transition-shadow duration-200
        ${className}
      `}
    >
      {children}
    </div>
  )
}
