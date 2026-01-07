import * as React from 'react'
import { useNavigate } from 'react-router'

import { SettingsModal, ProfileModal } from '@/components/modals'
import { paths } from '@/config/paths'

export default function DashboardSelection() {
  const navigate = useNavigate()
  const [showSettings, setShowSettings] = React.useState(false)
  const [showProfile, setShowProfile] = React.useState(false)

  return (
    <div className="layout-container flex h-full grow flex-col bg-slate-50 dark:bg-[#101622] min-h-screen font-display">
      {/* Header */}
      <div className="w-full bg-white dark:bg-[#1a2230] border-b border-[#e7ebf3] dark:border-gray-800 sticky top-0 z-50">
        <div className="px-4 md:px-10 lg:px-40 flex justify-center py-3">
          <div className="flex max-w-[960px] flex-1 items-center justify-between">
            <div className="flex items-center gap-4 text-[#0d121b] dark:text-white">
              <div className="size-8 text-primary">
                <svg
                  fill="currentColor"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                TodoApp
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
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4 pt-10">
              <div className="flex min-w-72 flex-col gap-2">
                <p className="text-[#0d121b] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  Welcome back, Admin
                </p>
                <p className="text-[#4c669a] dark:text-slate-400 text-lg font-normal leading-normal">
                  Which list would you like to work on?
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-10 px-4 py-6 @container">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h1 className="text-[#0d121b] dark:text-white text-2xl font-bold leading-tight max-w-[720px]">
                    My Lists
                  </h1>
                  <p className="text-[#4c669a] dark:text-slate-400 text-base font-normal leading-normal max-w-[720px]">
                    Select a list to view your tasks. You can rename lists and
                    change icons to suit your workflow.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
                    className="group flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1a2230] p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer h-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden relative"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDuhxbc7AOzA3mVOHkK4nM8wqpjz7Uu184364S2JAna7kPT2i-37zRnzmbib9Gut17b-yrnEpZU7G3yZsEsFrZ1_OvPpG-_UKlqryPr3S3VQYGIId91Khttk4D6ax9kTywvyGRnYBJqlwiuRJ3gsYx9AUKQs1_QawzlQYtNoSX9ira-RTB6n87i9WFYM9B7-37SkBWhgGmSle105H8HRFgOa0geWo7f0Li_FOXAAXC9JAXi1akzNYNh0s6zB3VB1BGhWgPENX0jEC4")',
                      }}
                    >
                      <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/5 transition-colors"></div>
                      <div className="absolute top-4 left-4 bg-white dark:bg-black/50 backdrop-blur-md p-2 rounded-lg shadow-sm">
                        <span className="material-symbols-outlined text-primary">
                          cottage
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                      <div className="flex justify-between items-center group/title">
                        <div className="flex items-center gap-2">
                          <p className="text-[#0d121b] dark:text-white text-xl font-bold leading-normal group-hover:text-primary transition-colors">
                            Personal (Todo Challenge)
                          </p>
                          <button
                            className="text-slate-300 hover:text-primary transition-colors focus:outline-none focus:text-primary"
                            title="Rename list"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                        </div>
                      </div>
                      <p className="text-[#4c669a] dark:text-slate-400 text-sm font-normal leading-relaxed mb-4">
                        Your private tasks, groceries, errands, and family
                        reminders.
                      </p>
                      <div className="mt-auto pt-2">
                        <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-700/50 text-[#0d121b] dark:text-white font-bold text-sm border border-transparent group-hover:bg-primary group-hover:text-white transition-all">
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
                    className="group flex flex-col gap-4 rounded-xl bg-white dark:bg-[#1a2230] p-5 shadow-sm border border-slate-200 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500 hover:shadow-md transition-all duration-300 cursor-pointer h-full focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden relative"
                      style={{
                        backgroundImage:
                          'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAyq44ZPSrsZ8xrKRjLrujij_HyjQ65VV9Y1pBPDsCw4uGoQQGeeFkSM_-hCbiG8DN_u3JlIIXD8my7wSyqbnREjfiHgyHCVEhq6l4TCPPUgspBACLJVA7yQULbRKPu8ypjhdNT03b2qVHwb_fmy1cEbO1fdiVJnWaFLP4gfCNH0Edc_DdIk8iTNQn_aAKn5IfbAROE51d293mlK8upswBg2jUdsgyvbRxmoewFEkhKagSoGNcizlgqRJALwVtIf00GDXlZExtzWQM")',
                      }}
                    >
                      <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/5 transition-colors"></div>
                      <div className="absolute top-4 left-4 bg-white dark:bg-black/50 backdrop-blur-md p-2 rounded-lg shadow-sm">
                        <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">
                          work
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                      <div className="flex justify-between items-center group/title">
                        <div className="flex items-center gap-2">
                          <p className="text-[#0d121b] dark:text-white text-xl font-bold leading-normal group-hover:text-purple-600 transition-colors">
                            Work Projects (Todos)
                          </p>
                          <button
                            className="text-slate-300 hover:text-purple-600 transition-colors focus:outline-none focus:text-purple-600"
                            title="Rename list"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                        </div>
                      </div>
                      <p className="text-[#4c669a] dark:text-slate-400 text-sm font-normal leading-relaxed mb-4">
                        Professional tasks, meetings, deadlines, and team
                        collaborations.
                      </p>
                      <div className="mt-auto pt-2">
                        <button className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-700/50 text-[#0d121b] dark:text-white font-bold text-sm border border-transparent group-hover:bg-purple-600 group-hover:text-white transition-all">
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

      <footer className="flex flex-col gap-6 px-5 py-10 text-center w-full border-t border-[#e7ebf3] dark:border-gray-800 bg-white dark:bg-[#1a2230]">
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            className="text-[#4c669a] dark:text-slate-400 hover:text-primary text-sm font-medium leading-normal min-w-40 transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-[#4c669a] dark:text-slate-400 hover:text-primary text-sm font-medium leading-normal min-w-40 transition-colors"
            href="#"
          >
            Terms of Service
          </a>
        </div>
        <p className="text-[#4c669a] dark:text-slate-500 text-sm font-normal leading-normal">
          © 2026 TodoApp Inc.
        </p>
      </footer>
      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
      <ProfileModal open={showProfile} onOpenChange={setShowProfile} />
    </div>
  )
}
