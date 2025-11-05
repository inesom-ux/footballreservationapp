import React, { useState } from 'react';
import InputField from '../../components/InputField';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // ✅ ADDED useLocation
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // ✅ ADDED
  const { login, loading } = useAuth();

  // ✅ Extract redirect URL if exists
  const params = new URLSearchParams(location.search);
  const redirectUrl = params.get("redirect");

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) ? '' : 'Invalid email format';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passError = validatePassword(password);
    if (emailError || passError) {
      setErrors({ email: emailError, password: passError });
      return;
    }

    setError('');
    const success = await login(email, password);
    if (success) {
      // ✅ Redirect to the page user came from
      navigate(redirectUrl || "/"); 
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen p-2 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/src/assets/test.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div className="relative z-10 flex h-[90vh] w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl bg-white">
        <div className="hidden md:flex w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: "url('/src/assets/panel.png')" }}>
          <div className="absolute bottom-4 right-7 w-full text-center text-white text-sm opacity-80 z-10">
            Developed by <span className="font-semibold">Salah & Ines</span>!
          </div>
        </div>
        <div
          className="w-full md:w-1/2 flex flex-col justify-center items-center bg-cover bg-center relative"
          style={{
            backgroundImage: "url('/src/assets/maradona.png')",
          }}
        >
          <form
            onSubmit={handleLogin}
            className="bg-white p-10 rounded-xl shadow-xl w-80 sm:w-96 space-y-6 opacity-90"
          >
            <h2 className="text-3xl font-semibold text-center text-gray-800">
              Sign in to your account
            </h2>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <InputField
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() =>
                setErrors((prev) => ({ ...prev, email: validateEmail(email) }))
              }
              placeholder="you@example.com"
              error={errors.email}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() =>
                setErrors((prev) => ({ ...prev, password: validatePassword(password) }))
              }
              placeholder="********"
              error={errors.password}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-md"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-sm text-gray-600 text-center">
              Don’t have an account?{' '}
              <Link to="/register" className="text-green-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
