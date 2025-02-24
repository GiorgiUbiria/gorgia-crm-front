import { create } from "zustand"
import { persist } from "zustand/middleware"

const initialProductState = {
  name: "",
  quantity: "",
  dimensions: "",
  description: "",
  search_variant: "",
  similar_purchase_planned: "",
  in_stock_explanation: "",
  payer: "",
  branches: [],
}

const initialFormState = {
  procurement_type: "",
  branches: [],
  category: "",
  purchase_purpose: "",
  requested_arrival_date: "",
  short_date_notice_explanation: null,
  exceeds_needs_reason: "",
  creates_stock: false,
  stock_purpose: null,
  delivery_address: "",
  external_url: "",
  file: null,
  products: [{ ...initialProductState }],
}

export const useProcurementStore = create(
  persist(
    set => ({
      formData: { ...initialFormState },
      expandedProducts: [0],
      generalError: null,
      file: null,
      isUpdating: false,

      setFormData: data =>
        set(state => {
          if (JSON.stringify(state.formData) === JSON.stringify(data)) {
            return state
          }
          return {
            formData: data,
            isUpdating: true,
          }
        }),
      clearUpdateFlag: () => set({ isUpdating: false }),
      updateFormField: (field, value) =>
        set(state => ({
          formData: {
            ...state.formData,
            [field]: value,
          },
        })),
      updateProductField: (index, field, value) =>
        set(state => {
          const updatedProducts = [...state.formData.products]
          if (!updatedProducts[index]) {
            updatedProducts[index] = { ...initialProductState }
          }
          updatedProducts[index] = {
            ...updatedProducts[index],
            [field]: value,
          }
          return {
            formData: {
              ...state.formData,
              products: updatedProducts,
            },
            isUpdating: true,
          }
        }),
      updateProductFields: (index, fields) =>
        set(state => {
          const updatedProducts = [...state.formData.products]
          if (!updatedProducts[index]) {
            updatedProducts[index] = { ...initialProductState }
          }
          updatedProducts[index] = {
            ...updatedProducts[index],
            ...fields,
          }
          return {
            formData: {
              ...state.formData,
              products: updatedProducts,
            },
            isUpdating: true,
          }
        }),
      addProduct: () =>
        set(state => ({
          formData: {
            ...state.formData,
            products: [...state.formData.products, { ...initialProductState }],
          },
          expandedProducts: [
            ...state.expandedProducts,
            state.formData.products.length,
          ],
          isUpdating: true,
        })),
      removeProduct: index =>
        set(state => ({
          formData: {
            ...state.formData,
            products: state.formData.products.filter((_, i) => i !== index),
          },
          expandedProducts: state.expandedProducts.filter(i => i !== index),
          isUpdating: true,
        })),
      toggleProduct: index =>
        set(state => ({
          expandedProducts: state.expandedProducts.includes(index)
            ? state.expandedProducts.filter(i => i !== index)
            : [...state.expandedProducts, index],
        })),
      setGeneralError: error => set({ generalError: error }),
      setFile: file => set({ file }),
      resetStore: () =>
        set({
          formData: { ...initialFormState },
          expandedProducts: [0],
          generalError: null,
          file: null,
          isUpdating: false,
        }),
    }),
    {
      name: "procurement-storage",
      partialize: state => ({
        formData: state.formData,
        expandedProducts: state.expandedProducts,
      }),
      getStorage: () => ({
        getItem: name => {
          const storedData = localStorage.getItem(name)
          if (!storedData) return null

          const { timestamp } = JSON.parse(storedData)
          if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(name)
            return null
          }
          return storedData
        },
        setItem: (name, value) => {
          const parsedValue = JSON.parse(value)
          const storageData = JSON.stringify({
            state: {
              formData: parsedValue.state.formData,
              expandedProducts: parsedValue.state.expandedProducts,
            },
            timestamp: Date.now(),
          })
          localStorage.setItem(name, storageData)
        },
        removeItem: name => localStorage.removeItem(name),
      }),
    }
  )
)
