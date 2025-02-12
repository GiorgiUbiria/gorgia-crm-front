import defaultInstance from "plugins/axios"

export const designFormService = {
  getDesignForms: async () => {
    const response = await defaultInstance.get("/api/design-forms")
    return response.data
  },

  getDesignForm: async id => {
    const response = await defaultInstance.get(`/api/design-forms/${id}`)
    return response.data
  },

  createDesignForm: async data => {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
      if (key === "advertisement_placement_photo") {
        const file = data[key][0]
        if (file) {
          formData.append(key, file)
        }
      } else {
        formData.append(key, data[key] || "")
      }
    })

    const response = await defaultInstance.post("/api/design-forms", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  updateDesignFormStatus: async (id, data) => {
    const response = await defaultInstance.post(
      `/api/design-forms/${id}/status`,
      data
    )
    return response.data
  },

  deleteDesignForm: async id => {
    const response = await defaultInstance.delete(`/api/design-forms/${id}`)
    return response.data
  },

  downloadAttachment: async id => {
    const response = await defaultInstance.get(
      `/api/design-forms/${id}/download`,
      {
        responseType: "blob",
      }
    )
    return response.data
  },
}
