import { useState, useEffect } from 'react';
import AdminAuth from './AdminAuth';
import AdminDashboard from './AdminDashboard';
import HomeLink from '../HomeLink.jsx';
import './AdminPage.css';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔧 AdminPage: Component mounted');
    
    // Check if admin is already authenticated
    const checkAuth = () => {
      try {
        console.log('🔧 AdminPage: Checking authentication...');
        const authenticated = localStorage.getItem('adminAuthenticated');
        const loginTime = localStorage.getItem('adminLoginTime');
        
        console.log('🔧 AdminPage: Auth data:', { authenticated, loginTime });
        
        if (authenticated && loginTime) {
          // Check if login is still valid (24 hours)
          const loginTimestamp = parseInt(loginTime);
          const now = Date.now();
          const twentyFourHours = 24 * 60 * 60 * 1000;
          
          if (now - loginTimestamp < twentyFourHours) {
            console.log('🔧 AdminPage: User is authenticated');
            setIsAuthenticated(true);
          } else {
            console.log('🔧 AdminPage: Session expired, clearing storage');
            // Session expired, clear storage
            localStorage.removeItem('adminAuthenticated');
            localStorage.removeItem('adminLoginTime');
          }
        } else {
          console.log('🔧 AdminPage: User not authenticated');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('❌ AdminPage: Error in checkAuth:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleAuthenticated = (authenticated) => {
    console.log('🔧 AdminPage: Authentication result:', authenticated);
    setIsAuthenticated(authenticated);
  };

  const handleLogout = () => {
    console.log('🔧 AdminPage: Logging out');
    setIsAuthenticated(false);
  };

  if (error) {
    return (
      <div className="admin-error-page">
        <h2>❌ Admin Panel Error</h2>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  console.log('🔧 AdminPage: Rendering with isAuthenticated:', isAuthenticated);

  // Simple test version to isolate the issue
  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <HomeLink />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>🔐 Admin Access</h1>
          <p>Simple test version</p>
          <button 
            onClick={() => {
              console.log('🔧 AdminPage: Test login clicked');
              localStorage.setItem('adminAuthenticated', 'true');
              localStorage.setItem('adminLoginTime', Date.now().toString());
              setIsAuthenticated(true);
            }}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Test Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <HomeLink />
      <div style={{ padding: '20px' }}>
        <h1>🏠 Admin Dashboard</h1>
        <p>You are logged in as admin</p>
        <button 
          onClick={handleLogout}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
