import { create } from "zustand"

const useModalStore = create((set, get) => ({
  // State
  modals: {},

  // Actions
  openModal: (modalId, data = {}) =>
    set(state => ({
      modals: {
        ...state.modals,
        [modalId]: { 
          isOpen: true,
          ...data
        },
      },
    })),

  closeModal: modalId =>
    set(state => ({
      modals: {
        ...state.modals,
        [modalId]: { isOpen: false },
      },
    })),

  updateModalData: (modalId, data) =>
    set(state => ({
      modals: {
        ...state.modals,
        [modalId]: {
          ...state.modals[modalId],
          ...data,
        },
      },
    })),

  // Getters
  getModal: modalId => get().modals[modalId] || { isOpen: false },
  isModalOpen: modalId => get().modals[modalId]?.isOpen || false,
  getModalData: modalId => {
    const modal = get().modals[modalId]
    if (!modal) return null
    
    const modalData = { ...modal }
    delete modalData.isOpen
    return modalData
  },
}))

export default useModalStore
