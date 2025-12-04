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
import Playlist from "../pages/Playlist.jsx";
import Generate from "../pages/Generate.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        Component: LayoutRoot,
        children: [
            { index: true, Component: Landing },
            { path: "/login", Component: Login},
            { path: "/register", Component: Register },
            { path: "/recover-password", Component: RecoverPassword },
            { path: "/generate", Component: Generate },
            { path: "/about", Component: About },
            { path: "/contact", Component: Contact },
            { path: "/news", Component: News },
            { path: "/terms", Component: Terms },
            { path: "/privacy", Component: Terms },
            { path: "/api", Component: API },
            { path: "/roadmap", Component: Roadmap },
            { Component: PrivateLayoutRoot,
                children: [
                    { path: "/dashboard", Component: DashBoard },
                    { path: "/profile", Component: Profile },
                    { path: "/edit-profile", Component: EditProfile },
                    { path: "/configuration", Component: Configuration },
                    { path: "/playlist", Component: Playlist },
                ],
            },
        ],
    },
    ]);

export default router;
