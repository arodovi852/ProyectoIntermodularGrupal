import { Navigate, Outlet } from 'react-router-dom';
import { UseAuth } from '../hooks/UseAuth.jsx';
import {Fragment} from "react";

const PrivateLayoutRoot = () => {
    const { isAuthenticated } = UseAuth();
    return (
        <Fragment>
            {isAuthenticated ? <Outlet/> : <Navigate to="/"/>}
        </Fragment>
    )
};

export default PrivateLayoutRoot;
