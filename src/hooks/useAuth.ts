import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import { LoginInput, User } from '@/types/auth'

const AUTH_KEY = ['auth']
const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

const storage = {
    getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
    setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    removeToken: () => localStorage.removeItem(TOKEN_KEY),

    getUser: (): User | null => {
        const user = localStorage.getItem(USER_KEY)
        return user ? JSON.parse(user) : null
    },
    setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
    removeUser: () => localStorage.removeItem(USER_KEY),

    clear: () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    },
}

export const useAuth = () => {
    const queryClient = useQueryClient()

    const userQuery = useQuery({
        queryKey: AUTH_KEY,
        queryFn: () => {
            const user = storage.getUser()
            return user
        },
        staleTime: Infinity,
    })

    const loginMutation = useMutation({
        mutationFn: (input: LoginInput) => authApi.login(input),
        onSuccess: (user) => {
            storage.setToken(user.accessToken)
            storage.setUser(user)
            queryClient.setQueryData(AUTH_KEY, user)
        },
    })

    const logout = () => {
        storage.clear()
        queryClient.setQueryData(AUTH_KEY, null)
        queryClient.clear()
    }

    return {
        user: userQuery.data,
        isAuthenticated: !!userQuery.data,
        isLoading: userQuery.isLoading,
        loginMutation,
        logout,
    }
}

export { storage }
