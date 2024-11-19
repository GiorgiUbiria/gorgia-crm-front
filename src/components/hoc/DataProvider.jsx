import React from 'react';
import useFetchUser from '../../hooks/useFetchUser';
import useFetchUsers from 'hooks/useFetchUsers';

const DataProvider = ({ children }) => {
    useFetchUser();
    useFetchUsers();

    return <>{children}</>
};

export default DataProvider;