import React, { useState, useCallback, memo } from "react"
import {
  useUpdateProductReviewStatus,
  useUpdatePurchaseReviewStatus,
} from "../../../../queries/purchase"
import CrmDialog, { DialogButton } from "components/CrmDialogs/Dialog"
import { BiInfoCircle } from "react-icons/bi"

const ProductsList = memo(({ purchase }) => {
  const [editingProduct, setEditingProduct] = useState(null)
  const [reviewComment, setReviewComment] = useState("")
  const [isInStock, setIsInStock] = useState(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const { mutate: updateProductReview, isLoading: isProductReviewLoading } =
    useUpdateProductReviewStatus()
  const { mutate: updatePurchaseReview, isLoading: isPurchaseReviewLoading } = useUpdatePurchaseReviewStatus()

  const handleCompleteReview = useCallback(() => {
    const comment = selectedFile
      ? (reviewComment || "განახლებული პროდუქტების სია ატვირთულია")
      : "განხილულია"

    const data = {
      review_comment: comment,
      review_status: "reviewed"
    }

    if (selectedFile) {
      data.file = selectedFile
    }

    updatePurchaseReview(
      {
        id: purchase.id,
        data,
      },
      {
        onSuccess: () => {
          setIsReviewDialogOpen(false)
          setSelectedFile(null)
          setReviewComment("")
        },
        onError: err => {
          console.error("Error completing review:", err)
          alert(err.response?.data?.message || "შეცდომა განხილვის დასრულებისას")
        },
      }
    )
  }, [purchase.id, updatePurchaseReview, selectedFile, reviewComment])

  const handleReview = useCallback(
    (product, isQuickReview = false) => {
      const data = {
        review_comment: isQuickReview
          ? "განხილულია"
          : reviewComment || "განხილულია",
        in_stock: isInStock,
        review_status: "reviewed"
      }

      updateProductReview(
        {
          purchaseId: purchase.id,
          productId: product.id,
          data,
        },
        {
          onSuccess: () => {
            setEditingProduct(null)
            setReviewComment("")
            setIsInStock(null)
            setIsReviewDialogOpen(false)

            const remainingProducts = purchase.products.filter(
              p => p.id !== product.id && p.review_status !== "reviewed"
            )

            if (remainingProducts.length === 0) {
              handleCompleteReview()
            }
          },
          onError: err => {
            console.error("Error updating product review:", err)
            alert(
              err.response?.data?.message || "შეცდომა განხილვის განახლებისას"
            )
          },
        }
      )
    },
    [
      purchase.id,
      purchase.products,
      isInStock,
      reviewComment,
      updateProductReview,
      handleCompleteReview
    ]
  )

  const handleQuickReviewAll = useCallback(() => {
    const unreviewedProducts = purchase.products.filter(p => p.review_status !== "reviewed")

    // If there are no unreviewed products, just update the purchase
    if (unreviewedProducts.length === 0) {
      updatePurchaseReview(
        {
          id: purchase.id,
          data: {
            review_comment: "განხილულია",
            review_status: "reviewed"
          },
        },
        {
          onSuccess: () => {
            // Success handling
          },
          onError: err => {
            console.error("Error completing purchase review:", err)
            alert("შეცდომა შესყიდვის განხილვის დასრულებისას")
          },
        }
      )
      return
    }

    // Otherwise, update all unreviewed products first
    const reviewPromises = unreviewedProducts.map(product =>
      new Promise((resolve, reject) => {
        updateProductReview(
          {
            purchaseId: purchase.id,
            productId: product.id,
            data: {
              review_comment: "განხილულია",
              in_stock: false,
              review_status: "reviewed"
            },
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        )
      })
    )

    Promise.all(reviewPromises)
      .then(() => {
        setReviewComment("განხილულია")
        updatePurchaseReview(
          {
            id: purchase.id,
            data: {
              review_comment: "განხილულია",
              review_status: "reviewed"
            },
          },
          {
            onSuccess: () => {
              // Success handling
            },
            onError: err => {
              console.error("Error completing purchase review:", err)
              alert("შეცდომა შესყიდვის განხილვის დასრულებისას")
            },
          }
        )
      })
      .catch(err => {
        console.error("Error during quick review:", err)
        alert("შეცდომა სწრაფი განხილვისას")
      })
  }, [purchase, updateProductReview, updatePurchaseReview])

  const handleFileUploadReview = useCallback(() => {
    if (!selectedFile) return

    // First update all products to have the comment "განხილულია ფაილში"
    const unreviewedProducts = purchase.products.filter(p => p.review_status !== "reviewed")

    // If there are no products or all products are already reviewed, just update the purchase
    if (unreviewedProducts.length === 0) {
      const data = {
        review_comment: reviewComment || "განახლებული პროდუქტების სია ატვირთულია",
        file: selectedFile,
        review_status: "reviewed" // Explicitly set the review status to "reviewed"
      }

      updatePurchaseReview(
        {
          id: purchase.id,
          data,
        },
        {
          onSuccess: () => {
            setIsReviewDialogOpen(false)
            setSelectedFile(null)
            setReviewComment("")
          },
          onError: err => {
            console.error("Error completing review:", err)
            alert(err.response?.data?.message || "შეცდომა განხილვის დასრულებისას")
          },
        }
      )
      return
    }

    // Otherwise, update all unreviewed products first
    const reviewPromises = unreviewedProducts.map(product =>
      new Promise((resolve, reject) => {
        updateProductReview(
          {
            purchaseId: purchase.id,
            productId: product.id,
            data: {
              review_comment: "განხილულია ფაილში",
              in_stock: false,
              review_status: "reviewed" // Explicitly set review_status for each product
            },
          },
          {
            onSuccess: resolve,
            onError: reject,
          }
        )
      })
    )

    // After all products are reviewed, complete the purchase review with the file
    Promise.all(reviewPromises)
      .then(() => {
        const data = {
          review_comment: reviewComment || "განახლებული პროდუქტების სია ატვირთულია",
          file: selectedFile,
          review_status: "reviewed" // Explicitly set the review status to "reviewed"
        }

        updatePurchaseReview(
          {
            id: purchase.id,
            data,
          },
          {
            onSuccess: () => {
              setIsReviewDialogOpen(false)
              setSelectedFile(null)
              setReviewComment("")
            },
            onError: err => {
              console.error("Error completing review:", err)
              alert(err.response?.data?.message || "შეცდომა განხილვის დასრულებისას")
            },
          }
        )
      })
      .catch(err => {
        console.error("Error during file upload review:", err)
        alert("შეცდომა ფაილის ატვირთვისას")
      })
  }, [purchase.id, purchase.products, selectedFile, reviewComment, updateProductReview, updatePurchaseReview])

  const getInStockLabel = (inStock) => {
    if (inStock === true) return "დიახ"
    if (inStock === false) return "არა"
    return "არ არის მითითებული"
  }

  const getInStockColor = (inStock) => {
    if (inStock === true) return "bg-green-100 text-green-800"
    if (inStock === false) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="mt-4">
      {purchase.status === "pending IT team review" && (
        <div className="mb-4 flex justify-between items-center">
          <div className="flex gap-2">
            {purchase.has_products_attachment && (
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setReviewComment("")
                  setIsReviewDialogOpen(true)
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:!bg-blue-500 dark:!hover:bg-blue-600 transition-colors"
              >
                ატვირთე განახლებული სია
              </button>
            )}
            {purchase.products.length > 0 && !purchase.has_products_attachment && (
              <button
                onClick={handleQuickReviewAll}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:!bg-green-500 dark:!hover:bg-green-600 transition-colors"
              >
                სწრაფი განხილვა
              </button>
            )}
          </div>
        </div>
      )}

      {purchase.products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:!divide-gray-700">
            <thead className="bg-gray-50 dark:!bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:!text-gray-300 uppercase tracking-wider">
                  დასახელება
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:!text-gray-300 uppercase tracking-wider">
                  რაოდენობა
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:!text-gray-300 uppercase tracking-wider">
                  განხილვის სტატუსი
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:!text-gray-300 uppercase tracking-wider">
                  კომენტარი
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:!text-gray-300 uppercase tracking-wider">
                  მარაგშია
                  <BiInfoCircle
                    className="inline-block ml-1 text-gray-400"
                    title="მიუთითეთ პროდუქტი არის თუ არა მარაგში"
                  />
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:!text-gray-300 uppercase tracking-wider">
                  მოქმედებები
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:!bg-gray-800 divide-y divide-gray-200 dark:!divide-gray-700">
              {purchase.products.map((product, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:!text-gray-100">
                    {product.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:!text-gray-100">
                    {product.quantity}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.review_status === "reviewed"
                        ? "bg-green-100 text-green-800 dark:!bg-green-900 dark:!text-green-100"
                        : "bg-yellow-100 text-yellow-800 dark:!bg-yellow-900 dark:!text-yellow-100"
                        }`}
                    >
                      {product.review_status === "reviewed"
                        ? "განხილულია"
                        : "განსახილველი"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 dark:!text-gray-100">
                    {product.review_comment || "-"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getInStockColor(product.in_stock)}`}
                    >
                      {getInStockLabel(product.in_stock)}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {product.review_status !== "reviewed" &&
                      purchase.status === "pending IT team review" &&
                      !purchase.has_products_attachment && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product)
                              setReviewComment("")
                              setIsInStock(null)
                              setIsReviewDialogOpen(true)
                            }}
                            className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:!bg-blue-500 dark:!hover:bg-blue-600 transition-colors"
                          >
                            განხილვა
                          </button>
                          <button
                            onClick={() => {
                              setIsInStock(false)
                              handleReview(product, true)
                            }}
                            className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:!bg-green-500 dark:!hover:bg-green-600 transition-colors"
                          >
                            განხილულია
                          </button>
                        </div>
                      )}
                    {product.review_status !== "reviewed" &&
                      purchase.status === "pending IT team review" &&
                      purchase.has_products_attachment && (
                        <div className="text-sm text-gray-500 italic">
                          განხილვა მოხდება ფაილის ატვირთვით
                        </div>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CrmDialog
        isOpen={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        title={editingProduct ? `პროდუქტის განხილვა: ${editingProduct?.name}` : "შესყიდვის განხილვა"}
      >
        <div className="space-y-4">
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

          {editingProduct && (
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
          )}

          {purchase.has_products_attachment && !editingProduct && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:!text-gray-300 mb-1">
                განახლებული პროდუქტების სია
              </label>
              <input
                type="file"
                onChange={e => {
                  const file = e.target.files[0]
                  if (file) {
                    const extension = file.name.split(".").pop().toLowerCase()
                    if (!["xls", "xlsx"].includes(extension)) {
                      alert("დაშვებულია მხოლოდ Excel ფაილები (xls, xlsx)")
                      e.target.value = ""
                      setSelectedFile(null)
                      return
                    }
                    if (file.size > 10 * 1024 * 1024) {
                      alert("ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს")
                      e.target.value = ""
                      setSelectedFile(null)
                      return
                    }
                    setSelectedFile(file)
                  }
                }}
                accept=".xls,.xlsx"
                className="block w-full text-sm text-gray-500 dark:!text-gray-400
                  file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                  file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 dark:!file:bg-blue-900 dark:!file:text-blue-100"
              />
              <small className="text-gray-500 dark:!text-gray-400 mt-1 block">
                მაქსიმალური ზომა: 10MB. დაშვებული ფორმატები: XLS, XLSX
              </small>
              <small className="text-blue-600 dark:!text-blue-400 mt-2 block">
                <BiInfoCircle className="inline-block mr-1" />
                ფაილის ატვირთვა ავტომატურად დაასრულებს ყველა პროდუქტის და მთლიანი შესყიდვის განხილვას
              </small>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <DialogButton
              actionType="cancel"
              onClick={() => {
                setIsReviewDialogOpen(false)
                setEditingProduct(null)
                setReviewComment("")
                setIsInStock(null)
                setSelectedFile(null)
              }}
            />
            <DialogButton
              actionType="approve"
              onClick={() => {
                if (editingProduct) {
                  handleReview(editingProduct)
                } else if (selectedFile) {
                  handleFileUploadReview()
                } else {
                  handleCompleteReview()
                }
              }}
              disabled={isProductReviewLoading || isPurchaseReviewLoading || (purchase.has_products_attachment && !editingProduct && !selectedFile)}
            />
          </div>
        </div>
      </CrmDialog>
    </div>
  )
})

ProductsList.displayName = "ProductsList"

export default ProductsList
