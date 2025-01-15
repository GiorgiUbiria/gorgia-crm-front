import React from "react"
import { BaseButton } from "./BaseButton"
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

export const AddButton = props => (
  <BaseButton
    variant="primary"
    icon={Plus}
    size="md"
    {...props}
  >
    დამატება
  </BaseButton>
)

export const EditButton = props => (
  <BaseButton
    variant="info"
    icon={Pencil}
    size="md"
    {...props}
  >
    რედაქტირება
  </BaseButton>
)

export const DeleteButton = props => (
  <BaseButton
    variant="danger"
    icon={Trash2}
    size="md"
    {...props}
  >
    წაშლა
  </BaseButton>
)

export const CancelButton = props => (
  <BaseButton
    variant="secondary"
    icon={X}
    size="md"
    {...props}
  >
    გაუქმება
  </BaseButton>
)

export const ApproveButton = props => (
  <BaseButton
    variant="success"
    icon={Check}
    size="md"
    {...props}
  >
    დამტკიცება
  </BaseButton>
)

export const RequestButton = props => (
  <BaseButton
    variant="warning"
    icon={Send}
    size="md"
    {...props}
  >
    მოთხოვნა
  </BaseButton>
)

export const DownloadPdfButton = props => (
  <BaseButton
    variant="info"
    icon={FileText}
    size="md"
    {...props}
  >
    PDF-ად ჩამოტვირთვა
  </BaseButton>
)

export const DownloadExcelButton = props => (
  <BaseButton
    variant="success"
    icon={FileSpreadsheet}
    size="md"
    {...props}
  >
    Excel-ად ჩამოტვირთვა
  </BaseButton>
)

export const DownloadButton = props => (
  <BaseButton
    variant="primary"
    icon={Download}
    size="md"
    {...props}
  >
    ჩამოტვირთვა
  </BaseButton>
)
