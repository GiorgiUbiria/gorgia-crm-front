import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
} from "reactstrap";

import withRouter from "components/Common/withRouter";;

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

//Import Cards
import CardProject from "./card-project";

import { getProjects as onGetProjects } from "store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import Spinners from "components/Common/Spinner";
import Paginations from "components/Common/Pagination";

const ProjectsGrid = () => {

  //meta title
  document.title = "Projects Grid | Gorgia LLC";

  const dispatch = useDispatch();

  const ProjectsProjectProperties = createSelector(
    (state) => state.projects,
    (Projects) => ({
      projects: Projects.projects,
      loading: Projects.loading
    })
  );

  const {
    loading, projects,
  } = useSelector(ProjectsProjectProperties);

  const [isLoading, setLoading] = useState(loading);
  const [projectsList, setProjectsList] = useState();

  useEffect(() => {
    dispatch(onGetProjects());
  }, [dispatch]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPageData = 6;
  const indexOfLast = currentPage * perPageData;
  const indexOfFirst = indexOfLast - perPageData;
  const currentdata = useMemo(() => projects?.slice(indexOfFirst, indexOfLast), [projects, indexOfFirst, indexOfLast])

  useEffect(() => {
    setProjectsList(currentdata);
  }, [currentdata]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Projects" breadcrumbItem="Projects Grid" />

          <Row>
            {/* Import Cards */}
            {
              isLoading ? <Spinners setLoading={setLoading} />
                :
                <>
                  <CardProject projects={projectsList} />
                  <Row>
                    <Paginations
                      perPageData={perPageData}
                      data={projects}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      isShowingPageLength={false}
                      paginationDiv="col-12"
                      paginationClass="pagination pagination-rounded justify-content-center mt-2 mb-5" />
                  </Row>
                </>
            }
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(ProjectsGrid);
