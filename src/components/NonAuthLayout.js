import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import withRouter from './Common/withRouter';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from "reselect";
import { changeLayoutMode } from 'store/actions';

const NonAuthLayout = (props) => {
  const dispatch = useDispatch();

  const LayoutModeProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({
      layoutModeType: layout.layoutModeType,
    })
  );

  const {
    layoutModeType
  } = useSelector(LayoutModeProperties);

  useEffect(() => {
    if (layoutModeType) {
      dispatch(changeLayoutMode(layoutModeType));
    }
  }, [layoutModeType, dispatch]);

  return (
    <React.Fragment>{props.children}</React.Fragment>
  );
};

NonAuthLayout.propTypes = {
  children: PropTypes.any,
  location: PropTypes.object
};

export default withRouter(NonAuthLayout);
