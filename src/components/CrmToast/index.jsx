import * as React from "react"
import * as Toast from "@radix-ui/react-toast"
import { CheckCircle, XCircle, Info, X } from "lucide-react"

const toastVariants = {
  success: {
    icon: CheckCircle,
    className: "bg-green-50 border-green-500 text-green-800",
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 border-red-500 text-red-800",
  },
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-500 text-blue-800",
  },
}

const sizeVariants = {
  small: {
    root: "max-w-[300px]",
    icon: "h-4 w-4",
    title: "text-xs font-semibold",
    description: "text-xs",
    close: "h-3 w-3",
  },
  default: {
    root: "max-w-[390px]",
    icon: "h-5 w-5",
    title: "text-sm font-semibold",
    description: "text-sm",
    close: "h-4 w-4",
  },
  large: {
    root: "max-w-[480px]",
    icon: "h-6 w-6",
    title: "text-base font-semibold",
    description: "text-base",
    close: "h-5 w-5",
  },
}

export const CrmToastProvider = ({ children, swipeDirection = "right" }) => {
  return (
    <Toast.Provider swipeDirection={swipeDirection}>
      {children}
      <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex flex-col gap-2.5 p-4 outline-none" />
    </Toast.Provider>
  )
}

export const CrmToast = ({
  open,
  onOpenChange,
  title,
  description,
  variant = "info",
  action,
  actionAltText,
  size = "default",
  duration,
}) => {
  const ToastIcon = toastVariants[variant]?.icon
  const sizeClasses = sizeVariants[size] || sizeVariants.default

  return (
    <Toast.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={duration}
      className={`group pointer-events-auto relative grid grid-cols-[auto_1fr_auto] items-center gap-x-3 rounded-lg border p-3 shadow-lg data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out] ${toastVariants[variant]?.className} ${sizeClasses.root}`}
    >
      {ToastIcon && (
        <ToastIcon className={sizeClasses.icon} aria-hidden="true" />
      )}

      <div className="flex flex-col gap-0.5">
        {title && (
          <Toast.Title className={sizeClasses.title}>
            {title}
          </Toast.Title>
        )}
        <Toast.Description className={sizeClasses.description}>
          {description}
        </Toast.Description>
      </div>

      <div className="flex items-center gap-2">
        {action && (
          <Toast.Action
            className="[grid-area:_action]"
            asChild
            altText={actionAltText}
          >
            {action}
          </Toast.Action>
        )}
        <Toast.Close className="rounded-md p-1 opacity-70 transition-opacity hover:opacity-100">
          <X className={sizeClasses.close} />
        </Toast.Close>
      </div>
    </Toast.Root>
  )
}

// Keyframes for animations
const style = document.createElement("style")
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(calc(100% + 1rem));
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes hide {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes swipeOut {
    from {
      transform: translateX(var(--radix-toast-swipe-end-x));
    }
    to {
      transform: translateX(calc(100% + 1rem));
    }
  }
`
document.head.appendChild(style)

export default CrmToast
