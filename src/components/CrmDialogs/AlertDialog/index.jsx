import React from "react"
import * as AlertDialog from "@radix-ui/react-alert-dialog"

const CrmAlertDialog = ({
  isOpen,
  onOpenChange,
  trigger,
  title,
  description,
  cancelText = "გაუქმება",
  actionText = "დადასტურება",
  actionVariant = "danger",
  onAction,
  onCancel,
}) => (
  <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
    {trigger && <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>}
    <AlertDialog.Portal>
      <AlertDialog.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-overlayShow" />
      <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow dark:bg-gray-800">
        <AlertDialog.Title className="m-0 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </AlertDialog.Title>
        <AlertDialog.Description className="mb-5 mt-2.5 text-sm leading-normal text-gray-600 dark:text-gray-400">
          {description}
        </AlertDialog.Description>
        <div className="mt-6 flex justify-end gap-3">
          <AlertDialog.Cancel asChild>
            <button
              onClick={onCancel}
              className="inline-flex h-9 items-center justify-center rounded-md bg-gray-100 px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-700 dark:text-gray-100"
            >
              {cancelText}
            </button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button
              onClick={onAction}
              className={`inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                actionVariant === "danger"
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {actionText}
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  </AlertDialog.Root>
)

export default CrmAlertDialog
