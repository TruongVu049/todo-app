import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

// Kiểu dữ liệu cho Selection Context
// Context này quản lý việc chọn nhiều todo và tab lọc (All/Completed/Active)
interface SelectionContextType {
  // Multi-select state
  selectedIds: Set<string> // Tập hợp các ID đang được chọn
  toggleSelect: (id: string) => void // Toggle chọn/bỏ chọn một ID
  selectAll: (ids: string[]) => void // Chọn tất cả các ID trong danh sách
  unselectAll: () => void // Bỏ chọn tất cả
  isSelected: (id: string) => boolean // Kiểm tra ID có đang được chọn không
  selectedCount: number // Số lượng item đang được chọn

  // Tab filter state
  activeTab: 'all' | 'completed' | 'active' // Tab đang active
  setActiveTab: (tab: 'all' | 'completed' | 'active') => void // Đổi tab
}

// Tạo Context với giá trị mặc định là null
// useContext sẽ trả về null nếu component không nằm trong Provider
const SelectionContext = createContext<SelectionContextType | null>(null)

interface SelectionProviderProps {
  children: ReactNode
}

// Provider component - bọc các component con để cung cấp state chọn nhiều
export function SelectionProvider({ children }: SelectionProviderProps) {
  // State lưu trữ các ID đang được chọn dưới dạng Set để truy xuất O(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  // State lưu trữ tab đang active
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'active'>(
    'all',
  )

  // Toggle chọn/bỏ chọn một ID
  // useCallback đảm bảo hàm không bị tạo mới mỗi lần render
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id) // Nếu đã chọn thì bỏ chọn
      } else {
        newSet.add(id) // Nếu chưa chọn thì thêm vào
      }
      return newSet
    })
  }, [])

  // Chọn tất cả các ID trong danh sách truyền vào
  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids))
  }, [])

  // Bỏ chọn tất cả
  const unselectAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  // Kiểm tra một ID có đang được chọn không
  const isSelected = useCallback(
    (id: string) => {
      return selectedIds.has(id)
    },
    [selectedIds],
  )

  // Số lượng item đang được chọn
  const selectedCount = selectedIds.size

  // useMemo để tạo object value ổn định, chỉ thay đổi khi dependencies thay đổi
  // Điều này giúp các component con không bị re-render khi value không đổi
  const value = useMemo<SelectionContextType>(
    () => ({
      selectedIds,
      toggleSelect,
      selectAll,
      unselectAll,
      isSelected,
      selectedCount,
      activeTab,
      setActiveTab,
    }),
    [
      selectedIds,
      toggleSelect,
      selectAll,
      unselectAll,
      isSelected,
      selectedCount,
      activeTab,
    ],
  )

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  )
}

// Hook để truy cập Selection Context
// Ném lỗi nếu sử dụng bên ngoài SelectionProvider
export function useSelection(): SelectionContextType {
  const context = useContext(SelectionContext)
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider')
  }
  return context
}
