import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Col, Container, Row } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

//Import Card
import CardShop from "./CardShop"
import { getShops as onGetShops } from "store/e-commerce/actions"

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import Spinners from "components/Common/Spinner"

const EcommerceShops = () => {

  //meta title
  document.title = "Shops | Gorgia LLC";

  const dispatch = useDispatch()

  const EcommerenceShopsProperties = createSelector(
    (state) => state.ecommerce,
    (Ecommerce) => ({
      shops: Ecommerce.shops,
      loading: Ecommerce.loading
    })
  );

  const {
    shops, loading
  } = useSelector(EcommerenceShopsProperties);

  const [isLoading, setLoading] = useState(loading)

  useEffect(() => {
    dispatch(onGetShops())
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Ecommerce" breadcrumbItem="Shops" />
          {
            isLoading ? <Spinners setLoading={setLoading} />
              :
              <>
                <Row>
                  {(shops || [])?.map((shop, key) => (
                    <CardShop shop={shop} key={"_shop_" + key} />
                  ))}
                </Row>
                <Row>
                  <Col xs="12">
                    <div className="text-center my-3">
                      <Link to="#" className="text-success">
                        <i className="bx bx-loader bx-spin font-size-18 align-middle me-2" />
                        Load more
                      </Link>
                    </div>
                  </Col>
                </Row>
              </>
          }
        </Container>
      </div>
    </React.Fragment>
  )
}

EcommerceShops.propTypes = {
  shops: PropTypes.array,
  onGetShops: PropTypes.func,
}

export default EcommerceShops;
