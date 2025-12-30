import { Navigate, Outlet } from 'react-router'

import { paths } from '@/config/paths'
import { useAuthStore } from '@/features/auth/store'

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={paths.login.getHref()} replace />
  }

  return <Outlet />
}
