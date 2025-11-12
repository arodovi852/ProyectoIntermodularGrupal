import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.jsx';
import {Fragment} from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const PrivateLayoutRoot = () => {
    const { isAuthenticated } = useAuth();
    return (
        <Fragment>
            <Header/>
            {isAuthenticated ? <Outlet/> : <Navigate to="/Login"/>}
            <Footer/>
        </Fragment>
    )
};

export default PrivateLayoutRoot;
