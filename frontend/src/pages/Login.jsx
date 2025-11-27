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
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className={styles.login}>
                <article className={styles.inputGroup}>
                    <label htmlFor={"username"} className={styles.text}>Email:</label>
                    <input id={"username"} type="email" value={email} className={styles.input} onChange={(e) => setEmail(e.target.value)} required/>
                </article>
                <article className={styles.inputGroup}>
                    <label htmlFor={"password"} className={styles.text}>Password:</label>
                    <input type="password"  id={"password"} value={password} className={styles.input} onChange={(e) => setPassword(e.target.value)} required/>
                </article>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <Button type="submit" className={styles.button}>Login</Button>
                <NavLink to={"/Register"} className={styles.text}>You dont have account, Register</NavLink>
                <NavLink to={"/RecoverPassword"} className={styles.text}>Did you forgot the password?, Recover it</NavLink>
            </form>
        </main>
    )
}

export default Login

