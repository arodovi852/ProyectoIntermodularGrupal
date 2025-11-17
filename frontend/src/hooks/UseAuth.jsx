import {createContext, useContext} from "react";

export const AuthContext = createContext(undefined);

export function UseAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}