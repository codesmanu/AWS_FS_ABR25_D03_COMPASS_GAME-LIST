import './login.css';
import './loginoverlay.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Coockie from 'js-cookie';

import { POST } from '@/utils/apiClient';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const errorNotify = (msg: any) => {
        toast.error(msg, {
            position: 'bottom-right',
            theme: 'dark',
        });
    };

    const successNotify = (msg: string) => {
        if (msg) {
            toast.success(msg, { position: 'bottom-right', theme: 'dark' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { token } = await POST<{ token: string }>('/account/login', {
                email,
                password,
            });
            if (token) {
                Coockie.set('token', token);
                successNotify('Login successful!');
                window.location.href = '/dashboard';
            } else {
                errorNotify('Login failed: no token returned from server');
            }
        } catch {
            errorNotify('An unexpected error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container">
                <div className="overlay-login"></div>
                <form className="boxLogin" onSubmit={handleSubmit}>
                    <div className="logo" />
                    <h1>Login</h1>
                    <p>Enter your credentials to access your account</p>

                    <div className="form">
                        <div className="form__div">
                            <label className="label-input" htmlFor="email">
                                <p>Email</p>
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                required
                            />
                        </div>

                        <div className="form__div">
                            <label className="label-input" htmlFor="password">
                                <p>Password</p>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="recall-forget">
                        <label>
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <a href="#">Forgot your password?</a>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'LOGGING IN...' : 'LOGIN'}
                    </button>

                    <div className="signup-link">
                        <p>
                            Don’t have an account?{' '}
                            <a href="/register">Register now</a>
                        </p>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </>
    );
};

export default Login;
