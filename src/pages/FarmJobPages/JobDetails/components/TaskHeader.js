import React, { useState } from "react"
import { Download, Trash2, X, ZoomIn, ZoomOut } from "lucide-react"
import { useDeleteTaskAttachment } from "queries/farmTasks"
import { toast } from "store/zustand/toastStore"

const ImageLightbox = ({ image, onClose }) => {
  const [scale, setScale] = useState(1)

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5))
  }

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={e => {
            e.stopPropagation()
            handleZoomIn()
          }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ZoomIn className="w-6 h-6" />
        </button>
        <button
          onClick={e => {
            e.stopPropagation()
            handleZoomOut()
          }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <ZoomOut className="w-6 h-6" />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div 
        className="max-w-[90vw] max-h-[90vh] relative cursor-zoom-in"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={image.src}
          alt={image.alt}
          style={{ transform: `scale(${scale})` }}
          className="max-w-full max-h-[90vh] object-contain transition-transform duration-200"
        />
      </div>
    </div>
  )
}

const TaskHeader = ({ task, canEdit }) => {
  const deleteAttachmentMutation = useDeleteTaskAttachment()
  const [selectedImage, setSelectedImage] = useState(null)

  if (!task) return null

  const handleDeleteAttachment = async attachmentId => {
    try {
      await deleteAttachmentMutation.mutateAsync({
        taskId: task.data.id,
        attachmentId,
      })
      toast.success("ფაილი წარმატებით წაიშალა", "წარმატება", {
        duration: 2000,
        size: "small",
      })
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "ფაილის წაშლის დროს დაფიქსირდა შეცდომა",
        "შეცდომა",
        {
          duration: 2000,
          size: "small",
        }
      )
    }
  }

  return (
    <>
      {selectedImage && (
        <ImageLightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
      <div className="p-6 border-b border-gray-200 dark:!border-gray-700">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:!text-gray-100">
                  {task.data.task_title}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:!text-gray-400">
                  მოთხოვნის ID: #{task.data.id}
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-700 dark:!text-gray-300 whitespace-pre-wrap">
            {task.data.description}
          </div>

          {task.data.attachments?.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {task.data.attachments.map(attachment => {
                const isImage = attachment.mime_type.startsWith('image/')
                const imageUrl = `${process.env.REACT_APP_API_URL}/storage/${attachment.file_path}`

                return (
                  <div
                    key={attachment.id}
                    className="relative group border border-gray-200 dark:!border-gray-700 rounded-lg p-4"
                  >
                    {isImage ? (
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt={attachment.file_name}
                          className="w-full h-auto rounded-lg shadow-sm max-h-48 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setSelectedImage({
                            src: imageUrl,
                            alt: attachment.file_name
                          })}
                        />
                        {canEdit && (
                          <button
                            onClick={() => handleDeleteAttachment(attachment.id)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <a
                          href={`${process.env.REACT_APP_API_URL}/api/farm-tasks/${task.data.id}/attachments/${attachment.id}/download`}
                          download={attachment.file_name}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:!text-blue-400 bg-blue-50 dark:!bg-blue-900/50 rounded-lg hover:bg-blue-100 dark:!hover:bg-blue-900 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          {attachment.file_name}
                        </a>
                        {canEdit && (
                          <button
                            onClick={() => handleDeleteAttachment(attachment.id)}
                            className="p-1.5 text-red-500 hover:text-red-600 dark:!text-red-400 dark:!hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default TaskHeader
