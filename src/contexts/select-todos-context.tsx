import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'

type TodosSelectionContextType = {
  selectedIds: Set<number>
  toggleSelection: (id: number) => void
  selectAll: (ids: number[]) => void
  clearSelection: () => void
  isSelected: (id: number) => boolean
  hasSelection: boolean
  selectedCount: number
}

const TodosSelectionContext = createContext<
  TodosSelectionContextType | undefined
>(undefined)

export const TodosSelectionProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  const selectAll = useCallback((ids: number[]) => {
    setSelectedIds(new Set(ids))
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const isSelected = useCallback(
    (id: number) => {
      return selectedIds.has(id)
    },
    [selectedIds],
  )

  const hasSelection = useMemo(() => selectedIds.size > 0, [selectedIds])
  const selectedCount = useMemo(() => selectedIds.size, [selectedIds])

  const value = useMemo(
    () => ({
      selectedIds,
      toggleSelection,
      selectAll,
      clearSelection,
      isSelected,
      hasSelection,
      selectedCount,
    }),
    [
      selectedIds,
      toggleSelection,
      selectAll,
      clearSelection,
      isSelected,
      hasSelection,
      selectedCount,
    ],
  )

  return (
    <TodosSelectionContext.Provider value={value}>
      {children}
    </TodosSelectionContext.Provider>
  )
}

export const useTodosSelection = () => {
  const context = useContext(TodosSelectionContext)
  if (context === undefined) {
    throw new Error(
      'useTodosSelection phải được sử dụng trong phạm vi TodosSelectionProvider',
    )
  }
  return context
}
