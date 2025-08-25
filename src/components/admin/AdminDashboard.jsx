import { useState, useEffect } from 'react';
import EmailListManager from '../EmailListManager';
import './AdminDashboard.css';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('email-list');
  const [adminInfo, setAdminInfo] = useState({
    username: 'admin',
    lastLogin: null
  });

  useEffect(() => {
    // Get admin info from localStorage
    const loginTime = localStorage.getItem('adminLoginTime');
    if (loginTime) {
      setAdminInfo(prev => ({
        ...prev,
        lastLogin: new Date(parseInt(loginTime)).toLocaleString()
      }));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    onLogout();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'email-list':
        return <EmailListManager />;
      case 'analytics':
        return (
          <div className="admin-tab-content">
            <h2>📊 Analytics Dashboard</h2>
            <p>Email list analytics and insights will be displayed here.</p>
            <div className="coming-soon">
              <span>🚧 Coming Soon</span>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="admin-tab-content">
            <h2>⚙️ Admin Settings</h2>
            <p>Admin panel configuration and settings.</p>
            <div className="coming-soon">
              <span>🚧 Coming Soon</span>
            </div>
          </div>
        );
      default:
        return <EmailListManager />;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <h1>🏠 EstatePlan Pro Admin</h1>
            <p>Administrative Dashboard</p>
          </div>
          
          <div className="admin-header-right">
            <div className="admin-info">
              <span className="admin-username">👤 {adminInfo.username}</span>
              {adminInfo.lastLogin && (
                <span className="admin-last-login">
                  Last login: {adminInfo.lastLogin}
                </span>
              )}
            </div>
            <button onClick={handleLogout} className="admin-logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="admin-nav">
        <div className="admin-nav-container">
          <button
            className={`admin-nav-tab ${activeTab === 'email-list' ? 'active' : ''}`}
            onClick={() => setActiveTab('email-list')}
          >
            📧 Email List
          </button>
          <button
            className={`admin-nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
          <button
            className={`admin-nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="admin-content">
        {renderTabContent()}
      </main>

      {/* Admin Footer */}
      <footer className="admin-footer">
        <div className="admin-footer-content">
          <p>&copy; 2024 EstatePlan Pro Admin Panel</p>
          <p>Secure administrative access only</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
