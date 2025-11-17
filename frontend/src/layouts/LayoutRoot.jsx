import {Outlet} from "react-router";
import React, {Fragment} from "react";
import {Footer} from "../components/Footer/Footer.jsx";
import {Header} from "../components/Header/Header.jsx";

function LayoutRoot() {
    return (
        <Fragment>
            <Header/>
            <Outlet/>
            <Footer/>
        </Fragment>
    )
}

export default LayoutRoot