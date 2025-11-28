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
            <form onSubmit={handleSubmit} className={styles.register}>
                <h2>Create an account</h2>

                <article className={styles.inputGroup}>
                    <label htmlFor="username" className={styles.label}>Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        className={styles.input}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </article>

                <article className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        className={styles.input}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </article>

                <article className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        className={styles.input}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </article>

                <article className={styles.inputGroup}>
                    <label htmlFor="repeatPassword" className={styles.label}>Repeat password:</label>
                    <input
                        id="repeatPassword"
                        type="password"
                        value={repeatPassword}
                        className={styles.input}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        required
                    />
                </article>

                {error && <p className={styles.error}>{error}</p>}

                <footer className={styles.actions}>
                    <Button type="submit" className={styles.button}>Register</Button>

                    <div className={styles.textGroup}>
                        <p className={styles.text}>
                            Already have an account?{' '}
                            <NavLink to="/Login" className={styles.link}>
                                Log in
                            </NavLink>
                        </p>
                    </div>
                </footer>
            </form>
        </main>
    );
}

export default Register
