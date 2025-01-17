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

export const AddButton = ({ props, label = "დამატება", size = "md" }) => (
  <BaseButton variant="primary" icon={Plus} size={size} {...props}>
    {label}
  </BaseButton>
)

export const EditButton = ({ props, label = "რედაქტირება", size = "md" }) => (
  <BaseButton variant="info" icon={Pencil} size={size} {...props}>
    {label}
  </BaseButton>
)

export const DeleteButton = ({ props, label = "წაშლა", size = "md" }) => (
  <BaseButton variant="danger" icon={Trash2} size={size} {...props}>
    {label}
  </BaseButton>
)

export const CancelButton = ({ props, label = "გაუქმება", size = "md" }) => (
  <BaseButton variant="secondary" icon={X} size={size} {...props}>
    {label}
  </BaseButton>
)

export const ApproveButton = ({ props, label = "დამტკიცება", size = "md" }) => (
  <BaseButton variant="success" icon={Check} size={size} {...props}>
    {label}
  </BaseButton>
)

export const RequestButton = ({ props, label = "მოთხოვნა", size = "md" }) => (
  <BaseButton variant="warning" icon={Send} size={size} {...props}>
    {label}
  </BaseButton>
)

export const DownloadPdfButton = ({ props, label = "PDF-ად ჩამოტვირთვა", size = "md" }) => (
  <BaseButton variant="info" icon={FileText} size={size} {...props}>
    {label}
  </BaseButton>
)

export const DownloadExcelButton = ({
  props,
  label = "Excel-ად ჩამოტვირთვა",
  size = "md",
}) => (
  <BaseButton variant="success" icon={FileSpreadsheet} size={size} {...props}>
    {label}
  </BaseButton>
)

export const DownloadButton = ({ props, label = "ჩამოტვირთვა", size = "md" }) => (
  <BaseButton variant="primary" icon={Download} size={size} {...props}>
    {label}
  </BaseButton>
)

export const AssignButton = ({ props, label = "მინიჭება", size = "md" }) => (
  <BaseButton variant="info" icon={Send} size={size} {...props}>
    {label}
  </BaseButton>
)
