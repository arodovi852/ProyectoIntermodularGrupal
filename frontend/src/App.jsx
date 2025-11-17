import { AuthProvider } from "./contexts/AuthContext.jsx";
import { RouterProvider } from "react-router";
import router from "./router/Router.jsx";
import { Landing } from './pages/Landing'
import './App.css'

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );



    function App() {
        return <Landing />
    }
}

export default App
