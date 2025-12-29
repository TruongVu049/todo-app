import { CheckCircle2 } from 'lucide-react'
import { ReactNode } from 'react'

import { Spinner } from '@/components/ui/spinner'

type ListProps = {
  children: ReactNode
  isLoading?: boolean
  isEmpty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  loadingText?: string
}

export const List = ({
  children,
  isLoading,
  isEmpty,
  emptyTitle = 'No items found',
  emptyDescription = 'Start by creating your first item',
  loadingText = 'Loading...',
}: ListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <Spinner size="lg" />
          <div className="absolute inset-0 blur-xl bg-green-400 opacity-20 animate-pulse" />
        </div>
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          {loadingText}
        </p>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative">
          <CheckCircle2
            className="w-20 h-20 text-green-400 animate-bounce"
            strokeWidth={1.5}
          />
          <div className="absolute inset-0 blur-2xl bg-green-400 opacity-20" />
        </div>
        <p className="text-xl font-semibold text-gray-700 mt-6">{emptyTitle}</p>
        <p className="text-sm text-gray-500 mt-2">{emptyDescription}</p>
      </div>
    )
  }

  return <div className="space-y-3">{children}</div>
}
