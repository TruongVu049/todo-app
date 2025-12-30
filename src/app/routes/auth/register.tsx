import { Helmet } from 'react-helmet-async'

import { RegisterForm } from '@/features/auth/components'

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title>Sign Up - TodoApp</title>
        <meta
          name="description"
          content="Create a TodoApp account to manage your tasks"
        />
      </Helmet>

      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <RegisterForm />
      </div>
    </>
  )
}
