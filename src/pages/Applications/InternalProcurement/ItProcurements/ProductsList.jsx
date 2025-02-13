import React, { useState } from "react"
import {
  useUpdateProductStatus,
  useUpdatePurchaseStatus,
} from "../../../../queries/purchase"

const ProductsList = ({ purchase }) => {
  const [editingProduct, setEditingProduct] = useState(null)
  const [reviewComment, setReviewComment] = useState("")
  const [isInStock, setIsInStock] = useState(false)

  const { mutate: updateProductStatus } = useUpdateProductStatus()
  const { mutate: updatePurchaseStatus } = useUpdatePurchaseStatus()

  const handleReview = (product, isQuickReview = false) => {
    const data = {
      purchaseId: purchase.id,
      productId: product.id,
      status: "completed",
      comment: isQuickReview
        ? isInStock
          ? "პროდუქტი მარაგშია"
          : "განხილულია IT გუნდის მიერ"
        : reviewComment,
    }

    updateProductStatus(data, {
      onSuccess: () => {
        setEditingProduct(null)
        setReviewComment("")
        setIsInStock(false)

        // Check if all products are reviewed
        const remainingProducts = purchase.products.filter(
          p => p.id !== product.id && p.status !== "completed"
        )

        if (remainingProducts.length === 0) {
          handleCompleteReview()
        }
      },
      onError: err => {
        console.error("Error updating product review:", err)
        alert(err.response?.data?.message || "შეცდომა განხილვის განახლებისას")
      },
    })
  }

  const handleCompleteReview = () => {
    updatePurchaseStatus(
      {
        id: purchase.id,
        status: "pending requested department",
        comment: "IT გუნდის განხილვა დასრულებულია",
      },
      {
        onSuccess: () => {
          // Handle success if needed
        },
        onError: err => {
          console.error("Error completing review:", err)
          alert(err.response?.data?.message || "შეცდომა განხილვის დასრულებისას")
        },
      }
    )
  }

  return (
    <div className="mt-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                დასახელება
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                რაოდენობა
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                განხილვის სტატუსი
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                კომენტარი
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                მოქმედებები
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {purchase.products.map((product, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {product.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {product.quantity}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {product.status === "completed"
                      ? "განხილულია"
                      : "განსახილველი"}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {editingProduct?.id === product.id ? (
                    <textarea
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      rows={2}
                      placeholder="შეიყვანეთ კომენტარი..."
                    />
                  ) : (
                    product.comment || "-"
                  )}
                </td>
                <td className="px-4 py-2">
                  {product.status !== "completed" && (
                    <div className="flex gap-2">
                      {editingProduct?.id === product.id ? (
                        <>
                          <button
                            onClick={() => handleReview(product)}
                            className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
                          >
                            დადასტურება
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(null)
                              setReviewComment("")
                              setIsInStock(false)
                            }}
                            className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 transition-colors"
                          >
                            გაუქმება
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingProduct(product)
                              setReviewComment("")
                              setIsInStock(false)
                            }}
                            className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                          >
                            კომენტარი
                          </button>
                          <button
                            onClick={() => {
                              setIsInStock(true)
                              handleReview(product, true)
                            }}
                            className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 transition-colors"
                          >
                            მარაგშია
                          </button>
                          <button
                            onClick={() => {
                              setIsInStock(false)
                              handleReview(product, true)
                            }}
                            className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
                          >
                            განხილულია
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductsList
