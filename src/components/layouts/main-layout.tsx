import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/auth'
import { useLogout } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export const MainLayout = () => {
  const user = useAuthStore((state) => state.user)
  const { logout } = useLogout()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/todo-challenge', label: 'Todo Challenge' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & User Info */}
            <div className="flex items-center gap-2 sm:gap-4">
              <a href="/" className="shrink-0">
                <img 
                  src="/logo150.png" 
                  alt="MeU Solutions" 
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
              </a>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">MEU TODO</h1>
                {user && (
                  <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                    Xin chào, <span className="font-medium">{user.firstName} {user.lastName}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Đăng Xuất
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === link.to
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
                >
                  Đăng Xuất
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}
