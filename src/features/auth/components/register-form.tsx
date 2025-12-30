import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/form/label'
import { cn } from '@/utils/cn'

import { paths } from '../../../config/paths'

import { SocialLoginButtons } from './social-login-buttons'

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    navigate(paths.login.getHref())
  }

  return (
    <div className="flex w-full max-w-[440px] flex-col gap-4">
      {/* Logo Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <svg
            fill="none"
            height="24"
            viewBox="0 0 48 48"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join us today to get organized.
          </p>
        </div>
      </div>

      {/* Card Container */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        {/* Social Login Buttons */}
        <SocialLoginButtons />

        {/* Divider */}
        <div className="relative flex items-center justify-center py-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative bg-card px-2 text-xs text-muted-foreground">
            Or continue with email
          </div>
        </div>

        {/* Signup Form */}
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="space-y-1">
            <Label htmlFor="username" className="text-sm font-semibold">
              Username
            </Label>
            <input
              id="username"
              type="text"
              placeholder="johndoe"
              className={cn(
                'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
              )}
              {...register('username')}
            />
            {errors.username && (
              <p className="text-xs text-destructive">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email Address
            </Label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className={cn(
                'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
              )}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-semibold">
              Password
            </Label>
            <div className="group relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={cn(
                  'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 pr-10 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
                )}
                {...register('password')}
              />
              <button
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-primary"
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
            {errors.password ? (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold">
              Confirm Password
            </Label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={cn(
                'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
              )}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Action Button */}
          <Button
            type="submit"
            className="mt-1 h-10 w-full text-sm font-bold shadow-md transition-colors hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="mr-2 size-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to={paths.login.getHref()}
            className="font-bold text-primary transition-all hover:text-primary/80 hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
