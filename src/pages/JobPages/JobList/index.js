import React, { Fragment, useEffect, useMemo, useState } from "react"
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import * as Yup from "yup"
import { useFormik } from "formik"
import { MdEdit, MdDelete, MdChevronLeft, MdChevronRight } from "react-icons/md"

import DeleteModal from "../../../components/Common/DeleteModal"

import {
  getTaskList,
  createTask,
  updateTask,
  deleteTask,
  getMyTasks,
} from "../../../services/tasks"

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
import useFetchUsers from "../../../hooks/useFetchUsers"
import useUserRoles from "../../../hooks/useUserRoles"

const TaskList = () => {
  document.title = "Tasks List | Gorgia LLC"

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
  const { users: allUsers, loading: usersLoading } = useFetchUsers()
  const usersList = allUsers?.filter(user => user.department_id === 5)
  const userRoles = useUserRoles()
  const currentUser = JSON.parse(sessionStorage.getItem("authUser"))

  const hasEditPermission = useMemo(() => {
    return userRoles.includes("admin") || currentUser?.department_id === 5
  }, [userRoles, currentUser])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response =
        currentUser?.department_id === 5
          ? await getTaskList()
          : await getMyTasks()

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
      priority: task?.priority || "Medium",
      status: task?.status || "Pending",
      ip_address: task?.ip_address || "",
      assigned_to: task?.assigned_to || "",
    },
    validationSchema: Yup.object({
      task_title: Yup.string().required("მიუთითეთ პრობლემის ტიპი"),
      description: Yup.string().required("აღწერეთ პრობლემა"),
      priority: Yup.string().required("მიუთითეთ პრიორიტეტი"),
      status: Yup.string().required("მიუთითეთ სტატუსი"),
      ip_address: Yup.string()
        .required("მიუთითეთ IP მისამართი")
        .matches(
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
          "Invalid IP address format"
        ),
      assigned_to: Yup.string(),
    }),
    onSubmit: async values => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]

        const payload = {
          ...values,
          user_id: currentUser.id,
          due_date: currentDate,
        }

        console.log(payload)
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
    setTask(task)
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
            to={`/support/it-tasks/${cellProps.row.original.id}`}
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
        header: "IP მისამართი",
        accessorKey: "ip_address",
        cell: cellProps => cellProps.row.original.ip_address || "N/A",
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
            hour: "2-digit",
            minute: "2-digit",
          })
        },
      },
      {
        header: "პრიორიტეტი",
        accessorKey: "priority",
        cell: cellProps => {
          switch (cellProps.row.original.priority) {
            case "High":
              return <Badge className="bg-danger">მაღალი</Badge>
            case "Medium":
              return <Badge className="bg-warning">საშუალო</Badge>
            case "Low":
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
            case "Pending":
              return <Badge className="bg-warning">ახალი</Badge>
            case "In Progress":
              return <Badge className="bg-info">მიმდინარე</Badge>
            case "Completed":
              return <Badge className="bg-success">დასრულებული</Badge>
            case "Cancelled":
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
      hasEditPermission && {
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
    [sortConfig, hasEditPermission]
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
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
                                          <strong>პრობლემის ტიპი:</strong>{" "}
                                          {task.task_title}
                                        </li>
                                        <li>
                                          <strong>აღწერა:</strong>{" "}
                                          {task.description}
                                        </li>
                                        <li>
                                          <strong>IP მისამართი:</strong>{" "}
                                          {task.ip_address}
                                        </li>
                                        <li>
                                          <strong>თარიღი:</strong>{" "}
                                          {task.due_date}
                                        </li>
                                        <li>
                                          <strong>პრიორიტეტი:</strong>{" "}
                                          {task.priority}
                                        </li>
                                        <li>
                                          <strong>სტატუსი:</strong>{" "}
                                          {task.status}
                                        </li>
                                        <li>
                                          <strong>პასუხისმგებელი პირი:</strong>{" "}
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
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex justify-center order-1 sm:order-2 w-full sm:w-auto">
                        <ul className="pagination flex">
                          <li
                            className={`page-item ${
                              currentPage <= 1 ? "disabled opacity-50" : ""
                            }`}
                          >
                            <Link
                              className="page-link px-3 py-2"
                              to="#"
                              onClick={handlePreviousPage}
                            >
                              <MdChevronLeft />
                            </Link>
                          </li>
                          {[...Array(totalPages).keys()].map(page => (
                            <li
                              key={page + 1}
                              className={`page-item hidden sm:block ${
                                currentPage === page + 1 ? "active" : ""
                              }`}
                            >
                              <Link
                                className="page-link px-3 py-2"
                                to="#"
                                onClick={() => handlePageClick(page + 1)}
                              >
                                {page + 1}
                              </Link>
                            </li>
                          ))}
                          <li
                            className={`page-item ${
                              currentPage >= totalPages
                                ? "disabled opacity-50"
                                : ""
                            }`}
                          >
                            <Link
                              className="page-link px-3 py-2"
                              to="#"
                              onClick={handleNextPage}
                            >
                              <MdChevronRight />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </Fragment>
              ) : (
                <div className="text-center py-8">თასქები არ არის</div>
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
            {isEdit ? "რედაქტირება" : "ახალი თასქის დამატება"}
          </ModalHeader>
          <ModalBody>
            <Form
              onSubmit={e => {
                e.preventDefault()
                validation.handleSubmit()
                return false
              }}
            >
              <Row>
                <Col xs="12">
                  <div className="mb-3">
                    <Label className="form-label">აირჩიეთ პრობლემის ტიპი</Label>
                    <Input
                      name="task_title"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.task_title || ""}
                      invalid={
                        validation.touched.task_title &&
                        validation.errors.task_title
                          ? true
                          : false
                      }
                    >
                      <option value="" disabled hidden>
                        აირჩიეთ პრობლემის ტიპი
                      </option>
                      <option value="პრინტერის პრობლემა">
                        პრინტერის პრობლემა
                      </option>
                      <option value="სერვისი">სერვისი</option>
                      <option value="პაროლის აღდგენა">პარლის აღდგენა</option>
                      <option value="ელ-ფოსტის პრობლემა">
                        ელ-ფოსტის პრობლემა
                      </option>
                      <option value="ტექნიკური პრობლემა">
                        ტექნიკური პრობლემა
                      </option>
                      <option value="სერვისის პრობლემა">
                        სერვისის პრობლემა
                      </option>
                      <option value="ფაილების აღდგენა">ფაილების აღდგენა</option>
                      <option value="სხვა">სხვა</option>
                    </Input>
                    {validation.touched.task_title &&
                    validation.errors.task_title ? (
                      <FormFeedback type="invalid">
                        {validation.errors.task_title}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <Label className="form-label">აღწერა</Label>
                    <Input
                      name="description"
                      type="textarea"
                      className="form-control"
                      placeholder="აღწერეთ პრობლემა"
                      rows="4"
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
                    validation.errors.description ? (
                      <FormFeedback type="invalid">
                        {validation.errors.description}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <Label className="form-label">პრიორიტეტი</Label>
                    <Input
                      name="priority"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.priority || ""}
                      invalid={
                        validation.touched.priority &&
                        validation.errors.priority
                          ? true
                          : false
                      }
                    >
                      <option value="Low">დაბალი</option>
                      <option value="Medium">საშუალო</option>
                      <option value="High">მაღალი</option>
                    </Input>
                    {validation.touched.priority &&
                    validation.errors.priority ? (
                      <FormFeedback type="invalid">
                        {validation.errors.priority}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <Label className="form-label">სტატუსი</Label>
                    <Input
                      name="status"
                      type="select"
                      className="form-select"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.status || ""}
                      invalid={
                        validation.touched.status && validation.errors.status
                          ? true
                          : false
                      }
                    >
                      <option value="Pending">ახალი</option>
                      <option value="In Progress">მიმდინარე</option>
                      <option value="Completed">დასრულებული</option>
                      <option value="Cancelled">გაუქმებული</option>
                    </Input>
                    {validation.touched.status && validation.errors.status ? (
                      <FormFeedback type="invalid">
                        {validation.errors.status}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <Label className="form-label">IP მისამართი</Label>
                    <Input
                      name="ip_address"
                      type="text"
                      className="form-control"
                      placeholder="ჩაწერეთ თქვენი იპ მისამართი"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.ip_address || ""}
                      invalid={
                        validation.touched.ip_address &&
                        validation.errors.ip_address
                          ? true
                          : false
                      }
                    />
                    {validation.touched.ip_address &&
                    validation.errors.ip_address ? (
                      <FormFeedback type="invalid">
                        {validation.errors.ip_address}
                      </FormFeedback>
                    ) : null}
                  </div>

                  <div className="mb-3">
                    <Label className="form-label">პასუხისმგებელი პირი</Label>
                    {userRoles.includes("admin") ? (
                      <>
                        <Input
                          name="assigned_to"
                          type="select"
                          className="form-select"
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
                              <option key={user.id} value={user.id}>
                                {`${user.name} ${user.sur_name}`}
                              </option>
                            ))}
                        </Input>
                        {validation.touched.assigned_to &&
                        validation.errors.assigned_to ? (
                          <FormFeedback type="invalid">
                            {validation.errors.assigned_to}
                          </FormFeedback>
                        ) : null}
                      </>
                    ) : (
                      <div className="text-muted text-sm">
                        მხოლოდ ადმინისტრატორს შეუძლია პასუხისმგებელი პირის
                        მითითება
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="text-end mt-4">
                    <Button
                      color="success"
                      type="submit"
                      className="w-full sm:w-auto"
                    >
                      გაგზავნა
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </ModalBody>
        </Modal>
      </div>
      <ToastContainer />
    </>
  )
}

export default TaskList
