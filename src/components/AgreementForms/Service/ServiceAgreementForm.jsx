import React, { useState } from "react"
import classnames from "classnames"
import { createAgreement } from "services/serviceAgreement"
import { toast } from "store/zustand/toastStore"
import {
  BsFileEarmarkText,
  BsChevronLeft,
  BsChevronRight,
  BsCheckCircle,
  BsExclamationTriangle,
  BsPerson,
  BsBank,
} from "react-icons/bs"

const ServiceAgreementForm = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState(1)
  const [passedSteps, setPassedSteps] = useState([1])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    executor_firm_name: "",
    executor_id_number: "",
    executor_home_address: "",
    executor_factual_address: "",
    executor_full_name: "",
    executor_position: "",
    executor_bank_account: "",
    executor_bank_name: "",
    executor_bank_swift: "",
    service_type: "",
    service_place: "",
    service_term: "",
    service_cost: "",
    service_payment_details: "",
    service_active_term: "",
    director_full_name: "",
    director_id_number: "",
    file_path: "",
  })

  const handleInputChange = e => {
    const { id, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }))
    validateField(id, value)
  }

  const validateField = (field, value) => {
    let errorMsg = ""

    switch (field) {
      case "executor_firm_name":
      case "executor_home_address":
      case "executor_factual_address":
      case "executor_full_name":
      case "executor_position":
      case "executor_bank_account":
      case "executor_bank_name":
      case "service_type":
      case "service_place":
      case "service_payment_details":
      case "director_full_name":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      case "executor_id_number":
      case "director_id_number":
        if (!value) errorMsg = "ველი არ შეიძლება იყოს ცარიელი"
        else if (value.length < 9 || value.length > 11)
          errorMsg = "უნდა შედგებოდეს 9-დან 11 სიმბოლომდე"
        break
      case "executor_bank_swift":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (value.length !== 8) errorMsg = "უნდა შედგებოდეს 8 სიმბოლოსგან"
        break
      case "service_term":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (isNaN(value) || Number(value) < 1)
          errorMsg = "უნდა იყოს დადებითი მთელი რიცხვი"
        break
      case "service_cost":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (isNaN(value) || Number(value) < 0)
          errorMsg = "უნდა იყოს არაუარყოფითი რიცხვი"
        else if (!/^\d+(\.\d{0,2})?$/.test(value))
          errorMsg = "არ უნდა ჰქონდეს 2-ზე მეტი ათობითი ადგილი"
        break
      case "service_active_term":
        if (!value) errorMsg = "ველი აუცილებელია"
        else if (new Date(value) <= new Date())
          errorMsg = "თარიღი უნდა იყოს მომავალში"
        break
      default:
        console.warn(`ველს არ გააჩნია ვალიდაციის წესი: ${field}`)
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: errorMsg,
    }))

    return !errorMsg
  }

  const validateForm = () => {
    let isValid = true
    Object.keys(formData).forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false
      }
    })

    if (!isValid) {
      toast.error("გთხოვთ შეავსოთ ყველა სავალდებულო ველი", "შეცდომა", {
        duration: 2000,
        size: "small",
      })
    }

    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    toast.info("მიმდინარეობს დამუშავება...", "დამუშავება", {
      duration: 2000,
      size: "small",
    })

    const formDataToSend = new FormData()

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        if (key === "service_term") {
          formDataToSend.append(key, parseInt(value))
        } else if (key === "service_cost") {
          formDataToSend.append(key, parseFloat(value).toFixed(2))
        } else {
          formDataToSend.append(key, value)
        }
      }
    })

    try {
      const response = await createAgreement(formDataToSend)

      if (response) {
        toast.success("ხელშეკრულება წარმატებით შეიქმნა", "წარმატება", {
          duration: 2000,
          size: "small",
        })
        setFormData({
          executor_firm_name: "",
          executor_id_number: "",
          executor_home_address: "",
          executor_factual_address: "",
          executor_full_name: "",
          executor_position: "",
          executor_bank_account: "",
          executor_bank_name: "",
          executor_bank_swift: "",
          service_type: "",
          service_place: "",
          service_term: "",
          service_cost: "",
          service_payment_details: "",
          service_active_term: "",
          director_full_name: "",
          director_id_number: "",
          file_path: "",
        })
        setActiveTab(4)
        setPassedSteps(prevSteps => [...prevSteps, 4])
        setErrors({})
        onSuccess?.()
      }
    } catch (error) {
      handleError(error)
    }
  }

  const handleError = error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error(
            "არასწორი მოაცემებ. გთხოვთ შამოწმოთ შეყვანილი ინფორმაცია",
            "შეცდომა",
            {
              duration: 2000,
              size: "small",
            }
          )
          break
        case 401:
          toast.error("გთხოვთ გაიაროთ ავტორიზაცია", "შეცდომა", {
            duration: 2000,
            size: "small",
          })
          break
        case 422: {
          const validationErrors = error.response.data.errors
          Object.keys(validationErrors).forEach(key => {
            toast.error(validationErrors[key][0], "შეცდომა", {
              duration: 2000,
              size: "small",
            })
          })
          break
        }
        case 500:
          toast.error(
            "სერვერის შეცდომა. გთხოვთ სცადოთ მოგვიანებით",
            "შეცდომა",
            {
              duration: 2000,
              size: "small",
            }
          )
          break
        default:
          toast.error(
            "დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით",
            "შეცდომა",
            {
              duration: 2000,
              size: "small",
            }
          )
      }
    } else if (error.request) {
      toast.error(
        "კავშირის შეცდომა. გთხოვთ შეამოწმოთ ინტერნეტ კავშირი",
        "შეცდომა",
        {
          duration: 2000,
          size: "small",
        }
      )
    } else {
      toast.error("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით", "შეცდომა", {
        duration: 2000,
        size: "small",
      })
    }
  }

  const toggleTab = tab => {
    if (activeTab !== tab) {
      if (tab === 4 && activeTab === 3) {
        handleSubmit()
      } else {
        const modifiedSteps = [...passedSteps, tab]
        if (tab >= 1 && tab <= 4) {
          setActiveTab(tab)
          setPassedSteps(modifiedSteps)
        }
      }
    }
  }

  const hasStepErrors = stepNumber => {
    const stepFields = {
      1: [
        "executor_firm_name",
        "executor_id_number",
        "executor_home_address",
        "executor_factual_address",
        "executor_full_name",
        "executor_position",
      ],
      2: [
        "executor_bank_account",
        "executor_bank_name",
        "executor_bank_swift",
        "director_full_name",
        "director_id_number",
      ],
      3: [
        "service_type",
        "service_place",
        "service_term",
        "service_cost",
        "service_payment_details",
        "service_active_term",
      ],
    }

    return stepFields[stepNumber]?.some(field => errors[field])
  }

  const hasStepData = stepNumber => {
    const stepFields = {
      1: [
        "executor_firm_name",
        "executor_id_number",
        "executor_home_address",
        "executor_factual_address",
        "executor_full_name",
        "executor_position",
      ],
      2: [
        "executor_bank_account",
        "executor_bank_name",
        "executor_bank_swift",
        "director_full_name",
        "director_id_number",
      ],
      3: [
        "service_type",
        "service_place",
        "service_term",
        "service_cost",
        "service_payment_details",
        "service_active_term",
      ],
    }

    return stepFields[stepNumber]?.some(field => formData[field])
  }

  return (
    <div className="p-4">
      <div className="relative mb-12">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:!bg-gray-700 -translate-y-1/2"></div>
        <div className="relative flex justify-between items-center">
          {[
            { label: "შემსრულებლის ინფორმაცია", icon: <BsPerson size={24} /> },
            { label: "საბანკო დეტალები", icon: <BsBank size={24} /> },
            { label: "სერვისის დეტალები", icon: <BsFileEarmarkText size={24} /> },
          ].map((step, index) => (
            <div
              key={index}
              className={classnames(
                "flex flex-col items-center relative z-10 transition-all duration-200",
                {
                  "cursor-pointer": passedSteps.includes(index + 1),
                  "cursor-not-allowed":
                    !passedSteps.includes(index + 1) && !hasStepData(index + 1),
                }
              )}
              onClick={() =>
                passedSteps.includes(index + 1) && toggleTab(index + 1)
              }
            >
              <div
                className={classnames(
                  "w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-200 border-2",
                  {
                    "bg-blue-600 border-blue-700 text-white":
                      activeTab === index + 1,
                    "bg-green-600 border-green-700 text-white":
                      passedSteps.includes(index + 1) &&
                      !hasStepErrors(index + 1) &&
                      activeTab !== index + 1,
                    "bg-red-600 border-red-700 text-white": hasStepErrors(
                      index + 1
                    ),
                    "bg-gray-200 border-gray-300 text-gray-500 dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-400":
                      !passedSteps.includes(index + 1) &&
                      !hasStepData(index + 1),
                    "shadow-lg": activeTab === index + 1,
                    "scale-110": activeTab === index + 1,
                  }
                )}
              >
                {step.icon}
              </div>
              <div
                className={classnames(
                  "text-sm font-medium text-center transition-colors duration-200 absolute -bottom-6 w-32 -translate-x-1/2 left-1/2",
                  {
                    "text-blue-600 dark:!text-blue-400":
                      activeTab === index + 1,
                    "text-green-600 dark:!text-green-400":
                      passedSteps.includes(index + 1) &&
                      !hasStepErrors(index + 1) &&
                      activeTab !== index + 1,
                    "text-red-600 dark:!text-red-400": hasStepErrors(index + 1),
                    "text-gray-500 dark:!text-gray-400":
                      !passedSteps.includes(index + 1) &&
                      !hasStepData(index + 1),
                  }
                )}
              >
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={classnames("w-full", { hidden: activeTab !== 1 })}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="executor_firm_name"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                შემსრულებელი ფირმის დასახელება
              </label>
              <input
                type="text"
                id="executor_firm_name"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.executor_firm_name}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ ფირმის დასახელება..."
              />
              {errors.executor_firm_name && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.executor_firm_name}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="executor_id_number"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                საიდენტიფიკაციო ნომერი
              </label>
              <input
                type="text"
                id="executor_id_number"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.executor_id_number}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ 11-ნიშნა საიდენტიფიკაციო ნომერი..."
                maxLength={11}
              />
              {errors.executor_id_number && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.executor_id_number}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="executor_home_address"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                იურიდიული მისამართი
              </label>
              <input
                type="text"
                id="executor_home_address"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.executor_home_address}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ იურიდიული მისამართი..."
              />
              {errors.executor_home_address && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.executor_home_address}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="executor_factual_address"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ფაქტიური მისამართი
              </label>
              <input
                type="text"
                id="executor_factual_address"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.executor_factual_address}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ ფაქტიური მისამართი..."
              />
              {errors.executor_factual_address && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.executor_factual_address}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="executor_full_name"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                შემსრულებლის სახელი და გვარი
              </label>
              <input
                type="text"
                id="executor_full_name"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.executor_full_name}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ სახელი და გვარი..."
              />
              {errors.executor_full_name && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.executor_full_name}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="executor_position"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                შემსრულებლის თანამდებობა
              </label>
              <input
                type="text"
                id="executor_position"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.executor_position}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ თანამდებობა..."
              />
              {errors.executor_position && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.executor_position}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={classnames("w-full", { hidden: activeTab !== 2 })}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="executor_bank_account"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                საბანკო ანგარიშის ნომერი
              </label>
              <input
                type="text"
                id="executor_bank_account"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.executor_bank_account}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ საბანკო ანგარიშის ნომერი..."
              />
              {errors.executor_bank_account && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.executor_bank_account}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="executor_bank_name"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ბანკის დასახელება
              </label>
              <input
                type="text"
                id="executor_bank_name"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.executor_bank_name}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ ბანკის დასახელება..."
              />
              {errors.executor_bank_name && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.executor_bank_name}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="executor_bank_swift"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ბანკის კოდი
              </label>
              <input
                type="text"
                id="executor_bank_swift"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.executor_bank_swift}
                onChange={handleInputChange}
                placeholder="მაგ. BAGAGE22"
                maxLength={8}
              />
              {errors.executor_bank_swift && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.executor_bank_swift}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="director_full_name"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                დირექტორის სახელი და გვარი
              </label>
              <input
                type="text"
                id="director_full_name"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.director_full_name}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ დირექტორის სახელი და გვარი..."
              />
              {errors.director_full_name && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.director_full_name}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="director_id_number"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                დირექტორის პირადი ნომერი
              </label>
              <input
                type="text"
                id="director_id_number"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.director_id_number}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ 11-ნიშნა პირადი ნომერი..."
                maxLength={11}
              />
              {errors.director_id_number && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.director_id_number}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={classnames("w-full", { hidden: activeTab !== 3 })}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="service_type"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                მომსახურების ტიპი
              </label>
              <input
                type="text"
                id="service_type"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.service_type}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ მომსახურების ტიპი..."
              />
              {errors.service_type && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.service_type}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="service_place"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                მომსახურების ადგილი
              </label>
              <input
                type="text"
                id="service_place"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.service_place}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ მომსახურების ადგილი..."
              />
              {errors.service_place && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.service_place}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="service_term"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                მომსახურების ვადა (დღეებში)
              </label>
              <input
                type="number"
                id="service_term"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.service_term}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ მომსახურების ვადა..."
                min="1"
              />
              {errors.service_term && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.service_term}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="service_cost"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                მომსახურების ღირებულება
              </label>
              <input
                type="number"
                id="service_cost"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.service_cost}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ მომსახურების ღირებულება..."
                step="0.01"
                min="0"
              />
              {errors.service_cost && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.service_cost}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="service_payment_details"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                გადახდის დეტალები
              </label>
              <input
                type="text"
                id="service_payment_details"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.service_payment_details}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ გადახდის დეტალები..."
              />
              {errors.service_payment_details && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.service_payment_details}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="service_active_term"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                მომსახურების აქტიური ვადა
              </label>
              <input
                type="date"
                id="service_active_term"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_id,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_id,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.service_active_term}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.service_active_term && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <BsExclamationTriangle />
                  {errors.service_active_term}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={classnames("w-full", { hidden: activeTab !== 4 })}>
        <div className="flex justify-center">
          <div className="text-center max-w-lg">
            <div className="mb-4">
              <BsCheckCircle className="text-6xl text-green-500" />
            </div>
            <h5 className="text-xl font-medium mb-2 text-gray-900 dark:!text-gray-100">
              ხელშეკრულება წარმატებით შეიქმნა!
            </h5>
            <p className="text-gray-600 dark:!text-gray-400">
              თქვენი ხელშეკრულება წარმატებით დარეგისტრირდა სისტემაში.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          className={classnames(
            "px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200",
            {
              "bg-gray-500 text-white hover:bg-gray-600 dark:!bg-gray-700 dark:!hover:bg-gray-600":
                activeTab !== 1,
              invisible: activeTab === 1,
            }
          )}
          onClick={() => toggleTab(activeTab - 1)}
          disabled={activeTab === 1}
        >
          <BsChevronLeft />
          წინა გვერდი
        </button>

        {activeTab === 3 ? (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition-colors duration-200 dark:!bg-green-700 dark:!hover:bg-green-600"
            onClick={handleSubmit}
          >
            დასრულება
            <BsCheckCircle />
          </button>
        ) : (
          <button
            className={classnames(
              "px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200",
              {
                "bg-blue-600 text-white hover:bg-blue-700 dark:!bg-blue-700 dark:!hover:bg-blue-600":
                  activeTab !== 4,
                invisible: activeTab === 4,
              }
            )}
            onClick={() => toggleTab(activeTab + 1)}
            disabled={activeTab === 4}
          >
            შემდეგი გვერდი
            <BsChevronRight />
          </button>
        )}
      </div>
    </div>
  )
}

export default ServiceAgreementForm
