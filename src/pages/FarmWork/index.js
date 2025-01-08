import React, { Fragment, useEffect, useMemo, useState } from "react"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import * as Yup from "yup"
import { useFormik } from "formik"
import { MdEdit, MdDelete, MdChevronLeft, MdChevronRight } from "react-icons/md"

import DeleteModal from "../../components/Common/DeleteModal"

import {
  getTaskList,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/farmTasks"

import {
  Col,
  Row,
  Badge,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
} from "reactstrap"
import Spinners from "components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import { Link } from "react-router-dom"
import useFetchUsers from "../../hooks/useFetchUsers"

const FarmWork = () => {
  document.title = "Farm Work | Gorgia LLC"

  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [task, setTask] = useState(null)
  const [tasks, setTasks] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [expandedRows, setExpandedRows] = useState([])
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  })
  const { users: usersList, loading: usersLoading } = useFetchUsers()

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await getTaskList()
      console.log(response)
      const sortedTasks = response.sort((a, b) => b.id - a.id)
      setTasks(sortedTasks || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      task_title: task?.task_title || "",
      description: task?.description || "",
      priority: task?.priority || "medium",
      status: task?.status || "in_progress",
      assigned_to: task?.assigned_to?.toString() || "",
    },
    validationSchema: Yup.object({
      task_title: Yup.string().required("Please Enter Your Task Title"),
      description: Yup.string().required("Please Enter Your Description"),
      priority: Yup.string()
        .oneOf(["low", "medium", "high"])
        .required("Please Enter Priority"),
      status: Yup.string()
        .oneOf(["pending", "in_progress", "completed"])
        .required("Please Enter Status"),
      assigned_to: Yup.string().required("Please Select Assigned To"),
    }),
    onSubmit: async values => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]

        const payload = {
          task_title: values.task_title,
          description: values.description,
          priority: values.priority.toLowerCase(),
          status: values.status.toLowerCase(),
          assigned_to: values.assigned_to.toString(),
          due_date: currentDate,
        }

        console.log("Submitting payload:", payload)

        if (isEdit) {
          await updateTask(task.id, payload)
        } else {
          await createTask(payload)
        }

        validation.resetForm()
        toggleModal()
        fetchTasks()
      } catch (error) {
        console.error("Error submitting form:", error)
        if (error.response?.data?.errors) {
          const errorData = error.response.data.errors
          Object.keys(errorData).forEach(key => {
            validation.setFieldError(key, errorData[key][0])
          })
        }
      }
    },
  })

  const toggleModal = () => {
    setModal(!modal)
    if (!modal) {
      setTask(null)
      setIsEdit(false)
    }
  }

  const handleTaskClick = task => {
    setTask({
      ...task,
      assigned_to: task.assigned_to?.toString(),
    })
    setIsEdit(true)
    setModal(true)
  }

  const onClickDelete = task => {
    setTask(task)
    setDeleteModal(true)
  }

  const handleDeleteTask = async () => {
    try {
      if (task && task.id) {
        await deleteTask(task.id)
        fetchTasks()
      }
      setDeleteModal(false)
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const toggleRow = index => {
    const isRowExpanded = expandedRows.includes(index)
    if (isRowExpanded) {
      setExpandedRows(expandedRows.filter(rowIndex => rowIndex !== index))
    } else {
      setExpandedRows([...expandedRows, index])
    }
  }

  const handleSort = key => {
    setSortConfig(prevConfig => ({
      key: key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }))
  }

  const columns = useMemo(
    () => [
      {
        header: "No",
        accessorKey: "id",
        cell: cellProps => (
          <Link
            to={`/support/farm-tasks/${cellProps.row.original.id}`}
            className="text-body fw-bold"
          >
            {cellProps.row.original.id}
          </Link>
        ),
      },
      {
        header: "პრობლემის ტიპი",
        accessorKey: "task_title",
      },
      {
        header: (
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => handleSort("created_at")}
          >
            შექმნის თარიღი
            <span style={{ marginLeft: "4px" }}>
              {sortConfig.key === "created_at" &&
                (sortConfig.direction === "desc" ? "▼" : "▲")}
            </span>
          </div>
        ),
        accessorKey: "created_at",
        cell: cellProps => {
          const date = new Date(cellProps.row.original.created_at)
          return date.toLocaleDateString("ka-GE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        },
      },
      {
        header: (
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => handleSort("due_date")}
          >
            დასრულების თარიღი
            <span style={{ marginLeft: "4px" }}>
              {sortConfig.key === "due_date" &&
                (sortConfig.direction === "desc" ? "▼" : "▲")}
            </span>
          </div>
        ),
        accessorKey: "due_date",
        cell: cellProps => {
          const date = new Date(cellProps.row.original.due_date)
          return date.toLocaleDateString("ka-GE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        },
      },
      {
        header: "პრიორიტეტი",
        accessorKey: "priority",
        cell: cellProps => {
          switch (cellProps.row.original.priority) {
            case "high":
              return <Badge className="bg-danger">მაღალი</Badge>
            case "medium":
              return <Badge className="bg-warning">საშუალო</Badge>
            case "low":
              return <Badge className="bg-success">დაბალი</Badge>
            default:
              return <Badge className="bg-secondary">უცნობი</Badge>
          }
        },
      },
      {
        header: "სტატუსი",
        accessorKey: "status",
        cell: cellProps => {
          switch (cellProps.row.original.status) {
            case "pending":
              return <Badge className="bg-warning">ახალი</Badge>
            case "in_progress":
              return <Badge className="bg-info">მიმდინარე</Badge>
            case "completed":
              return <Badge className="bg-success">დასრულებული</Badge>
            case "cancelled":
              return <Badge className="bg-danger">გაუქმებული</Badge>
            default:
              return <Badge className="bg-secondary">უცნობი</Badge>
          }
        },
      },
      {
        header: "პასუხისმგებელი პირი",
        accessorKey: "assigned_to",
        cell: cellProps => {
          const user = cellProps.row.original.assigned_user
          return user ? `${user.name} ${user.sur_name}` : "Unassigned"
        },
      },
      {
        header: "მოქმედება",
        cell: cellProps => (
          <ul className="list-unstyled hstack gap-1 mb-0">
            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Edit">
              <Link
                to="#"
                className="btn btn-sm btn-soft-info"
                onClick={() => handleTaskClick(cellProps.row.original)}
              >
                <MdEdit />
              </Link>
            </li>
            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
              <Link
                to="#"
                className="btn btn-sm btn-soft-danger"
                onClick={() => onClickDelete(cellProps.row.original)}
              >
                <MdDelete />
              </Link>
            </li>
          </ul>
        ),
      },
    ],
    [sortConfig]
  )

  const totalPages = Math.ceil(tasks.length / itemsPerPage)

  const handlePageClick = page => {
    if (page !== currentPage) {
      setCurrentPage(page)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  useEffect(() => {
    if (tasks.length > 0) {
      const sortedTasks = [...tasks].sort((a, b) => {
        const dateA = new Date(a[sortConfig.key])
        const dateB = new Date(b[sortConfig.key])
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA
      })
      setTasks(sortedTasks)
    }
  }, [sortConfig])

  return (
    <>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTask}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="max-w-9xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6">
        {isLoading ? (
          <Spinners setLoading={setLoading} />
        ) : (
          <Row>
            <Col xs="12">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <h5 className="text-xl font-medium mb-3 sm:mb-0">
                  ბილეთების სია
                </h5>
                <div>
                  <Link
                    to="#!"
                    onClick={() => setModal(true)}
                    className="btn btn-primary w-full sm:w-auto"
                  >
                    ახალი ბილეთის გახსნა
                  </Link>
                </div>
              </div>
              {tasks.length > 0 ? (
                <Fragment>
                  <div className="overflow-x-auto">
                    <Table hover className="table-nowrap min-w-full">
                      <thead className="thead-light">
                        <tr>
                          {columns.map((column, index) => (
                            <th
                              key={column.accessorKey || index}
                              className="whitespace-nowrap"
                            >
                              {column.header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tasks
                          .slice(
                            (currentPage - 1) * itemsPerPage,
                            currentPage * itemsPerPage
                          )
                          .map((task, index) => (
                            <React.Fragment key={task.id}>
                              <tr
                                onClick={() => toggleRow(index)}
                                className="cursor-pointer hover:bg-gray-50"
                              >
                                {columns.map(column => (
                                  <td
                                    key={`${task.id}-${column.accessorKey}`}
                                    className="whitespace-nowrap"
                                  >
                                    {column.cell
                                      ? column.cell({
                                          row: { original: task },
                                        })
                                      : task[column.accessorKey]}
                                  </td>
                                ))}
                              </tr>
                              {expandedRows.includes(index) && (
                                <tr>
                                  <td colSpan={columns.length}>
                                    <div className="p-3 text-sm">
                                      <p className="font-medium mb-2">
                                        დეტალური ინფორმაცია
                                      </p>
                                      <ul className="space-y-2">
                                        <li>
                                          <span className="font-medium">
                                            პრობლემის ტიპი:
                                          </span>{" "}
                                          {task.task_title}
                                        </li>
                                        <li>
                                          <span className="font-medium">
                                            აღწერა:
                                          </span>{" "}
                                          {task.description}
                                        </li>
                                        <li>
                                          <span className="font-medium">
                                            თარიღი:
                                          </span>{" "}
                                          {task.due_date}
                                        </li>
                                        <li>
                                          <span className="font-medium">
                                            პრიორიტეტი:
                                          </span>{" "}
                                          {task.priority}
                                        </li>
                                        <li>
                                          <span className="font-medium">
                                            სტატუსი:
                                          </span>{" "}
                                          {task.status}
                                        </li>
                                        <li>
                                          <span className="font-medium">
                                            პასუხისმგებელი პირი:
                                          </span>{" "}
                                          {task.assigned_user
                                            ? `${task.assigned_user.name} ${task.assigned_user.sur_name}`
                                            : "არ არის მითითებული"}
                                        </li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                      </tbody>
                    </Table>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
                      <div className="text-sm text-gray-600 order-2 sm:order-1">
                        გვერდი {currentPage} / {totalPages}
                      </div>
                      <div className="flex justify-center order-1 sm:order-2 w-full sm:w-auto">
                        <nav className="flex items-center gap-1">
                          <button
                            className={`p-2 rounded hover:bg-gray-100 ${
                              currentPage <= 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={handlePreviousPage}
                            disabled={currentPage <= 1}
                          >
                            <MdChevronLeft className="w-5 h-5" />
                          </button>

                          <div className="hidden sm:flex items-center gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                              <button
                                key={i + 1}
                                onClick={() => handlePageClick(i + 1)}
                                className={`px-3 py-1 rounded ${
                                  currentPage === i + 1
                                    ? "bg-primary text-white"
                                    : "hover:bg-gray-100"
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>

                          <button
                            className={`p-2 rounded hover:bg-gray-100 ${
                              currentPage >= totalPages
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages}
                          >
                            <MdChevronRight className="w-5 h-5" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  )}
                </Fragment>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  ბილეთები არ მოიძებნა
                </div>
              )}
            </Col>
          </Row>
        )}
        <Modal
          isOpen={modal}
          toggle={toggleModal}
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={toggleModal} tag="h4">
            {isEdit ? "ბილეთის რედაქტირება" : "ახალი ბილეთი"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={e => {
                e.preventDefault()
                validation.handleSubmit()
                return false
              }}
              className="space-y-4"
            >
              <div>
                <Label className="mb-1">პრობლემის ტიპი</Label>
                <Input
                  name="task_title"
                  type="text"
                  placeholder="შეიყვანეთ პრობლემის ტიპი"
                  className="w-full"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.task_title || ""}
                  invalid={
                    validation.touched.task_title &&
                    validation.errors.task_title
                      ? true
                      : false
                  }
                />
                {validation.touched.task_title &&
                  validation.errors.task_title && (
                    <FormFeedback>{validation.errors.task_title}</FormFeedback>
                  )}
              </div>

              <div>
                <Label className="mb-1">აღწერა</Label>
                <Input
                  name="description"
                  type="textarea"
                  rows="4"
                  placeholder="აღწერეთ პრობლემა"
                  className="w-full"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.description || ""}
                  invalid={
                    validation.touched.description &&
                    validation.errors.description
                      ? true
                      : false
                  }
                />
                {validation.touched.description &&
                  validation.errors.description && (
                    <FormFeedback>{validation.errors.description}</FormFeedback>
                  )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1">სტატუსი</Label>
                  <Input
                    name="status"
                    type="select"
                    className="w-full"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.status || ""}
                    invalid={
                      validation.touched.status && validation.errors.status
                        ? true
                        : false
                    }
                  >
                    <option value="pending">ახალი</option>
                    <option value="in_progress">მიმდინარე</option>
                    <option value="completed">დასრულებული</option>
                  </Input>
                  {validation.touched.status && validation.errors.status && (
                    <FormFeedback>{validation.errors.status}</FormFeedback>
                  )}
                </div>

                <div>
                  <Label className="mb-1">პრიორიტეტი</Label>
                  <Input
                    name="priority"
                    type="select"
                    className="w-full"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.priority || ""}
                    invalid={
                      validation.touched.priority && validation.errors.priority
                        ? true
                        : false
                    }
                  >
                    <option value="low">დაბალი</option>
                    <option value="medium">საშუალო</option>
                    <option value="high">მაღალი</option>
                  </Input>
                  {validation.touched.priority &&
                    validation.errors.priority && (
                      <FormFeedback>{validation.errors.priority}</FormFeedback>
                    )}
                </div>
              </div>

              <div>
                <Label className="mb-1">პასუხისმგებელი პირი</Label>
                <Input
                  name="assigned_to"
                  type="select"
                  className="w-full"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.assigned_to || ""}
                  invalid={
                    validation.touched.assigned_to &&
                    validation.errors.assigned_to
                      ? true
                      : false
                  }
                >
                  <option value="" disabled>
                    აირჩიეთ პასუხისმგებელი პირი
                  </option>
                  {!usersLoading &&
                    usersList.map(user => (
                      <option key={user.id} value={user.id.toString()}>
                        {`${user.name} ${user.sur_name}`}
                      </option>
                    ))}
                </Input>
                {validation.touched.assigned_to &&
                  validation.errors.assigned_to && (
                    <FormFeedback>{validation.errors.assigned_to}</FormFeedback>
                  )}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  color="success"
                  type="submit"
                  className="w-full sm:w-auto"
                >
                  გაგზავნა
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </div>
      <ToastContainer />
    </>
  )
}

export default FarmWork
