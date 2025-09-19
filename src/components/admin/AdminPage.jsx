import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import AdminDashboard from './AdminDashboard';
import HomeLink from '../HomeLink.jsx';
import './AdminPage.css';

const AdminPage = () => {
  const { user, loading, isAdmin, signOut } = useSupabaseAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔧 AdminPage: Component mounted');
    console.log('🔧 AdminPage: User:', user?.email, 'IsAdmin:', isAdmin());
  }, [user, isAdmin]);

  const handleLogout = async () => {
    console.log('🔧 AdminPage: Logging out');
    try {
      await signOut();
      // Redirect to login page after successful logout
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('❌ AdminPage: Logout error:', err);
      setError('Error logging out');
      // Still redirect even if there was an error
      navigate('/login', { replace: true });
    }
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

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return (
      <div className="admin-page">
        <HomeLink />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>🔐 Admin Access Required</h1>
          <p>You must be logged in as an admin to access this page.</p>
          <p>Please <a href="/login">sign in</a> with your admin account.</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (!isAdmin()) {
    return (
      <div className="admin-page">
        <HomeLink />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>🚫 Access Denied</h1>
          <p>You don't have admin privileges.</p>
          <p>Logged in as: {user.email}</p>
          <p>Contact the administrator if you believe this is an error.</p>
          <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  console.log('🔧 AdminPage: Rendering admin dashboard for:', user.email);

  return (
    <div className="admin-page">
      <AdminDashboard onLogout={handleLogout} adminEmail={user.email} />
    </div>
  );
};

export default AdminPage;
