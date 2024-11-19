import React from "react"
import { Container, Row, Col, Badge } from "reactstrap"
import { Link } from "react-router-dom"
import { blogs } from "../../../../common/data";

const Blog = () => {

  return (
    <React.Fragment>
      <section className="section bg-white" id="news">
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-center mb-5">
                <div className="small-title">Blog</div>
                <h4>Latest News</h4>
              </div>
            </Col>
          </Row>

          <Row>
            {blogs.map((blog, key) => (
              <Col xl="4" sm="6" key={key}>
                <div className="blog-box mb-4 mb-xl-0">
                  <div className="position-relative">
                    <img
                      src={blog.imgUrl}
                      alt=""
                      className="rounded img-fluid mx-auto d-block"
                    />
                    <Badge color="success" className="blog-badge font-size-11">
                      {blog.tag}
                    </Badge>
                  </div>

                  <div className="mt-4 text-muted">
                    <p className="mb-2">
                      <i className="bx bx-calendar me-1 ms-1" /> {blog.date}
                    </p>
                    <h5 className="mb-3">{blog.title}</h5>
                    <p>{blog.desc}</p>

                    <div>
                      <Link to="#">Read more</Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </React.Fragment>
  )
}

export default Blog
