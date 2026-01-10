import { Outlet, Link, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/auth'
import { useLogout } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export const MainLayout = () => {
  const user = useAuthStore((state) => state.user)
  const { logout } = useLogout()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="flex-shrink-0">
                <img 
                  src="/logo150.png" 
                  alt="MeU Solutions" 
                  className="h-10 w-10"
                />
              </a>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MEU TODO</h1>
                {user && (
                  <p className="text-sm text-gray-600">
                    Xin chào, <span className="font-medium">{user.firstName} {user.lastName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                to="/todo-challenge"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/todo-challenge'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Todo Challenge
              </Link>
              <Button
                onClick={logout}
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Đăng Xuất
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}
