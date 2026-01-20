import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react'

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('') // Quản lý state từ khóa tìm kiếm toàn cục (cho tính năng search)

  // useMemo: Đảm bảo value truyền vào Provider chỉ thay đổi khi searchQuery thay đổi
  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
    }),
    [searchQuery],
  )

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

// Hook tiện ích để lấy state search nhanh chóng
export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
