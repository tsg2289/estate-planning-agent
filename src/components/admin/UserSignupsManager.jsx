import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './UserSignupsManager.css';

const UserSignupsManager = () => {
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState({
    total_users: 0,
    verified_users: 0,
    active_users: 0,
    recent_signups: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📊 Loading user data...');

      // Load user statistics
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_user_statistics');

      if (statsError) {
        console.error('❌ Error loading statistics:', statsError);
        throw statsError;
      }

      // Load all users
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_all_users');

      if (usersError) {
        console.error('❌ Error loading users:', usersError);
        throw usersError;
      }

      console.log('✅ User data loaded:', {
        stats: statsData?.[0],
        userCount: usersData?.length
      });

      setStatistics(statsData?.[0] || {
        total_users: 0,
        verified_users: 0,
        active_users: 0,
        recent_signups: 0
      });
      setUsers(usersData || []);

    } catch (err) {
      console.error('💥 Error loading user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="user-signups-loading">
        <div className="loading-spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-signups-error">
        <h3>❌ Error Loading User Data</h3>
        <p>{error}</p>
        <button onClick={loadUserData} className="retry-button">
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div className="user-signups-manager">
      {/* Header */}
      <div className="user-signups-header">
        <h2>👥 User Signups</h2>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="refresh-button"
        >
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{statistics.total_users}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-number">{statistics.verified_users}</div>
            <div className="stat-label">Email Verified</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <div className="stat-number">{statistics.active_users}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <div className="stat-number">{statistics.recent_signups}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <h3>📋 All Users ({users.length})</h3>
        
        {users.length === 0 ? (
          <div className="no-users">
            <p>No users found.</p>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="user-email">
                      {user.email}
                      {user.email === 'thomas.st.germain22@gmail.com' && (
                        <span className="admin-badge">👑 Admin</span>
                      )}
                    </td>
                    <td className="user-name">
                      {user.full_name || 'Not provided'}
                    </td>
                    <td className="user-status">
                      <div className="status-badges">
                        <span className={`status-badge ${user.email_verified ? 'verified' : 'unverified'}`}>
                          {user.email_verified ? '✅ Verified' : '⏳ Pending'}
                        </span>
                        <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                          {user.is_active ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="user-joined">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="user-last-login">
                      {formatDate(user.last_login)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSignupsManager;
