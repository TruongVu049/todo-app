import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react'

type SelectionState = {
  selectedIds: Set<number>
}

type SelectionAction =
  | { type: 'TOGGLE'; payload: number }
  | { type: 'SELECT_ALL'; payload: number[] }
  | { type: 'CLEAR' }
  | { type: 'SELECT_MULTIPLE'; payload: number[] }
  | { type: 'DESELECT_MULTIPLE'; payload: number[] }

type SelectionStateContextType = {
  selectedIds: Set<number>
  selectedCount: number
  hasSelection: boolean
}

type SelectionActionsContextType = {
  toggleSelection: (id: number) => void
  selectAll: (ids: number[]) => void
  clearSelection: () => void
  selectMultiple: (ids: number[]) => void
  deselectMultiple: (ids: number[]) => void
  isSelected: (id: number) => boolean
}

function selectionReducer(
  state: SelectionState,
  action: SelectionAction,
): SelectionState {
  switch (action.type) {
    case 'TOGGLE': {
      const newSet = new Set(state.selectedIds)
      if (newSet.has(action.payload)) {
        newSet.delete(action.payload)
      } else {
        newSet.add(action.payload)
      }
      return { selectedIds: newSet }
    }

    case 'SELECT_ALL': {
      return { selectedIds: new Set(action.payload) }
    }

    case 'CLEAR': {
      return { selectedIds: new Set() }
    }

    case 'SELECT_MULTIPLE': {
      const newSet = new Set(state.selectedIds)
      action.payload.forEach((id) => newSet.add(id))
      return { selectedIds: newSet }
    }

    case 'DESELECT_MULTIPLE': {
      const newSet = new Set(state.selectedIds)
      action.payload.forEach((id) => newSet.delete(id))
      return { selectedIds: newSet }
    }

    default:
      return state
  }
}

const SelectionStateContext = createContext<
  SelectionStateContextType | undefined
>(undefined)

const SelectionActionsContext = createContext<
  SelectionActionsContextType | undefined
>(undefined)

export const TodosSelectionProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [state, dispatch] = useReducer<
    React.Reducer<SelectionState, SelectionAction>
  >(selectionReducer, { selectedIds: new Set<number>() })

  const toggleSelection = useCallback((id: number) => {
    dispatch({ type: 'TOGGLE', payload: id })
  }, [])

  const selectAll = useCallback((ids: number[]) => {
    dispatch({ type: 'SELECT_ALL', payload: ids })
  }, [])

  const clearSelection = useCallback(() => {
    dispatch({ type: 'CLEAR' })
  }, [])

  const selectMultiple = useCallback((ids: number[]) => {
    dispatch({ type: 'SELECT_MULTIPLE', payload: ids })
  }, [])

  const deselectMultiple = useCallback((ids: number[]) => {
    dispatch({ type: 'DESELECT_MULTIPLE', payload: ids })
  }, [])

  const isSelected = useCallback(
    (id: number) => state.selectedIds.has(id),
    [state.selectedIds],
  )

  const stateValue = useMemo(
    () => ({
      selectedIds: state.selectedIds,
      selectedCount: state.selectedIds.size,
      hasSelection: state.selectedIds.size > 0,
    }),
    [state.selectedIds],
  )

  const actionsValue = useMemo(
    () => ({
      toggleSelection,
      selectAll,
      clearSelection,
      selectMultiple,
      deselectMultiple,
      isSelected,
    }),
    [
      toggleSelection,
      selectAll,
      clearSelection,
      selectMultiple,
      deselectMultiple,
      isSelected,
    ],
  )

  return (
    <SelectionStateContext.Provider value={stateValue}>
      <SelectionActionsContext.Provider value={actionsValue}>
        {children}
      </SelectionActionsContext.Provider>
    </SelectionStateContext.Provider>
  )
}

export const useSelectionState = () => {
  const context = useContext(SelectionStateContext)
  if (context === undefined) {
    throw new Error(
      'useSelectionState phải được sử dụng trong phạm vi TodosSelectionProvider',
    )
  }
  return context
}

export const useSelectionActions = () => {
  const context = useContext(SelectionActionsContext)
  if (context === undefined) {
    throw new Error(
      'useSelectionActions phải được sử dụng trong phạm vi TodosSelectionProvider',
    )
  }
  return context
}

export const useTodosSelection = () => {
  const state = useSelectionState()
  const actions = useSelectionActions()
  return { ...state, ...actions }
}
