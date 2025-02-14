import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { designFormService } from "../services/designForm"
import { toast } from "../store/zustand/toastStore"

export const useDesignForms = () => {
  return useQuery({
    queryKey: ["designForms"],
    queryFn: designFormService.getDesignForms,
  })
}

export const useDesignForm = id => {
  return useQuery({
    queryKey: ["designForm", id],
    queryFn: () => designFormService.getDesignForm(id),
    enabled: !!id,
  })
}

export const useCreateDesignForm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: designFormService.createDesignForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designForms"] })
      toast.success("დიზაინის მოთხოვნა წარმატებით შეიქმნა")
    },
    onError: error => {
      toast.error(
        error.response?.data?.message ||
          "დიზაინის მოთხოვნის შექმნა ვერ მოხერხდა"
      )
    },
  })
}

export const useUpdateDesignFormStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) =>
      designFormService.updateDesignFormStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designForms"] })
      toast.success("დიზაინის მოთხოვნის სტატუსი წარმატებით განახლდა")
    },
    onError: error => {
      toast.error(
        error.response?.data?.message ||
          "დიზაინის მოთხოვნის სტატუსის განახლება ვერ მოხერხდა"
      )
    },
  })
}

export const useDeleteDesignForm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: designFormService.deleteDesignForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designForms"] })
      toast.success("დიზაინის მოთხოვნა წარმატებით წაიშალა")
    },
    onError: error => {
      toast.error(
        error.response?.data?.message || "დიზაინის მოთხოვნის წაშლა ვერ მოხერხდა"
      )
    },
  })
}

export const useDownloadDesignFormAttachment = () => {
  return useMutation({
    mutationFn: designFormService.downloadAttachment,
    onSuccess: (response, id) => {
      const contentType = response.type

      let extension = ".jpg"
      if (contentType) {
        const ext = contentType.split("/")[1]

        if (contentType === "image/jpeg") {
          extension = ".jpg"
        } else if (contentType === "image/png") {
          extension = ".png"
        } else if (contentType === "image/gif") {
          extension = ".gif"
        } else if (contentType === "image/webp") {
          extension = ".webp"
        } else if (contentType === "image/svg+xml") {
          extension = ".svg"
        } else if (ext) {
          extension = `.${ext}`
        }
      }

      const blob = new Blob([response], { type: contentType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `design-form-${id}-attachment${extension}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },
    onError: error => {
      toast.error(
        error.response?.data?.message || "ფაილის ჩამოტვირთვა ვერ მოხერხდა"
      )
    },
  })
}
