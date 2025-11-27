import {Outlet, useLocation} from "react-router";
import React, {Fragment} from "react";
import {Footer} from "../components/Footer/Footer.jsx";
import {Header} from "../components/Header/Header.jsx";

function LayoutRoot() {
    const location = useLocation()
    const isLanding = location.pathname === '/'

    return (
        <Fragment>
            <Header/>
            <Outlet/>
            {!isLanding && <Footer/>}
        </Fragment>
    )
}

export default LayoutRoot