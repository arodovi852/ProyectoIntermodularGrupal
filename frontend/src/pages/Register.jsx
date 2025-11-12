import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth.jsx';
import { NavLink } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        const success = await register(username, email, password);

        if (password !== repeatPassword) {
            setError('Las contraseñas no coinciden');
            return;
        } else {
            if (success) {
                navigate('/DashBoard');
            } else {
                setError('Error al registrar el usuario');
            }
        }

        setLoading(true);
        try {
            // Suposición razonable: endpoint de registro
            const res = await fetch('http://braodcastts.com/api/v1/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();

            // Si la API devuelve token directamente después de registrar
            if (data && data.token) {
                // Guardar token usando la función de login del contexto
                const success = await login(email, password);
                if (success) {
                    navigate('/DashBoard');
                    return;
                }
                setError('Registro completado, pero no se pudo iniciar sesión automáticamente');
            } else if (res.ok) {
                // Registro ok pero sin token — intentar login con las credenciales
                const success = await login(email, password);
                if (success) {
                    navigate('/DashBoard');
                    return;
                }
                setError('Registro correcto, por favor inicia sesión');
            } else {
                // Mostrar mensaje de error devuelto por la API si existe
                setError(data?.message || 'Error al registrar el usuario');
            }
        } catch (err) {
            setError('Error de red o del servidor');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
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

                <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>

                <NavLink to={"/Login"}>You already have account, Login</NavLink>
            </form>
        </main>
    )
}

export default Register