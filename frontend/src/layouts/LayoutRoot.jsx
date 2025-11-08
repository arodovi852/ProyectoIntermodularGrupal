import {Outlet} from "react-router";
import {Fragment} from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";


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