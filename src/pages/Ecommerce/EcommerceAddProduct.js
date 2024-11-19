import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";
import Select from "react-select";
import Dropzone from "react-dropzone";
import * as yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const EcommerceAddProduct = () => {

  //meta title
  document.title = "Add Product | Gorgia LLC";

  const [selectedFiles, setselectedFiles] = useState([])

  const options = [
    { value: "AK", label: "Alaska" },
    { value: "HI", label: "Hawaii" },
    { value: "CA", label: "California" },
    { value: "NV", label: "Nevada" },
    { value: "OR", label: "Oregon" },
    { value: "WA", label: "Washington" },
  ]

  const CategoryOptions = [
    { value: 'FA', label: 'Fashion' },
    { value: 'EL', label: 'Electronic' },
  ]

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )

    setselectedFiles(files)
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  //Basic Information
  const formik = useFormik({
    initialValues: {
      productName: '',
      manufacturerName: '',
      manufacturerBrand: '',
      price: '',
      category: '',
      productDesc: ''
    },
    validationSchema: yup.object().shape({
      productName: yup.string().required('Please Enter Your Product Name'),
      manufacturerName: yup.string().required('Please Enter Your Manufacturer Name'),
      manufacturerBrand: yup.string().required('Please Enter Your Manufacturer Brand'),
      price: yup.number().required('Please Enter Your Price'),
      category: yup.string().required('Please Enter Your Category'),
      productDesc: yup.string().required('Please Enter Your Product Description'),
    }),
    onSubmit: (values) => {
      // console.log('Basic Information', values);
      formik.resetForm();
    },
  });

  //Meta Data
  const metaData = useFormik({
    initialValues: {
      productName: '',
      manufacturerName: '',
      metaDescription: ''
    },
    validationSchema: yup.object().shape({
      productName: yup.string().required('Please Enter Your Product Name'),
      manufacturerName: yup.string().required('Please Enter Your Manufacturer Name'),
      metaDescription: yup.string().required('Please Enter Your Meta Description')
    }),
    onSubmit: (values) => {
      // console.log('Meta Data', values);
      metaData.resetForm();
    },
  })


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs title="Ecommerce" breadcrumbItem="Add Product" />

          <Row>
            <Col xs="12">
              <Card>
                <CardBody>
                  <CardTitle>Basic Information</CardTitle>
                  <p className="card-title-desc mb-4">
                    Fill all information below
                  </p>

                  <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm="6">
                        <div className="mb-3">
                          <Label htmlFor="productName">Product Name</Label>
                          <Input
                            id="productName"
                            name="productName"
                            type="text"
                            placeholder="Product Name"
                            value={formik.values.productName}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.productName && formik.errors.productName ? true : false
                            }
                          />
                          {formik.errors.productName && formik.touched.productName ? (
                            <FormFeedback type="invalid">{formik.errors.productName}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturerName"> Manufacturer Name </Label>
                          <Input
                            id="manufacturerName"
                            name="manufacturerName"
                            type="text"
                            placeholder="Manufacturer Name"
                            value={formik.values.manufacturerName}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.manufacturerName && formik.errors.manufacturerName ? true : false
                            }
                          />
                          {formik.errors.manufacturerName && formik.touched.manufacturerName ? (
                            <FormFeedback type="invalid">{formik.errors.manufacturerName}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="manufacturerBrand"> Manufacturer Brand </Label>
                          <Input
                            id="manufacturerBrand"
                            name="manufacturerBrand"
                            type="text"
                            placeholder="Manufacturer Brand"
                            value={formik.values.manufacturerBrand}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.manufacturerBrand && formik.errors.manufacturerBrand ? true : false
                            }
                          />
                          {formik.errors.manufacturerBrand && formik.touched.manufacturerBrand ? (
                            <FormFeedback type="invalid">{formik.errors.manufacturerBrand}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="Price"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.price && formik.errors.price ? true : false
                            }
                          />
                          {formik.errors.price && formik.touched.price ? (
                            <FormFeedback type="invalid">{formik.errors.price}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col sm="6">
                        <div className="mb-3">
                          <Label className="control-label">Category</Label>
                          <Select name="category" options={CategoryOptions} className="select2" />
                          {formik.errors.category && formik.touched.category ? (
                            <span className="text-danger">{formik.errors.category}</span>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label className="control-label">Features</Label>
                          <Select classNamePrefix="select2-selection" name="features" placeholder="Choose..." options={options} isMulti />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="productDesc">
                            Product Description
                          </Label>
                          <Input
                            tag="textarea"
                            className="mb-3"
                            id="productDesc"
                            name="productDesc"
                            rows={5}
                            placeholder="Product Description"
                            value={formik.values.productDesc}
                            onChange={formik.handleChange}
                            invalid={
                              formik.touched.productDesc && formik.errors.productDesc ? true : false
                            }
                          />
                          {formik.errors.productDesc && formik.touched.productDesc ? (
                            <FormFeedback type="invalid">{formik.errors.productDesc}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary"> Save Changes  </Button>
                      <Button type="button" color="secondary" onClick={() => formik.resetForm()}> Cancel</Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle className="mb-3">Product Images</CardTitle>
                  <Form>
                    <Dropzone
                      onDrop={acceptedFiles => {
                        handleAcceptedFiles(acceptedFiles)
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone">
                          <div
                            className="dz-message needsclick"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <div className="dz-message needsclick">
                              <div className="mb-3">
                                <i className="display-4 text-muted bx bxs-cloud-upload" />
                              </div>
                              <h4>Drop files here or click to upload.</h4>
                            </div>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <ul className="list-unstyled mb-0" id="file-previews">
                      {(selectedFiles || [])?.map((file, index) => {
                        return (
                          <li className="mt-2 dz-image-preview" key=''>
                            <div className="border rounded">
                              <div className="d-flex flex-wrap gap-2 p-2">
                                <div className="flex-shrink-0 me-3">
                                  <div className="avatar-sm bg-light rounded p-2">
                                    <img data-dz-thumbnail="" className="img-fluid rounded d-block" src={file.preview} alt={file.name} />
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <div className="pt-1">
                                    <h5 className="fs-md mb-1" data-dz-name>{file.path}</h5>
                                    <strong className="error text-danger" data-dz-errormessage></strong>
                                  </div>
                                </div>
                                <div className="flex-shrink-0 ms-3">
                                  <Button variant="danger" size="sm"
                                    onClick={() => {
                                      const newImages = [...selectedFiles];
                                      newImages.splice(index, 1);
                                      setselectedFiles(newImages);
                                    }}>
                                    Delete</Button>
                                </div>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </Form>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <CardTitle>Meta Data</CardTitle>
                  <p className="card-title-desc">   Fill all information below </p>

                  <Form onSubmit={metaData.handleSubmit} autoComplete="off">
                    <Row>
                      <Col sm={6}>
                        <div className="mb-3">
                          <Label htmlFor="metatitle">Meta title</Label>
                          <Input
                            id="metatitle"
                            name="productName"
                            type="text"
                            placeholder="Metatitle"
                            value={metaData.values.productName}
                            onChange={metaData.handleChange}
                            invalid={
                              metaData.touched.productName && metaData.errors.productName ? true : false
                            }
                          />
                          {metaData.errors.productName && metaData.touched.productName ? (
                            <FormFeedback type="invalid">{metaData.errors.productName}</FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="metakeywords">Meta Keywords</Label>
                          <Input
                            id="metakeywords"
                            name="manufacturerName"
                            type="text"
                            placeholder="Meta Keywords"
                            value={metaData.values.manufacturerName}
                            onChange={metaData.handleChange}
                            invalid={
                              metaData.touched.manufacturerName && metaData.errors.manufacturerName ? true : false
                            }
                          />
                          {metaData.errors.manufacturerName && metaData.touched.manufacturerName ? (
                            <FormFeedback type="invalid">{metaData.errors.manufacturerName}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>

                      <Col sm={6}>
                        <div className="mb-3">
                          <Label htmlFor="metaDescription">Meta Description  </Label>
                          <Input
                            name="metaDescription"
                            tag="textarea"
                            id="metaDescription"
                            rows={5}
                            placeholder="Meta Description"
                            value={metaData.values.metaDescription}
                            onChange={metaData.handleChange}
                            invalid={
                              metaData.touched.metaDescription && metaData.errors.metaDescription ? true : false
                            }
                          />
                          {metaData.errors.metaDescription && metaData.touched.metaDescription ? (
                            <FormFeedback type="invalid">{metaData.errors.metaDescription}</FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" className="waves-effect waves-light" color="primary">Save Changes  </Button>
                      <Button type="button" className="waves-effect waves-light" color="secondary" onClick={() => metaData.resetForm()}> Cancel</Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default EcommerceAddProduct
