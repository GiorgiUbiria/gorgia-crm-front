import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { CrmTable } from "components/CrmTable"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import CrmSpinner from "components/CrmSpinner"
import { Download } from "lucide-react"
import useAuth from "hooks/useAuth"
import {
  useDesignForms,
  useCreateDesignForm,
  useUpdateDesignFormStatus,
  useDownloadDesignFormAttachment,
  useDeleteAttachment,
} from "queries/designForm"

const DESIGN_TYPES = [
  "ბანერი",
  "სტიკერი",
  "ბადესტიკერი",
  "ნავიგაცია",
  "გასტიკერებული PVC",
  "ფლაერი",
  "სავიზიტო ბარათი",
  "სასაჩუქრე ვაუჩერი",
  "ვობლერი",
  "შელფთოქერი",
  "საგარანტიო",
  "ფასმაჩვენებელი",
  "კატალოგი",
  "ბუკლეტი",
  "ბროშურა",
  "ლაითბოქსი",
  "ბრენდირებული ჩანთა",
  "დროშები",
  "დროშა-ბანერი",
  "ბრენდირებული პოს-მასალა",
]

const schema = yup.object().shape({
  design_type: yup
    .string()
    .oneOf(DESIGN_TYPES, "არასწორი დიზაინის ტიპი")
    .required("დიზაინის ტიპი სავალდებულოა"),
  location: yup.string().required("მდებარეობა სავალდებულოა"),
  description: yup.string().nullable(),
  attachments: yup
    .mixed()
    .test("required", "მინიმუმ ერთი ფაილი სავალდებულოა", value => {
      return value && value.length > 0
    })
    .test("maxFiles", "მაქსიმუმ 10 ფაილის ატვირთვაა შესაძლებელი", value => {
      if (!value || !value.length) return true
      return value.length <= 10
    })
    .test(
      "fileSize",
      "თითოეული ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს",
      value => {
        if (!value || !value.length) return true
        return Array.from(value).every(file => file.size <= 10 * 1024 * 1024)
      }
    )
    .test(
      "fileType",
      "დაშვებულია მხოლოდ jpeg, png, jpg, gif, pdf, doc, docx, xls, xlsx ფორმატის ფაილები",
      value => {
        if (!value || !value.length) return true
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/gif",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ]
        return Array.from(value).every(file => allowedTypes.includes(file.type))
      }
    ),
  status_change_comment: yup.string(),
})

const DesignForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isDeleteAttachmentDialogOpen, setIsDeleteAttachmentDialogOpen] =
    useState(false)
  const [selectedAttachment, setSelectedAttachment] = useState(null)

  const auth = useAuth()
  const { data: designForms, isLoading } = useDesignForms()
  const createDesignForm = useCreateDesignForm()
  const updateStatus = useUpdateDesignFormStatus()
  const downloadAttachment = useDownloadDesignFormAttachment()
  const deleteAttachment = useDeleteAttachment()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = data => {
    createDesignForm.mutate(data, {
      onSuccess: () => {
        setIsOpen(false)
        reset()
      },
    })
  }

  const handleStatusUpdate = (id, status) => {
    updateStatus.mutate(
      {
        id,
        data: {
          status,
          status_change_comment: selectedDesign?.status_change_comment,
        },
      },
      {
        onSuccess: () => {
          setIsStatusDialogOpen(false)
          setSelectedDesign(null)
        },
      }
    )
  }

  const handleApprove = id => {
    setIsConfirmDialogOpen(true)
    setSelectedDesign({ id })
  }

  const handleConfirmApprove = () => {
    handleStatusUpdate(selectedDesign.id, "accepted")
    setIsConfirmDialogOpen(false)
    setSelectedDesign(null)
  }

  const handleDeleteAttachment = () => {
    deleteAttachment.mutate(
      {
        designFormId: selectedDesign.id,
        attachmentId: selectedAttachment.id,
      },
      {
        onSuccess: () => {
          setIsDeleteAttachmentDialogOpen(false)
          setSelectedAttachment(null)
          setSelectedDesign(null)
        },
      }
    )
  }

  const columns = [
    {
      header: "დიზაინის ტიპი",
      accessorKey: "design_type",
    },
    {
      header: "მომთხოვნი",
      accessorKey: "requester.full_name",
    },
    {
      header: "მდებარეობა",
      accessorKey: "location",
    },
    {
      header: "აღწერა",
      accessorKey: "description",
    },
    {
      header: "სტატუსი",
      accessorKey: "status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              row.original.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : row.original.status === "accepted"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.status === "pending"
              ? "მოლოდინში"
              : row.original.status === "accepted"
              ? "დამტკიცებული"
              : "უარყოფილი"}
          </span>
          {row.original.status === "rejected" &&
            row.original.status_change_comment && (
              <span
                className="text-sm text-red-600 dark:!text-red-400"
                title={row.original.status_change_comment}
              >
                (!)
              </span>
            )}
        </div>
      ),
    },
    {
      header: "მოქმედებები",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {(auth.can("role:admin") || auth.isInDepartment(21)) &&
            row.original.status === "pending" && (
              <>
                <DialogButton
                  actionType="approve"
                  size="sm"
                  onClick={() => handleApprove(row.original.id)}
                />
                <DialogButton
                  actionType="reject"
                  size="sm"
                  onClick={() => {
                    setSelectedDesign(row.original)
                    setIsStatusDialogOpen(true)
                  }}
                />
              </>
            )}
        </div>
      ),
    },
    {
      header: "ფაილები",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:!text-gray-400">
            {row.original.attachments.length}
          </span>
          <DialogButton
            icon={Download}
            variant="info"
            size="sm"
            onClick={() => downloadAttachment.mutate(row.original.id)}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:!text-gray-100">
          დიზაინის მოთხოვნები
        </h1>
        <DialogButton actionType="add" onClick={() => setIsOpen(true)} />
      </div>

      <CrmTable
        data={designForms?.data || []}
        columns={columns}
        isLoading={isLoading}
        size="sm"
      />

      <CrmDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title="ახალი დიზაინის მოთხოვნა"
        maxWidth="800px"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                დიზაინის ტიპი
              </label>
              <select
                {...register("design_type")}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                hover:border-gray-400 dark:!hover:border-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="dark:!bg-gray-800">
                  აირჩიეთ ტიპი
                </option>
                {DESIGN_TYPES.map(type => (
                  <option key={type} value={type} className="dark:!bg-gray-800">
                    {type}
                  </option>
                ))}
              </select>
              {errors.design_type && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.design_type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                მდებარეობა
              </label>
              <input
                type="text"
                {...register("location")}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                hover:border-gray-400 dark:!hover:border-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.location && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                აღწერა
              </label>
              <textarea
                {...register("description")}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                hover:border-gray-400 dark:!hover:border-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                ფაილები (მინ. 1, მაქს. 10)
              </label>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx"
                {...register("attachments")}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full text-sm text-gray-500 dark:!text-gray-400
                file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-2 file:border-blue-200 file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                dark:!file:bg-blue-900/50 dark:!file:text-blue-200 dark:!file:hover:bg-blue-900/70 dark:!file:border-blue-800
                file:transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.attachments && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.attachments.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DialogButton
              actionType="cancel"
              onClick={() => setIsOpen(false)}
              type="button"
              disabled={createDesignForm.isLoading}
            />
            {createDesignForm.isLoading ? (
              <CrmSpinner />
            ) : (
              <DialogButton
                actionType="add"
                type="submit"
                loading={createDesignForm.isLoading}
                disabled={createDesignForm.isLoading}
              />
            )}
          </div>
        </form>
      </CrmDialog>

      <CrmDialog
        isOpen={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        title="უარყოფის მიზეზი"
      >
        <div className="space-y-4">
          <textarea
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:!bg-gray-700 dark:!border-gray-600"
            placeholder="შეიყვანეთ უარყოფის მიზეზი"
            value={selectedDesign?.status_change_comment || ""}
            onChange={e =>
              setSelectedDesign(prev => ({
                ...prev,
                status_change_comment: e.target.value,
              }))
            }
          />
          <div className="flex justify-end gap-2">
            <DialogButton
              actionType="cancel"
              onClick={() => {
                setIsStatusDialogOpen(false)
                setSelectedDesign(null)
              }}
            />
            <DialogButton
              actionType="reject"
              onClick={() => handleStatusUpdate(selectedDesign.id, "rejected")}
              disabled={!selectedDesign?.status_change_comment}
            />
          </div>
        </div>
      </CrmDialog>

      <CrmDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="დიზაინის მოთხოვნის დამტკიცება"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:!text-gray-300">
            დარწმუნებული ხართ, რომ გსურთ დიზაინის მოთხოვნის დამტკიცება?
          </p>
          <div className="flex justify-end gap-2">
            <DialogButton
              actionType="cancel"
              onClick={() => {
                setIsConfirmDialogOpen(false)
                setSelectedDesign(null)
              }}
            />
            <DialogButton
              actionType="approve"
              onClick={handleConfirmApprove}
              disabled={updateStatus.isLoading}
              loading={updateStatus.isLoading}
            />
          </div>
        </div>
      </CrmDialog>

      <CrmDialog
        isOpen={isDeleteAttachmentDialogOpen}
        onOpenChange={setIsDeleteAttachmentDialogOpen}
        title="ფაილის წაშლა"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:!text-gray-300">
            დარწმუნებული ხართ, რომ გსურთ ფაილის წაშლა?
          </p>
          <div className="flex justify-end gap-2">
            <DialogButton
              actionType="cancel"
              onClick={() => {
                setIsDeleteAttachmentDialogOpen(false)
                setSelectedAttachment(null)
                setSelectedDesign(null)
              }}
            />
            <DialogButton
              actionType="delete"
              onClick={handleDeleteAttachment}
              disabled={deleteAttachment.isLoading}
              loading={deleteAttachment.isLoading}
            />
          </div>
        </div>
      </CrmDialog>
    </div>
  )
}

export default DesignForm
