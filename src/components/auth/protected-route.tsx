import { Navigate, Outlet } from 'react-router'

import { paths } from '@/config/paths'
import { isAuthenticated } from '@/lib/auth'

export const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to={paths.login.getHref()} replace />
  }
  return <Outlet />
}
