import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import Presentation from "../pages/Presentation.jsx";
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

const router = createBrowserRouter([
    {
        path: "/",
        Component: LayoutRoot,
        children: [
            { index: true, Component: Presentation },
            { path: "/Login", Component: Login },
            { path: "/Register", Component: Register },
            { path: "/Home", Component: Home },
            { path: "/Profile", Component: Profile },
            { path: "/About", Component: About },
            { path: "/Contact", Component: Contact },
            { path: "/News", Component: News },
            { path: "/Terms", Component: Terms },
            { path: "/API", Component: API },
            { path: "/Roadmap", Component: Roadmap },
        ],
    },
    ]);

export default router;
