import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "components/Common/withRouter";
import { Card, CardBody, CardTitle, Col, Container, FormGroup, Form, Input, Label, Nav, NavItem, NavLink, Row } from "reactstrap";
import classnames from "classnames";
import { isEmpty } from "lodash";

//Import Star Ratings
import StarRatings from "react-star-ratings";

// RangeSlider
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

//Import data
import { discountData, productsData } from "common/data";

//Import actions
import { getProducts as onGetProducts } from "store/e-commerce/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { handleSearchData } from "components/Common/searchFile";
import Paginations from "components/Common/Pagination";
import Spinners from "components/Common/Spinner";

const EcommerceProducts = () => {

  //meta title
  document.title = "Products | Gorgia LLC";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const EcommerenceProductsProperties = createSelector(
    (state) => state.ecommerce,
    (Ecommerce) => ({
      products: Ecommerce.products,
      loading: Ecommerce.loading
    })
  );

  const {
    products, loading
  } = useSelector(EcommerenceProductsProperties);

  const [isLoading, setLoading] = useState(loading)
  const [productList, setProductList] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  // eslint-disable-next-line no-unused-vars
  const filterClothes = [
    { id: 1, name: "T-shirts", link: "#" },
    { id: 2, name: "Shirts", link: "#" },
    { id: 3, name: "Jeans", link: "#" },
    { id: 4, name: "Jackets", link: "#" },
  ];

  useEffect(() => {
    dispatch(onGetProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(products)) setProductList(products);
  }, [products]);

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const onSelectDiscount = e => {
    const { value } = e.target;

    if (value !== null) {
      const filteredProducts = (products || [])?.filter((product) => product.offer.toString() === value.toString());
      setProductList(filteredProducts);
    } else {
      setProductList(products);
    }
  };

  //Product Filter with noUi slider
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(500);

  const onUpdate = useCallback((value) => {
    const filterData = (products || [])?.filter((i) => {
      return i.newPrice >= minCost && i.newPrice <= maxCost
    })
    setProductList(filterData)
    setMinCost(value[0]);
    setMaxCost(value[1]);
  }, [minCost, maxCost, products]);

  useEffect(() => {
    onUpdate([minCost, maxCost]);
  }, [minCost, maxCost, onUpdate]);

  /*
  on change rating checkbox method
  */
  const onChangeRating = value => {
    if (value !== null) {
      const filteredProducts = (products || [])?.filter((product) => product.rating === value);
      setProductList(filteredProducts);
    } else {
      setProductList(products);
    }
  };

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPageData = 6;
  const indexOfLast = currentPage * perPageData;
  const indexOfFirst = indexOfLast - perPageData;
  const currentdata = useMemo(() => products?.slice(indexOfFirst, indexOfLast), [products, indexOfFirst, indexOfLast])

  useEffect(() => {
    setProductList(currentdata);
  }, [currentdata, productsData]);

  // search
  const handleSearch = (ele) => {
    const query = ele.value.toLowerCase();
    handleSearchData({ setState: setProductList, data: products, item: query })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Ecommerce" breadcrumbItem="Products" />
          <Row>
            <Col lg="3">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Filter</CardTitle>
                  <div>
                    <h5 className="font-size-14 mb-3">Clothes</h5>
                    {/* Render Cloth Categories */}
                    <ul className="list-unstyled product-list">
                      {(filterClothes || [])?.map((cloth, key) => (
                        <li key={"_li_" + key}>
                          <Link to={cloth.link}>
                            <i className="mdi mdi-chevron-right me-2" /> {cloth.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-3">
                    <h5 className="font-size-14 mb-3">Price</h5>
                    <br />

                    <Nouislider
                      range={{ min: 0, max: 600 }}
                      tooltips={true}
                      start={[minCost, maxCost]}
                      connect
                      step={10}
                      onSlide={onUpdate}
                    />
                  </div>

                  <div className="mt-4 pt-3">
                    <h5 className="font-size-14 mb-3">Discount</h5>
                    {(discountData || []).map((discount, i) => (
                      <FormGroup check className="mt-2" key={i}>
                        <Input type="checkbox" value={discount.value} onChange={onSelectDiscount} />
                        <Label check>{discount.label} </Label>
                      </FormGroup>
                    ))}
                  </div>

                  <div className="mt-4 pt-3">
                    <h5 className="font-size-14 mb-3">Customer Rating</h5>
                    <div>
                      <FormGroup check className="mt-2">
                        <Input type="checkbox" id="productratingCheck1" onChange={(e) => { onChangeRating(4) }} />
                        <Label check htmlFor="productratingCheck1">
                          4 <i className="bx bx-star text-warning" /> & Above
                        </Label>
                      </FormGroup>
                      <FormGroup check className="mt-2">
                        <Input type="checkbox" id="productratingCheck2" onChange={(e) => { onChangeRating(3) }} />
                        <Label check htmlFor="productratingCheck2">
                          3 <i className="bx bx-star text-warning" /> & Above
                        </Label>
                      </FormGroup>
                      <FormGroup check className="mt-2">
                        <Input type="checkbox" id="productratingCheck3" onChange={(e) => { onChangeRating(2) }} />
                        <Label check htmlFor="productratingCheck3">
                          2 <i className="bx bx-star text-warning" /> & Above
                        </Label>
                      </FormGroup>
                      <FormGroup check className="mt-2">
                        <Input type="checkbox" id="productratingCheck4" onChange={(e) => { onChangeRating(1) }} />
                        <Label check htmlFor="productratingCheck4">
                          1 <i className="bx bx-star text-warning" />
                        </Label>
                      </FormGroup>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={9}>
              <Row className="mb-3">
                <Col xl={4} sm={6}>
                  <div className="mt-2">
                    <h5>Clothes</h5>
                  </div>
                </Col>
                <Col lg={8} sm={6}>
                  <Form className="mt-4 mt-sm-0 float-sm-end d-sm-flex align-items-center">
                    <div className="search-box me-2">
                      <div className="position-relative">
                        <Input
                          type="text"
                          className="form-control border-0"
                          placeholder="Search..."
                          onChange={(e) => handleSearch(e.target)}
                        />
                        <i className="bx bx-search-alt search-icon" />
                      </div>
                    </div>
                    <Nav className="product-view-nav justify-content-end mt-3 mt-sm-0" pills>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "1",
                          })}
                          onClick={() => {
                            toggleTab("1");
                          }}
                        >
                          <i className="bx bx-grid-alt" />
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({
                            active: activeTab === "2",
                          })}
                          onClick={() => {
                            toggleTab("2");
                          }}
                        >
                          <i className="bx bx-list-ul" />
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Form>
                </Col>
              </Row>
              {
                isLoading ? <Spinners setLoading={setLoading} />
                  :
                  <>
                    <Row>
                      {!isEmpty(productList) &&
                        (productList || [])?.map((product, key) => (
                          <Col xl={4} sm={6} key={"_col_" + key}>
                            <Card
                              onClick={() =>
                                navigate(
                                  `/ecommerce-product-detail/${product.id}`
                                )
                              }
                            >
                              <CardBody>
                                <div className="product-img position-relative">
                                  {product.isOffer ? (
                                    <div className="avatar-sm product-ribbon">
                                      <span className="avatar-title rounded-circle bg-primary">
                                        {`- ${product.offer} %`}
                                      </span>
                                    </div>
                                  ) : null}

                                  <img
                                    style={{ height: "auto"  }}
                                    src={product.image}
                                    alt=""
                                    className="img-fluid mx-auto d-block"
                                  />
                                </div>
                                <div className="mt-4 text-center">
                                  <h5 className="mb-3 text-truncate">
                                    <Link
                                      to={"/ecommerce-product-detail/" + product.id}
                                      className="text-dark"
                                    >
                                      {product.name}{" "}
                                    </Link>
                                  </h5>
                                  <div className="text-muted mb-3">
                                    <StarRatings
                                      rating={product.rating}
                                      starRatedColor="#F1B44C"
                                      starEmptyColor="#74788d"
                                      numberOfStars={5}
                                      name="rating"
                                      starDimension="14px"
                                      starSpacing="1px"
                                    />
                                  </div>
                                  <h5 className="my-0">
                                    <span className="text-muted me-2">
                                      <del>${product.oldPrice}</del>
                                    </span>
                                    <b>${product.newPrice}</b>
                                  </h5>
                                </div>
                              </CardBody>
                            </Card>
                          </Col>
                        ))}
                    </Row>
                    <Paginations
                      perPageData={perPageData}
                      data={products}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      isShowingPageLength={false}
                      paginationDiv="col-lg-12"
                      paginationClass="pagination pagination-rounded justify-content-center mt-3 mb-4 pb-1"
                    />
                  </>
              }

            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

EcommerceProducts.propTypes = {
  products: PropTypes.array,
  onGetProducts: PropTypes.func,
};

export default withRouter(EcommerceProducts);
