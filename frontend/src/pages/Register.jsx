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
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptMarketing, setAcceptMarketing] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { register } = UseAuth();

    async function handleSubmit(e){
        e.preventDefault();

        // Validar consentimientos obligatorios (RGPD)
        if (!acceptPrivacy || !acceptTerms) {
            setError('Debes aceptar la Política de Privacidad y los Términos y Condiciones');
            return;
        }

        if (password === repeatPassword) {
            const success = await register(username, email, password);
            if (success) {
                navigate('/dashboard');
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

                {/* Consentimientos RGPD */}
                <article className={styles.inputGroup}>
                    <label className={styles.checkboxLabel} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={acceptPrivacy}
                            onChange={(e) => setAcceptPrivacy(e.target.checked)}
                            required
                            aria-required="true"
                            style={{ marginTop: '4px', accentColor: '#5888ed' }}
                        />
                        <span style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                            He leído y acepto la{' '}
                            <NavLink to="/legal/privacidad" target="_blank" rel="noopener noreferrer" style={{ color: '#5888ed', textDecoration: 'underline' }}>
                                Política de Privacidad
                            </NavLink>
                            {' '}*
                        </span>
                    </label>
                </article>

                <article className={styles.inputGroup}>
                    <label className={styles.checkboxLabel} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            required
                            aria-required="true"
                            style={{ marginTop: '4px', accentColor: '#5888ed' }}
                        />
                        <span style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                            Acepto los{' '}
                            <NavLink to="/legal/terminos" target="_blank" rel="noopener noreferrer" style={{ color: '#5888ed', textDecoration: 'underline' }}>
                                Términos y Condiciones
                            </NavLink>
                            {' '}*
                        </span>
                    </label>
                </article>

                <article className={styles.inputGroup}>
                    <label className={styles.checkboxLabel} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={acceptMarketing}
                            onChange={(e) => setAcceptMarketing(e.target.checked)}
                            style={{ marginTop: '4px', accentColor: '#5888ed' }}
                        />
                        <span style={{ fontSize: '0.85rem', lineHeight: '1.4', opacity: 0.8 }}>
                            Deseo recibir comunicaciones comerciales y novedades (opcional)
                        </span>
                    </label>
                </article>

                {error && <p className={styles.error} role="alert">{error}</p>}

                <footer className={styles.actions}>
                    <Button type="submit" className={styles.button}>Register</Button>

                    <div className={styles.textGroup}>
                        <p className={styles.text}>
                            Already have an account?{' '}
                            <NavLink to="/login" className={styles.link}>
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
