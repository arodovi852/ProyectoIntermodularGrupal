import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.jsx';
import {NavLink} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    async function handleSubmit(e){
        e.preventDefault();

        const success = await login(email, password);

        if (success) {
            navigate('/DashBoard');
        } else {
            setError('Email o contraseña incorrectos');
        }
    }

    return (
        <main>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <article>
                    <label htmlFor={"username"}>Email:</label>
                    <input id={"username"} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </article>
                <article>
                    <label htmlFor={"password"}>Password:</label>
                    <input type="password"  id={"password"} value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </article>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <button type="submit">Login</button>
                <NavLink to={"/Register"}>You dont have account, Register</NavLink>
                <NavLink to={"/RecoverPassword"}>Did you forgot the password?, Recover it</NavLink>
            </form>
        </main>
    )
}

export default Login
