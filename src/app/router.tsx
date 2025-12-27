import { useMemo } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: '/',
      element: <Navigate to="/todos" replace />,
    },

    {
      path: '/login',
      lazy: async () => {
        const { default: Login } = await import('./routes/login/page')
        return { element: <Login /> }
      },
    },

    {
      path: '/todos',
      lazy: async () => {
        const { default: Todos } = await import('./routes/todos/page')
        return { element: <Todos /> }
      },
    },

    {
      path: '*',
      element: <Navigate to="/todos" replace />,
    },
  ])

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), [])
  return <RouterProvider router={router} />
}
