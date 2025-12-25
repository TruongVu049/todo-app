import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser } from '@/types/api'

export interface AuthState {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: AuthUser | null) => void
  setToken: (token: string | null) => void
  setRefreshToken: (refreshToken: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setAuth: (user: AuthUser, token: string, refreshToken: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      setAuth: (user, token, refreshToken) =>
        set({ user, token, refreshToken, error: null }),

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          error: null,
        }),

      isAuthenticated: () => {
        const { token } = get()
        return token !== null && token !== ''
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
)
