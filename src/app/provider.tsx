import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'

import { MainErrorFallback } from '@/components/errors/main'
import { Spinner } from '@/components/ui/spinner'
import { ToastProvider } from '@/components/ui/toast'

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={MainErrorFallback}>
        <ToastProvider>
          <HelmetProvider>{children}</HelmetProvider>
        </ToastProvider>
      </ErrorBoundary>
    </React.Suspense>
  )
}
