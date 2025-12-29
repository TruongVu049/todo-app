import { Outlet } from 'react-router'

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Outlet />
    </div>
  )
}
