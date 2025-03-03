import React from "react"
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react"
import { Fragment } from "react"
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
  Loader2,
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
  <Transition.Root show={isOpen} as={Fragment}>
    <HeadlessDialog as="div" className="relative z-50" onClose={onOpenChange}>
      {trigger && (
        <HeadlessDialog.Trigger as={Fragment}>
          {trigger}
        </HeadlessDialog.Trigger>
      )}
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/40 transition-opacity" />
      </Transition.Child>

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <HeadlessDialog.Panel
              className="relative w-full transform rounded-lg bg-white text-left shadow-xl transition-all dark:!bg-gray-800"
              style={{ maxWidth }}
            >
              <div className="flex flex-col">
                <div className="flex-none p-6">
                  {title && (
                    <HeadlessDialog.Title className="text-lg font-semibold text-gray-900 dark:!text-gray-100">
                      {title}
                    </HeadlessDialog.Title>
                  )}
                  {description && (
                    <HeadlessDialog.Description className="mt-2.5 text-sm text-gray-600 dark:!text-gray-400">
                      {description}
                    </HeadlessDialog.Description>
                  )}
                </div>

                <div className="relative px-6 flex-1 min-h-0">
                  {children}
                </div>

                {footer && (
                  <div className="p-6 pt-4 flex-none border-t border-gray-200 dark:!border-gray-700 flex justify-end gap-3">
                    {footer}
                  </div>
                )}

                <button
                  type="button"
                  className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:!text-gray-400 dark:!hover:text-gray-300"
                  onClick={() => onOpenChange(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </HeadlessDialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </HeadlessDialog>
  </Transition.Root>
)

export const DialogButton = ({
  actionType,
  label,
  variant,
  icon: CustomIcon,
  size = "md",
  loading = false,
  ...props
}) => {
  const actionConfig = actionType ? actionTypes[actionType] : null

  const buttonVariant = variant || (actionConfig?.variant ?? "primary")
  const Icon = loading ? Loader2 : CustomIcon || (actionConfig?.icon ?? null)
  const buttonLabel = label || (actionConfig?.label ?? "")

  return (
    <BaseButton
      variant={buttonVariant}
      icon={Icon}
      size={size}
      className={loading ? "animate-spin" : ""}
      {...props}
    >
      {buttonLabel}
    </BaseButton>
  )
}

export default CrmDialog
