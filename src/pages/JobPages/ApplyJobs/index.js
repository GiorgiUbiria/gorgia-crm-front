import React, { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import TableContainer from "../../../components/Common/TableContainer"
import {
  Badge,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import DeleteModal from "components/Common/DeleteModal"

import {
  getApplyJob as OnGetApplyJob,
  deleteApplyJob as OnDeleteApplyJob,
} from "store/jobs/actions"

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import Spinners from "components/Common/Spinner"
import { ToastContainer } from "react-toastify"

const ApplyJobs = () => {
  //meta title
  document.title = "Job Apply | Gorgia LLC"

  const dispatch = useDispatch()

  const JobsApplyProperties = createSelector(
    (state) => state.JobReducer,
    (jobReducer) => ({
      jobApply: jobReducer.jobApply,
      loading: jobReducer.loading
    })
  );

  const {
    jobApply, loading
  } = useSelector(JobsApplyProperties);
  const [isLoading, setLoading] = useState(loading)

  const [apply, setApply] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    dispatch(OnGetApplyJob())
  }, [dispatch])

  useEffect(() => {
    setApply(jobApply)
  }, [jobApply])

  // delete
  const onClickData = apply => {
    setApply(apply)
    setDeleteModal(true)
  }

  const handleDeleteApplyJob = () => {
    if (apply && apply.id) {
      dispatch(OnDeleteApplyJob(apply.id))
      setDeleteModal(false)
    }
  }

  const columns = useMemo(
    () => [
      {
        header: "No",
        accessorKey: "no",
        enableColumnFilter: false,
        enableSorting: true,

      },
      {
        header: "Job Title",
        accessorKey: "jobTitle",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Company Name",
        accessorKey: "companyName",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Type",
        accessorKey: "type",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          switch (cellProps.row.original.type) {
            case "Full Time":
              return <Badge className="badge-soft-success">Full Time</Badge>
            case "Freelance":
              return <Badge className="badge-soft-info">Freelance</Badge>
            case "Internship":
              return <Badge className="badge-soft-warning">Internship</Badge>
            default:
              return <Badge className="badge-soft-danger">Part Time</Badge>
          }
        }
      },
      {
        header: "Apply Date",
        accessorKey: "applyDate",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          switch (cellProps.row.original.status) {
            case "Active":
              return <Badge className="bg-success">Active</Badge>
            case "New":
              return <Badge className="bg-info">New</Badge>
            default:
              return <Badge className="bg-danger">Close</Badge>
          }
        }
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: true,
        cell: (cellProps) => {
          return (
            <div className="list-unstyled hstack gap-1 mb-0">
              <li>
                <Link to="/job-details" className="btn btn-sm btn-soft-primary" id={`viewtooltip${cellProps.row.original.id}`}>
                  <i className="mdi mdi-eye-outline" />
                  <UncontrolledTooltip placement="top" target={`viewtooltip${cellProps.row.original.id}`}>
                    View
                  </UncontrolledTooltip>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="btn btn-sm btn-soft-danger"
                  onClick={() => {
                    const userData = cellProps.row.original
                    onClickData(userData)
                  }}
                  id={`deletetooltip${cellProps.row.original.id}`}
                >
                  <i className="mdi mdi-delete-outline" />
                  <UncontrolledTooltip placement="top" target={`deletetooltip${cellProps.row.original.id}`}>
                    Delete
                  </UncontrolledTooltip>
                </Link>
              </li>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={() => handleDeleteApplyJob()}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Jobs" breadcrumbItem="Job Apply" />
          {
            isLoading ? <Spinners setLoading={setLoading} />
              :
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody className="border-bottom">
                      <div className="d-flex align-items-center">
                        <h5 className="mb-0 card-title flex-grow-1">
                          Applied Jobs
                        </h5>
                        <div className="flex-shrink-0">
                          <select
                            className="form-select"
                            aria-label="Default select example"
                          >
                            <option value="Today" defaultValue>
                              Today
                            </option>
                            <option value="1 Monthly">1 Month</option>
                            <option value="6 Month">6 Month</option>
                            <option value="1 Years">1 Year</option>
                          </select>
                        </div>
                      </div>
                    </CardBody>
                    <CardBody>
                     
                      <TableContainer
                        columns={columns}
                        data={jobApply || []}
                        isGlobalFilter={false}
                        isPagination={true}
                        tableClass="table-bordered align-middle nowrap"
                        pagination="pagination pagination-rounded"
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
          }
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default withRouter(ApplyJobs)
