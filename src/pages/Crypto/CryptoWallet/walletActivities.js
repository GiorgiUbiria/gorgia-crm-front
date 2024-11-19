import React, { useState, useEffect } from "react";
import { useMemo } from "react";
import { Card, CardBody, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import { getCryptoProducts as onGetCryptoProducts } from "store/actions";
import TableContainer from "../../../components/Common/TableContainer";
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from "reselect";
import Spinners from "components/Common/Spinner";
import { Link } from "react-router-dom";

const WalletActivities = ({ isLoading, setLoading }) => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("1");

  const CryptoProperties = createSelector(
    (state) => state.crypto,
    (Crypto) => ({
      products: Crypto.products,
    })
  );

  const {
    products
  } = useSelector(CryptoProperties);

  const [currentPages, setCurrentPages] = useState();

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    dispatch(onGetCryptoProducts());
  }, [dispatch]);

  useEffect(() => {
    setCurrentPages(products)
  }, [products])

  const columns = useMemo(
    () => [
      {
        header: "Id No",
        accessorKey: "idno",
        enableColumnFilter: false,
        enableSorting: true,
        cell: cellProps => {
          return <Link to="#" className="text-body fw-bold">{cellProps.getValue()}</Link>
        },
      },
      {
        header: "Date",
        accessorKey: "pdate",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Type",
        accessorKey: "type",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Currency",
        accessorKey: "coin",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Amount",
        accessorKey: "amount",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Amount in USD",
        accessorKey: "valueInUsd",
        enableColumnFilter: false,
        enableSorting: true,
      },
    ],
    []
  );

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">Activities</h4>
        {
          isLoading ? <Spinners setLoading={setLoading} />
            :
            <>
              <ul className="nav nav-tabs nav-tabs-custom">
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "1",
                    })}
                    onClick={() => {
                      toggleTab("1");
                      setCurrentPages(products)
                    }}
                  >
                    All
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "2",
                    })}
                    onClick={() => {
                      toggleTab("2");
                      setCurrentPages(products?.filter((data) => data.type === 'Buy'))
                    }}
                  >
                    Buy
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "3",
                    })}
                    onClick={() => {
                      toggleTab("3");
                      setCurrentPages(products?.filter((data) => data.type === 'Sell'))
                    }}
                  >
                    Sell
                  </NavLink>
                </NavItem>
              </ul>
              <div className="mt-4">

                <TableContainer
                  columns={columns}
                  data={currentPages || []}
                  isGlobalFilter={true}
                  isCustomPageSize={true}
                  isPagination={true}
                  SearchPlaceholder="search..."
                  tableClass="table-hover table-nowrap dt-responsive nowrap dataTable no-footer dtr-inline"
                  pagination="pagination pagination-rounded"
                />

              </div>
            </>
        }
      </CardBody>
    </Card>
  );
};

export default WalletActivities;
