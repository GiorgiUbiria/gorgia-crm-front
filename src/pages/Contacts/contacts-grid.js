import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";
import { Col, Container, Row } from "reactstrap";
import { map } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

//Import Card
import CardContact from "./card-contact";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import { getUsers as onGetUsers } from "../../store/contacts/actions";
import Spinners from "components/Common/Spinner";

const ContactsGrid = () => {

  //meta title
  document.title = "User Grid | Skote - React Admin & Dashboard Template";

  const dispatch = useDispatch();

  const ContactsProperties = createSelector(
    (state) => state.contacts,
    (Contacts) => ({
      users: Contacts.users,
      loading: Contacts.loading
    })
  );

  const {
    users, loading
  } = useSelector(ContactsProperties);
  const [isLoading, setLoading] = useState(loading);

  useEffect(() => {
    if (users && !users.length) {
      dispatch(onGetUsers());
    }
  }, [dispatch, users]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="User Grid" />
          {
            isLoading ? <Spinners setLoading={setLoading} />
              :
              <>
                <Row>
                  {(users || [])?.map((user, key) => (
                    <CardContact user={user} key={"_user_" + key} />
                  ))}
                </Row>
                <Row>
                  <Col xs="12">
                    <div className="text-center my-3">
                      <Link to="#" className="text-success">
                        <i className="bx bx-hourglass bx-spin me-2" />
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
  );
};

export default withRouter(ContactsGrid);
