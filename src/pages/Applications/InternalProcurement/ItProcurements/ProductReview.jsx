import React from "react"
import { useUpdateProductStatus } from "../../../../queries/purchase"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"

const ProductReview = ({ product, purchase, onClose, onSuccess }) => {
  const { mutate: updateProductStatus } = useUpdateProductStatus()

  const handleReview = () => {
    updateProductStatus(
      {
        purchaseId: purchase.id,
        productId: product.id,
        status: "completed",
        comment: "განხილულია IT გუნდის მიერ",
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

  return (
    <CrmDialog
      isOpen={true}
      onOpenChange={onClose}
      title={`პროდუქტის განხილვა: ${product?.name}`}
      footer={
        <>
          <DialogButton actionType="cancel" onClick={onClose} />
          <DialogButton actionType="approve" onClick={handleReview} />
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
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
      </div>
    </CrmDialog>
  )
}

export default ProductReview
