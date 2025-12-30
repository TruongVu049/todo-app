import { zodResolver } from '@hookform/resolvers/zod'
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/form/label'
import { cn } from '@/utils/cn'

import { paths } from '../../../config/paths'
import { useLogin } from '../hooks/use-login'

import { SocialLoginButtons } from './social-login-buttons'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header Text */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-sm font-normal text-muted-foreground">
          Please enter your details to access your tasks.
        </p>
      </div>

      {/* Form */}
      <form
        className="flex w-full flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Test Credentials Info */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs dark:border-blue-800 dark:bg-blue-900/30">
          <p className="font-semibold text-blue-800 dark:text-blue-300">
            🔐 Test:{' '}
            <code className="rounded bg-blue-100 px-1 font-mono dark:bg-blue-800">
              emilys
            </code>{' '}
            /{' '}
            <code className="rounded bg-blue-100 px-1 font-mono dark:bg-blue-800">
              emilyspass
            </code>
          </p>
        </div>

        {/* Error Message */}
        {loginMutation.isError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {loginMutation.error?.message || 'Login failed. Please try again.'}
          </div>
        )}

        {/* Username Field */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="username" className="text-sm font-semibold">
            Username
          </Label>
          <div className="relative flex items-center">
            <MailIcon className="absolute left-3 size-4 select-none text-muted-foreground" />
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              className={cn(
                'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 pl-9 pr-4 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
              )}
              {...register('username')}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="password" className="text-sm font-semibold">
            Password
          </Label>
          <div className="relative flex w-full items-stretch rounded-lg shadow-sm">
            <LockIcon className="absolute left-3 top-3 z-10 size-4 select-none text-muted-foreground" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className={cn(
                'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 pl-9 pr-10 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
              )}
              {...register('password')}
            />
            <button
              aria-label="Toggle password visibility"
              className="absolute right-0 top-0 flex h-10 items-center justify-center px-3 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
          <div className="flex justify-end">
            <a
              className="text-xs font-semibold text-primary transition-colors hover:text-primary/80"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="h-10 w-full text-sm font-bold shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="grow border-t border-border" />
          <span className="mx-3 shrink-0 text-xs font-semibold uppercase text-muted-foreground">
            Or continue with
          </span>
          <div className="grow border-t border-border" />
        </div>

        {/* Social Login */}
        <SocialLoginButtons />
      </form>

      {/* Mobile Bottom Link */}
      <div className="flex items-center justify-center gap-2 lg:hidden">
        <span className="text-sm font-medium text-muted-foreground">
          Don&apos;t have an account?
        </span>
        <Link
          to={paths.register.getHref()}
          className="text-sm font-bold text-primary hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}
