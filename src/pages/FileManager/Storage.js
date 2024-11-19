import React from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { Card, CardBody } from "reactstrap"
import ReactApexChart from "react-apexcharts"
import { storageData } from "common/data"

const Storage = (props) => {
  const { options, series } = props
  return (
    <React.Fragment>
      <Card className="filemanager-sidebar ms-lg-2">
        <CardBody>
          <div className="text-center">
            <h5 className="font-size-15 mb-4">Storage</h5>
            <div>
              <ReactApexChart
                options={options}
                series={series}
                type="radialBar"
                height={150}
                className="apex-charts"
              />
            </div>

            <p className="text-muted mt-4">48.02 GB (76%) of 64 GB used</p>
          </div>

          <div className="mt-4">
            {
              (storageData || [])?.map((item, index) => (
                <Card className="border shadow-none mb-2" key={index}>
                  <Link to="#" className="text-body">
                    <div className="p-2">
                      <div className="d-flex">
                        <div className="avatar-xs align-self-center me-2">
                          <div className={`avatar-title rounded bg-transparent text-${item.color} font-size-20`}>
                            <i className={item.icon}></i>
                          </div>
                        </div>

                        <div className="overflow-hidden me-auto">
                          <h5 className="font-size-13 text-truncate mb-1">
                            {item.title}
                          </h5>
                          <p className="text-muted text-truncate mb-0">{item.files}</p>
                        </div>

                        <div className="ml-2">
                          <p className="text-muted">{item.size}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))
            }
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}


Storage.propTypes = {
  options: PropTypes.any,
  series: PropTypes.any
}

export default Storage
