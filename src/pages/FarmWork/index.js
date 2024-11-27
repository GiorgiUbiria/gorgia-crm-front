import React, { Fragment, useEffect, useMemo, useState } from "react"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import * as Yup from "yup"
import { useFormik } from "formik"

import Breadcrumbs from "../../components/Common/Breadcrumb"
import DeleteModal from "../../components/Common/DeleteModal"

import {
  getTaskList,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/tasks"

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
  Card,
  CardBody,
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
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [expandedRows, setExpandedRows] = useState([])
  const [sortConfig, setSortConfig] = useState({
    key: "due_date",
    direction: "desc",
  })
  const { users: usersList, loading: usersLoading } = useFetchUsers()

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await getTaskList()
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
      task_title: Yup.string().required("Please Enter Your Task Title"),
      description: Yup.string().required("Please Enter Your Description"),
      priority: Yup.string().required("Please Enter Priority"),
      status: Yup.string().required("Please Enter Status"),
      ip_address: Yup.string()
        .required("Please Enter IP Address")
        .matches(
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
          "Invalid IP address format"
        ),
      assigned_to: Yup.string().required("Please Select Assigned To"),
    }),
    onSubmit: async values => {
      try {
        const currentDate = new Date().toISOString().split("T")[0]

        const payload = {
          ...values,
          due_date: currentDate,
        }

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

  const handleSort = () => {
    setSortConfig(prevConfig => ({
      key: "due_date",
      direction: prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  const columns = useMemo(
    () => [
      {
        header: "No",
        accessorKey: "id",
        cell: cellProps => (
          <Link
            to={`/it-tasks/${cellProps.row.original.id}`}
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
            onClick={handleSort}
          >
            თარიღი
            <span style={{ marginLeft: "4px" }}>
              {sortConfig.direction === "desc" ? "▼" : "▲"}
            </span>
          </div>
        ),
        accessorKey: "due_date",
        cell: cellProps => cellProps.row.original.due_date,
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
                <i className="mdi mdi-pencil-outline" />
              </Link>
            </li>
            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Delete">
              <Link
                to="#"
                className="btn btn-sm btn-soft-danger"
                onClick={() => onClickDelete(cellProps.row.original)}
              >
                <i className="mdi mdi-delete-outline" />
              </Link>
            </li>
          </ul>
        ),
      },
    ],
    [sortConfig.direction]
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
        const dateA = new Date(a.due_date)
        const dateB = new Date(b.due_date)
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA
      })
      setTasks(sortedTasks)
    }
  }, [sortConfig])

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteTask}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="სამეურნეო" breadcrumbItem="თასქები" />
          {isLoading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody className="border-bottom">
                    <div className="d-flex align-items-center">
                      <h5 className="mb-0 card-title flex-grow-1">
                        ბილეთების სია
                      </h5>
                      <div className="flex-shrink-0">
                        <Link
                          to="#!"
                          onClick={() => setModal(true)}
                          className="btn btn-primary me-1"
                        >
                          ახალი ბილეთის გახსნა
                        </Link>
                      </div>
                    </div>
                  </CardBody>
                  <CardBody>
                    {tasks.length > 0 ? (
                      <Fragment>
                        <div className="table-responsive">
                          <Table hover className="table-nowrap">
                            <thead className="thead-light">
                              <tr>
                                {columns.map((column, index) => (
                                  <th key={column.accessorKey || index}>
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
                                      style={{ cursor: "pointer" }}
                                    >
                                      {columns.map(column => (
                                        <td
                                          key={`${task.id}-${column.accessorKey}`}
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
                                          <div className="p-3">
                                            <p>დეტალური ინფორმაცია</p>
                                            <ul>
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
                                                <strong>
                                                  პასუხისმგებელი პირი:
                                                </strong>{" "}
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
                          <Row className="justify-content-between align-items-center mt-3">
                            <Col sm={12} md={5}>
                              <div className="text-muted">
                                Page {currentPage} of {totalPages}
                              </div>
                            </Col>
                            <Col sm={12} md={7}>
                              <ul className="pagination">
                                <li
                                  className={`page-item ${
                                    currentPage <= 1 ? "disabled" : ""
                                  }`}
                                >
                                  <Link
                                    className="page-link"
                                    to="#"
                                    onClick={handlePreviousPage}
                                  >
                                    <i className="mdi mdi-chevron-left"></i>
                                  </Link>
                                </li>
                                {[...Array(totalPages).keys()].map(page => (
                                  <li
                                    key={page + 1}
                                    className={`page-item ${
                                      currentPage === page + 1 ? "active" : ""
                                    }`}
                                  >
                                    <Link
                                      className="page-link"
                                      to="#"
                                      onClick={() => handlePageClick(page + 1)}
                                    >
                                      {page + 1}
                                    </Link>
                                  </li>
                                ))}
                                <li
                                  className={`page-item ${
                                    currentPage >= totalPages ? "disabled" : ""
                                  }`}
                                >
                                  <Link
                                    className="page-link"
                                    to="#"
                                    onClick={handleNextPage}
                                  >
                                    <i className="mdi mdi-chevron-right"></i>
                                  </Link>
                                </li>
                              </ul>
                            </Col>
                          </Row>
                        )}
                      </Fragment>
                    ) : (
                      <div>No tasks available.</div>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal} tag="h4">
              {!!isEdit ? "Edit Task" : "Add Task"}
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
                  <Col className="col-12">
                    <div className="mb-3">
                      <Label>აირჩიეთ პრობლემის ტიპი</Label>
                      <Input
                        name="task_title"
                        type="select"
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
                        <option value="ფაილების აღდგენა">
                          ფაილების აღდგენა
                        </option>
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
                      <Label>აღწერა</Label>
                      <Input
                        name="description"
                        type="textarea"
                        placeholder="აღწერეთ პრობლემა"
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
                      <Label>პრიორიტეტი</Label>
                      <Input
                        name="priority"
                        type="select"
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
                      <Label>სტატუსი</Label>
                      <Input
                        name="status"
                        type="select"
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
                      <Label>IP მისამართი</Label>
                      <Input
                        name="ip_address"
                        type="text"
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
                      <Label>პასუხისმგებელი პირი</Label>
                      <Input
                        name="assigned_to"
                        type="select"
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
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <Button
                        color="success"
                        type="submit"
                        className="save-task"
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
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default FarmWork
