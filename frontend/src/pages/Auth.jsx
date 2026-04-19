import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Alert } from '../components/index';
import authService from '../services/authService';
import { LogIn, UserPlus } from 'lucide-react';

export const LoginPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;

      if (isAdmin) {
        // Admin login via API
        response = await authService.adminLogin(email, password);
      } else {
        // Student login via API
        response = await authService.studentLogin(email, password);
      }

      if (response.success) {
        // Update auth context with response data
        login(response.data.user, response.data.userType);
        
        // Navigate to appropriate dashboard
        navigate(isAdmin ? '/admin/dashboard' : '/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(135deg, #FF6B6B 0%, #A855F7 100%)',
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: '40px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '64px',
          fontWeight: '700',
          marginBottom: '20px',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}>
          🏢
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '16px' }}>
          HostelHub
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '400px', lineHeight: '1.6' }}>
          Manage hostel room allocations efficiently with our smart allocation system
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        background: 'var(--color-light)',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '40px',
        }}>
          <h2 style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: '700',
            marginBottom: '8px',
            color: 'var(--color-dark)',
          }}>
            Welcome Back
          </h2>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-medium-gray)',
            marginBottom: '30px',
          }}>
            Sign in to access your account
          </p>

          {error && (
            <div style={{ marginBottom: '20px' }}>
              <Alert type="error" message={error} />
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* User Type Toggle */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                color: 'var(--color-dark)',
                display: 'block',
                marginBottom: '12px',
              }}>
                Login as:
              </label>
              <div style={{
                display: 'flex',
                gap: '12px',
                background: 'var(--color-light)',
                padding: '4px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--color-light-gray)',
              }}>
                <button
                  type="button"
                  onClick={() => setIsAdmin(false)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: !isAdmin ? 'var(--color-white)' : 'transparent',
                    color: !isAdmin ? 'var(--color-primary)' : 'var(--color-medium-gray)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all var(--transition-md)',
                    boxShadow: !isAdmin ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdmin(true)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: isAdmin ? 'var(--color-white)' : 'transparent',
                    color: isAdmin ? 'var(--color-primary)' : 'var(--color-medium-gray)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all var(--transition-md)',
                    boxShadow: isAdmin ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Admin
                </button>
              </div>
            </div>

            <Input
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              block
              disabled={loading}
              style={{ marginTop: '24px', marginBottom: '16px' }}
            >
              <LogIn size={18} />
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p style={{
              textAlign: 'center',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-medium-gray)',
            }}>
              Don't have an account?{' '}
              <a
                href="/register"
                style={{
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Sign up here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limit phone to 10 digits only
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, ''); // Remove non-digits
      const limited = digitsOnly.slice(0, 10); // Limit to 10 digits
      setFormData(prev => ({ ...prev, [name]: limited }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Full name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password strength validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    setLoading(true);

    try {
      let response;

      if (isAdmin) {
        // Admin registration via API
        response = await authService.adminRegister(
          formData.name,
          formData.email,
          formData.password
        );
      } else {
        // Student registration via API
        // Use default values for department and year
        response = await authService.studentRegister(
          formData.name,
          formData.email,
          formData.password,
          'General',  // Default department
          1,          // Default year
          formData.phone || '',  // phoneNumber parameter
          formData.address
        );
      }

      if (response.success) {
        // Update auth context with response data
        login(response.data.user, response.data.userType);
        
        // Navigate to appropriate dashboard
        navigate(isAdmin ? '/admin/dashboard' : '/student/dashboard');
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(135deg, #FF6B6B 0%, #A855F7 100%)',
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: '40px',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '64px',
          fontWeight: '700',
          marginBottom: '20px',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}>
          🏢
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: '700', marginBottom: '16px' }}>
          HostelHub
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '400px', lineHeight: '1.6' }}>
          Join our platform to find the perfect hostel room for you
        </p>
      </div>

      {/* Right Side - Register Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        background: 'var(--color-light)',
        overflowY: 'auto',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          padding: '40px',
          marginY: '20px',
        }}>
          <h2 style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: '700',
            marginBottom: '8px',
            color: 'var(--color-dark)',
          }}>
            Create Account
          </h2>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-medium-gray)',
            marginBottom: '30px',
          }}>
            Sign up to get started
          </p>

          {error && (
            <div style={{ marginBottom: '20px' }}>
              <Alert type="error" message={error} />
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* User Type Toggle */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: '600',
                color: 'var(--color-dark)',
                display: 'block',
                marginBottom: '12px',
              }}>
                Register as:
              </label>
              <div style={{
                display: 'flex',
                gap: '12px',
                background: 'var(--color-light)',
                padding: '4px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--color-light-gray)',
              }}>
                <button
                  type="button"
                  onClick={() => setIsAdmin(false)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: !isAdmin ? 'var(--color-white)' : 'transparent',
                    color: !isAdmin ? 'var(--color-primary)' : 'var(--color-medium-gray)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all var(--transition-md)',
                    boxShadow: !isAdmin ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdmin(true)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    background: isAdmin ? 'var(--color-white)' : 'transparent',
                    color: isAdmin ? 'var(--color-primary)' : 'var(--color-medium-gray)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all var(--transition-md)',
                    boxShadow: isAdmin ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Admin
                </button>
              </div>
            </div>

            <Input
              type="text"
              name="name"
              label="Full Name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              type="tel"
              name="phone"
              label="Phone Number (10 digits)"
              placeholder="+91 XXXXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              maxLength="10"
              pattern="[0-9]*"
            />

            <Input
              type="text"
              name="address"
              label="Address"
              placeholder="Your address"
              value={formData.address}
              onChange={handleChange}
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              variant="primary"
              block
              disabled={loading}
              style={{ marginTop: '24px', marginBottom: '16px' }}
            >
              <UserPlus size={18} />
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>

            <p style={{
              textAlign: 'center',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-medium-gray)',
            }}>
              Already have an account?{' '}
              <a
                href="/login"
                style={{
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Sign in here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
