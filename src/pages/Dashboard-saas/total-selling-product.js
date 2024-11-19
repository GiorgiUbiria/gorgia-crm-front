import React, { useEffect, useState } from "react";
import { Col, Card, CardBody, Table } from "reactstrap";
import ReactApexChart from "react-apexcharts";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

//actions
import { getTopSellingProduct } from "../../store/actions";

const getChartOptions = index => {
  var options = {
    chart: { sparkline: { enabled: !0 } },
    dataLabels: { enabled: !1 },
    colors: ["#556ee6"],
    plotOptions: {
      radialBar: {
        hollow: { margin: 0, size: "60%" },
        track: { margin: 0 },
        dataLabels: { show: !1 },
      },
    },
  };
  switch (index) {
    case 1:
      options["colors"][0] = "#556ee6";
      break;
    case 2:
      options["colors"][0] = "#34c38f";
      break;
    case 3:
      options["colors"][0] = "#f46a6a";
      break;
    default:
      break;
  }

  return options;
};

const TotalSellngProduct = () => {
  const dispatch = useDispatch();

  const DashboardSaasProperties = createSelector(
    (state) => state.DashboardSaas,
    (dashboardSaas) => ({
      sellingData: dashboardSaas.sellingData,
    })
  );

  const {
    sellingData
  } = useSelector(DashboardSaasProperties);

  useEffect(() => {
    dispatch(getTopSellingProduct("jan"));
  }, [dispatch]);

  const [selectedMonth, setSelectedMonth] = useState("jan");

  const onChangeMonth = value => {
    setSelectedMonth(value);
    dispatch(getTopSellingProduct(value));
  };

  return (
    <React.Fragment>
      <Col xl="4">
        <Card>
          <CardBody>
            <div className="clearfix">
              <div className="float-end">
                <div className="input-group input-group-sm">
                  <select
                    className="form-select form-select-sm"
                    value={selectedMonth}
                    onChange={e => {
                      onChangeMonth(e.target.value);
                    }}
                  >
                    <option value="jan">Jan</option>
                    <option value="dec">Dec</option>
                    <option value="nov">Nov</option>
                    <option value="oct">Oct</option>
                  </select>
                  <label className="input-group-text">Month</label>
                </div>
              </div>
              <h4 className="card-title mb-4">Top Selling product</h4>
            </div>

            <div className="text-muted text-center">
              <p className="mb-2">Product A</p>
              <h4>$ 6385</h4>
              <p className="mt-4 mb-0">
                <span className="badge badge-soft-success font-size-11 me-2">
                  {" "}
                  0.6% <i className="mdi mdi-arrow-up" />{" "}
                </span>{" "}
                From previous period
              </p>
            </div>

            <div className="table-responsive mt-4">
              <Table className="table align-middle mb-0">
                <tbody>
                  {(sellingData || [])?.map((data, key) => {
                    const options = getChartOptions(key + 1);
                    return (
                      <tr key={key}>
                        <td>
                          <h5 className="font-size-14 mb-1">{data.name}</h5>
                          <p className="text-muted mb-0">{data.desc}</p>
                        </td>

                        <td>
                          <div id="radialchart-1">
                            <ReactApexChart
                              options={options}
                              series={[data.value]}
                              type="radialBar"
                              height={60}
                              width={60}
                              className="apex-charts"
                            />
                          </div>
                        </td>
                        <td>
                          <p className="text-muted mb-1">Sales</p>
                          <h5 className="mb-0">{data.value} %</h5>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default TotalSellngProduct;
