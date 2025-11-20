import {useEffect, useState} from 'react';
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
        return fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(async response => {
                if (response.status !== 200) {
                    return false;
                }

                const data = await response.json();
                if (data) {
                    localStorage.setItem('token', data.token);
                    setUser({ token: data.token, ...data.user });
                    return true;
                }

                return false;
            }).catch(() => false)
    };


    const register = (name, email, password) => {

        return fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password})
        }).then(async response => {
                if (response.status !== 201) {
                    return false
                }
                const data = await response.json()
                if (data) {
                    localStorage.setItem('token', data.token);
                    setUser({token: data.token, ...data.user});
                    return true;
                }
                return false;
            }).catch(() => false)
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
