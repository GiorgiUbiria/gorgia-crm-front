import React, { useState, useCallback } from "react"
import classnames from "classnames"
import { toast } from "react-toastify"
import { createAgreement } from "services/agreement"

const StandardAgreementForm = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState(1)
  const [passedSteps, setPassedSteps] = useState([1])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    contragent_name: "",
    contragent_id: "",
    contragent_address: "",
    contragent_phone_number: "",
    contragent_email: "",
    contragent_director_name: "",
    contragent_director_phone_number: "",
    conscription_term: "",
    product_delivery_address: "",
    bank_account: "",
    file_path: "",
    status: "pending",
    payment_different_terms: false,
    advance_payment_percentage: "",
    remaining_payment_percentage: "",
    contract_initiator_name: "",
    products: [
      {
        product_name: "",
        product_price: "",
        specification: "",
        product_quantity: "",
      },
    ],
    product_payment_term: "",
  })

  const calculateProductCost = useCallback(products => {
    return products.reduce((total, product) => {
      const price = parseFloat(product.product_price) || 0
      const quantity = parseInt(product.product_quantity) || 0
      return total + price * quantity
    }, 0)
  }, [])

  const handleInputChange = e => {
    const { id, value, type, checked } = e.target
    setFormData(prevData => {
      const newData = { ...prevData }

      if (id === "payment_different_terms") {
        newData[id] = checked
        if (!checked) {
          newData.advance_payment_percentage = ""
          newData.remaining_payment_percentage = ""
        }
      } else if (id === "advance_payment_percentage") {
        const numValue = parseFloat(value) || 0
        newData[id] = value
        if (numValue >= 0 && numValue <= 100) {
          newData.remaining_payment_percentage = (100 - numValue).toFixed(2)
        }
      } else if (id === "remaining_payment_percentage") {
        const numValue = parseFloat(value) || 0
        newData[id] = value
        if (numValue >= 0 && numValue <= 100) {
          newData.advance_payment_percentage = (100 - numValue).toFixed(2)
        }
      } else {
        newData[id] = type === "checkbox" ? checked : value
      }

      return newData
    })
    validateField(id, type === "checkbox" ? checked : value)
  }

  const validateField = (field, value) => {
    let errorMsg = ""

    switch (field) {
      case "contragent_name":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "contragent_address":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "contragent_email":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "contragent_director_name":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "product_delivery_address":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "bank_account":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "contragent_id":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        else if (value.length < 9 || value.length > 11)
          errorMsg = "უნდა შედგებოდეს 9-დან 11 სიმბოლომდე"
        break
      case "contract_initiator_name":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        break
      case "contragent_phone_number":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        else if (value.length > 20) errorMsg = "მაქსიმალური სიგრძეა 20 სიმბოლო"
        break
      case "contragent_director_phone_number":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        else if (value.length > 20) errorMsg = "მაქსიმალური სიგრძეა 20 სიმბოლო"
        break
      case "conscription_term":
        if (!value && value !== 0) errorMsg = "ველი აუცილებელია"
        else if (isNaN(value) || Number(value) < 1)
          errorMsg = "უნდა იყოს დადებითი მთელი რიცხვი"
        break
      case "advance_payment_percentage":
        if (formData.payment_different_terms && !value && value !== 0)
          errorMsg = "ველი აუცილებელია"
        else if (
          value &&
          (isNaN(value) || Number(value) < 0 || Number(value) > 100)
        )
          errorMsg = "უნდა იყოს 0-დან 100-მდე"
        break
      case "remaining_payment_percentage":
        if (formData.payment_different_terms && !value && value !== 0)
          errorMsg = "ველი აუცილებელია"
        else if (
          value &&
          (isNaN(value) || Number(value) < 0 || Number(value) > 100)
        )
          errorMsg = "უნდა იყოს 0-დან 100-მდე"
        break
      case "products":
        if (!Array.isArray(value)) {
          errorMsg = "პროდუქტები უნდა იყოს მასივი"
        } else if (value.length === 0) {
          errorMsg = "მინიმუმ ერთი პროდუქტი აუცილებელია"
        } else {
          const invalidProduct = value.find(
            product =>
              !product.product_name?.trim() ||
              !product.product_price ||
              isNaN(product.product_price) ||
              Number(product.product_price) <= 0 ||
              !product.specification?.trim() ||
              !product.product_quantity ||
              isNaN(product.product_quantity) ||
              Number(product.product_quantity) < 1
          )
          if (invalidProduct) {
            errorMsg =
              "ყველა პროდუქტს უნდა ჰქონდეს სახელი, დადებითი ღირებულება, სპეციფიკაცია და რაოდენობა"
          }
        }
        break
      case "file_path":
        // Optional field, no validation needed
        break
      case "status":
        // System-managed field, no validation needed
        break
      case "payment_different_terms":
        // Boolean field, no validation needed
        break
      case "product_payment_term":
        if (!formData.payment_different_terms && !value && value !== 0)
          errorMsg = "ველი აუცილებელია"
        else if (value && (isNaN(value) || Number(value) < 0))
          errorMsg = "არ უნდა იყოს 0-ზე ნაკლები"
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
      toast.error("გთხოვთ შეავსოთ ყველა სავალდებულო ველი")
    }

    return isValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    if (formData.payment_different_terms) {
      const advancePercent = Number(formData.advance_payment_percentage)
      const remainingPercent = Number(formData.remaining_payment_percentage)

      if (Math.abs(advancePercent + remainingPercent - 100) > 0.01) {
        toast.error("გადახდის პროცენტების ჯამი უნდა იყოს 100")
        return
      }
    }

    toast.info("მიმდინარეობს დამუშავება...", {
      autoClose: false,
      toastId: "submitProgress",
    })

    try {
      const dataToSend = {
        contragent_name: formData.contragent_name,
        contragent_id: formData.contragent_id,
        contragent_address: formData.contragent_address,
        contragent_phone_number: formData.contragent_phone_number,
        contragent_email: formData.contragent_email,
        contragent_director_name: formData.contragent_director_name,
        contragent_director_phone_number:
          formData.contragent_director_phone_number,
        conscription_term: parseInt(formData.conscription_term),
        product_delivery_address: formData.product_delivery_address,
        bank_account: formData.bank_account,
        file_path: formData.file_path || null,
        payment_different_terms: formData.payment_different_terms ? 1 : 0,
        contract_initiator_name: formData.contract_initiator_name,
        product_cost: calculateProductCost(formData.products),
        product_payment_term: formData.payment_different_terms
          ? null
          : parseInt(formData.product_payment_term),
        products: formData.products.map(product => ({
          product_name: product.product_name,
          product_price: parseFloat(product.product_price),
          specification: product.specification,
          product_quantity: parseInt(product.product_quantity),
        })),
      }

      if (formData.payment_different_terms) {
        dataToSend.advance_payment_percentage = parseFloat(
          formData.advance_payment_percentage
        )
        dataToSend.remaining_payment_percentage = parseFloat(
          formData.remaining_payment_percentage
        )
      }

      const response = await createAgreement(dataToSend)
      toast.dismiss("submitProgress")

      if (response) {
        toast.success("ხელშეკრულება წარმატებით შეიქმნა")
        setFormData({
          contragent_name: "",
          contragent_id: "",
          contragent_address: "",
          contragent_phone_number: "",
          contragent_email: "",
          contragent_director_name: "",
          contragent_director_phone_number: "",
          conscription_term: "",
          product_delivery_address: "",
          bank_account: "",
          file_path: "",
          status: "pending",
          payment_different_terms: false,
          advance_payment_percentage: "",
          remaining_payment_percentage: "",
          contract_initiator_name: "",
          products: [
            {
              product_name: "",
              product_price: "",
              specification: "",
              product_quantity: "",
            },
          ],
          product_payment_term: "",
        })
        setActiveTab(4)
        setPassedSteps(prevSteps => [...prevSteps, 4])
        setErrors({})
        onSuccess?.()
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast.dismiss("submitProgress")
      handleError(error)
    }
  }

  const handleError = error => {
    const validationErrors = error.response?.data?.errors

    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error("არასწორი მოაცემებ. გთხოვთ შამოწმოთ შეყვანილი ინფორმაცია")
          break
        case 401:
          toast.error("გთხოვთ გაიაროთ ავტორიზაცია")
          break
        case 422:
          if (validationErrors) {
            Object.keys(validationErrors).forEach(key => {
              toast.error(validationErrors[key][0])
            })
          }
          break
        case 500:
          toast.error("სერვერის შეცდომა. გთხოვთ სცადოთ მოგვიანებით")
          break
        default:
          toast.error("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით")
      }
    } else if (error.request) {
      toast.error("კავშირის შეცდომა. გთხოვთ შეამოწმოთ ინტერნეტ კავშირი")
    } else {
      toast.error("დაფიქსირდა შეცდომა. გთხოვთ სცადოთ მოგვიანებით")
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

  const hasStepFields = {
    1: [
      "contragent_name",
      "contragent_id",
      "contragent_address",
      "contragent_phone_number",
      "contragent_email",
      "bank_account",
    ],
    2: [
      "contragent_director_name",
      "contragent_director_phone_number",
      "conscription_term",
      "product_delivery_address",
      "product_payment_term",
      "payment_different_terms",
      ...(formData.payment_different_terms
        ? ["advance_payment_percentage", "remaining_payment_percentage"]
        : []),
    ],
    3: ["contract_initiator_name", "products"],
  }

  const hasStepErrors = stepNumber => {
    const stepFields = hasStepFields[stepNumber]
    const hasErrors = stepFields?.some(field => errors[field])
    return hasErrors
  }

  const hasStepData = stepNumber => {
    const stepFields = hasStepFields[stepNumber]
    const hasData = stepFields?.some(field => {
      if (field === "products") {
        const hasValidProducts = formData.products.some(
          product => product.product_name && product.product_price
        )
        return hasValidProducts
      }
      return formData[field]
    })
    return hasData
  }

  const handleAddProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        {
          product_name: "",
          product_price: "",
          specification: "",
          product_quantity: "",
        },
      ],
    }))
    validateField("products", [
      ...formData.products,
      {
        product_name: "",
        product_price: "",
        specification: "",
        product_quantity: "",
      },
    ])
  }

  const handleRemoveProduct = index => {
    if (formData.products.length > 1) {
      const newProducts = formData.products.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        products: newProducts,
      }))
      validateField("products", newProducts)
    }
  }

  const handleProductChange = (index, field, value) => {
    const newProducts = [...formData.products]
    newProducts[index] = {
      ...newProducts[index],
      [field]: value,
    }
    setFormData(prev => ({
      ...prev,
      products: newProducts,
    }))
    validateField("products", newProducts)
  }

  return (
    <div className="p-4">
      <div className="relative mb-12">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:!bg-gray-700 -translate-y-1/2"></div>
        <div className="relative flex justify-between items-center">
          {[
            { label: "ძირითადი ინფორმაცია", icon: "bx-user" },
            { label: "ფინანსური დეტალები", icon: "bx-money" },
            { label: "დამატებითი ინფორმაცია", icon: "bx-file" },
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

      <div
        className={classnames("w-full transition-all duration-200", {
          hidden: activeTab !== 1,
        })}
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contragent_name"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                კონტრაგენტის სრული დასახელება/სახელი და გვარი
              </label>
              <input
                type="text"
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
                id="contragent_name"
                value={formData.contragent_name}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ კონტრაგენტის სრული დასახელება..."
              />
              {errors.contragent_name && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.contragent_name}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="contragent_id"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                საიდენტიფიკაციო კოდი/პირადი ნომერი
              </label>
              <input
                type="text"
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
                id="contragent_id"
                value={formData.contragent_id}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ საიდენტიფიკაციო კოდი..."
              />
              {errors.contragent_id && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.contragent_id}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contragent_address"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                იურიდიული მისამართი/ფაქტიური მისამართი
              </label>
              <input
                type="text"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_address,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_address,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                id="contragent_address"
                value={formData.contragent_address}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ იურიდიული/ფაქტიური მისამართი..."
              />
              {errors.contragent_address && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.contragent_address}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="contragent_phone_number"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ტელეფონის ნომერი
              </label>
              <input
                type="text"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_phone_number,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_phone_number,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                id="contragent_phone_number"
                value={formData.contragent_phone_number}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ ტელეფონის ნომერი..."
              />
              {errors.contragent_phone_number && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.contragent_phone_number}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contragent_email"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ელ.ფოსტა
              </label>
              <input
                type="email"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_email,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_email,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                id="contragent_email"
                value={formData.contragent_email}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ ელ.ფოსტა..."
              />
              {errors.contragent_email && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.contragent_email}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="bank_account"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ანგარიშის ნომერი
              </label>
              <input
                type="text"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.bank_account,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.bank_account,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                id="bank_account"
                value={formData.bank_account}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ საბანკო რეკვიზიტები..."
              />
              {errors.bank_account && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.bank_account}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <div
        className={classnames("w-full transition-all duration-200", {
          hidden: activeTab !== 2,
        })}
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contragent_director_name"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                დირექტორის სახელი და გვარი
              </label>
              <input
                type="text"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_director_name,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_director_name,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                id="contragent_director_name"
                value={formData.contragent_director_name}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ დირექტორის სახელი..."
              />
              {errors.contragent_director_name && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.contragent_director_name}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="contragent_director_phone_number"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                დირექტორის ტელეფონის ნომერი
              </label>
              <input
                type="text"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contragent_director_phone_number,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contragent_director_phone_number,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                id="contragent_director_phone_number"
                value={formData.contragent_director_phone_number}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ დირექტორის ტელეფონის ნომერი..."
              />
              {errors.contragent_director_phone_number && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.contragent_director_phone_number}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="conscription_term"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                პროდუქციის მიწოდების ვადა (დღეებში)
              </label>
              <input
                type="number"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.conscription_term,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.conscription_term,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                id="conscription_term"
                value={formData.conscription_term}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ პროდუქციის მიწოდების ვადა..."
              />
              {errors.conscription_term && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.conscription_term}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="product_delivery_address"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                პროდუქციის მიწოდების ადგილი
              </label>
              <input
                type="text"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.product_delivery_address,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.product_delivery_address,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                id="product_delivery_address"
                value={formData.product_delivery_address}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ პროდუქტის მიწოდების ადგილი..."
              />
              {errors.product_delivery_address && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.product_delivery_address}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                id="payment_different_terms"
                checked={formData.payment_different_terms}
                onChange={handleInputChange}
              />
              <label
                htmlFor="payment_different_terms"
                className="ml-2 block text-sm font-medium text-gray-700 dark:!text-gray-300"
              >
                გადახდის განსხვავებული პირობები
              </label>
            </div>
          </div>

          {formData.payment_different_terms && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="advance_payment_percentage"
                  className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
                >
                  ავანსის პროცენტი (%)
                </label>
                <input
                  type="number"
                  className={classnames(
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                    {
                      "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                        errors.advance_payment_percentage,
                      "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                        !errors.advance_payment_percentage,
                      "dark:!bg-gray-800 dark:!text-white": true,
                    }
                  )}
                  id="advance_payment_percentage"
                  value={formData.advance_payment_percentage}
                  onChange={handleInputChange}
                  placeholder="შეიყვანეთ ავანსის პროცენტი..."
                  min="0"
                  max="100"
                  step="0.01"
                />
                {errors.advance_payment_percentage && (
                  <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                    <i className="bx bx-error-circle"></i>
                    {errors.advance_payment_percentage}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="remaining_payment_percentage"
                  className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
                >
                  დარჩენილი თანხის პროცენტი (%)
                </label>
                <input
                  type="number"
                  className={classnames(
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                    {
                      "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                        errors.remaining_payment_percentage,
                      "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                        !errors.remaining_payment_percentage,
                      "dark:!bg-gray-800 dark:!text-white": true,
                    }
                  )}
                  id="remaining_payment_percentage"
                  value={formData.remaining_payment_percentage}
                  onChange={handleInputChange}
                  placeholder="შეიყვანეთ დარჩენილი თანხის პროცენტი..."
                  min="0"
                  max="100"
                  step="0.01"
                />
                {errors.remaining_payment_percentage && (
                  <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                    <i className="bx bx-error-circle"></i>
                    {errors.remaining_payment_percentage}
                  </div>
                )}
              </div>
            </div>
          )}

          {!formData.payment_different_terms && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="product_payment_term"
                  className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
                >
                  გადახდის ვადა (დღეებში)
                </label>
                <input
                  type="number"
                  className={classnames(
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                    {
                      "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                        errors.product_payment_term,
                      "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                        !errors.product_payment_term,
                      "dark:!bg-gray-800 dark:!text-white": true,
                    }
                  )}
                  id="product_payment_term"
                  value={formData.product_payment_term}
                  onChange={handleInputChange}
                  placeholder="ჩაწერეთ გადახდის ვადა..."
                  min="1"
                />
                {errors.product_payment_term && (
                  <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                    <i className="bx bx-error-circle"></i>
                    {errors.product_payment_term}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>

      <div
        className={classnames("w-full transition-all duration-200", {
          hidden: activeTab !== 3,
        })}
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="contract_initiator_name"
                className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1"
              >
                ხელშეკრულების გაფორმებაზე პასუხისმგებელი პირი
              </label>
              <input
                type="text"
                className={classnames(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-200",
                  {
                    "border-red-300 focus:border-red-300 focus:ring-red-200 dark:!border-red-700 dark:!focus:border-red-700 dark:!focus:ring-red-900":
                      errors.contract_initiator_name,
                    "border-gray-300 focus:border-blue-300 focus:ring-blue-200 dark:!border-gray-600 dark:!focus:border-blue-500 dark:!focus:ring-blue-900":
                      !errors.contract_initiator_name,
                    "dark:!bg-gray-800 dark:!text-white": true,
                  }
                )}
                id="contract_initiator_name"
                value={formData.contract_initiator_name}
                onChange={handleInputChange}
                placeholder="ჩაწერეთ ხელშეკრულების გაფორმებაზე პასუხისმგებელი პირი..."
              />
              {errors.contract_initiator_name && (
                <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                  <i className="bx bx-error-circle"></i>
                  {errors.contract_initiator_name}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300">
                პროდუქტები
              </label>
              <button
                type="button"
                onClick={handleAddProduct}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <i className="bx bx-plus"></i>
                დამატება
              </button>
            </div>

            {formData.products.map((product, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg space-y-4 bg-gray-50 dark:!bg-gray-800"
              >
                <div className="flex justify-between items-center">
                  <h6 className="text-sm font-medium text-gray-700 dark:!text-gray-300">
                    პროდუქტი {index + 1}
                  </h6>
                  {formData.products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <i className="bx bx-trash text-xl"></i>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                      პროდუქტის დასახელება
                    </label>
                    <input
                      type="text"
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
                      value={product.product_name}
                      onChange={e =>
                        handleProductChange(
                          index,
                          "product_name",
                          e.target.value
                        )
                      }
                      placeholder="ჩაწერეთ პროდუქტის დასახელება..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                      პროდუქტის ფასი
                    </label>
                    <input
                      type="number"
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
                      value={product.product_price}
                      onChange={e =>
                        handleProductChange(
                          index,
                          "product_price",
                          e.target.value
                        )
                      }
                      placeholder="ჩაწერეთ პროდუქტის ფასი..."
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                      სპეციფიკაცია
                    </label>
                    <textarea
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
                      value={product.specification}
                      onChange={e =>
                        handleProductChange(
                          index,
                          "specification",
                          e.target.value
                        )
                      }
                      placeholder="ჩაწერეთ პროდუქტის სპეციფიკაცია..."
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                      რაოდენობა
                    </label>
                    <input
                      type="number"
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
                      value={product.product_quantity}
                      onChange={e =>
                        handleProductChange(
                          index,
                          "product_quantity",
                          e.target.value
                        )
                      }
                      placeholder="ჩაწერეთ პროდუქტის რაოდენობა..."
                      min="1"
                    />
                  </div>
                </div>
              </div>
            ))}

            {errors.products && (
              <div className="mt-1 text-sm text-red-600 dark:!text-red-400 flex items-center gap-1">
                <i className="bx bx-error-circle"></i>
                {errors.products}
              </div>
            )}
          </div>
        </form>
      </div>

      <div
        className={classnames("w-full transition-all duration-200", {
          hidden: activeTab !== 4,
        })}
      >
        <div className="flex justify-center">
          <div className="text-center max-w-lg">
            <div className="mb-4">
              <i className="bx bx-check-circle text-6xl text-green-500"></i>
            </div>
            <h5 className="text-xl font-medium mb-2">
              შეკვეთა წარმატებით დასრულდა!
            </h5>
            <p className="text-gray-600">თქვენი შეკვეთა წარმატებით შესრულდა.</p>
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

        {activeTab === 3 ? (
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
                  activeTab !== 4,
                invisible: activeTab === 4,
              }
            )}
            onClick={() => toggleTab(activeTab + 1)}
            disabled={activeTab === 4}
          >
            შემდეგი გვერდი
            <i className="bx bx-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  )
}

export default StandardAgreementForm
