import { CheckCircle2Icon } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { LoginForm } from '@/features/auth/components'

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>Login - TodoApp</title>
        <meta
          name="description"
          content="Login to TodoApp to manage your tasks"
        />
      </Helmet>

      <div className="flex min-h-screen flex-col overflow-x-hidden bg-background antialiased">
        {/* Top Navigation */}
        <header className="w-full border-b border-border bg-card px-6 py-4">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center text-primary">
                <CheckCircle2Icon className="size-7" />
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-foreground">
                TaskMaster
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm font-medium text-muted-foreground sm:block">
                Don&apos;t have an account?
              </span>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                onClick={() => navigate(paths.register.getHref())}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex w-full max-w-[1280px] flex-1 flex-col items-stretch justify-center gap-10 lg:flex-row lg:gap-20">
            {/* Left Side: Visual/Branding Card */}
            <div className="hidden max-w-[580px] flex-1 items-stretch justify-center lg:flex">
              <div
                className="group relative flex min-h-[500px] w-full flex-col items-start justify-end overflow-hidden rounded-xl bg-cover bg-center shadow-lg"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop")',
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="relative z-10 flex w-full flex-col gap-4 p-8">
                  <div className="flex size-12 items-center justify-center rounded-lg border border-white/10 bg-primary/20 backdrop-blur-sm">
                    <svg
                      className="size-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-3xl font-bold leading-tight tracking-tight text-white">
                      Focus on what matters.
                    </p>
                    <p className="max-w-md text-lg font-medium leading-relaxed text-gray-200">
                      Organize your daily tasks, collaborate with your team, and
                      track your progress seamlessly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="mx-auto flex w-full max-w-[480px] flex-1 flex-col items-center justify-center lg:mx-0 lg:items-start">
              <LoginForm />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-sm text-muted-foreground">
          © 2024 TaskMaster Inc. All rights reserved.
        </footer>
      </div>
    </>
  )
}
