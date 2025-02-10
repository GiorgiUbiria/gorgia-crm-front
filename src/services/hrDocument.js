import defaultInstance from "plugins/axios"

export const createHrDocument = async data => {
  return defaultInstance.post("/api/hr-documents", data)
}

export const updateHrDocumentStatus = async (
  hrDocumentId,
  status,
  data = {}
) => {
  return defaultInstance.patch(`/api/hr-documents/${hrDocumentId}/status`, {
    status,
    ...data,
  })
}

export const getHrDocuments = async () => {
  return defaultInstance.get("/api/hr-documents")
}

export const getHrDocument = async hrDocumentId => {
  return defaultInstance.get("/api/hr-documents/" + hrDocumentId)
}

export const getCurrentUserHrDocuments = async () => {
  return defaultInstance.get("/api/hr-documents/current")
}

export const downloadHrDocument = async hrDocumentId => {
  return defaultInstance.get(`/api/hr-documents/${hrDocumentId}/download`, {
    responseType: "blob",
  })
}

export const createHrAdditionalDocument = async data => {
  return defaultInstance.post("/api/hr-additional-documents", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const getHrAdditionalDocuments = async () => {
  return defaultInstance.get("/api/hr-additional-documents")
}

export const getCurrentUserHrAdditionalDocuments = async () => {
  return defaultInstance.get("/api/hr-additional-documents/current")
}

export const updateHrAdditionalDocumentStatus = async (id, status) => {
  return defaultInstance.patch(`/api/hr-additional-documents/${id}/status`, {
    status,
  })
}

export const updateHrAdditionalDocumentOneCStatus = async (id, data) => {
  return defaultInstance.post(
    `/api/hr-additional-documents/${id}/one-c-status`,
    {
      stored_in_one_c: data.stored_in_one_c,
      one_c_comment: data.one_c_comment,
    }
  )
}

export const downloadHrAdditionalDocument = async (id, index) => {
  try {
    const response = await defaultInstance.get(
      `/api/hr-additional-documents/${id}/download/${index}`,
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

    const file = new Blob([response.data], { type: contentType })

    const fileURL = window.URL.createObjectURL(file)
    const link = document.createElement("a")
    link.href = fileURL
    link.setAttribute("download", `hr_additional_document_${id}_${index}.png`)

    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(fileURL)

    return true
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("დოკუმენტი ვერ მოიძებნა")
    } else if (error.response?.status === 403) {
      throw new Error(
        "დოკუმენტის ჩამოტვირთვა შესაძლებელია მხოლოდ დამტკიცების შემდეგ"
      )
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error("ფაილის ჩამოტვირთვა ვერ მოხერხდა")
  }
}
