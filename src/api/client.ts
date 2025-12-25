import { ApiError } from '@/types/api'

const API_BASE_URL = 'https://dummyjson.com'

interface FetchOptions extends RequestInit {
  token?: string
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options
    const url = `${this.baseURL}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (fetchOptions.headers) {
      Object.assign(headers, fetchOptions.headers)
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      })

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      const isJson = contentType?.includes('application/json')

      if (!response.ok) {
        let errorData: ApiError = {
          message: `HTTP ${response.status}`,
          status: response.status,
        }

        if (isJson) {
          const data = await response.json()
          errorData.message = data.message || errorData.message
        }

        throw errorData
      }

      if (!isJson) {
        throw {
          message: 'Invalid response format',
          status: response.status,
        } as ApiError
      }

      return await response.json() as T
    } catch (error) {
      // Re-throw if it's already an ApiError
      if (error instanceof Object && 'message' in error && 'status' in error) {
        throw error
      }

      // Convert unknown errors to ApiError
      throw {
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      } as ApiError
    }
  }

  get<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, data?: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  put<T>(endpoint: string, data?: unknown, options?: FetchOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string, options?: FetchOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
