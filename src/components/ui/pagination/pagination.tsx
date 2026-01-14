import React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const effectiveTotalPages = Math.max(1, totalPages)

    if (effectiveTotalPages <= 7) {
      for (let i = 1; i <= effectiveTotalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(effectiveTotalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < effectiveTotalPages - 2) {
        pages.push('...')
      }

      pages.push(effectiveTotalPages)
    }

    return pages
  }

  const effectiveTotalPages = Math.max(1, totalPages)

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
      >
        ← Trước
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                •••
              </span>
            )
          }

          const pageNumber = page as number
          const isActive = pageNumber === currentPage

          return (
            <Button
              key={pageNumber}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(pageNumber)}
              className={cn(
                'min-w-[36px] transition-all duration-200 hover:scale-110 active:scale-95',
                isActive
                  ? 'bg-green-600 text-white shadow-md animate-pulse-once'
                  : 'hover:bg-gray-100',
              )}
            >
              {pageNumber}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === effectiveTotalPages}
        className="px-3 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
      >
        Sau →
      </Button>
    </div>
  )
}
