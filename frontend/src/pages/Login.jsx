import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../hooks/UseAuth.jsx';
import {NavLink} from "react-router-dom";
import styles from "../styles/Login.module.css";
import {Button} from "../components/atoms/Button";
import React from 'react'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = UseAuth();

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
        <main className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.login}>
                <h2>Login</h2>
                <article className={styles.inputGroup}>
                    <label htmlFor={"username"} className={styles.text}>Email:</label>
                    <input id={"username"} type="email" value={email} className={styles.input} onChange={(e) => setEmail(e.target.value)} required/>
                </article>
                <article className={styles.inputGroup}>
                    <label htmlFor={"password"} className={styles.text}>Password:</label>
                    <input type="password"  id={"password"} value={password} className={styles.input} onChange={(e) => setPassword(e.target.value)} required/>
                </article>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <footer className={styles.actions}>
                    <Button type="submit" className={styles.button}>Login</Button>

                    <div className={styles.textGroup}>
                        <p className={styles.text}>
                            Don't have an account?{' '}
                            <NavLink to="/Register" className={styles.link}>
                                Sign up
                            </NavLink>
                        </p>

                        <p className={styles.text}>
                            Forgot your password?{' '}
                            <NavLink to="/RecoverPassword" className={styles.link}>
                                Reset it
                            </NavLink>
                        </p>
                    </div>
                </footer>
            </form>
        </main>
    )
}

export default Login

