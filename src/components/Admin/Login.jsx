import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Login error:', error);
            setError(error.message);
        } else {
            onLogin(data.user);
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-box glass-box animate-up">
                <h2>ESPACE RÉSERVÉ</h2>
                <p>Veuillez vous identifier pour accéder au CMS.</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@hotel-elegance.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error-msg">{error}</div>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Connexion...' : 'SE CONNECTER'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
