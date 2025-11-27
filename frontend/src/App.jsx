import { AuthProvider } from "./contexts/AuthContext.jsx";
import { RouterProvider } from "react-router";
import router from "./router/Router.jsx";
import ConnectionStatus from "./components/ConnectionStatus/ConnectionStatus.jsx";
import './styles/App.css'

function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
            <ConnectionStatus />
        </AuthProvider>
    );
}

export default App
