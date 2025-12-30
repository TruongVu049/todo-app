import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { AppProvider } from './provider'
import { AppRouter } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5000,
    },
  },
})

export const App = () => {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </AppProvider>
  )
}
