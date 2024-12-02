import defaultInstance from "plugins/axios"

export const createAgreement = async data => {
  const response = await defaultInstance.post("/api/agreements", data)
  return response.data
}

export const updateAgreementStatus = async (agreementId, status) => {
  return defaultInstance.post(`/api/agreements/${agreementId}/status`, {
    status,
  })
}

export const getDepartmentAgreements = async () => {
  return defaultInstance.get("/api/agreements/departments")
}

export const getUserAgreemnets = async () => {
  return defaultInstance.get("/api/agreements/user")
}

export const downloadAgreement = async (agreementId) => {
  try {
    const response = await defaultInstance.get(`/api/agreements/${agreementId}/download`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Type': 'application/json',
      },
    })
    
    const contentType = response.headers['content-type']
    const isDocx = contentType.includes('wordprocessingml')
    
    // Create a blob from the response
    const file = new Blob([response.data], { type: contentType })
    
    // Create a link element to trigger the download
    const fileURL = window.URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = fileURL
    link.setAttribute('download', `agreement_${agreementId}.${isDocx ? 'docx' : 'pdf'}`)
    
    // Append to html link element page
    document.body.appendChild(link)
    
    // Start download
    link.click()
    
    // Clean up and remove the link
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(fileURL)
    
    return true
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('ხელშეკრულება ვერ მოიძებნა')
    } else if (error.response?.status === 403) {
      throw new Error('ხელშეკრულების ჩამოტვირთვა შესაძლებელია მხოლოდ დამტკიცების შემდეგ')
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('ფაილის ჩამოტვირთვა ვერ მოხერხდა')
  }
}
