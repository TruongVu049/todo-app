import { debounce } from 'lodash-es'
import * as React from 'react'
import { useLocation, useNavigate } from 'react-router'

import { SettingsModal, ProfileModal } from '@/components/modals'
import { paths } from '@/config/paths'
import { cn } from '@/utils/cn'

interface HeaderProps {
  className?: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onMenuClick?: () => void
  isSidebarOpen?: boolean
}

export function Header({
  className,
  searchQuery = '',
  onSearchChange,
  onMenuClick,
  isSidebarOpen = true,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [showSettings, setShowSettings] = React.useState(false)
  const [showProfile, setShowProfile] = React.useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  // Local state for immediate UI feedback
  const [localSearchValue, setLocalSearchValue] = React.useState(searchQuery)

  // Sync local state with prop when it changes from outside
  React.useEffect(() => {
    setLocalSearchValue(searchQuery)
  }, [searchQuery])

  // Debounced callback - only triggers onSearchChange after 300ms of no typing
  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        onSearchChange?.(value)
      }, 300),
    [onSearchChange],
  )

  // Cleanup debounce on unmount
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setLocalSearchValue(value) // Immediate UI update
      debouncedSearch(value) // Debounced filter update
    },
    [debouncedSearch],
  )

  const handleClearSearch = React.useCallback(() => {
    setLocalSearchValue('')
    debouncedSearch.cancel()
    onSearchChange?.('') // Immediate clear
  }, [debouncedSearch, onSearchChange])

  return (
    <>
      <header
        className={cn(
          'h-14 md:h-16 flex items-center justify-between px-3 md:px-8 bg-white/90 dark:bg-[#101622]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10',
          className,
        )}
      >
        {/* Menu Button - visible on mobile always, on desktop only when sidebar closed */}
        <button
          onClick={onMenuClick}
          className={cn(
            'p-2 mr-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800',
            isSidebarOpen ? 'lg:hidden' : 'block',
          )}
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Back to Dashboard Button (only if not on dashboard) */}
        {location.pathname !== paths.dashboard.path && (
          <button
            onClick={() => navigate(paths.dashboard.getHref())}
            className="p-2 mr-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Quay lại trang chọn danh sách"
          >
            <span className="material-symbols-outlined text-[24px]">
              arrow_back
            </span>
          </button>
        )}

        {/* Search Bar */}
        <div className="flex-1 max-w-[180px] md:max-w-xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 md:pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                search
              </span>
            </div>
            <input
              type="text"
              value={localSearchValue}
              onChange={handleSearchChange}
              className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 md:py-2.5 pl-9 md:pl-11 pr-3 md:pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 text-xs md:text-sm transition-all"
              placeholder="Tìm kiếm..."
            />
            {localSearchValue && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-2 md:pr-3 text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                  close
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 ml-6">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-[22px]">
                notifications
              </span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Thông báo
                  </h3>
                </div>
                <div className="py-2">
                  <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                    <p className="text-sm text-slate-900 dark:text-white">
                      🎉 Bạn đã hoàn thành 5 công việc hôm nay!
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Vừa xong</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                    <p className="text-sm text-slate-900 dark:text-white">
                      ⏰ Có 2 công việc sắp đến hạn
                    </p>
                    <p className="text-xs text-slate-500 mt-1">10 phút trước</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                    <p className="text-sm text-slate-900 dark:text-white">
                      💡 Mẹo: Dùng phím Enter để thêm nhanh công việc
                    </p>
                    <p className="text-xs text-slate-500 mt-1">1 giờ trước</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[22px]">
              settings
            </span>
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

          {/* User Avatar */}
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div
              className="size-9 rounded-full bg-cover bg-center ring-2 ring-white dark:ring-slate-700 shadow-md group-hover:ring-primary transition-all"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6s1bsO331SuWxFMxVT2a1rZ590J6IZPvk2fEDE4KDsI4G42S_FcGJFBgpPl0TS9oG1YHhEK57VnZVBc_Mki5p-RR3K_uVKQNa78xl_Hr4bFmJ7ixuzK_l0jbrO88MciSqOSExEnnL-omW_WqbbCbUuB9W7nkgZ8gu6Z_p_eektopNcFOwzc075CCtBFoxP8FBU6xbhRvr4cjgkSdGUbRYpoCupBjU_XqQqlVU5ISsQZIxCKX1XkL2g00eyEVhw3L7SkyCG1xEuSg")',
              }}
            />
          </button>
        </div>
      </header>

      {/* Modals */}
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
      <ProfileModal open={showProfile} onOpenChange={setShowProfile} />
    </>
  )
}
