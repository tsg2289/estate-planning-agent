import { useState, useEffect } from 'react';
import AdminAuth from './AdminAuth';
import AdminDashboard from './AdminDashboard';
import './AdminPage.css';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already authenticated
    const checkAuth = () => {
      const authenticated = localStorage.getItem('adminAuthenticated');
      const loginTime = localStorage.getItem('adminLoginTime');
      
      if (authenticated && loginTime) {
        // Check if login is still valid (24 hours)
        const loginTimestamp = parseInt(loginTime);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (now - loginTimestamp < twentyFourHours) {
          setIsAuthenticated(true);
        } else {
          // Session expired, clear storage
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('adminLoginTime');
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthenticated = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminAuth onAuthenticated={handleAuthenticated} />
      )}
    </div>
  );
};

export default AdminPage;
