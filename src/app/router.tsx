import { useMemo } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { paths } from '@/config/paths'

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: paths.home.path,
      lazy: async () => {
        const { default: TodosPage } = await import('@/pages/TodosPage')
        return { element: <TodosPage /> }
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
