import {Outlet} from "react-router";
import React, {Fragment} from "react";
import {Footer} from "../components/Footer/Footer.jsx";
import {Header} from "../components/Header/Header.jsx";
import './LayoutRoot.css';

function LayoutRoot() {
    return (
        <div className="layout-root">
            <Header/>
            <main className="layout-content">
                <Outlet/>
            </main>
            <Footer/>
        </div>
    )
}

export default LayoutRoot