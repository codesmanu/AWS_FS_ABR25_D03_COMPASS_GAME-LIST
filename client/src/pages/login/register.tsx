import './registerlogin.css';
import './loginoverlay.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { validatePasswordRequirements } from '../../utils/validation';
import { customRegister } from '../../utils/apiClient';

const RegisterLogin = () => {
  const [nickname, setnickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (password !== confirmPassword) {
      errorNotify('Passwords do not match');
      return;
    }

    const passwordValidation = validatePasswordRequirements(password);
    if (!passwordValidation.isValid) {
      errorNotify(passwordValidation.messages);
      return;
    }

    setLoading(true);

    try {
      const responseFromApi = await customRegister({
        nickname,
        email,
        password,
      });
      const responseBody = responseFromApi.data;
      successNotify(
        responseBody.message || 'Registration successful! Please log in.',
      );
      navigate('/login');
    } catch (err: any) {
      const backendError = err.response?.data;
      if (backendError?.errors && Array.isArray(backendError.errors)) {
        errorNotify(backendError.errors);
      } else {
        errorNotify(
          backendError?.message ||
          err.message ||
          'An unexpected error occurred during sign up.',
        );
      }
      console.error('Sign up submission error:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="overlay-register"></div>
        <form className="boxLogin" onSubmit={handleSubmit}>
          <div className="logo" />
          <h1>Sign Up</h1>
          <p>Register yourself to access the system</p>

          <div className="form">
            <div className="form__div">
              <label className="label-input" htmlFor="name">
                <p>Full Name</p>
              </label>
              <input
                type="text"
                placeholder="Your Name"
                value={nickname}
                onChange={(e) => setnickname(e.target.value)}
                id="name"
                required
              />
            </div>

            <div className="form__div">
              <label className="label-input" htmlFor="password">
                <p>Email</p>
              </label>
              <input
                type="email"
                placeholder="email@email.com"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div className="form__div">
              <label className="label-input" htmlFor="confirmPassword">
                <p>Confirm Password</p>
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'SIGNING UP...' : 'SIGN UP'}
          </button>
          <div className="signup-link">
            <p>
              Already have an account? <a href="/login">Login Now</a>
            </p>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default RegisterLogin;
