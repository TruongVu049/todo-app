import * as React from 'react'

export const EmptyState = ({
  message = 'No tasks yet',
}: {
  message?: string
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
