import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-6">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
