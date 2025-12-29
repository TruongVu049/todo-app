const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

export const getUser = (): string | null => {
  return localStorage.getItem(USER_KEY)
}

export const setUser = (user: string): void => {
  localStorage.setItem(USER_KEY, user)
}

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY)
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

export const clearAuth = (): void => {
  removeToken()
  removeUser()
}
