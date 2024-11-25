import React from 'react';
import useFetchUser from '../../hooks/useFetchUser';

const DataProvider = ({ children }) => {
    useFetchUser();

    return <>{children}</>
};

export default DataProvider;