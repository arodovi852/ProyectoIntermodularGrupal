import { createBrowserRouter } from "react-router";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import LayoutRoot from "../layouts/LayoutRoot.jsx";
import Profile from "../pages/Profile.jsx";
import Roadmap from "../pages/Roadmap.jsx";
import About from "../pages/About.jsx";
import API from "../pages/API.jsx";
import Terms from "../pages/Terms.jsx";
import News from "../pages/News.jsx";
import Contact from "../pages/Contact.jsx";
import Configuration from "../pages/Configuration.jsx";
import EditProfile from "../pages/EditProfile.jsx";
import RecoverPassword from "../pages/RecoverPassword.jsx";
import DashBoard from "../pages/DashBoard.jsx";
import PrivateLayoutRoot from "../layouts/PrivateLayoutRoot.jsx";
import Landing from "../pages/Landing.jsx";
import Generate from "../pages/Generate.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        Component: LayoutRoot,
        children: [
            { index: true, Component: Landing },
            { path: "/Login", Component: Login},
            { path: "/Register", Component: Register },
            { path: "/RecoverPassword", Component: RecoverPassword },
            { path: "/About", Component: About },
            { path: "/Contact", Component: Contact },
            { path: "/News", Component: News },
            { path: "/Terms", Component: Terms },
            { path: "Privacy", Component: Terms },
            { path: "/API", Component: API },
            { path: "/Roadmap", Component: Roadmap },
            { path: "/Generate", Component: Generate },
            { Component: PrivateLayoutRoot,
                children: [
                    { path: "/DashBoard", Component: DashBoard },
                    { path: "/Profile", Component: Profile },
                    { path: "/EditProfile", Component: EditProfile },
                    {path: "/Configuration", Component: Configuration },],},
        ],
    },
    ]);

export default router;
