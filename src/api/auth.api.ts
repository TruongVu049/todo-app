import { LoginInput, User } from '@/types/auth'

const API_BASE = 'https://dummyjson.com'

export const authApi = {
    login: async (input: LoginInput): Promise<User> => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(input),
        })

        if (!res.ok) {
            const error = await res.json()
            throw new Error(error.message || 'Invalid credentials')
        }

        return res.json()
    },

    getCurrentUser: async (token: string): Promise<User> => {
        const res = await fetch(`${API_BASE}/auth/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            throw new Error('Failed to get user')
        }

        return res.json()
    },
}
