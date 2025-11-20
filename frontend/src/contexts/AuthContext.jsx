import { useState, useEffect } from 'react';
import {AuthContext} from "../hooks/UseAuth.jsx";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {

            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {

        return fetch('http://broadcastts.com/api/v1/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    setUser({ token: data.token, ...data.user });
                    return true;
                }
                return false;
            });
    };

    const register = (username, email, password) => {

        return fetch('http://broadcastts.com/api/v1/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    setUser({ token: data.token, ...data.user });
                    return true;
                }
                return false;
            });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
