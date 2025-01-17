import React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { BaseButton } from "components/CrmActionButtons"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Send,
  FileText,
  FileSpreadsheet,
  Download,
} from "lucide-react"

const actionTypes = {
  add: {
    variant: "primary",
    icon: Plus,
    label: "დამატება",
  },
  edit: {
    variant: "info",
    icon: Pencil,
    label: "რედაქტირება",
  },
  delete: {
    variant: "danger",
    icon: Trash2,
    label: "წაშლა",
  },
  cancel: {
    variant: "secondary",
    icon: X,
    label: "გაუქმება",
  },
  approve: {
    variant: "success",
    icon: Check,
    label: "დამტკიცება",
  },
  reject: {
    variant: "destructive",
    icon: X,
    label: "უარყოფა",
  },
  request: {
    variant: "warning",
    icon: Send,
    label: "მოთხოვნა",
  },
  downloadPdf: {
    variant: "info",
    icon: FileText,
    label: "PDF-ად ჩამოტვირთვა",
  },
  downloadExcel: {
    variant: "success",
    icon: FileSpreadsheet,
    label: "Excel-ად ჩამოტვირთვა",
  },
  download: {
    variant: "primary",
    icon: Download,
    label: "ჩამოტვირთვა",
  },
  assign: {
    variant: "info",
    icon: Send,
    label: "მინიჭება",
  },
}

const CrmDialog = ({
  isOpen,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  maxWidth = "450px",
}) => (
  <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
    {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-overlayShow" />
      <Dialog.Content
        className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow dark:!bg-gray-800"
        style={{ maxWidth }}
      >
        {title && (
          <Dialog.Title className="m-0 text-lg font-semibold text-gray-900 dark:!text-gray-100">
            {title}
          </Dialog.Title>
        )}
        {description && (
          <Dialog.Description className="mb-5 mt-2.5 text-sm leading-normal text-gray-600 dark:!text-gray-400">
            {description}
          </Dialog.Description>
        )}

        <div className="mt-4">{children}</div>

        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}

        <Dialog.Close asChild>
          <button
            className="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:!text-gray-400 dark:!hover:text-gray-300"
            aria-label="Close"
          >
            <Cross2Icon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

export const DialogButton = ({
  actionType,
  label,
  variant,
  icon: CustomIcon,
  size = "md",
  ...props
}) => {
  // If actionType is provided, use predefined styles
  const actionConfig = actionType ? actionTypes[actionType] : null
  
  // Use either the action config or provided props
  const buttonVariant = variant || (actionConfig?.variant ?? "primary")
  const Icon = CustomIcon || (actionConfig?.icon ?? null)
  const buttonLabel = label || (actionConfig?.label ?? "")

  return (
    <BaseButton
      variant={buttonVariant}
      icon={Icon}
      size={size}
      {...props}
    >
      {buttonLabel}
    </BaseButton>
  )
}

export default CrmDialog
