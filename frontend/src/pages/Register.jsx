import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import {UseAuth} from "../hooks/UseAuth.jsx";
import styles from './Login.module.css'


function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = UseAuth();

    async function handleSubmit(e){
        e.preventDefault();

        const success = await register(username, email, password);
        if (password === repeatPassword) {
            if (success) {
                navigate('/DashBoard');
            } else {
                setError('Email o contraseña incorrectos');
            }
        } else {
            setError('Las contraseñas no coinciden');
        }
    }

    return (
        <main className={styles.login}>
            <h2>Create an account</h2>
            <form onSubmit={handleSubmit}>
                <article>
                    <label htmlFor={"username"}>Username:</label>
                    <input id={"username"} type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </article>
                <article>
                    <label htmlFor={"email"}>Email:</label>
                    <input id={"email"} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </article>
                <article>
                    <label htmlFor={"password"}>Password:</label>
                    <input id={"password"} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </article>
                <article>
                    <label htmlFor={"repeatPassword"}>Repeat Password:</label>
                    <input id={"repeatPassword"} type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
                </article>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Register</button>
                <NavLink to={"/Login"}>You already have account, Login</NavLink>
            </form>
        </main>
    )
}

export default Register
