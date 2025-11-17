import { AuthProvider } from "./contexts/AuthContext.jsx";
import { RouterProvider } from "react-router";
import router from "./router/Router.jsx";
import './App.css'

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App
