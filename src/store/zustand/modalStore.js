import create from "zustand"

const useModalStore = create(set => ({
  isOpen: false,
  toggleModal: () => set(state => ({ isOpen: !state.isOpen })),
}))

export default useModalStore
