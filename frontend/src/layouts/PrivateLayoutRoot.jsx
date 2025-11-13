import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.jsx';
import {Fragment} from "react";

const PrivateLayoutRoot = () => {
    const { isAuthenticated } = useAuth();
    return (
        <Fragment>
            {isAuthenticated ? <Outlet/> : <Navigate to="/Login"/>}
        </Fragment>
    )
};

export default PrivateLayoutRoot;
