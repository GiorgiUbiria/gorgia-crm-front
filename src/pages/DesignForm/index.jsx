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
  reason_for_request: yup.string().required("მოთხოვნის მიზეზი სავალდებულოა"),
  brand_product_name: yup
    .string()
    .required("ბრენდის/პროდუქტის სახელი სავალდებულოა"),
  main_messages: yup.string(),
  design_placement_description: yup.string(),
  advertisement_placement_photo: yup
    .mixed()
    .test("required", "რეკლამის განთავსების ფოტო სავალდებულოა", value => {
      return value && value.length > 0
    })
    .test("fileSize", "ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს", value => {
      if (!value || !value[0]) return true
      return value[0].size <= 10 * 1024 * 1024
    })
    .test("fileType", "ფაილი უნდა იყოს სურათი", value => {
      if (!value || !value[0]) return true
      return value[0].type.startsWith("image/")
    }),
  length: yup
    .number()
    .typeError("სიგრძე უნდა იყოს რიცხვი")
    .min(0, "სიგრძე არ შეიძლება იყოს უარყოფითი")
    .required("სიგრძე სავალდებულოა"),
  width: yup
    .number()
    .typeError("სიგანე უნდა იყოს რიცხვი")
    .min(0, "სიგანე არ შეიძლება იყოს უარყოფითი")
    .required("სიგანე სავალდებულოა"),
  dimension: yup.string().required("განზომილება სავალდებულოა"),
  installation_location: yup
    .string()
    .required("დამონტაჟების ადგილი სავალდებულოა"),
  is_photo_high_quality: yup.string().oneOf(["yes", "no"]),
  payer_information: yup
    .string()
    .required("გადამხდელის ინფორმაცია სავალდებულოა"),
  employee_taking_product: yup
    .string()
    .required("პროდუქტის მიმღები თანამშრომელი სავალდებულოა"),
  status_change_comment: yup.string(),
})

const DesignForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const auth = useAuth()
  const { data: designForms, isLoading } = useDesignForms()
  const createDesignForm = useCreateDesignForm()
  const updateStatus = useUpdateDesignFormStatus()
  const downloadAttachment = useDownloadDesignFormAttachment()

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

  const columns = [
    {
      id: "expander",
      header: "",
      cell: ({ row }) => (
        <button
          onClick={row.getToggleExpandedHandler()}
          className="px-2 py-1 rounded-md hover:bg-gray-100 dark:!hover:bg-gray-700"
        >
          {row.getIsExpanded() ? "▼" : "▶"}
        </button>
      ),
    },
    {
      header: "დიზაინის ტიპი",
      accessorKey: "design_type",
    },
    {
      header: "მომთხოვნი",
      accessorKey: "requester.full_name",
    },
    {
      header: "ბრენდი/პროდუქტის დასახელება",
      accessorKey: "brand_product_name",
    },
    {
      header: "ვინ ანაზღაურებს ამ თანხას?",
      accessorKey: "payer_information",
    },
    {
      header: "თანამშრომელი, რომელიც საბოლოოდ ჩაიბარებს მოთხოვნილ პროდუქციას",
      accessorKey: "employee_taking_product",
    },
    {
      header: "სტატუსი",
      accessorKey: "status",
      cell: ({ row }) => (
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
      ),
    },
    {
      header: "მოქმედებები",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DialogButton
            icon={Download}
            variant="info"
            size="sm"
            onClick={() => downloadAttachment.mutate(row.original.id)}
          />
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
  ]

  const renderSubComponent = ({ row }) => {
    const design = row.original
    return (
      <div className="p-6 bg-white dark:!bg-gray-800 shadow-inner border-t border-gray-200 dark:!border-gray-700">
        {design.status_change_comment && (
          <div className="mb-6 bg-red-50 dark:!bg-red-900/30 text-red-800 dark:!text-red-200 p-4 rounded-md border border-red-200 dark:!border-red-800">
            <p className="font-medium mb-1">უარყოფის მიზეზი:</p>
            <p className="text-red-700 dark:!text-red-300">
              {design.status_change_comment}
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-gray-50 dark:!bg-gray-700/50 p-4 rounded-md border border-gray-200 dark:!border-gray-600">
              <h4 className="font-semibold mb-3 text-gray-900 dark:!text-gray-100">
                მოთხოვნის დეტალები
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    მიზნობრიობა. მიზეზი, რის გამოც ხდება მოცემული დიზაინის
                    მოთხოვნა:
                  </p>
                  <p className="text-gray-600 dark:!text-gray-400">
                    {design.reason_for_request}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    ძირითადი მესიჯები, რისი კომუნიკაციაც უნდა მოხდეს დიზაინზე:
                  </p>
                  <p className="text-gray-600 dark:!text-gray-400">
                    {design.main_messages || "-"}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    დიზაინის განთავსების ადგილის აღწერა:
                  </p>
                  <p className="text-gray-600 dark:!text-gray-400">
                    {design.design_placement_description || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:!bg-gray-700/50 p-4 rounded-md border border-gray-200 dark:!border-gray-600">
              <h4 className="font-semibold mb-3 text-gray-900 dark:!text-gray-100">
                ზომები და ადგილმდებარეობა
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-700 dark:!text-gray-300 mb-1">
                      სიგრძე:
                    </p>
                    <p className="text-gray-600 dark:!text-gray-400">
                      {design.dimensions.length} {design.dimensions.unit}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 dark:!text-gray-300 mb-1">
                      სიგანე:
                    </p>
                    <p className="text-gray-600 dark:!text-gray-400">
                      {design.dimensions.width} {design.dimensions.unit}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700 dark:!text-gray-300 mb-1">
                    გეოგრაფიული ლოკაცია, სადაც უნდა მოხდეს ინსტალაცია:
                  </p>
                  <p className="text-gray-600 dark:!text-gray-400">
                    {design.installation_location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
        renderSubComponent={renderSubComponent}
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
                მიზნობრიობა. მიზეზი, რის გამოც ხდება მოცემული დიზაინის მოთხოვნა
              </label>
              <input
                type="text"
                {...register("reason_for_request")}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                hover:border-gray-400 dark:!hover:border-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.reason_for_request && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.reason_for_request.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                ბრენდის/პროდუქტის სახელი
              </label>
              <input
                type="text"
                {...register("brand_product_name")}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                hover:border-gray-400 dark:!hover:border-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.brand_product_name && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.brand_product_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                ძირითადი მესიჯები, რისი კომუნიკაციაც უნდა მოხდეს დიზაინზე
              </label>
              <textarea
                {...register("main_messages")}
                rows={3}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                hover:border-gray-400 dark:!hover:border-gray-500 resize-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.main_messages && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.main_messages.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                დიზაინის განთავსების ადგილის აღწერა
              </label>
              <textarea
                {...register("design_placement_description")}
                rows={3}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                hover:border-gray-400 dark:!hover:border-gray-500 resize-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.design_placement_description && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.design_placement_description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                ადგილის ფოტო, სადაც უნდა მოხდეს მონტაჟი
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("advertisement_placement_photo")}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full text-sm text-gray-500 dark:!text-gray-400
                file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-2 file:border-blue-200 file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                dark:!file:bg-blue-900/50 dark:!file:text-blue-200 dark:!file:hover:bg-blue-900/70 dark:!file:border-blue-800
                file:transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.advertisement_placement_photo && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.advertisement_placement_photo.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                  სიგრძე
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("length")}
                  disabled={createDesignForm.isLoading}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                  hover:border-gray-400 dark:!hover:border-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.length && (
                  <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                    {errors.length.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                  სიგანე
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("width")}
                  disabled={createDesignForm.isLoading}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                  hover:border-gray-400 dark:!hover:border-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.width && (
                  <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                    {errors.width.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                  განზომილება
                </label>
                <input
                  type="text"
                  placeholder="მაგ: სმ, მ, პიქსელი"
                  {...register("dimension")}
                  disabled={createDesignForm.isLoading}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                  hover:border-gray-400 dark:!hover:border-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.dimension && (
                  <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                    {errors.dimension.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                გეოგრაფიული ლოკაცია, სადაც უნდა მოხდეს ინსტალაცია
              </label>
              <input
                type="text"
                {...register("installation_location")}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                hover:border-gray-400 dark:!hover:border-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.installation_location && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.installation_location.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-3">
                დაურთეთ, თუ არა დიზაინისთვის საჭირო მაღალი განზომილების
                ლოგო/ფოტო მოთხოვნის ფორმას?
              </label>
              <div className="space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("is_photo_high_quality")}
                    value="yes"
                    disabled={createDesignForm.isLoading}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:!border-gray-600
                    dark:!bg-gray-800 dark:!checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="ml-2 text-gray-900 dark:!text-gray-100">
                    დიახ
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    {...register("is_photo_high_quality")}
                    value="no"
                    disabled={createDesignForm.isLoading}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:!border-gray-600
                    dark:!bg-gray-800 dark:!checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="ml-2 text-gray-900 dark:!text-gray-100">
                    არა
                  </span>
                </label>
              </div>
              {errors.is_photo_high_quality && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.is_photo_high_quality.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                ვინ ანაზღაურებს ამ თანხას?
              </label>
              <input
                type="text"
                {...register("payer_information")}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                hover:border-gray-400 dark:!hover:border-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.payer_information && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.payer_information.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:!text-gray-100 mb-1.5">
                თანამშრომლის სახელი გვარი, რომელიც საბოლოოდ ჩაიბარებს მოთხოვნილ
                პროდუქციას
              </label>
              <input
                type="text"
                {...register("employee_taking_product")}
                disabled={createDesignForm.isLoading}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 bg-white dark:!bg-gray-800 shadow-sm transition-colors
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:!border-gray-600 dark:!text-gray-100
                hover:border-gray-400 dark:!hover:border-gray-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {errors.employee_taking_product && (
                <p className="mt-1.5 text-sm text-red-600 dark:!text-red-400">
                  {errors.employee_taking_product.message}
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
    </div>
  )
}

export default DesignForm
