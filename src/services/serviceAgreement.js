import defaultInstance from "plugins/axios"

export const createAgreement = async data => {
  const response = await defaultInstance.post("/api/service-agreements", data)
  return response.data
}

export const updateAgreementStatus = async (
  agreementId,
  status,
  additionalData
) => {
  return defaultInstance.post(`/api/service-agreements/${agreementId}/status`, {
    status,
    ...additionalData,
  })
}

export const getDepartmentAgreements = async () => {
  return defaultInstance.get("/api/service-agreements/departments")
}

export const getUserAgreemnets = async () => {
  return defaultInstance.get("/api/service-agreements/user")
}

export const downloadAgreement = async agreementId => {
  try {
    const response = await defaultInstance.get(
      `/api/service-agreements/${agreementId}/download`,
      {
        responseType: "blob",
        headers: {
          Accept:
            "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Type": "application/json",
        },
      }
    )

    const contentType = response.headers["content-type"]
    const isDocx = contentType.includes("wordprocessingml")

    const file = new Blob([response.data], { type: contentType })

    const fileURL = window.URL.createObjectURL(file)
    const link = document.createElement("a")
    link.href = fileURL
    link.setAttribute(
      "download",
      `service_agreement_${agreementId}.${isDocx ? "docx" : "pdf"}`
    )

    document.body.appendChild(link)

    link.click()

    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(fileURL)

    return true
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("ხელშეკრულება ვერ მოიძებნა")
    } else if (error.response?.status === 403) {
      throw new Error(
        "ხელშეკრულების ჩამოტვირთვა შესაძლებელია მხოლოდ დამტკიცების შემდეგ"
      )
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("ფაილის ჩამოტვირთვა ვერ მოხერხდა")
  }
}
