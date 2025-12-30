export type LoginInput = {
    username: string
    password: string
}

export type User = {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    gender: string
    image: string
    accessToken: string
    refreshToken: string
}

export type AuthState = {
    user: User | null
    isAuthenticated: boolean
}
