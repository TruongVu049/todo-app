import { Outlet } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'

export const MainLayout = () => {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <div className="font-semibold">Todo App</div>
          <div>
            <button
              className="rounded bg-red-500 px-3 py-1 text-sm text-white"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
