import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import {UseAuth} from "../hooks/UseAuth.jsx";
import styles from '../styles/Register.module.css'
import {Button} from "../components/atoms/index.js";


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

        if (password === repeatPassword) {
            const success = await register(username, email, password);
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
        <main className={styles.container}>
            <h2>Create an account</h2>
            <form onSubmit={handleSubmit} className={styles.register}>
                <article className={styles.inputGroup}>
                    <label htmlFor={"username"}>Username:</label>
                    <input id={"username"} type="text" value={username} className={styles.input} onChange={(e) => setUsername(e.target.value)} required />
                </article>
                <article className={styles.inputGroup}>
                    <label htmlFor={"email"}>Email:</label>
                    <input id={"email"} type="email" value={email} className={styles.input} onChange={(e) => setEmail(e.target.value)} required />
                </article>
                <article className={styles.inputGroup}>
                    <label htmlFor={"password"}>Password:</label>
                    <input id={"password"} type="password" value={password} className={styles.input} onChange={(e) => setPassword(e.target.value)} required />
                </article>
                <article className={styles.inputGroup}>
                    <label htmlFor={"repeatPassword"}>Repeat Password:</label>
                    <input id={"repeatPassword"} type="password" value={repeatPassword} className={styles.input} onChange={(e) => setRepeatPassword(e.target.value)} required />
                </article>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Button type="submit" className={styles.button}>Register</Button>
                <NavLink to={"/Login"} className={styles.text}>You already have account, Login</NavLink>
            </form>
        </main>
    )
}

export default Register
