import { create } from 'zustand'

import type { Todo } from './types'

interface HistoryAction {
  id: string
  type: 'add' | 'delete' | 'update' | 'complete'
  timestamp: number
  // The todo before the action (for undo)
  previousState?: Todo
  // The todo after the action (for redo)
  newState?: Todo
  todoId: number
}

interface HistoryStore {
  actions: HistoryAction[]
  undoneActions: HistoryAction[] // For redo
  lastAction: HistoryAction | null
  showUndoToast: boolean

  // Actions
  recordAction: (action: Omit<HistoryAction, 'id' | 'timestamp'>) => void
  undo: () => HistoryAction | null
  redo: () => HistoryAction | null
  clearHistory: () => void
  dismissToast: () => void
}

const MAX_HISTORY = 20

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  actions: [],
  undoneActions: [],
  lastAction: null,
  showUndoToast: false,

  recordAction: (action) => {
    const newAction: HistoryAction = {
      ...action,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    }

    set((state) => ({
      actions: [...state.actions.slice(-MAX_HISTORY + 1), newAction],
      undoneActions: [], // Clear redo stack when new action is recorded
      lastAction: newAction,
      showUndoToast: action.type === 'delete' || action.type === 'update',
    }))

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      const currentAction = get().lastAction
      if (currentAction?.id === newAction.id) {
        set({ showUndoToast: false })
      }
    }, 5000)
  },

  undo: () => {
    const { actions } = get()
    if (actions.length === 0) return null

    const lastAction = actions[actions.length - 1]

    set((state) => ({
      actions: state.actions.slice(0, -1),
      undoneActions: [...state.undoneActions, lastAction],
      showUndoToast: false,
    }))

    return lastAction
  },

  redo: () => {
    const { undoneActions } = get()
    if (undoneActions.length === 0) return null

    const actionToRedo = undoneActions[undoneActions.length - 1]

    set((state) => ({
      undoneActions: state.undoneActions.slice(0, -1),
      actions: [...state.actions, actionToRedo],
    }))

    return actionToRedo
  },

  clearHistory: () => {
    set({
      actions: [],
      undoneActions: [],
      lastAction: null,
      showUndoToast: false,
    })
  },

  dismissToast: () => {
    set({ showUndoToast: false })
  },
}))
