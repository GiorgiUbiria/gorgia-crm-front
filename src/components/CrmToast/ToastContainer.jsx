import React from "react"
import { CrmToast, CrmToastProvider } from "./index"
import useToastStore from "../../store/zustand/toastStore"

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore()

  return (
    <CrmToastProvider>
      {toasts.map(toast => (
        <CrmToast
          key={toast.id}
          open={true}
          onOpenChange={isOpen => !isOpen && removeToast(toast.id)}
          title={toast.title}
          description={toast.message}
          variant={toast.variant}
          action={toast.action}
          actionAltText={toast.actionAltText}
          size={toast.size}
          duration={toast.duration}
        />
      ))}
    </CrmToastProvider>
  )
}

export default ToastContainer
