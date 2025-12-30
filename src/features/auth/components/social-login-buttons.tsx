export function SocialLoginButtons() {
  return (
    <div className="flex flex-col gap-2">
      <button
        className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-4 text-sm font-semibold transition-colors hover:bg-muted"
        type="button"
      >
        <svg
          className="size-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.52 12.29c0-.85-.08-1.68-.21-2.48H12v4.69h6.46c-.28 1.49-1.12 2.76-2.39 3.61v3h3.87c2.26-2.09 3.58-5.17 3.58-8.82z"
            fill="#4285F4"
          />
          <path
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3c-1.08.72-2.46 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.33v3.12C3.33 21.36 7.33 24 12 24z"
            fill="#34A853"
          />
          <path
            d="M5.27 14.29c-.25-.75-.39-1.54-.39-2.34s.14-1.59.39-2.34V6.49H1.33c-1.74 3.48-1.74 7.54 0 11.02l3.94-3.22z"
            fill="#FBBC05"
          />
          <path
            d="M12 4.75c1.76 0 3.34.6 4.59 1.8l3.44-3.44C17.95 1.18 15.24 0 12 0 7.33 0 3.33 2.64 1.33 6.49l3.94 3.22c.95-2.84 3.6-4.96 6.73-4.96z"
            fill="#EA4335"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      <button
        className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-4 text-sm font-semibold transition-colors hover:bg-muted"
        type="button"
      >
        <svg
          className="size-5 shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        <span>Continue with GitHub</span>
      </button>
    </div>
  )
}
