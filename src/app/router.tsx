import { useMemo } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { paths } from '@/config/paths'
import { ProtectedRoute } from './protected-route'

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: '/login',
      lazy: async () => {
        const { default: Login } = await import('./routes/login/page')
        return { element: <Login /> }
      },
    },
    {
      path: paths.home.path,
      lazy: async () => {
        const { default: Home } = await import('./routes/home/page')
        return {
          element: (
            <ProtectedRoute element={<Home />} />
          ),
        }
      },
    },
    {
      path: '*',
      lazy: async () => {
        const { default: NotFound } = await import('./routes/not-found')
        return { element: <NotFound /> }
      },
    },
  ])

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), [])

  return <RouterProvider router={router} />
}
