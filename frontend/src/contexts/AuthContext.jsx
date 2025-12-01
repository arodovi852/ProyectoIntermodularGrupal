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

    async function login(email, password) {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        return !!(await storeData(response));

    }

    async function register(name, email, password) {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password})
        })
        await storeData(response)
        return !!(await storeData(response));

    }

    async function storeData(response) {
        if (response.status === 200) {
            const element = await response.json()
            if (element.success) {
                localStorage.setItem('id', element.data.user.id);
                localStorage.setItem('token', element.data.token);
                setUser({ token: element.data.token, ...element.data.user });
                return true;
            } else {
                return false
            }
        }
    }

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