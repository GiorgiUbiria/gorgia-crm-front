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

export const AddButton = ({ props, label = "დამატება" }) => (
  <BaseButton variant="primary" icon={Plus} size="md" {...props}>
    {label}
  </BaseButton>
)

export const EditButton = ({ props, label = "რედაქტირება" }) => (
  <BaseButton variant="info" icon={Pencil} size="md" {...props}>
    {label}
  </BaseButton>
)

export const DeleteButton = ({ props, label = "წაშლა" }) => (
  <BaseButton variant="danger" icon={Trash2} size="md" {...props}>
    {label}
  </BaseButton>
)

export const CancelButton = ({ props, label = "გაუქმება" }) => (
  <BaseButton variant="secondary" icon={X} size="md" {...props}>
    {label}
  </BaseButton>
)

export const ApproveButton = ({ props, label = "დამტკიცება" }) => (
  <BaseButton variant="success" icon={Check} size="md" {...props}>
    {label}
  </BaseButton>
)

export const RequestButton = ({ props, label = "მოთხოვნა" }) => (
  <BaseButton variant="warning" icon={Send} size="md" {...props}>
    {label}
  </BaseButton>
)

export const DownloadPdfButton = ({ props, label = "PDF-ად ჩამოტვირთვა" }) => (
  <BaseButton variant="info" icon={FileText} size="md" {...props}>
    {label}
  </BaseButton>
)

export const DownloadExcelButton = ({ props, label = "Excel-ად ჩამოტვირთვა" }) => (
  <BaseButton variant="success" icon={FileSpreadsheet} size="md" {...props}>
    {label}
  </BaseButton>
)

export const DownloadButton = ({ props, label = "ჩამოტვირთვა" }) => (
  <BaseButton variant="primary" icon={Download} size="md" {...props}>
    {label}
  </BaseButton>
)

export const AssignButton = ({ props, label = "მინიჭება" }) => (
  <BaseButton variant="info" icon={Send} size="md" {...props}>
    {label}
  </BaseButton>
)
