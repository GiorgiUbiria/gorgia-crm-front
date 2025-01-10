import React from "react"
import { Spinner } from "reactstrap"

const Spinners = ({ className = "position-absolute top-50 start-50" }) => {
  return <Spinner color="primary" className={className} />
}

export default Spinners