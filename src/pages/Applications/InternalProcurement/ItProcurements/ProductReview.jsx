import React, { useState } from "react"
import { useUpdateProductStatus } from "../../../../queries/purchase"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"

const ProductReview = ({ product, purchase, onClose, onSuccess }) => {
  const [reviewComment, setReviewComment] = useState("")
  const [isInStock, setIsInStock] = useState(null)
  const { mutate: updateProductStatus, isLoading } = useUpdateProductStatus()

  const handleReview = () => {
    updateProductStatus(
      {
        purchaseId: purchase.id,
        productId: product.id,
        status: "completed",
        comment: reviewComment || "განხილულია",
        in_stock: isInStock,
        review_status: "reviewed"
      },
      {
        onSuccess: () => {
          onSuccess?.()
          onClose()
        },
        onError: err => {
          console.error("Error updating product review:", err)
          alert(err.response?.data?.message || "შეცდომა განხილვის განახლებისას")
        },
      }
    )
  }

  // Don't allow direct product review if purchase has attachment
  if (purchase.has_products_attachment) {
    return (
      <CrmDialog
        isOpen={true}
        onOpenChange={onClose}
        title={`პროდუქტის განხილვა: ${product?.name}`}
      >
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
            <p>
              ეს შესყიდვა შეიცავს ატვირთულ ფაილს. პროდუქტების განხილვა შესაძლებელია მხოლოდ განახლებული ფაილის ატვირთვით.
            </p>
          </div>
          <div className="flex justify-end">
            <DialogButton actionType="cancel" onClick={onClose} />
          </div>
        </div>
      </CrmDialog>
    )
  }

  return (
    <CrmDialog
      isOpen={true}
      onOpenChange={onClose}
      title={`პროდუქტის განხილვა: ${product?.name}`}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:!text-gray-100">
            პროდუქტის დეტალები
          </h3>
          <div className="mt-2 space-y-2">
            <p>
              <span className="font-medium">დასახელება:</span> {product.name}
            </p>
            <p>
              <span className="font-medium">რაოდენობა:</span> {product.quantity}
            </p>
            <p>
              <span className="font-medium">აღწერა:</span>{" "}
              {product.description || "-"}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
            განხილვის კომენტარი
          </label>
          <textarea
            value={reviewComment}
            onChange={e => setReviewComment(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:!bg-gray-700 dark:!border-gray-600"
            rows={3}
            placeholder="შეიყვანეთ კომენტარი (არასავალდებულო)..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
            მარაგშია
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setIsInStock(true)}
              className={`px-3 py-1.5 rounded-md ${isInStock === true
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
                }`}
            >
              დიახ
            </button>
            <button
              onClick={() => setIsInStock(false)}
              className={`px-3 py-1.5 rounded-md ${isInStock === false
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
                }`}
            >
              არა
            </button>
            <button
              onClick={() => setIsInStock(null)}
              className={`px-3 py-1.5 rounded-md ${isInStock === null
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
                }`}
            >
              არ ვიცი
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <DialogButton actionType="cancel" onClick={onClose} />
          <DialogButton
            actionType="approve"
            onClick={handleReview}
            disabled={isLoading}
          />
        </div>
      </div>
    </CrmDialog>
  )
}

export default ProductReview
