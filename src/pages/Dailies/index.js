import React, { useEffect, useState, useMemo } from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import TableContainer from "../../components/Common/TableContainer"
import { getDailyList, createDaily } from "../../services/daily"
import { getDepartments } from "../../services/auth"
import useIsAdmin from "hooks/useIsAdmin"

const Dailies = () => {
  const [data, setData] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [modal, setModal] = useState(false)
  const isAdmin = useIsAdmin()
  const [newDaily, setNewDaily] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    department: "",
    description: "",
  })

  const toggleModal = () => setModal(!modal)

  const handleInputChange = e => {
    const { name, value } = e.target
    setNewDaily({ ...newDaily, [name]: value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await createDaily(newDaily)
      setModal(false)
      setNewDaily({
        date: new Date().toISOString().split("T")[0],
        name: "",
        department: "",
        description: "",
      })
      fetchData()
    } catch (error) {
      console.error("Error creating daily:", error)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await getDailyList(currentPage, itemsPerPage)
      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
      setData(sortedData)
      setTotalItems(response.data.total)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, itemsPerPage])

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments()
        setDepartments(response.data.departments)
      } catch (error) {
        setError(error.message)
      }
    }

    fetchDepartments()
  }, [])

  const columns = useMemo(
    () => [
      {
        header: "საკითხის ნომერი",
        accessorKey: "id",
        enableSorting: true,
      },
      {
        header: "თარიღი",
        accessorKey: "date",
        enableSorting: true,
      },
      {
        header: "საკითხი",
        accessorKey: "name",
        enableSorting: true,
      },
      {
        header: "დეპარტამენტი",
        accessorKey: "user.department.name",
        enableSorting: true,
      },
      {
        header: "სახელი/გვარი",
        accessorKey: "user.name",
        enableSorting: true,
      },
    ],
    []
  )

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleItemsPerPageChange = e => {
    setItemsPerPage(parseInt(e.target.value))
    setCurrentPage(1)
  }

  const handleExport = () => {
    const csvRows = []
    const headers = columns.map(col => col.header)
    csvRows.push(headers.join(","))

    data.forEach(row => {
      const values = columns.map(col => {
        const accessor = col.accessorKey.split(".")
        let value = row
        accessor.forEach(key => {
          value = value ? value[key] : ""
        })
        return `"${value || ""}"`
      })
      csvRows.push(values.join(","))
    })

    const csvContent = `data:text/csv;charset=utf-8,${csvRows.join("\n")}`
    const link = document.createElement("a")
    link.href = encodeURI(csvContent)
    link.setAttribute("download", "daily_report.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    )

  return (
    <div className="page-content bg-gray-50">
      <div className="container-fluid max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs title="დღიური შეფასება" breadcrumbItem="შეფასებები" />
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              დღიური შეფასებები
            </h2>
            <div className="space-x-3">
              {isAdmin && (
                <Button
                  color="secondary"
                  className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={handleExport}
                >
                  <i className="bx bx-export mr-2"></i>
                  CSV გადმოწერა
                </Button>
              )}
              <Button
                color="primary"
                className="px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                onClick={toggleModal}
              >
                <i className="bx bx-plus mr-2"></i>
                შეფასების დამატება
              </Button>
            </div>
          </div>

          <TableContainer
            columns={columns}
            data={data}
            isGlobalFilter={true}
            isPagination={true}
            SearchPlaceholder="შეფასებების ძიება..."
            pagination="pagination"
            paginationWrapper="flex justify-end mt-4 space-x-2"
            tableClass="min-w-full divide-y divide-gray-200"
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <Modal isOpen={modal} toggle={toggleModal} className="rounded-lg">
          <ModalHeader toggle={toggleModal} className="border-b bg-gray-50">
            <span className="text-xl font-semibold">შეფასების დამატება</span>
          </ModalHeader>
          <Form onSubmit={handleSubmit}>
            <ModalBody className="p-6 space-y-4">
              <FormGroup>
                <Label for="date" className="text-sm font-medium text-gray-700">
                  თარიღი
                </Label>
                <Input
                  type="date"
                  name="date"
                  id="date"
                  value={newDaily.date}
                  onChange={handleInputChange}
                  required
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </FormGroup>
              <FormGroup>
                <Label for="name" className="text-sm font-medium text-gray-700">
                  საკითხი
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={newDaily.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </FormGroup>
              <FormGroup>
                <Label
                  for="department"
                  className="text-sm font-medium text-gray-700"
                >
                  დეპარტამენტი
                </Label>
                <Input
                  type="select"
                  name="department"
                  id="department"
                  value={newDaily.department}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                  <option value="">დეპარტამენტის არჩევა</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label
                  for="description"
                  className="text-sm font-medium text-gray-700"
                >
                  აღწერა
                </Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  value={newDaily.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  rows="4"
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter className="bg-gray-50 border-t p-4">
              <Button
                color="primary"
                type="submit"
                className="px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                შეფასების დამატება
              </Button>
              <Button
                color="secondary"
                onClick={toggleModal}
                className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors ml-3"
              >
                გაუქმება
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default Dailies
