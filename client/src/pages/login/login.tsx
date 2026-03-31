declare global {
  interface Window {
    Clerk: {
      session: {
        getToken(): Promise<string>;
      };
    };
  }
}

import './login.css';
import './loginoverlay.css';

import { useSignIn } from '@clerk/clerk-react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { getAppSessionToken } from '../../utils/apiClient';

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const errorNotify = (msg?: any) => {
    toast.error(msg, {
      position: 'bottom-right',
      theme: 'dark',
    });
  };

  const successNotify = (msg?: string) => {
    if (msg) {
      toast.success(msg, { position: 'bottom-right', theme: 'dark' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn || !setActive) {
      errorNotify('Login system not ready, please try again shortly.');
      return;
    }
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        try {
          await setActive({ session: result.createdSessionId });

          const clerkToken = await window.Clerk.session.getToken();

          const appSessionResponse = await getAppSessionToken(clerkToken);
          const appSessionData = appSessionResponse.data;

          if (appSessionData && appSessionData.token) {
            localStorage.setItem('appToken', appSessionData.token);
            successNotify('Login successful!');
            navigate('/dashboard');
          } else {
            errorNotify(
              'Failed to retrieve application session token from backend.',
            );
          }
        } catch (apiError: any) {
          errorNotify(
            apiError.response?.data?.message ||
            apiError.message ||
            'Error fetching application session.',
          );
          console.error('API session error:', apiError.response || apiError);
        }
      } else {
        console.error('Clerk sign in status:', result.status, result);
        errorNotify(
          `Sign in not complete. Status: ${result.status}. Please check your credentials or follow further instructions.`,
        );
      }
    } catch (clerkErr: any) {
      const clerkErrorMessage =
        clerkErr.errors?.[0]?.longMessage ||
        clerkErr.message ||
        'An error occurred during sign in.';
      errorNotify(clerkErrorMessage);
      console.error(
        'Clerk sign in error:',
        clerkErr.errors ? JSON.stringify(clerkErr.errors, null, 2) : clerkErr,
      );
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

          <button type="submit" disabled={loading || !isLoaded}>
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
          <div className="signup-link">
            <p>
              Don’t have an account? <a href="/register">Register now</a>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
