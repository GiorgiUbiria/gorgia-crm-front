import { create } from "zustand"
import { nanoid } from "nanoid"

const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: ({
    title,
    message,
    variant = "info",
    action,
    actionAltText,
    duration = 5000, // default duration
    size = "default", // default size
  }) => {
    const id = nanoid()
    const toast = {
      id,
      title,
      message,
      variant,
      action,
      actionAltText,
      duration,
      size,
    }

    set(state => ({
      toasts: [...state.toasts, toast],
    }))

    if (duration !== Infinity) {
      setTimeout(() => {
        get().removeToast(id)
      }, duration)
    }
  },

  removeToast: id =>
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id),
    })),

  clearAllToasts: () => set({ toasts: [] }),
}))

// Custom hook for easier toast management
export const useToast = () => {
  const { addToast } = useToastStore()

  return {
    success: (message, title, options = {}) =>
      addToast({ message, title, variant: "success", ...options }),

    error: (message, title, options = {}) =>
      addToast({ message, title, variant: "error", ...options }),

    info: (message, title, options = {}) =>
      addToast({ message, title, variant: "info", ...options }),

    custom: options => addToast(options),
  }
}

export default useToastStore
