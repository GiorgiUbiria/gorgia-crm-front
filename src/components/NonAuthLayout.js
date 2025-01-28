import React from "react"
import PropTypes from "prop-types"

const NonAuthLayout = props => {
  return <React.Fragment>{props.children}</React.Fragment>
}

NonAuthLayout.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object,
}

export default NonAuthLayout
