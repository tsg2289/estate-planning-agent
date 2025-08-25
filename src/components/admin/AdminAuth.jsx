import { useState } from 'react';
import './AdminAuth.css';

const AdminAuth = ({ onAuthenticated }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Admin credentials (in production, this should be stored securely)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'estateplan2024!' // Change this to a secure password
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple authentication (in production, use proper backend auth)
    if (credentials.username === ADMIN_CREDENTIALS.username && 
        credentials.password === ADMIN_CREDENTIALS.password) {
      // Store admin session
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      onAuthenticated(true);
    } else {
      setError('Invalid credentials. Please try again.');
    }

    setIsLoading(false);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-auth">
      <div className="admin-auth-container">
        <div className="admin-auth-header">
          <h1>🔐 Admin Access</h1>
          <p>Enter your admin credentials to access the email list manager</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-auth-form">
          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter admin username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="admin-auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className="admin-auth-footer">
          <p>🔒 Secure access required for administrative functions</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
