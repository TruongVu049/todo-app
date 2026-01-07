import * as React from 'react'

import type { FilterOptions } from '@/components/modals'
import type { NavFilter, ProjectFilter } from '@/types/common'
import { cn } from '@/utils/cn'

import { Header } from './header'
import { Sidebar } from './sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
  completedCount?: number
  totalCount?: number
  todayCount?: number
  tomorrowCount?: number
  onNewTask?: () => void
  navFilter?: NavFilter
  onNavFilterChange?: (filter: NavFilter) => void
  projectFilter?: ProjectFilter
  onProjectFilterChange?: (filter: ProjectFilter) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onAddProject?: (projectId: string) => void
  customProjects?: string[]
  advancedFilters?: FilterOptions
  onAdvancedFiltersChange?: (filters: FilterOptions) => void
  overdueCount?: number
}

export function DashboardLayout({
  children,
  className,
  completedCount = 0,
  totalCount = 0,
  todayCount = 0,
  tomorrowCount = 0,
  onNewTask,
  navFilter = 'all',
  onNavFilterChange,
  projectFilter = 'none',
  onProjectFilterChange,
  searchQuery = '',
  onSearchChange,
  onAddProject,
  customProjects = [],
  advancedFilters,
  onAdvancedFiltersChange,
  overdueCount = 0,
}: DashboardLayoutProps) {
  // Start with sidebar closed, then open on desktop after mount
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  // Open sidebar by default on desktop (lg breakpoint = 1024px)
  React.useEffect(() => {
    const isDesktop = window.innerWidth >= 1024
    setIsSidebarOpen(isDesktop)
  }, [])

  return (
    <div className="h-screen flex overflow-hidden bg-background dark:bg-[#101622]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-default"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 h-full transform transition-transform duration-300 ease-in-out lg:relative',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-64',
        )}
      >
        <Sidebar
          completedCount={completedCount}
          totalCount={totalCount}
          todayCount={todayCount}
          tomorrowCount={tomorrowCount}
          onNewTask={onNewTask}
          navFilter={navFilter}
          onNavFilterChange={onNavFilterChange}
          projectFilter={projectFilter}
          onProjectFilterChange={onProjectFilterChange}
          onAddProject={onAddProject}
          customProjects={customProjects}
          advancedFilters={advancedFilters}
          onAdvancedFiltersChange={onAdvancedFiltersChange}
          overdueCount={overdueCount}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <main className={cn('flex-1 flex flex-col min-w-0', className)}>
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onMenuClick={() => setIsSidebarOpen(true)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 md:p-8">
          <div className="max-w-5xl mx-auto flex flex-col gap-4 md:gap-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
