import React, { useState } from "react"
import classnames from "classnames"
import { createAgreement as createDeliveryAgreement } from "services/deliveryAgreement"
import { toast } from "store/zustand/toastStore"

const DeliveryAgreementForm = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState(1)
  const [passedSteps, setPassedSteps] = useState([1])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    jursdictional_name: "",
    jursdictional_address: "",
    jursdictional_id_number: "",
    agreement_date_of_issue: "",
    agreement_type: "",
    action_act: "",
    sum_cost: "",
    sum_cost_type: "",
    file_path: "",
    director_full_name: "",
    director_id_number: "",
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
      case "jursdictional_name":
      case "jursdictional_address":
      case "agreement_type":
      case "action_act":
      case "sum_cost_type":
      case "director_full_name":
        if (!value) errorMsg = "ველი არ შეიძლება იყოს ცარიელი"
        else if (value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      case "jursdictional_id_number":
      case "director_id_number":
        if (!value) errorMsg = "ველი არ შეიძლება იყოს ცარიელი"
        else if (value.length < 9 || value.length > 11)
          errorMsg = "უნდა შედგებოდეს 9-დან 11 სიმბოლომდე"
        break
      case "agreement_date_of_issue":
        if (!value) errorMsg = "ველი არ შეიძლება იყოს ცარიელი"
        else {
          const date = new Date(value)
          if (isNaN(date.getTime())) errorMsg = "უნდა იყოს ვალიდური თარიღი"
        }
        break
      case "sum_cost":
        if (!value) errorMsg = "ველი არ შეიძლება იყოს ცარიელი"
        else if (isNaN(value) || Number(value) < 0)
          errorMsg = "უნდა იყოს ნლზე მეტი რიცხვი"
        else {
          const decimalPlaces = value.toString().split(".")[1]?.length || 0
          if (decimalPlaces > 2)
            errorMsg = "უნდა შედგებოდეს მაქსიმუმ 2 ათწილადი"
        }
        break
      case "file_path":
        if (value && value.length > 255)
          errorMsg = "მაქსიმალური სიგრძეა 255 სიმბოლო"
        break
      default:
        console.warn(`ველს არ გააჩნია ვალიდაცია: ${field}`)
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

    Object.keys(formData).forEach(key => {
      if (
        formData[key] !== "" &&
        formData[key] !== null &&
        formData[key] !== undefined
      ) {
        if (key === "sum_cost") {
          formDataToSend.append(key, parseFloat(formData[key]).toFixed(2))
        } else {
          formDataToSend.append(key, formData[key])
        }
      }
    })

    formDataToSend.append("status", "pending")

    try {
      const response = await createDeliveryAgreement(formDataToSend)

      if (response) {
        toast.success("მიღება-ჩაბარების აქტი წარმატებით შეიქმნა", "წარმატება", {
          duration: 2000,
          size: "small",
        })
        setFormData({
          jursdictional_name: "",
          jursdictional_address: "",
          jursdictional_id_number: "",
          agreement_date_of_issue: "",
          agreement_type: "",
          action_act: "",
          sum_cost: "",
          sum_cost_type: "",
          file_path: "",
          director_full_name: "",
          director_id_number: "",
        })
        setActiveTab(3)
        setPassedSteps(prevSteps => [...prevSteps, 3])
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
            "არასწორი მოაცემები. გთხოვთ შამოწმოთ შეყვანილი ინფორმაცია",
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
        case 422:
          {
            const validationErrors = error.response.data.errors
            Object.keys(validationErrors).forEach(key => {
              toast.error(validationErrors[key][0], "შეცდომა", {
                duration: 2000,
                size: "small",
              })
            })
          }
          break
        case 500:
          console.log(error.response)
          toast.error("სერვერის შეცდომა. გთხოვთ სცადოთ მოგვიანებით", "შეცდომა", {
            duration: 2000,
            size: "small",
          })
          break
        default:
          toast.error("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით", "შეცდომა", {
            duration: 2000,
            size: "small",
          })
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
      if (tab === 3 && activeTab === 2) {
        handleSubmit()
      } else {
        const modifiedSteps = [...passedSteps, tab]
        if (tab >= 1 && tab <= 3) {
          setActiveTab(tab)
          setPassedSteps(modifiedSteps)
        }
      }
    }
  }

  return (
    <div className="p-4">
      <div className="relative mb-12">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:!bg-gray-700 -translate-y-1/2"></div>
        <div className="relative flex justify-between items-center">
          {[
            { label: "იურიდიული ინფორმაცია", icon: "bx-building" },
            { label: "ხელშეკრულების დეტალები", icon: "bx-file" },
          ].map((step, index) => (
            <div
              key={index}
              className={classnames(
                "flex flex-col items-center relative z-10 transition-all duration-200",
                {
                  "cursor-pointer": passedSteps.includes(index + 1),
                  "cursor-not-allowed": !passedSteps.includes(index + 1),
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
                      activeTab !== index + 1,
                    "bg-gray-200 border-gray-300 text-gray-500 dark:!bg-gray-700 dark:!border-gray-600 dark:!text-gray-400":
                      !passedSteps.includes(index + 1),
                    "shadow-lg": activeTab === index + 1,
                    "scale-110": activeTab === index + 1,
                  }
                )}
              >
                <i className={`bx ${step.icon} text-2xl`}></i>
              </div>
              <div
                className={classnames(
                  "text-sm font-medium text-center transition-colors duration-200 absolute -bottom-6 w-32 -translate-x-1/2 left-1/2",
                  {
                    "text-blue-600 dark:!text-blue-400":
                      activeTab === index + 1,
                    "text-green-600 dark:!text-green-400":
                      passedSteps.includes(index + 1) &&
                      activeTab !== index + 1,
                    "text-gray-500 dark:!text-gray-400": !passedSteps.includes(
                      index + 1
                    ),
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
                htmlFor="jursdictional_name"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                იურიდიული დასახელება
              </label>
              <input
                type="text"
                id="jursdictional_name"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.jursdictional_name,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.jursdictional_name,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.jursdictional_name}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ იურიდიული დასახელება..."
              />
              {errors.jursdictional_name && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.jursdictional_name}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="jursdictional_address"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                იურიდიული მიამართი/ფაქტიური მისამართი
              </label>
              <input
                type="text"
                id="jursdictional_address"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.jursdictional_address,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.jursdictional_address,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.jursdictional_address}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ იურიდიული/ფაქტიური მისამართი..."
              />
              {errors.jursdictional_address && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.jursdictional_address}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="jursdictional_id_number"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                საიდენტიფიკაციო კოდი/პირადი ნომერი
              </label>
              <input
                type="text"
                id="jursdictional_id_number"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.jursdictional_id_number,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.jursdictional_id_number,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.jursdictional_id_number}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ საიდენტიფიკაციო კოდი/პირადი ნომერი..."
                maxLength={11}
              />
              {errors.jursdictional_id_number && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.jursdictional_id_number}
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
                      errors.director_full_name,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.director_full_name,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.director_full_name}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ დირექტორის სახელი და გვარი..."
              />
              {errors.director_full_name && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
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
                      errors.director_id_number,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.director_id_number,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.director_id_number}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ დირექტორის ტირადი ნომერი..."
                maxLength={11}
              />
              {errors.director_id_number && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.director_id_number}
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
                htmlFor="agreement_date_of_issue"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ხელშეკრულების გაფორმების თარიღი
              </label>
              <input
                type="date"
                id="agreement_date_of_issue"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.agreement_date_of_issue,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.agreement_date_of_issue,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.agreement_date_of_issue}
                onChange={handleInputChange}
              />
              {errors.agreement_date_of_issue && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.agreement_date_of_issue}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="agreement_type"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ხელშეკრულების ტიპი
              </label>
              <input
                type="text"
                id="agreement_type"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.agreement_type,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.agreement_type,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.agreement_type}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ ხელშეკრულების ტიპი..."
              />
              {errors.agreement_type && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.agreement_type}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="action_act"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                მიღება-ჩაბარების აქტით გათვალისწინებული ქმედება
              </label>
              <input
                type="text"
                id="action_act"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.action_act,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.action_act,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.action_act}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ მოქმედების აქტი..."
              />
              {errors.action_act && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.action_act}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="sum_cost"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                შესრულებული სამუშაოს ჯამური ღირებულება
              </label>
              <input
                type="number"
                id="sum_cost"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.sum_cost,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.sum_cost,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.sum_cost}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ თანხის ოდენობა..."
                step="0.01"
              />
              {errors.sum_cost && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.sum_cost}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="sum_cost_type"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ღირებულების შამადგენლობა
              </label>
              <select
                id="sum_cost_type"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.sum_cost_type,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.sum_cost_type,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                value={formData.sum_cost_type}
                onChange={handleInputChange}
              >
                <option value="">აირჩიეთ ღირებულების შამადგენლობა...</option>
                <option value="დღგ-ს ჩათვლით">დღგ-ს ჩათვლით</option>
                <option value="დღგ-ს გარეშე">დღგ-ს გარეშე</option>
                <option value="ყველანაირი გადასახადის ჩათვლით">
                  ყველანაირი გადასახადის ჩათვლით
                </option>
                <option value="ყველანაირი გადასახადის გარეშე">
                  ყველანაირი გადასახადის გარეშე
                </option>
              </select>
              {errors.sum_cost_type && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.sum_cost_type}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={classnames("w-full", { hidden: activeTab !== 3 })}>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="mb-4">
              <i className="mdi mdi-check-circle-outline text-success display-4" />
            </div>
            <div>
              <h5>შეკვეთა წარმატებით დასრულდა!</h5>
              <p className="text-muted">თქვენი შეკვეთა წარმატებით შესრულდა.</p>
            </div>
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
          <i className="bx bx-chevron-left"></i>
          წინა გვერდი
        </button>

        {activeTab === 2 ? (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition-colors duration-200 dark:!bg-green-700 dark:!hover:bg-green-600"
            onClick={handleSubmit}
          >
            დასრულება
            <i className="bx bx-check-circle"></i>
          </button>
        ) : (
          <button
            className={classnames(
              "px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-200",
              {
                "bg-blue-600 text-white hover:bg-blue-700 dark:!bg-blue-700 dark:!hover:bg-blue-600":
                  activeTab !== 3,
                invisible: activeTab === 3,
              }
            )}
            onClick={() => toggleTab(activeTab + 1)}
            disabled={activeTab === 3}
          >
            შემდეგი გვერდი
            <i className="bx bx-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  )
}

export default DeliveryAgreementForm
