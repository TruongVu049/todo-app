import * as React from 'react'
import { useNavigate } from 'react-router'

import { SettingsModal, ProfileModal } from '@/components/modals'
import { paths } from '@/config/paths'
import { useAuthStore } from '@/features/auth/store'

export default function DashboardSelection() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const [showSettings, setShowSettings] = React.useState(false)
  const [showProfile, setShowProfile] = React.useState(false)

  return (
    <div className="layout-container flex h-full grow flex-col bg-slate-50 dark:bg-[#101622] min-h-screen font-display">
      {/* Header */}
      <div className="w-full bg-white dark:bg-[#1a2230] border-b border-[#e7ebf3] dark:border-gray-800 sticky top-0 z-50">
        <div className="px-4 md:px-10 lg:px-40 flex justify-center py-3">
          <div className="flex max-w-[960px] flex-1 items-center justify-between">
            <div className="flex items-center gap-4 text-[#0d121b] dark:text-white">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[18px]">
                  check
                </span>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                TaskDash
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center justify-center rounded-lg text-slate-500 hover:text-primary transition-colors dark:text-slate-400 dark:hover:text-primary"
              >
                <span className="material-symbols-outlined">settings</span>
              </button>
              <button
                onClick={() => setShowProfile(true)}
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-white dark:ring-gray-800 shadow-sm cursor-pointer hover:ring-primary transition-all"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6s1bsO331SuWxFMxVT2a1rZ590J6IZPvk2fEDE4KDsI4G42S_FcGJFBgpPl0TS9oG1YHhEK57VnZVBc_Mki5p-RR3K_uVKQNa78xl_Hr4bFmJ7ixuzK_l0jbrO88MciSqOSExEnnL-omW_WqbbCbUuB9W7nkgZ8gu6Z_p_eektopNcFOwzc075CCtBFoxP8FBU6xbhRvr4cjgkSdGUbRYpoCupBjU_XqQqlVU5ISsQZIxCKX1XkL2g00eyEVhw3L7SkyCG1xEuSg")',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-2">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4 pt-4">
              <div className="flex min-w-72 flex-col gap-1">
                <p className="text-[#0d121b] dark:text-white text-2xl font-black leading-tight tracking-[-0.033em]">
                  Welcome back, {user?.firstName || 'Admin'}
                </p>
                <p className="text-[#4c669a] dark:text-slate-400 text-sm font-normal leading-normal">
                  Which list would you like to work on?
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6 px-4 py-2 @container">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-[#0d121b] dark:text-white text-xl font-bold leading-tight max-w-[720px]">
                    My Lists
                  </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {/* Personal List Card */}
                  {/* Personal List Card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(paths.todoChallenge.getHref())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        navigate(paths.todoChallenge.getHref())
                      }
                    }}
                    className="group flex flex-col gap-3 rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-slate-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer h-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden relative"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDuhxbc7AOzA3mVOHkK4nM8wqpjz7Uu184364S2JAna7kPT2i-37zRnzmbib9Gut17b-yrnEpZU7G3yZsEsFrZ1_OvPpG-_UKlqryPr3S3VQYGIId91Khttk4D6ax9kTywvyGRnYBJqlwiuRJ3gsYx9AUKQs1_QawzlQYtNoSX9ira-RTB6n87i9WFYM9B7-37SkBWhgGmSle105H8HRFgOa0geWo7f0Li_FOXAAXC9JAXi1akzNYNh0s6zB3VB1BGhWgPENX0jEC4")',
                      }}
                    >
                      <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors"></div>
                      <div className="absolute top-3 left-3 bg-white dark:bg-black/50 backdrop-blur-md p-1.5 rounded-lg shadow-sm">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          cottage
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                      <div className="flex justify-between items-center group/title">
                        <div className="flex items-center gap-2">
                          <p className="text-[#0d121b] dark:text-white text-lg font-bold leading-normal group-hover:text-primary transition-colors">
                            Personal (Todo Challenge)
                          </p>
                          <button
                            className="text-slate-300 hover:text-primary transition-colors focus:outline-none focus:text-primary"
                            title="Rename list"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              edit
                            </span>
                          </button>
                        </div>
                      </div>
                      <p className="text-[#4c669a] dark:text-slate-400 text-xs font-normal leading-relaxed mb-2 line-clamp-2">
                        Your private tasks, groceries, errands, and family
                        reminders.
                      </p>
                      <div className="mt-auto pt-1">
                        <button className="w-full flex items-center justify-center rounded-lg h-9 px-4 bg-slate-100 dark:bg-slate-700/50 text-[#0d121b] dark:text-white font-bold text-xs border border-transparent group-hover:bg-primary group-hover:text-white transition-all">
                          Open List
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Work Projects List Card */}
                  {/* Work Projects List Card */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(paths.home.getHref())}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        navigate(paths.home.getHref())
                      }
                    }}
                    className="group flex flex-col gap-3 rounded-xl bg-white dark:bg-[#1a2230] p-4 shadow-sm border border-slate-200 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500 hover:shadow-md transition-all duration-300 cursor-pointer h-full focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden relative"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAyq44ZPSrsZ8xrKRjLrujij_HyjQ65VV9Y1pBPDsCw4uGoQQGeeFkSM_-hCbiG8DN_u3JlIIXD8my7wSyqbnREjfiHgyHCVEhq6l4TCPPUgspBACLJVA7yQULbRKPu8ypjhdNT03b2qVHwb_fmy1cEbO1fdiVJnWaFLP4gfCNH0Edc_DdIk8iTNQn_aAKn5IfbAROE51d293mlK8upswBg2jUdsgyvbRxmoewFEkhKagSoGNcizlgqRJALwVtIf00GDXlZExtzWQM")',
                      }}
                    >
                      <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/5 transition-colors"></div>
                      <div className="absolute top-3 left-3 bg-white dark:bg-black/50 backdrop-blur-md p-1.5 rounded-lg shadow-sm">
                        <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[20px]">
                          work
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                      <div className="flex justify-between items-center group/title">
                        <div className="flex items-center gap-2">
                          <p className="text-[#0d121b] dark:text-white text-lg font-bold leading-normal group-hover:text-purple-600 transition-colors">
                            Work Projects (Todos)
                          </p>
                          <button
                            className="text-slate-300 hover:text-purple-600 transition-colors focus:outline-none focus:text-purple-600"
                            title="Rename list"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              edit
                            </span>
                          </button>
                        </div>
                      </div>
                      <p className="text-[#4c669a] dark:text-slate-400 text-xs font-normal leading-relaxed mb-2 line-clamp-2">
                        Professional tasks, meetings, deadlines, and team
                        collaborations.
                      </p>
                      <div className="mt-auto pt-1">
                        <button className="w-full flex items-center justify-center rounded-lg h-9 px-4 bg-slate-100 dark:bg-slate-700/50 text-[#0d121b] dark:text-white font-bold text-xs border border-transparent group-hover:bg-purple-600 group-hover:text-white transition-all">
                          Open List
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 px-1">
                <span className="material-symbols-outlined text-[#4c669a] dark:text-slate-500 text-sm">
                  history
                </span>
                <p className="text-[#4c669a] dark:text-slate-500 text-sm">
                  Last active: You added 3 items to &apos;Work Projects&apos;
                  yesterday.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-[#1a2230]/50 backdrop-blur-sm py-4 mt-auto">
        <div className="layout-content-container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-10 lg:px-40 max-w-[960px] mx-auto text-xs text-slate-500 dark:text-slate-400">
          <p>© 2026 TaskDash Inc.</p>
          <div className="flex items-center gap-6">
            <a className="hover:text-primary transition-colors" href="#">
              Privacy
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Terms
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Support
            </a>
          </div>
        </div>
      </footer>
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
      <ProfileModal open={showProfile} onOpenChange={setShowProfile} />
    </div>
  )
}
