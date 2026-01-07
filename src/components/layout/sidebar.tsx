import * as React from 'react'

import {
  AddProjectModal,
  FilterModal,
  type FilterOptions,
} from '@/components/modals'
import type { NavFilter, ProjectFilter } from '@/types/common'
import { cn } from '@/utils/cn'

interface Project {
  id: string
  name: string
  color: string
}

interface SidebarProps {
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
  onAddProject?: (projectId: string) => void
  customProjects?: string[]
  advancedFilters?: FilterOptions
  onAdvancedFiltersChange?: (filters: FilterOptions) => void
  overdueCount?: number
  onClose?: () => void
}

const DEFAULT_PROJECTS: Project[] = [
  { id: 'work', name: 'Công việc', color: 'bg-blue-500' },
  { id: 'personal', name: 'Cá nhân', color: 'bg-emerald-500' },
  { id: 'shopping', name: 'Mua sắm', color: 'bg-purple-500' },
]

export function Sidebar({
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
  onAddProject,
  customProjects = [],
  advancedFilters,
  onAdvancedFiltersChange,
  overdueCount = 0,
  onClose,
}: SidebarProps) {
  const [projects, setProjects] = React.useState<Project[]>(DEFAULT_PROJECTS)
  const [showAddProject, setShowAddProject] = React.useState(false)
  const [showFilters, setShowFilters] = React.useState(false)

  const progress =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const handleNavClick = (nav: NavFilter) => {
    onNavFilterChange?.(nav)
    onProjectFilterChange?.('none')
  }

  const handleLogoClick = () => {
    onNavFilterChange?.('all')
    onProjectFilterChange?.('none')
    onAdvancedFiltersChange?.({
      status: 'all',
      priority: 'all',
      dateRange: 'all',
    })
  }

  const handleProjectClick = (projectId: string) => {
    onProjectFilterChange?.(projectId === projectFilter ? 'none' : projectId)
  }

  const handleAddProjectSubmit = (project: { name: string; color: string }) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      emerald: 'bg-emerald-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      yellow: 'bg-yellow-500',
      cyan: 'bg-cyan-500',
    }

    const projectId =
      project.name.toLowerCase().replace(/\s/g, '-') + '-' + Date.now()

    setProjects((prev) => [
      ...prev,
      {
        id: projectId,
        name: project.name,
        color: colorMap[project.color] || 'bg-slate-500',
      },
    ])

    onAddProject?.(projectId)
  }

  const hasAdvancedFilters =
    advancedFilters &&
    (advancedFilters.status !== 'all' ||
      advancedFilters.priority !== 'all' ||
      advancedFilters.dateRange !== 'all')

  return (
    <>
      <aside
        className={cn(
          'w-64 h-full bg-white dark:bg-[#151c2a] border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0',
          className,
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/50">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[18px]">
                check
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              TaskDash
            </h2>
          </button>
          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>
          )}
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
          {/* New Task Button */}
          <div className="px-1 mb-4">
            <button
              onClick={onNewTask}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg font-medium shadow-md shadow-primary/25 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Tạo mới</span>
            </button>
          </div>

          {/* Main Navigation */}
          <div className="space-y-0.5">
            <button
              onClick={() => handleNavClick('all')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg group text-left',
                navFilter === 'all' && projectFilter === 'none'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50',
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-[20px]',
                  navFilter === 'all' && projectFilter === 'none'
                    ? 'text-primary'
                    : 'text-slate-400 group-hover:text-primary',
                )}
              >
                inbox
              </span>
              <span className="text-sm font-medium">Tất cả</span>
              <span
                className={cn(
                  'ml-auto text-xs font-semibold px-2 py-0.5 rounded-full',
                  navFilter === 'all' && projectFilter === 'none'
                    ? 'bg-white/60 dark:bg-white/20 text-primary'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500',
                )}
              >
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('today')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg group text-left',
                navFilter === 'today' && projectFilter === 'none'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50',
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-[20px]',
                  navFilter === 'today' && projectFilter === 'none'
                    ? 'text-primary'
                    : 'text-slate-400 group-hover:text-primary',
                )}
              >
                wb_sunny
              </span>
              <span className="text-sm font-medium">Hôm nay</span>
              <span
                className={cn(
                  'ml-auto text-xs font-semibold px-2 py-0.5 rounded-full',
                  navFilter === 'today' && projectFilter === 'none'
                    ? 'bg-white/60 dark:bg-white/20 text-primary'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500',
                )}
              >
                {todayCount}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('upcoming')}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg group text-left',
                navFilter === 'upcoming' && projectFilter === 'none'
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50',
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-[20px]',
                  navFilter === 'upcoming' && projectFilter === 'none'
                    ? 'text-primary'
                    : 'text-slate-400 group-hover:text-primary',
                )}
              >
                calendar_month
              </span>
              <span className="text-sm font-medium">Sắp tới</span>
              <span
                className={cn(
                  'ml-auto text-xs font-semibold px-2 py-0.5 rounded-full',
                  navFilter === 'upcoming' && projectFilter === 'none'
                    ? 'bg-white/60 dark:bg-white/20 text-primary'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500',
                )}
              >
                {tomorrowCount}
              </span>
            </button>

            {/* Overdue - only show if there are overdue tasks */}
            {overdueCount > 0 && (
              <button
                onClick={() => handleNavClick('overdue' as NavFilter)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg group text-left',
                  navFilter === 'overdue' && projectFilter === 'none'
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50',
                )}
              >
                <span className="material-symbols-outlined text-[20px] text-red-500">
                  warning
                </span>
                <span className="text-sm font-medium">Quá hạn</span>
                <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                  {overdueCount}
                </span>
              </button>
            )}

            <button
              onClick={() => setShowFilters(true)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg group text-left',
                hasAdvancedFilters
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50',
              )}
            >
              <span
                className={cn(
                  'material-symbols-outlined text-[20px]',
                  hasAdvancedFilters
                    ? 'text-primary'
                    : 'text-slate-400 group-hover:text-primary',
                )}
              >
                filter_list
              </span>
              <span className="text-sm font-medium">Bộ lọc & Nhãn</span>
              {hasAdvancedFilters && (
                <span className="ml-auto w-2 h-2 rounded-full bg-primary"></span>
              )}
            </button>
          </div>

          {/* Projects Section */}
          <div className="mt-6">
            <div className="px-3 mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Dự án
              </h3>
              <button
                onClick={() => setShowAddProject(true)}
                className="text-slate-400 hover:text-primary p-0.5 hover:bg-slate-100 rounded"
              >
                <span className="material-symbols-outlined text-[16px]">
                  add
                </span>
              </button>
            </div>
            <div className="space-y-0.5">
              {projects.map((project) => {
                const isNewProject = customProjects.includes(project.id)
                return (
                  <button
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left',
                      projectFilter === project.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50',
                    )}
                  >
                    <span
                      className={cn('w-2 h-2 rounded-full', project.color)}
                    ></span>
                    <span className="text-sm font-medium">{project.name}</span>
                    {isNewProject && (
                      <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-medium">
                        Mới
                      </span>
                    )}
                    {projectFilter === project.id && !isNewProject && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer - Daily Goal */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 justify-between items-center">
              <p className="text-slate-900 dark:text-white text-sm font-semibold">
                Mục tiêu ngày
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                {completedCount}/{totalCount}
              </p>
            </div>
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Modals */}
      <AddProjectModal
        open={showAddProject}
        onOpenChange={setShowAddProject}
        onProjectAdd={handleAddProjectSubmit}
      />
      <FilterModal
        open={showFilters}
        onOpenChange={setShowFilters}
        filters={advancedFilters}
        onApplyFilters={onAdvancedFiltersChange}
      />
    </>
  )
}
