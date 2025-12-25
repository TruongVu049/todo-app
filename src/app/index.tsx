import { AppProvider } from './provider'
import { AppRouter } from './router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

export const App = () => {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </AppProvider>
  )
}
